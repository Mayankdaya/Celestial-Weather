'use server';
/**
 * @fileOverview Generates a conversational weather summary.
 * 
 * - getWeatherSummary - A function that takes weather data and returns a human-readable summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { WeatherDataSchema } from '@/ai/schemas/weather';

const GetWeatherSummaryOutputSchema = z.string().describe("A conversational, human-readable summary of the weather. For example: 'Expect a sunny day, but bring a jacket for the evening.'");
export type GetWeatherSummaryOutput = z.infer<typeof GetWeatherSummaryOutputSchema>;

export async function getWeatherSummary(input: z.infer<typeof WeatherDataSchema>): Promise<GetWeatherSummaryOutput> {
    return getWeatherSummaryFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getWeatherSummaryPrompt',
    input: { schema: WeatherDataSchema },
    output: { schema: GetWeatherSummaryOutputSchema },
    prompt: `You are a helpful weather assistant. Given the following weather data, provide a short, conversational summary (2-3 sentences) of the overall weather conditions. Focus on what a person would need to know for their day.

    For example: "It will be a pleasant and sunny afternoon, perfect for a walk. However, grab a jacket if you're planning to be out late as it will get chilly after sunset."

    Weather Data:
    Current Temperature: {{{current.temperature}}}°C
    Current Condition: {{{current.condition}}}
    Feels Like: {{{current.feelsLike}}}°C
    7-Day Forecast:
    {{#each forecast}}
    - {{{day}}}: {{{temperature}}}°C, {{{condition}}}
    {{/each}}
    `,
});

const getWeatherSummaryFlow = ai.defineFlow(
    {
        name: 'getWeatherSummaryFlow',
        inputSchema: WeatherDataSchema,
        outputSchema: GetWeatherSummaryOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
