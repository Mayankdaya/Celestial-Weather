import { z } from 'genkit';

export const WeatherDataSchema = z.object({
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
    sunrise: z.string().describe('The sunrise time for the city (e.g., 6:05 AM).'),
    sunset: z.string().describe('The sunset time for the city (e.g., 8:30 PM).'),
  }),
  forecast: z.array(
    z.object({
      day: z.string().describe('Day of the week (e.g., Monday).'),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(7).describe('A 7-day weather forecast.'),
  hourly: z.array(
    z.object({
      time: z.string().describe('The time for the forecast (e.g., 3:00 PM).'),
      temperature: z.number().describe('Predicted temperature in Celsius.'),
      condition: z.string().describe('Predicted condition (e.g., Clear, Clouds, Rain, Snow).'),
    })
  ).length(24).describe('A 24-hour forecast, one for each hour.'),
  activitySuggestions: z.array(
    z.object({
        name: z.string().describe('The name of the suggested activity.'),
        description: z.string().describe('A brief description of the activity.'),
        icon: z.string().describe("A relevant icon name from lucide-react, e.g., 'TreePine', 'Utensils', 'Building2'.")
    })
  ).length(3).describe('A list of three suggested activities based on the current weather.'),
  pollen: z.object({
    grass: z.object({
      level: z.string().describe('Pollen level (e.g., Low, Moderate, High, Very High).'),
      value: z.number().describe('Pollen count value (0-100).'),
    }),
    weed: z.object({
      level: z.string().describe('Pollen level (e.g., Low, Moderate, High, Very High).'),
      value: z.number().describe('Pollen count value (0-100).'),
    }),
    tree: z.object({
      level: z.string().describe('Pollen level (e.g., Low, Moderate, High, Very High).'),
      value: z.number().describe('Pollen count value (0-100).'),
    }),
  }).describe('Pollen details for grass, weed, and tree.'),
  airPollutants: z.object({
    ozone: z.object({
      level: z.string().describe('Pollutant level (e.g., Good, Moderate).'),
      value: z.number().describe('Pollutant value (0-100).'),
    }),
    carbonMonoxide: z.object({
      level: z.string().describe('Pollutant level (e.g., Good, Moderate).'),
      value: z.number().describe('Pollutant value (0-100).'),
    }),
    sulfurDioxide: z.object({
      level: z.string().describe('Pollutant level (e.g., Good, Moderate).'),
      value: z.number().describe('Pollutant value (0-100).'),
    }),
  }).describe('Air pollutant details for ozone, carbon monoxide, and sulfur dioxide.'),
});
