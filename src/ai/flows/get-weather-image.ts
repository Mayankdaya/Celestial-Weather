'use server';
/**
 * @fileOverview Generates an image for the weather of a given city.
 * 
 * - getWeatherImage - A function that generates an image based on weather conditions.
 * - GetWeatherImageInput - The input type for the getWeatherImage function.
 * - GetWeatherImageOutput - The return type for the getWeatherImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GetWeatherImageInputSchema = z.object({
  city: z.string().describe('The name of the city.'),
  condition: z.string().describe('The current weather condition (e.g., Clear, Clouds, Rain, Snow).'),
});
export type GetWeatherImageInput = z.infer<typeof GetWeatherImageInputSchema>;

const GetWeatherImageOutputSchema = z.object({
    imageUrl: z.string().describe('The URL of the generated image as a data URI.'),
});
export type GetWeatherImageOutput = z.infer<typeof GetWeatherImageOutputSchema>;

export async function getWeatherImage(input: GetWeatherImageInput): Promise<GetWeatherImageOutput> {
    return getWeatherImageFlow(input);
}

const getWeatherImageFlow = ai.defineFlow(
  {
    name: 'getWeatherImageFlow',
    inputSchema: GetWeatherImageInputSchema,
    outputSchema: GetWeatherImageOutputSchema,
  },
  async ({ city, condition }) => {
    const prompt = `A beautiful, serene, atmospheric, and photorealistic image of the city of ${city} during a time with ${condition} weather.`;

    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt,
      config: {
        aspectRatio: '16:9',
      },
    });

    const imageUrl = media.url;

    if (!imageUrl) {
      // Fallback to a placeholder if image generation fails
      return { imageUrl: `https://picsum.photos/seed/${city}/1280/720` };
    }

    return { imageUrl };
  }
);
