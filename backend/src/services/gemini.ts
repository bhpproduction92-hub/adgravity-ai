import { GoogleGenAI } from '@google/genai';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MarketingContent {
  caption_en: string;
  caption_as: string;
}

/**
 * Generates marketing captions in English and Assamese using Gemini 1.5 Flash.
 * Enforces structured JSON output matching the MarketingContent interface.
 */
export async function generateMarketingContent(
  businessType: string,
  businessName: string,
  offerDetails: string
): Promise<MarketingContent> {
  const prompt = `Business Name: ${businessName}\nBusiness Type: ${businessType}\nPromotion/Offer Details: ${offerDetails}`;
  
  const systemInstruction = `You are a professional social media marketing copywriter. Generate highly engaging ad captions for a business based on its name, type, and promotion details.
Generate exactly two fields in the output JSON:
1. 'caption_en': A professional English social media marketing caption with trending and relevant hashtags.
2. 'caption_as': A highly engaging and natural Assamese language translation/adaptation of the same marketing caption for local audiences in Assam. Do not translate literally; adapt it to sound native, fluent, and persuasive to Assamese speakers using the correct Assamese script.
Return only valid JSON adhering to the specified schema.`;

  const schema = {
    type: 'OBJECT',
    properties: {
      caption_en: { type: 'STRING' },
      caption_as: { type: 'STRING' }
    },
    required: ['caption_en', 'caption_as']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    if (!response.text) {
      throw new Error('Empty response from Gemini API');
    }

    const data = JSON.parse(response.text) as MarketingContent;
    return data;
  } catch (error) {
    console.error('Error generating marketing content:', error);
    throw error;
  }
}
