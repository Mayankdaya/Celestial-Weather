'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2, Shirt, Thermometer } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';

const weatherIcons: { [key: string]: React.ReactNode } = {
  'Clear': <Sun className="w-16 h-16 text-yellow-300" />,
  'Clouds': <Cloud className="w-16 h-16 text-gray-300" />,
  'Rain': <CloudRain className="w-16 h-16 text-blue-300" />,
  'Snow': <CloudSnow className="w-16 h-16 text-white" />,
  'Wind': <Wind className="w-16 h-16 text-gray-400" />,
};

const getIcon = (condition: string) => {
    if (condition.includes('Clear')) return weatherIcons['Clear'];
    if (condition.includes('Cloud')) return weatherIcons['Clouds'];
    if (condition.includes('Rain')) return weatherIcons['Rain'];
    if (condition.includes('Snow')) return weatherIcons['Snow'];
    return <Sun className="w-16 h-16 text-yellow-300" />;
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

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    if (aqui <= 300) return 'text-purple-400';
    return 'text-rose-500';
  }

  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={`bg-card text-card-foreground border backdrop-blur-lg shadow-lg rounded-2xl ${className}`}>
      {children}
    </Card>
  );

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-white">Weather App</h1>
        </header>

        <main>
          <div className="relative flex w-full max-w-lg mx-auto mb-8">
            <Input
              type="text"
              placeholder="Enter a city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-24 h-12 text-lg bg-black/20 border-white/20 placeholder:text-gray-400 text-white rounded-full focus:ring-primary focus:border-primary"
            />
            <Button onClick={handleSearch} disabled={isPending} className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full">
              {isPending ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>

          {isPending && (
            <div className="flex justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}

          {weather && (
            <div className="grid grid-cols-1 gap-8">
              <GlassmorphismCard>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{weather.current.city}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    {getIcon(weather.current.condition)}
                    <div>
                      <p className="text-6xl font-bold text-white">{weather.current.temperature}°C</p>
                      <p className="text-lg text-gray-300">{weather.current.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-200">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-gray-300" />
                      <span>Humidity: {weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-gray-300" />
                      <span>Wind: {weather.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="text-gray-300">AQI:</span>
                      <span className={getAqiColor(weather.current.aqi)}>{weather.current.aqi}</span>
                    </div>
                  </div>
                </CardContent>
              </GlassmorphismCard>

              <GlassmorphismCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shirt />
                    Outfit Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-200">{weather.current.outfitSuggestion}</p>
                </CardContent>
              </GlassmorphismCard>

              <GlassmorphismCard>
                 <CardHeader>
                  <CardTitle className="text-white">5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
                      <p className="font-semibold text-white">{day.day}</p>
                      <div className="my-2">{getIcon(day.condition)}</div>
                      <p className="text-2xl font-bold text-white">{day.temperature}°C</p>
                      <p className="text-sm text-gray-300">{day.condition}</p>
                    </div>
                  ))}
                </CardContent>
              </GlassmorphismCard>
            </div>
          )}
           {!weather && !isPending && (
            <div className="text-center text-gray-400 mt-16">
              <Sun className="h-24 w-24 mx-auto text-gray-500" />
              <p className="mt-4 text-lg">Enter a city to get the weather forecast.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
