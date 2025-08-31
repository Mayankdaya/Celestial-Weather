'use server';
/**
 * @fileOverview Fetches weather data for a given city.
 * 
 * - getWeather - A function that fetches the current weather and a 3-day forecast.
 * - GetWeatherInput - The input type for the getWeather function.
 * - WeatherData - The return type for the getWeather function.
 */

import { ai } from '@/ai/genkit';
import { GenkitError } from 'genkit';
import { z } from 'genkit';
import { WeatherDataSchema } from '@/ai/schemas/weather';

const GetWeatherInputSchema = z.object({
  city: z.string().describe('The name of the city to get the weather for.'),
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

export type WeatherData = z.infer<typeof WeatherDataSchema>;

export async function getWeather(input: GetWeatherInput): Promise<WeatherData> {
    return getWeatherFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getWeatherPrompt',
    input: { schema: GetWeatherInputSchema },
    output: { schema: WeatherDataSchema },
    prompt: `You are a weather API. Given a city, provide the current weather and a 3-day forecast.
    
    Provide detailed current conditions including: temperature, condition, humidity, and wind speed in M/s.
    You must also provide the current date, formatted like 'Wed, 07 Aug'.
    
    City: {{{city}}}

    For the 3-day forecast, provide it for the next 3 days, starting with tomorrow. Use realistic weather conditions and temperatures for the given city. The date should be formatted like 'Aug 08'.
    `,
});

const getWeatherFlow = ai.defineFlow(
    {
        name: 'getWeatherFlow',
        inputSchema: GetWeatherInputSchema,
        outputSchema: WeatherDataSchema,
    },
    async (input) => {
        try {
            const { output } = await prompt(input);
             if (!output) {
                throw new Error('No output from AI model.');
            }
            return output;
        } catch (e) {
            if (e instanceof GenkitError && e.reason === 'INVALID_ARGUMENT') {
                console.error(`Schema validation failed for city "${input.city}":`, e.message);
            } else {
                console.error(`An unexpected error occurred in getWeatherFlow for city "${input.city}":`, e);
            }
            // Return a default error structure that matches the schema
            return {
                current: {
                    city: input.city,
                    date: 'N/A',
                    temperature: 0,
                    condition: 'Error',
                    humidity: 0,
                    windSpeed: 0,
                },
                forecast: Array(3).fill({ day: 'N/A', temperature: 0, condition: 'Error' }),
            };
        }
    }
);
