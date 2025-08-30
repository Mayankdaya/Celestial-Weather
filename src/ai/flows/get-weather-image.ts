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
    async (input) => {
        const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `A beautiful, photorealistic, cinematic shot of ${input.city} during ${input.condition} weather.`,
        });
        
        return { imageUrl: media.url! };
    }
);
