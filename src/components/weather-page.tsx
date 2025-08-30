'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2 } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';

const weatherIcons: { [key: string]: React.ReactNode } = {
  'Clear': <Sun className="w-16 h-16 text-yellow-400" />,
  'Clouds': <Cloud className="w-16 h-16 text-gray-400" />,
  'Rain': <CloudRain className="w-16 h-16 text-blue-400" />,
  'Snow': <CloudSnow className="w-16 h-16 text-white" />,
  'Wind': <Wind className="w-16 h-16 text-gray-500" />,
};

const getIcon = (condition: string) => {
    if (condition.includes('Clear')) return weatherIcons['Clear'];
    if (condition.includes('Cloud')) return weatherIcons['Clouds'];
    if (condition.includes('Rain')) return weatherIcons['Rain'];
    if (condition.includes('Snow')) return weatherIcons['Snow'];
    return <Sun className="w-16 h-16 text-yellow-400" />;
}

export function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!city) return;
    startTransition(async () => {
      setWeather(null);
      const result = await getWeather({ city });
      setWeather(result);
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Weather App</h1>
        </header>

        <main>
          <div className="relative flex w-full max-w-lg mx-auto mb-8">
            <Input
              type="text"
              placeholder="Enter a city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-24 h-12 text-lg"
            />
            <Button onClick={handleSearch} disabled={isPending} className="absolute right-1 top-1/2 -translate-y-1/2 h-10">
              {isPending ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>

          {isPending && (
            <div className="flex justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {weather && (
            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{weather.current.city}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {getIcon(weather.current.condition)}
                    <div>
                      <p className="text-6xl font-bold">{weather.current.temperature}°C</p>
                      <p className="text-lg text-muted-foreground">{weather.current.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Humidity: {weather.current.humidity}%</p>
                    <p>Wind: {weather.current.windSpeed} km/h</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="font-semibold">{day.day}</p>
                      <div className="my-2">{getIcon(day.condition)}</div>
                      <p className="text-2xl font-bold">{day.temperature}°C</p>
                      <p className="text-sm text-muted-foreground">{day.condition}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
           {!weather && !isPending && (
            <div className="text-center text-muted-foreground mt-16">
              <Sun className="h-24 w-24 mx-auto text-gray-300" />
              <p className="mt-4 text-lg">Enter a city to get the weather forecast.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
