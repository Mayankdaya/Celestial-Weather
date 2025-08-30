'use server';
/**
 * @fileOverview Fetches weather data for a given city.
 * 
 * - getWeather - A function that fetches the current weather and a 7-day forecast.
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
    windDirection: z.string().describe('Wind direction (e.g., N, S, E, W, NE, NW, SE, SW).'),
    aqi: z.number().describe('Air Quality Index.'),
    feelsLike: z.number().describe('The "feels like" temperature in Celsius.'),
    uvIndex: z.number().describe('The UV index (0-11+).'),
    visibility: z.number().describe('Visibility in kilometers.'),
    pressure: z.number().describe('Atmospheric pressure in hPa.'),
    outfitSuggestion: z.string().describe('A suggestion for what to wear based on the weather.'),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe('Day of the week (e.g., Monday).'),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(7).describe('A 7-day weather forecast.'),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;


export async function getWeather(input: GetWeatherInput): Promise<WeatherData> {
    return getWeatherFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getWeatherPrompt',
    input: { schema: GetWeatherInputSchema },
    output: { schema: WeatherDataSchema },
    prompt: `You are a weather API. Given a city, provide the current weather and a 7-day forecast.
    
    Provide detailed current conditions including: temperature, condition, humidity, wind speed, wind direction, AQI, "feels like" temperature, UV Index, visibility, and pressure.
    Also provide a suggestion for what to wear based on the current weather.

    City: {{{city}}}

    For the forecast, provide it for the next 7 days, starting with tomorrow. Use realistic weather conditions and temperatures for the given city.
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
