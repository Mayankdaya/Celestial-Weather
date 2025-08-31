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
    prompt: `You are a weather API. Given a city, provide the current weather, a 7-day forecast, a 24-hour hourly forecast, and activity suggestions.
    
    Provide detailed current conditions including: temperature, condition, humidity, wind speed, wind direction, AQI, "feels like" temperature, UV Index, visibility, and pressure.
    Also provide a suggestion for what to wear based on the current weather.

    Based on the weather, suggest 3 activities suitable for the given city. For each, provide a name, a short description, and a relevant icon name from the lucide-react library. For example, for a park, use 'TreePine'; for a restaurant, use 'Utensils'.

    Provide details on pollen levels (grass, weed, tree) and air pollutants (ozone, carbon monoxide, sulfur dioxide). Each should have a 'level' (e.g., Low, Good) and a 'value' (0-100).

    City: {{{city}}}

    For the 7-day forecast, provide it for the next 7 days, starting with tomorrow. Use realistic weather conditions and temperatures for the given city.
    For the 24-hour forecast, provide it for the next 24 hours, starting from the next hour.
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
