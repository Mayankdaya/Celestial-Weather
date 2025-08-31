import { z } from 'genkit';

export const WeatherDataSchema = z.object({
  current: z.object({
    city: z.string(),
    date: z.string().describe("Today's date, formatted like 'Wed, 07 Aug'."),
    temperature: z.number().describe('Temperature in Celsius.'),
    condition: z.string().describe('e.g., Clear, Clouds, Rain, Snow.'),
    iconUrl: z.string().url().describe('A URL to an icon representing the current weather condition.'),
    humidity: z.number().describe('Humidity in percent.'),
    windSpeed: z.number().describe('Wind speed in M/s.'),
    windDirection: z.string().describe('Wind direction (e.g., N, S, E, W, NE, SW).'),
    feelsLike: z.number().describe('"Feels like" temperature in Celsius.'),
    pressure: z.number().describe('Atmospheric pressure in hPa.'),
    visibility: z.number().describe('Visibility in kilometers.'),
    uv: z.number().describe('UV index.'),
    sunrise: z.string().describe("Sunrise time, e.g., '6:30 AM'."),
    sunset: z.string().describe("Sunset time, e.g., '7:45 PM'."),
    dewPoint: z.number().describe('Dew point temperature in Celsius.'),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe("Day of the week and date, e.g., 'Aug 08'."),
      temperature: z.number().describe('Predicted max temperature in Celsius.'),
      minTemperature: z.number().describe('Predicted min temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
      iconUrl: z.string().url().describe('A URL to an icon representing the forecast condition.'),
      chanceOfRain: z.number().describe('The chance of rain in percent for that day.'),
    })
  ).length(5).describe('A 5-day weather forecast.'),
  hourly: z.array(
    z.object({
      time: z.string().describe("Hour of the day, e.g., '3PM', '4PM'."),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      apparentTemperature: z.number().describe('Predicted "feels like" temperature in Celsius.'),
      condition: z.string().describe('Predicted condition.'),
      iconUrl: z.string().url().describe('A URL to an icon representing the hourly condition.'),
    })
  ).length(7).describe('A 7-hour forecast.'),
  airQuality: z.object({
    aqi: z.number().describe('Air Quality Index value.'),
    category: z.string().describe('e.g., Good, Moderate, Unhealthy.'),
    pm25: z.number().describe('PM2.5 particle level.'),
    ozone: z.number().describe('Ozone (O3) level.'),
  }),
});
