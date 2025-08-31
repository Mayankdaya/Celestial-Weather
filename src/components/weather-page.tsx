
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2, MapPin, Droplets } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const getIcon = (condition: string, width = 64, height = 64) => {
    const iconProps = { width, height };
    if (condition.includes('Cloud')) return <Image alt="cloudy" src="https://cdn.weatherapi.com/weather/64x64/day/116.png" {...iconProps} data-ai-hint="cloudy" />;
    if (condition.includes('Rain')) return <Image alt="rain" src="https://cdn.weatherapi.com/weather/64x64/day/302.png" {...iconProps} data-ai-hint="rain" />;
    if (condition.includes('Snow')) return <Image alt="snow" src="https://cdn.weatherapi.com/weather/64x64/day/332.png" {...iconProps} data-ai-hint="snow" />;
    if (condition.includes('Clear') || condition.includes('Sunny')) return <Image alt="sun" src="https://cdn.weatherapi.com/weather/64x64/day/113.png" {...iconProps} data-ai-hint="sun" />;
    return <Image alt="sun" src="https://cdn.weatherapi.com/weather/64x64/day/113.png" {...iconProps} data-ai-hint="weather" />;
}

export function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (searchCity: string) => {
    if (!searchCity) return;
    setError(null);
    startTransition(async () => {
      setWeather(null);
      const weatherResult = await getWeather({ city: searchCity });
      if (weatherResult.current.condition === 'Error') {
        setError(`Could not fetch weather for "${searchCity}". Please try another city.`);
        setWeather(null);
      } else {
        setWeather(weatherResult);
      }
    });
  };

  useEffect(() => {
    handleSearch('Jeddah');
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(city);
    }
  };
  
  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('bg-white/10 border border-white/20 backdrop-blur-lg shadow-2xl rounded-3xl text-white', className)}>
      {children}
    </div>
  );

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <GlassmorphismCard className="w-full max-w-sm p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 w-full rounded-full bg-black/20 border-none pl-6 pr-14 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/50"
          />
          <Button onClick={() => handleSearch(city)} disabled={isPending} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 p-0 rounded-full bg-white/20 hover:bg-white/30">
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>

        { isPending && !weather && (
           <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-10 w-10 animate-spin" />
           </div>
        )}
        
        { error && !isPending && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <CloudRain className="h-16 w-16 text-gray-300" />
            <p className="mt-4 font-medium">{error}</p>
          </div>
        )}

        { weather && !isPending && (
          <div className="animate-in fade-in-50 duration-500">
            {/* Location and Date */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <p className="text-xl font-bold">{weather.current.city}</p>
              </div>
              <p className="text-sm text-gray-300">{weather.current.date}</p>
            </div>

            {/* Main Weather Info */}
            <div className="flex items-center justify-between my-6">
              <div className='w-32 h-32'>
                {getIcon(weather.current.condition, 128, 128)}
              </div>
              <div className="text-right">
                <p className="text-7xl font-bold">{weather.current.temperature}°C</p>
                <p className="text-xl text-gray-200">{weather.current.condition}</p>
              </div>
            </div>

            {/* Details */}
            <div className="flex justify-between items-center text-center">
                <div className="flex items-center gap-3">
                    <Droplets className="h-7 w-7 text-gray-300" />
                    <div>
                        <p className="font-semibold">{weather.current.humidity}%</p>
                        <p className="text-xs text-gray-300">Humidity</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Wind className="h-7 w-7 text-gray-300" />
                    <div>
                        <p className="font-semibold">{weather.current.windSpeed} M/s</p>
                        <p className="text-xs text-gray-300">Wind Speed</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 my-6" />

            {/* Forecast */}
            <div className="flex justify-between gap-2">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex flex-col items-center p-3 w-1/3 bg-white/10 rounded-2xl text-center">
                  <p className="text-sm font-semibold">{day.day}</p>
                  <div className='my-1'>{getIcon(day.condition)}</div>
                  <p className="font-bold text-lg">{day.temperature}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassmorphismCard>
    </main>
  );
}
