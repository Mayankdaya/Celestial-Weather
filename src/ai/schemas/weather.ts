import { z } from 'genkit';

export const WeatherDataSchema = z.object({
  current: z.object({
    city: z.string(),
    date: z.string().describe("Today's date, formatted like 'Wed, 07 Aug'."),
    temperature: z.number().describe('Temperature in Celsius.'),
    condition: z.string().describe('e.g., Clear, Clouds, Rain, Snow.'),
    humidity: z.number().describe('Humidity in percent.'),
    windSpeed: z.number().describe('Wind speed in M/s.'),
    feelsLike: z.number().describe('"Feels like" temperature in Celsius.'),
    pressure: z.number().describe('Atmospheric pressure in hPa.'),
    visibility: z.number().describe('Visibility in kilometers.'),
    uv: z.number().describe('UV index.'),
    sunrise: z.string().describe("Sunrise time, e.g., '6:30 AM'."),
    sunset: z.string().describe("Sunset time, e.g., '7:45 PM'."),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe("Day of the week and date, e.g., 'Aug 08'."),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(5).describe('A 5-day weather forecast.'),
  hourly: z.array(
    z.object({
      time: z.string().describe("Hour of the day, e.g., '3PM', '4PM'."),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition.'),
    })
  ).length(7).describe('A 7-hour forecast.'),
  airQuality: z.object({
    aqi: z.number().describe('Air Quality Index value.'),
    category: z.string().describe('e.g., Good, Moderate, Unhealthy.'),
  }),
});
