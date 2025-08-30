'use server';
/**
 * @fileOverview Fetches weather data for a given city.
 * 
 * - getWeather - A function that fetches the current weather and a 5-day forecast.
 * - GetWeatherInput - The input type for the getWeather function.
 * - WeatherData - The return type for the getWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherInputSchema = z.object({
  city: z.string().describe('The name of the city to get the weather for.'),
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

const WeatherDataSchema = z.object({
  current: z.object({
    city: z.string(),
    temperature: z.number().describe('Temperature in Celsius.'),
    condition: z.string().describe('e.g., Clear, Clouds, Rain, Snow.'),
    humidity: z.number().describe('Humidity in percent.'),
    windSpeed: z.number().describe('Wind speed in km/h.'),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe('Day of the week (e.g., Monday).'),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(5).describe('A 5-day weather forecast.'),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;


export async function getWeather(input: GetWeatherInput): Promise<WeatherData> {
    return getWeatherFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getWeatherPrompt',
    input: { schema: GetWeatherInputSchema },
    output: { schema: WeatherDataSchema },
    prompt: `You are a weather API. Given a city, provide the current weather and a 5-day forecast.
    
    City: {{{city}}}

    For the forecast, provide it for the next 5 days, starting with tomorrow. Use realistic weather conditions and temperatures for the given city.
    `,
});

const getWeatherFlow = ai.defineFlow(
    {
        name: 'getWeatherFlow',
        inputSchema: GetWeatherInputSchema,
        outputSchema: WeatherDataSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
