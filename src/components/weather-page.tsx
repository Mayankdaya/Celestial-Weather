
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CloudRain, Droplets, Eye, Gauge, Loader2, MapPin, Search, Sunrise, Sunset, Wind, Sun, Compass } from 'lucide-react';
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
    <Card className="bg-black/25 p-4 rounded-2xl flex flex-col items-center justify-center text-center border-white/10 h-full">
      <div className="text-gray-300 mb-2">{icon}</div>
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="font-bold text-lg">{value}</p>
        {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
      </div>
    </Card>
  );

  return (
    <main className="flex min-h-screen w-full items-start justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
            <div className="relative w-full max-w-xs">
              <Input
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-11 w-full rounded-full bg-black/20 border-white/20 pl-6 pr-14 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-white/50"
              />
              <Button onClick={() => handleSearch(city)} disabled={isPending} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
        </header>
        
        <GlassmorphismCard className="w-full p-6">
            { isPending && !weather && (
               <div className="flex flex-col items-center justify-center h-[600px]">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
                <p className="mt-4 text-white">Fetching weather data...</p>
               </div>
            )}
            
            { error && !isPending && (
              <div className="flex flex-col items-center justify-center h-[600px] text-center">
                <CloudRain className="h-16 w-16 text-gray-300" />
                <p className="mt-4 font-medium text-white">{error}</p>
              </div>
            )}

            { weather && !isPending && (
              <div className="animate-in fade-in-50 duration-500 space-y-8">
                {/* Main Weather Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-6 w-6" />
                           <h2 className="text-3xl font-bold">{weather.current.city}</h2>
                        </div>
                        <p className="text-lg text-gray-300">{weather.current.date}</p>
                        <div className="flex items-center gap-4 mt-4">
                            {weather.current.iconUrl && <Image alt={weather.current.condition} src={weather.current.iconUrl} width={100} height={100} className="w-24 h-24" />}
                            <div>
                                <p className="text-7xl font-bold tracking-tighter">{weather.current.temperature}°</p>
                                <p className="text-2xl font-medium text-gray-200">{weather.current.condition}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <InfoCard icon={<Droplets className="w-6 h-6"/>} title="Humidity" value={`${weather.current.humidity}%`} />
                        <InfoCard icon={<Wind className="w-6 h-6"/>} title="Wind Speed" value={`${weather.current.windSpeed} M/s`} />
                        <InfoCard icon={<Compass className="w-6 h-6"/>} title="Direction" value={weather.current.windDirection} />
                        <InfoCard icon={<Gauge className="w-6 h-6"/>} title="Feels Like" value={`${weather.current.feelsLike}°`} />
                    </div>
                </section>

                {/* Hourly Forecast */}
                <section>
                    <h3 className="text-lg font-semibold mb-2 text-white">HOURLY FORECAST</h3>
                    <div className="bg-black/20 p-4 rounded-2xl border-white/10">
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
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 5-Day Forecast */}
                    <section>
                         <h3 className="text-lg font-semibold mb-2 text-white">5-DAY FORECAST</h3>
                         <div className="space-y-2">
                           {weather.forecast.map((day, index) => (
                             <div key={index} className="flex items-center justify-between p-3 bg-black/20 border-white/10 rounded-lg">
                               <p className="font-semibold w-1/4">{day.day}</p>
                               <div className="flex items-center gap-2 w-1/4">
                                   {day.iconUrl && <Image alt={day.condition} src={day.iconUrl} width={32} height={32} />}
                                   <p className="text-sm text-gray-300 hidden sm:block">{day.condition}</p>
                               </div>
                               <div className="flex items-center gap-1 text-sm text-gray-300 w-1/4 justify-center">
                                   <CloudRain className="w-4 h-4"/>
                                   <span>{day.chanceOfRain}%</span>
                               </div>
                               <p className="font-bold text-lg w-1/4 text-right">{day.temperature}°</p>
                             </div>
                           ))}
                         </div>
                    </section>
                    
                    {/* More Details */}
                    <section>
                        <h3 className="text-lg font-semibold mb-2 text-white">ADDITIONAL DETAILS</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard icon={<Eye className="w-6 h-6"/>} title="Visibility" value={`${weather.current.visibility} km`} />
                            <InfoCard icon={<Sun className="w-6 h-6"/>} title="UV Index" value={weather.current.uv.toString()} />
                             <InfoCard icon={<Gauge className="w-6 h-6"/>} title="Pressure" value={`${weather.current.pressure} hPa`} />
                            <InfoCard icon={<Wind className="w-6 h-6"/>} title="AQI" value={weather.airQuality.aqi.toString()} subValue={weather.airQuality.category} />
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                               <InfoCard icon={<Sunrise className="w-8 h-8"/>} title="Sunrise" value={weather.current.sunrise} />
                               <InfoCard icon={<Sunset className="w-8 h-8"/>} title="Sunset" value={weather.current.sunset} />
                            </div>
                        </div>
                    </section>
                </div>
              </div>
            )}
        </GlassmorphismCard>
      </div>
    </main>
  );
}
