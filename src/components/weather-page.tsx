
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, CloudRain, Droplets, Eye, Gauge, Loader2, MapPin, Search, Sunrise, Sunset, Wind, Sun, Snowflake, Thermometer, Briefcase, Compass } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

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
    handleSearch('New York');
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(city);
    }
  };
  
  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('bg-black/20 border border-white/10 backdrop-blur-lg shadow-2xl rounded-3xl text-white', className)}>
      {children}
    </div>
  );

  const InfoCard = ({ icon, title, value, subValue }: { icon: React.ReactNode, title: string, value: string, subValue?: string }) => (
    <Card className="bg-black/20 p-4 rounded-2xl flex items-center gap-4 border-white/10">
      <div className="text-gray-300">{icon}</div>
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="font-bold text-lg">{value}</p>
        {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
      </div>
    </Card>
  );

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <GlassmorphismCard className="w-full max-w-6xl p-6 space-y-6">
        <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Briefcase /> Weather Dashboard</h1>
            <div className="relative w-full max-w-xs">
              <Input
                type="text"
                placeholder="Search City..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-11 w-full rounded-full bg-black/20 border-white/20 pl-6 pr-14 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/50"
              />
              <Button onClick={() => handleSearch(city)} disabled={isPending} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
        </div>

        { isPending && !weather && (
           <div className="flex flex-col items-center justify-center h-[600px]">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
           </div>
        )}
        
        { error && !isPending && (
          <div className="flex flex-col items-center justify-center h-[600px] text-center">
            <CloudRain className="h-16 w-16 text-gray-300" />
            <p className="mt-4 font-medium text-white">{error}</p>
          </div>
        )}

        { weather && !isPending && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-6">
                <div className="flex flex-col items-center text-center">
                    {weather.current.iconUrl && <Image alt={weather.current.condition} src={weather.current.iconUrl} width={160} height={160} className="w-40 h-40" />}
                    <p className="text-8xl font-bold tracking-tighter">{weather.current.temperature}°</p>
                    <p className="text-2xl font-medium text-gray-200">{weather.current.condition}</p>
                    <div className="flex items-center gap-2 mt-4">
                        <MapPin className="h-5 w-5" />
                        <p className="text-xl font-bold">{weather.current.city}</p>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{weather.current.date}</p>
                </div>
                
                <div className="border-t border-white/20" />

                <div className="grid grid-cols-5 gap-2">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center p-2 bg-black/20 border-white/10 rounded-2xl text-center">
                      <p className="text-xs font-semibold">{day.day}</p>
                      {day.iconUrl && <Image alt={day.condition} src={day.iconUrl} width={40} height={40} className="my-1 w-10 h-10" />}
                      <p className="font-bold text-base">{day.temperature}°</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <CloudRain className="w-3 h-3"/>
                          <span>{day.chanceOfRain}%</span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            {/* Right Column */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-white">HOURLY FORECAST</h2>
                    <Card className="bg-black/20 p-4 rounded-2xl border-white/10">
                      <ChartContainer config={{}} className="h-[150px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={weather.hourly} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                  <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
                                  <YAxis stroke="rgba(255, 255, 255, 0.7)" fontSize={12} unit="°" />
                                  <RechartsTooltip 
                                      content={<ChartTooltipContent />} 
                                      cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                      contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px'}}
                                  />
                                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} dot={{r:4, fill: '#8884d8'}} activeDot={{r:6}} name="Temp"/>
                              </LineChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                    </Card>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-white">MORE DETAILS</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoCard icon={<Thermometer className="w-6 h-6"/>} title="Feels Like" value={`${weather.current.feelsLike}°C`} />
                        <InfoCard icon={<Droplets className="w-6 h-6"/>} title="Humidity" value={`${weather.current.humidity}%`} />
                        <InfoCard icon={<Wind className="w-6 h-6"/>} title="Wind Speed" value={`${weather.current.windSpeed} M/s`} />
                        <InfoCard icon={<Compass className="w-6 h-6"/>} title="Direction" value={weather.current.windDirection} />
                        <InfoCard icon={<Gauge className="w-6 h-6"/>} title="Pressure" value={`${weather.current.pressure} hPa`} />
                        <InfoCard icon={<Eye className="w-6 h-6"/>} title="Visibility" value={`${weather.current.visibility} km`} />
                        <InfoCard icon={<Sun className="w-6 h-6"/>} title="UV Index" value={weather.current.uv.toString()} />
                        <InfoCard icon={<Wind className="w-6 h-6"/>} title="AQI" value={weather.airQuality.aqi.toString()} subValue={weather.airQuality.category} />

                    </div>
                </div>
                 <div>
                    <h2 className="text-lg font-semibold mb-2 text-white">SUNRISE & SUNSET</h2>
                     <div className="grid grid-cols-2 gap-4">
                        <InfoCard icon={<Sunrise className="w-8 h-8"/>} title="Sunrise" value={weather.current.sunrise} />
                        <InfoCard icon={<Sunset className="w-8 h-8"/>} title="Sunset" value={weather.current.sunset} />
                    </div>
                </div>
            </div>
          </div>
        )}
      </GlassmorphismCard>
    </main>
  );
}
