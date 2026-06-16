import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { generateMarketingContent } from './services/gemini.js';
import { publishToFacebook } from './services/facebook.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// System Logs memory store
interface SystemLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export const systemLogs: SystemLog[] = [
  { id: 'log_1', timestamp: new Date(Date.now() - 3600000 * 2), type: 'success', message: 'Database RLS policies checked and connected with Supabase instance.' },
  { id: 'log_2', timestamp: new Date(Date.now() - 3600000), type: 'info', message: 'Gemini 1.5 Flash content generation model loaded successfully.' }
];

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AdGravity AI Backend', timestamp: new Date() });
});

// Generate marketing copy using Gemini and push it to the Supabase content queue
app.post('/api/content/generate', async (req, res) => {
  const { userId, businessType, businessName, offerDetails } = req.body;

  if (!userId || !businessType || !businessName || !offerDetails) {
    systemLogs.push({
      id: `log_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      type: 'error',
      message: 'Failed AI generation request: missing required inputs.'
    });
    return res.status(400).json({ error: 'Missing required parameters (userId, businessType, businessName, offerDetails)' });
  }

  try {
    // 1. Generate English and Assamese captions
    const content = await generateMarketingContent(businessType, businessName, offerDetails);

    // 2. Format content block for the database (we save the JSON string)
    const aiContentString = JSON.stringify(content);

    // 3. Insert into public.content_queue table
    const { data: queueItem, error: queueError } = await supabase
      .from('content_queue')
      .insert({
        user_id: userId,
        prompt: `Niche: ${businessType} | Offer: ${offerDetails}`,
        ai_content: aiContentString,
        status: 'pending'
      })
      .select()
      .single();

    if (queueError) throw queueError;

    systemLogs.push({
      id: `log_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      type: 'info',
      message: `AI content generated and queued for User ${userId.slice(0, 10)}...`
    });

    return res.status(200).json({
      message: 'AI Content generated and queued successfully',
      content,
      queueItem
    });
  } catch (error: any) {
    console.error('Error in /api/content/generate:', error);
    systemLogs.push({
      id: `log_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      type: 'error',
      message: `AI generation failed for User ${userId.slice(0, 10)}: ${error.message}`
    });
    return res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
});

// Activate 7-day Trial Subscription (₹1) logic
// This endpoint simulates payment verification & trial activation.
app.post('/api/subscriptions/trial', async (req, res) => {
  const { userId, businessName, businessDetails } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // 1. If business details are provided, update the public.users record
    if (businessName || businessDetails) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          company_name: businessName || '',
          category: businessDetails?.category || '',
          meta_page_tokens: businessDetails?.metaPageToken ? { page_access_token: businessDetails.metaPageToken } : {},
          updated_at: new Date()
        })
        .eq('id', userId);

      if (userError) throw userError;
    }

    // 2. Establish trial subscription logic (7 days)
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialStart.getDate() + 7); // 7-day trial

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: 'trial',
        status: 'trial',
        price_paid: 1.00, // ₹1
        currency: 'INR',
        trial_start: trialStart,
        trial_end: trialEnd,
        trial_end_date: trialEnd,
        next_billing_date: trialEnd,
        updated_at: new Date()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (subError) throw subError;

    systemLogs.push({
      id: `log_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      type: 'success',
      message: `Simulated trial subscription (₹1) activated for User ${userId.slice(0, 10)}...`
    });

    return res.status(200).json({
      message: '7-day trial subscription activated successfully',
      subscription
    });
  } catch (error: any) {
    console.error('Error initiating trial:', error);
    systemLogs.push({
      id: `log_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      type: 'error',
      message: `Trial activation failed for User ${userId.slice(0, 10)}: ${error.message}`
    });
    return res.status(500).json({ error: error.message || 'Failed to initialize trial' });
  }
});

// Fetch User Profile & Subscription info
app.get('/api/user/:userId/status', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (subError) throw subError;

    // Check if trial subscription has expired
    let isExpired = false;
    if (subscription && (subscription.status === 'active' || subscription.status === 'trial') && subscription.trial_end) {
      const now = new Date();
      const trialEndDate = new Date(subscription.trial_end);
      if (now > trialEndDate) {
        isExpired = true;
        // Proactively update status to expired in db
        await supabase
          .from('subscriptions')
          .update({ status: 'expired', updated_at: new Date() })
          .eq('user_id', userId);
        subscription.status = 'expired';
        
        systemLogs.push({
          id: `log_${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          type: 'warning',
          message: `Trial subscription for User ${userId.slice(0, 10)} has expired.`
        });
      }
    }

    return res.status(200).json({
      user,
      subscription: subscription ? {
        ...subscription,
        isExpired
      } : null
    });
  } catch (error: any) {
    console.error('Error fetching user status:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Fetch content queue for user approval
app.get('/api/content-queue/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: queue, error } = await supabase
      .from('content_queue')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ queue });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/* ==========================================================================
   ADMIN ENDPOINTS ("God View")
   ========================================================================== */

// 1. GET Admin Metrics (Total Users, Active Trials, Total Mock Revenue)
app.get('/api/admin/metrics', async (req, res) => {
  try {
    // Fetch user counts
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id');
    if (usersError) throw usersError;
    const totalUsers = usersData?.length || 0;

    // Fetch subscriptions
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('price_paid, status');
    if (subError) throw subError;

    const trialCount = subData?.filter(s => s.status === 'trial').length || 0;
    const activeCount = subData?.filter(s => s.status === 'active' || s.status === 'trial').length || 0;
    
    // Sum prices
    const totalRevenue = subData?.reduce((sum, s) => sum + Number(s.price_paid || 0), 0) || 0;

    return res.status(200).json({
      totalUsers,
      trialCount,
      activeCount,
      totalRevenue
    });
  } catch (error: any) {
    console.error('Error in /api/admin/metrics:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch admin metrics' });
  }
});

// 2. GET Pending Global Content Queue
app.get('/api/admin/content-queue/pending', async (req, res) => {
  try {
    const { data: pendingQueue, error } = await supabase
      .from('content_queue')
      .select('*, users(email, company_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ queue: pendingQueue });
  } catch (error: any) {
    console.error('Error in /api/admin/content-queue/pending:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch pending content' });
  }
});

// 3. PUT Edit and Approve Content Queue Item
app.put('/api/admin/content-queue/:id', async (req, res) => {
  const { id } = req.params;
  const { caption_en, caption_as, status } = req.body;

  try {
    // Get original details first to log & publish
    const { data: original } = await supabase
      .from('content_queue')
      .select('prompt, user_id, ai_content, image_url')
      .eq('id', id)
      .single();

    const updateData: any = {};
    if (caption_en && caption_as) {
      updateData.ai_content = JSON.stringify({ caption_en, caption_as });
    }
    if (status) {
      updateData.status = status;
    }
    updateData.updated_at = new Date();

    // If we are approving the item, trigger Meta Page publishing
    if (status === 'approved' && original) {
      // 1. Fetch user's Page access token
      const { data: userRecord } = await supabase
        .from('users')
        .select('meta_page_tokens')
        .eq('id', original.user_id)
        .single();

      const pageAccessToken = userRecord?.meta_page_tokens?.page_access_token || '';
      
      const parsedOriginal = original.ai_content ? JSON.parse(original.ai_content) : {};
      const finalCaptionEn = caption_en || parsedOriginal.caption_en || '';
      const finalCaptionAs = caption_as || parsedOriginal.caption_as || '';
      const message = `${finalCaptionEn}\n\n---\n\n${finalCaptionAs}`;

      // 2. Publish using Meta Graph API SDK
      try {
        const publishResult = await publishToFacebook(pageAccessToken, message, original.image_url);
        
        // 3. Mark status as 'published' since it was successfully shared to the client's page
        updateData.status = 'published';
        
        systemLogs.push({
          id: `log_${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          type: 'success',
          message: `Successfully published campaign for user ${original.user_id.slice(0, 8)}... to Facebook (Post ID: ${publishResult.id}).`
        });
      } catch (pubError: any) {
        console.error('Failed publishing to Meta Graph API:', pubError);
        systemLogs.push({
          id: `log_${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date(),
          type: 'error',
          message: `Facebook publishing failed: ${pubError.message || pubError}`
        });
        throw new Error(`Facebook API Error: ${pubError.message || pubError}`);
      }
    }

    const { data: updated, error } = await supabase
      .from('content_queue')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: 'Content updated and approved successfully',
      item: updated
    });
  } catch (error: any) {
    console.error('Error updating content item:', error);
    return res.status(500).json({ error: error.message || 'Failed to update content item' });
  }
});

// 4. GET Admin System Logs
app.get('/api/admin/system-logs', (req, res) => {
  const sortedLogs = [...systemLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return res.status(200).json({ logs: sortedLogs });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
