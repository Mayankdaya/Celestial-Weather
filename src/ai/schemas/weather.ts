import { z } from 'genkit';

export const WeatherDataSchema = z.object({
  current: z.object({
    city: z.string(),
    date: z.string().describe("Today's date, formatted like 'Wed, 07 Aug'."),
    temperature: z.number().describe('Temperature in Celsius.'),
    condition: z.string().describe('e.g., Clear, Clouds, Rain, Snow.'),
    humidity: z.number().describe('Humidity in percent.'),
    windSpeed: z.number().describe('Wind speed in M/s.'),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe("Day of the week and date, e.g., 'Aug 08'."),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(3).describe('A 3-day weather forecast.'),
});
