
'use client';

import { useState, useTransition } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2, Shirt, Droplets, Eye, Gauge, Compass, Sunrise, Clock, BarChart } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';
import { getWeatherImage } from '@/ai/flows/get-weather-image';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

const getIcon = (condition: string, className = "w-16 h-16") => {
    const iconProps = { className };
    if (condition.includes('Clear')) return <Sun {...iconProps} data-ai-hint="sun" />;
    if (condition.includes('Cloud')) return <Cloud {...iconProps} data-ai-hint="cloud" />;
    if (condition.includes('Rain')) return <CloudRain {...iconProps} data-ai-hint="rain" />;
    if (condition.includes('Snow')) return <CloudSnow {...iconProps} data-ai-hint="snow" />;
    return <Sun {...iconProps} data-ai-hint="weather" />;
}

export function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!city) return;
    startTransition(async () => {
      setWeather(null);
      setBackgroundImage('');
      const weatherResult = await getWeather({ city });
      setWeather(weatherResult);

      if (weatherResult) {
        const imageResult = await getWeatherImage({ city: weatherResult.current.city, condition: weatherResult.current.condition });
        setBackgroundImage(imageResult.imageUrl);
      }
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
    if (aqi <= 300) return 'text-purple-400';
    return 'text-rose-500';
  }

  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn('bg-card/60 text-card-foreground border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl', className)}>
      {children}
    </Card>
  );

  return (
    <div 
      className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to bottom right, #1e3a8a, #4c1d95, #1e293b)',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="w-full max-w-5xl z-10">
        <header className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Weather App</h1>
        </header>

        <main>
          <div className="relative flex w-full max-w-lg mx-auto mb-8">
            <Input
              type="text"
              placeholder="Enter a city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-24 h-12 text-lg bg-black/20 border-white/20 placeholder:text-gray-300 text-white rounded-full focus:ring-primary focus:border-primary"
            />
            <Button onClick={handleSearch} disabled={isPending} className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full">
              {isPending ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>

          {(isPending && !weather) && (
            <div className="text-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mx-auto" />
                <p className="mt-4 text-lg">Fetching weather and generating background...</p>
            </div>
          )}

          {weather && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
              <div className="lg:col-span-1 space-y-6">
                 <GlassmorphismCard>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-2xl text-white">{weather.current.city}</CardTitle>
                      {getIcon(weather.current.condition, 'w-12 h-12')}
                    </CardHeader>
                    <CardContent>
                        <p className="text-7xl font-bold text-white">{weather.current.temperature}°C</p>
                        <p className="text-lg text-gray-200">{weather.current.condition}</p>
                        <p className="text-md text-gray-300 mt-2">Feels like {weather.current.feelsLike}°C</p>
                    </CardContent>
                  </GlassmorphismCard>
                  
                  <GlassmorphismCard>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white text-lg">
                        <Shirt />
                        Outfit Suggestion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-md text-gray-200">{weather.current.outfitSuggestion}</p>
                    </CardContent>
                  </GlassmorphismCard>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <GlassmorphismCard>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white text-lg">
                        Current Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-200">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-gray-300" />
                        <span>Humidity: {weather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-300" />
                        <span>Wind: {weather.current.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-gray-300" />
                        <span>Direction: {weather.current.windDirection}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sunrise className="w-5 h-5 text-gray-300" />
                        <span>UV Index: {weather.current.uvIndex}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-gray-300" />
                        <span>Visibility: {weather.current.visibility} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-gray-300" />
                        <span>Pressure: {weather.current.pressure} hPa</span>
                      </div>
                       <div className="flex items-center gap-2 col-span-full">
                        <span className="text-gray-300">AQI:</span>
                        <span className={getAqiColor(weather.current.aqi)}>{weather.current.aqi}</span>
                      </div>
                    </CardContent>
                  </GlassmorphismCard>

                <GlassmorphismCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <Clock />
                      Hourly Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Carousel opts={{ align: 'start', dragFree: true }}>
                      <CarouselContent className="-ml-2">
                        {weather.hourly.map((hour, index) => (
                          <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/6 md:basis-1/8 lg:basis-[12%]">
                            <div className="flex flex-col items-center p-2 text-center bg-white/10 rounded-lg h-full justify-between">
                              <p className="text-sm font-semibold text-white">{hour.time}</p>
                              <div className="my-1">{getIcon(hour.condition, 'w-8 h-8')}</div>
                              <p className="text-lg font-bold text-white">{hour.temperature}°</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-white hidden sm:flex" />
                      <CarouselNext className="text-white hidden sm:flex" />
                    </Carousel>
                  </CardContent>
                </GlassmorphismCard>
                
                <GlassmorphismCard>
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <BarChart />
                      7-Day Forecast
                      </CardTitle>
                  </Header>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-4 lg:grid-cols-7 md:col-span-2 gap-2 text-center">
                      {weather.forecast.map((day, index) => (
                        <div key={index} className="flex flex-col items-center p-2 bg-white/10 rounded-lg">
                          <p className="font-semibold text-white">{day.day.substring(0,3)}</p>
                          <div className="my-1">{getIcon(day.condition, 'w-8 h-8')}</div>
                          <p className="text-lg font-bold text-white">{day.temperature}°</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-64 md:col-span-2">
                      <ChartContainer config={{}} className='text-white'>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weather.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.substring(0, 3)} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} />
                                <CartesianGrid strokeDasharray="3 3" stroke='hsl(var(--border))' />
                                <Tooltip 
                                  contentStyle={{
                                    backgroundColor: 'hsla(var(--background) / 0.8)',
                                    borderColor: 'hsla(var(--border) / 0.5)',
                                    color: 'hsl(var(--foreground))',
                                  }}
                                  cursor={{ fill: 'hsla(var(--primary) / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTemp)" name="Temp" />
                            </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </GlassmorphismCard>

              </div>
            </div>
          )}
           {!weather && !isPending && (
            <div className="text-center text-gray-400 mt-16 flex flex-col items-center justify-center h-full">
              <Sun className="h-24 w-24 mx-auto text-gray-500" />
              <p className="mt-4 text-lg">Enter a city to get the weather forecast.</p>
              <p className="text-sm text-gray-500">e.g. London, New York, Tokyo</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
