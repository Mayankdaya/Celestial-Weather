'use server';
/**
 * @fileOverview Fetches weather data for a given city.
 * 
 * - getWeather - A function that fetches the current weather and a 5-day forecast.
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
    prompt: `You are a weather API. Given a city, provide the current weather, a 5-day forecast, hourly forecast, and air quality.
    
    Provide detailed current conditions including: temperature, condition, humidity, wind speed in M/s, wind direction, feels like temperature, pressure in hPa, visibility in km, UV index, sunrise time (e.g., '6:30 AM'), and sunset time (e.g., '7:45 PM').
    You must also provide the current date, formatted like 'Wed, 07 Aug'.
    For all 'iconUrl' fields, you must use realistic weather condition image URLs from 'https://openweathermap.org/img/wn/'. For example: 'https://openweathermap.org/img/wn/01d@4x.png' for a clear day. Use the @4x version for high resolution.
    
    City: {{{city}}}

    For the 5-day forecast, provide it for the next 5 days, starting with tomorrow. For each day, provide the max and min temperatures. Use realistic weather conditions, temperatures, and chance of rain for the given city. The date should be formatted like 'Aug 08'.

    For the hourly forecast, provide it for the next 7 hours, starting from the current hour. Include temperature and apparentTemperature for each hour. The time should be formatted like '3PM', '4PM', etc. Also include an icon for each hour.
    
    For air quality, provide the AQI value, a descriptive category (e.g., 'Good', 'Moderate'), and values for PM2.5 and Ozone (O3).
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
                    iconUrl: 'https://openweathermap.org/img/wn/01d@4x.png',
                    humidity: 0,
                    windSpeed: 0,
                    windDirection: 'N/A',
                    feelsLike: 0,
                    pressure: 0,
                    visibility: 0,
                    uv: 0,
                    sunrise: 'N/A',
                    sunset: 'N/A',
                },
                forecast: Array(5).fill({ day: 'N/A', temperature: 0, minTemperature: 0, condition: 'Error', iconUrl: 'https://openweathermap.org/img/wn/01d@4x.png', chanceOfRain: 0 }),
                hourly: Array(7).fill({ time: 'N/A', temperature: 0, apparentTemperature: 0, condition: 'Error', iconUrl: 'https://openweathermap.org/img/wn/01d@4x.png' }),
                airQuality: { aqi: 0, category: 'Error', pm25: 0, ozone: 0 },
            };
        }
    }
);
