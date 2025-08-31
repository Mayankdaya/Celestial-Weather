
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2, Shirt, Droplets, Eye, Gauge, Compass, Sunrise, Sunset, Clock, BarChart, MapPin, Globe, Cloudy, Drama } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import * as LucideIcons from 'lucide-react';

const getIcon = (condition: string, className = "w-16 h-16") => {
    const iconProps = { className };
    if (condition.includes('Cloud')) return <Cloudy {...iconProps} data-ai-hint="cloud" />;
    if (condition.includes('Rain')) return <CloudRain {...iconProps} data-ai-hint="rain" />;
    if (condition.includes('Snow')) return <CloudSnow {...iconProps} data-ai-hint="snow" />;
    if (condition.includes('Clear')) return <Sun {...iconProps} data-ai-hint="sun" />;
    return <Sun {...iconProps} data-ai-hint="weather" />;
}

const getActivityIcon = (iconName: string, className = "w-8 h-8") => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
        return <IconComponent className={className} />;
    }
    return <Drama className={className} />;
};

const majorCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles', 'Chicago', 'Moscow'];

export function WeatherPage() {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (searchCity: string = city) => {
    if (!searchCity) return;
    startTransition(async () => {
      setWeather(null);
      const weatherResult = await getWeather({ city: searchCity });
      setWeather(weatherResult);
    });
  };

  useEffect(() => {
    handleSearch('New York');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-500';
    if (aqi <= 100) return 'text-yellow-500';
    if (aqi <= 150) return 'text-orange-500';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-rose-600';
  }
  
  const getAqiDescription = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn('bg-white/15 text-gray-800 border border-white/20 backdrop-blur-2xl shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-white/30', className)}>
      {children}
    </Card>
  );

  return (
    <SidebarProvider>
      <div
        className="flex min-h-screen bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f0f2f5, #e6e9ee)',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/5 z-0" />
        
        <Sidebar collapsible='icon' className='border-r border-black/10 bg-white/30 backdrop-blur-2xl'>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-2">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="text-primary" />
                  <span className="text-lg font-semibold text-gray-800 group-data-[collapsible=icon]:hidden">World Clock</span>
                </div>
              </SidebarMenuItem>
              {majorCities.map((c) => (
                <SidebarMenuItem key={c}>
                  <SidebarMenuButton onClick={() => { setCity(c); handleSearch(c); }} tooltip={c} isActive={weather?.current.city === c}>
                    <MapPin />
                    <span>{c}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-4 sm:p-6 md:p-8 z-10 overflow-y-auto">
          <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className='text-gray-800' />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 drop-shadow-lg">Weather Dashboard</h1>
              </div>

              <div className="relative flex w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Enter a city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-24 h-12 text-lg bg-white/50 border-gray-500/20 placeholder:text-gray-500 text-gray-800 rounded-full focus:ring-primary focus:border-primary"
                />
                <Button onClick={() => handleSearch()} disabled={isPending} className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full">
                  {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                  <span className="ml-2 hidden sm:inline">Search</span>
                </Button>
              </div>
          </header>

          {(isPending && !weather) && (
            <div className="flex items-center justify-center h-[calc(100vh-200px)] text-gray-800">
                <div className='text-center'>
                  <Loader2 className="h-12 w-12 animate-spin mx-auto" />
                  <p className="mt-4 text-lg">Fetching weather...</p>
                </div>
            </div>
          )}

          {weather ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
              {/* Current Weather */}
              <GlassmorphismCard className="md:col-span-2 xl:col-span-2">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className='flex flex-col'>
                    <CardTitle className="text-3xl text-gray-800">{weather.current.city}</CardTitle>
                    <CardDescription className='text-lg text-gray-600'>{weather.current.condition}</CardDescription>
                  </div>
                  {getIcon(weather.current.condition, 'w-20 h-20 text-gray-800 drop-shadow-lg')}
                </CardHeader>
                <CardContent className='flex flex-row items-end justify-between'>
                    <p className="text-8xl font-bold text-gray-800">{weather.current.temperature}°</p>
                    <p className="text-2xl text-gray-600 mb-2">Feels like {weather.current.feelsLike}°</p>
                </CardContent>
              </GlassmorphismCard>
              
              {/* Outfit Suggestion */}
              <GlassmorphismCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                    <Shirt />
                    Outfit Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-md text-gray-600">{weather.current.outfitSuggestion}</p>
                </CardContent>
              </GlassmorphismCard>

              {/* Air Quality */}
              <GlassmorphismCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                        Air Quality Index
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <div className='relative flex items-center justify-center w-24 h-24'>
                      <Gauge className={cn('w-24 h-24', getAqiColor(weather.current.aqi))} style={{ transform: 'scaleX(-1)' }} />
                      <p className='absolute text-3xl font-bold text-gray-800'>{weather.current.aqi}</p>
                    </div>
                    <p className={cn('text-lg font-semibold mt-2', getAqiColor(weather.current.aqi))}>{getAqiDescription(weather.current.aqi)}</p>
                  </CardContent>
              </GlassmorphismCard>

               {/* Activity Suggestions */}
              <GlassmorphismCard className="md:col-span-2 xl:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                    <Drama />
                    Activity Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weather.activitySuggestions.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/20 rounded-lg">
                            {getActivityIcon(activity.icon, 'w-10 h-10 text-primary shrink-0 mt-1')}
                            <div>
                                <h3 className="font-bold text-gray-800">{activity.name}</h3>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
              </GlassmorphismCard>

              {/* Current Conditions */}
              <GlassmorphismCard className="md:col-span-2 xl:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                    Current Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 text-gray-600 text-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-7 h-7 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p>{weather.current.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="w-7 h-7 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Wind Speed</p>
                      <p>{weather.current.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Compass className="w-7 h-7 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Direction</p>
                      <p>{weather.current.windDirection}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-7 h-7 text-gray-500" />
                     <div>
                      <p className="text-sm text-gray-500">Visibility</p>
                      <p>{weather.current.visibility} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <p className='text-3xl font-bold text-gray-800'>UV</p>
                     <div>
                      <p className="text-sm text-gray-500">UV Index</p>
                      <p>{weather.current.uvIndex}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-2.4-4.2-4.8-4.8-.4-.1-.7-.2-1.1-.2-1.4.1-2.7.7-3.9.7s-2.5-.7-3.9-.7c-.4 0-.8.1-1.1.2-2.4.6-4.2 2.4-4.8 4.8-.3 1.4 0 2.7.7 3.9.7 1.2 1.8 2.1 3.1 2.7.4.2.8.3 1.2.4 1.4-.1 2.7-.7 3.9-.7s2.5.7 3.9.7c.4 0 .8-.1 1.2-.4 1.3-.6 2.4-1.5 3.1-2.7z"/><path d="M12 15.5a.5.5 0 0 0-1 0V16a1 1 0 0 0 1 1h.5a.5.5 0 0 0 0-1H12v-.5z"/></svg>
                     <div>
                      <p className="text-sm text-gray-500">Pressure</p>
                      <p>{weather.current.pressure} hPa</p>
                    </div>
                  </div>
                </CardContent>
              </GlassmorphismCard>
              
              {/* Sunrise & Sunset */}
              <GlassmorphismCard className='xl:col-span-1'>
                <CardContent className='pt-6 flex items-center justify-around'>
                  <div className="flex flex-col items-center gap-2">
                    <Sunrise className="w-10 h-10 text-yellow-500" />
                    <p className="text-lg font-bold text-gray-800">6:05 AM</p>
                    <p className="text-sm text-gray-500">Sunrise</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Sunset className="w-10 h-10 text-orange-500" />
                    <p className="text-lg font-bold text-gray-800">8:30 PM</p>
                    <p className="text-sm text-gray-500">Sunset</p>
                  </div>
                </CardContent>
              </GlassmorphismCard>
              
              {/* Hourly Forecast */}
              <GlassmorphismCard className="md:col-span-2 xl:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                    <Clock />
                    Hourly Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel opts={{ align: 'start', dragFree: true }}>
                    <CarouselContent className="-ml-2">
                      {weather.hourly.map((hour, index) => (
                        <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/6 md:basis-[12%]">
                          <div className="flex flex-col items-center p-2 text-center bg-white/20 rounded-lg h-full justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800">{hour.time}</p>
                            {getIcon(hour.condition, 'w-8 h-8 text-gray-800')}
                            <p className="text-lg font-bold text-gray-800">{hour.temperature}°</p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-gray-800 bg-black/10 border-none hover:bg-black/20 -left-4 hidden sm:flex" />
                    <CarouselNext className="text-gray-800 bg-black/10 border-none hover:bg-black/20 -right-4 hidden sm:flex" />
                  </Carousel>
                </CardContent>
              </GlassmorphismCard>
              
              {/* 7-Day Forecast */}
              <GlassmorphismCard className="md:col-span-2 xl:col-span-4">
                 <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
                    <BarChart />
                    7-Day Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="grid grid-cols-4 lg:grid-cols-7 xl:col-span-1 gap-2 text-center">
                    {weather.forecast.map((day, index) => (
                      <div key={index} className="flex flex-col items-center p-3 bg-white/20 rounded-lg">
                        <p className="font-semibold text-gray-800">{day.day.substring(0,3)}</p>
                        <div className="my-2">{getIcon(day.condition, 'w-8 h-8 text-gray-800')}</div>
                        <p className="text-lg font-bold text-gray-800">{day.temperature}°</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 xl:col-span-1">
                    <ChartContainer config={{}} className='text-gray-800'>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weather.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.substring(0, 3)} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} />
                              <CartesianGrid strokeDasharray="3 3" stroke='hsl(var(--border))' />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsla(var(--background) / 0.8)',
                                  borderColor: 'hsla(var(--border) / 0.5)',
                                  color: 'hsl(var(--foreground))',
                                  borderRadius: '0.75rem'
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
          ) : (!weather && !isPending && (
            <div className="flex items-center justify-center h-[calc(100vh-200px)] text-center text-gray-500">
              <div className='flex flex-col items-center justify-center p-8 bg-black/5 rounded-2xl'>
                <Sun className="h-24 w-24 mx-auto text-gray-400" />
                <p className="mt-4 text-lg text-gray-600">Enter a city to get the weather forecast.</p>
                <p className="text-sm text-gray-400">e.g. London, New York, Tokyo</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </SidebarProvider>
  );
}
