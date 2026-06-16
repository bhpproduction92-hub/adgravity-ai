import { FacebookAdsApi } from 'facebook-nodejs-business-sdk';

/**
 * Publishes ad copy message to a linked Facebook Page.
 * Automatically falls back to mock sandbox reporting if mock tokens are configured.
 */
export async function publishToFacebook(
  pageAccessToken: string,
  message: string,
  imageUrl?: string
): Promise<{ id: string }> {
  // If it's a sandbox/mock token, we run simulated publishing
  if (
    !pageAccessToken ||
    pageAccessToken.includes('mocktoken') ||
    pageAccessToken.includes('YOUR_') ||
    pageAccessToken === ''
  ) {
    console.log('[MOCK FB PUBLISH] Successfully posted to Page Feed:', {
      message,
      imageUrl
    });
    // Return a mock post ID
    return { id: `fb_post_mock_${Math.random().toString(36).substring(2, 9)}` };
  }

  try {
    // Initialize standard Facebook API using Page token
    const api = FacebookAdsApi.init(pageAccessToken);

    if (imageUrl) {
      // Post photo with a message/caption
      const response = await api.call('POST', ['me/photos'], {
        url: imageUrl,
        caption: message
      }) as any;
      return { id: response.id || 'photo_post_success' };
    } else {
      // Post standard text feed status update
      const response = await api.call('POST', ['me/feed'], {
        message: message
      }) as any;
      return { id: response.id || 'feed_post_success' };
    }
  } catch (error) {
    console.error('Error in Facebook Graph API call:', error);
    throw error;
  }
}
