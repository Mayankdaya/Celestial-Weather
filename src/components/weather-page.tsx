
'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Search, Loader2, Shirt, Droplets, Eye, Gauge, Compass, Sunrise, Sunset, Clock, BarChart, MapPin, Globe, Cloudy, Drama, Leaf, Trees, WindIcon, Flower, Sparkles } from 'lucide-react';
import { getWeather, WeatherData } from '@/ai/flows/get-weather';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import * as LucideIcons from 'lucide-react';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

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
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (searchCity: string) => {
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
  

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const convertToF = (celsius: number) => Math.round((celsius * 9/5) + 32);

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return convertToF(celsius);
    }
    return celsius;
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(city);
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

  const getProgressColor = (level: string) => {
    if (typeof level !== 'string') return 'bg-gray-400';
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('low') || lowerLevel.includes('good')) return 'bg-green-500';
    if (lowerLevel.includes('moderate')) return 'bg-yellow-500';
    if (lowerLevel.includes('high')) return 'bg-orange-500';
    if (lowerLevel.includes('very high')) return 'bg-red-500';
    return 'bg-gray-400';
  }

  const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn('bg-white/30 dark:bg-black/30 border-white/40 dark:border-black/40 backdrop-blur-lg shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-white/50 dark:hover:border-black/50', className)}>
      {children}
    </Card>
  );

  return (
    <SidebarProvider>
      <div
        className="flex min-h-screen transition-all duration-1000 h-screen flex-col"
      >
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 sm:p-4 md:p-6 z-20 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className='text-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground' />
               <Link href="/" className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-lg">
                <h1>Weather Dashboard</h1>
              </Link>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center space-x-2">
                <Label htmlFor="temp-unit" className={cn('font-bold', unit === 'C' ? 'text-primary' : 'text-muted-foreground')}>°C</Label>
                <Switch id="temp-unit" checked={unit === 'F'} onCheckedChange={(checked) => setUnit(checked ? 'F' : 'C')} />
                <Label htmlFor="temp-unit" className={cn('font-bold', unit === 'F' ? 'text-primary' : 'text-muted-foreground')}>°F</Label>
              </div>
              <div className="relative flex w-full sm:max-w-xs">
                <Input
                  type="text"
                  placeholder="Enter a city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20 h-11 text-base bg-white/40 dark:bg-black/40 border-black/20 dark:border-white/20 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-foreground rounded-full focus:ring-primary focus:border-primary"
                />
                <Button onClick={() => handleSearch(city)} disabled={isPending} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 rounded-full px-3">
                  {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                  <span className="ml-1 hidden xs:inline">Search</span>
                </Button>
              </div>
            </div>
        </header>

        <Sidebar collapsible='icon' className='border-r border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-xl'>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className="p-2">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="text-primary" />
                  <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">World Clock</span>
                </div>
              </SidebarMenuItem>
              {majorCities.map((c) => (
                <SidebarMenuItem key={c}>
                  <SidebarMenuButton onClick={() => { setCity(c); handleSearch(c); }} tooltip={c} isActive={weather?.current.city === c} className='text-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground data-[active=true]:bg-black/20 dark:data-[active=true]:bg-white/20 data-[active=true]:text-foreground'>
                    <MapPin />
                    <span>{c}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-2 sm:p-4 md:p-6 z-10 flex-grow">
          {(!weather && isPending) && (
              <div className="flex items-center justify-center h-full text-foreground">
                  <div className='text-center'>
                    <Loader2 className="h-10 w-10 animate-spin mx-auto" />
                    <p className="mt-4 text-md">Fetching weather...</p>
                  </div>
              </div>
          )}
          
          {weather && weather.current.condition === 'Error' ? (
            <div className="grid place-items-center h-full text-center text-foreground">
              <GlassmorphismCard className='p-8'>
                <CloudRain className="h-20 w-20 mx-auto text-destructive" />
                <p className="mt-4 text-base text-foreground">Could not retrieve weather for {city}.</p>
                <p className="text-xs text-muted-foreground">Please check the city name or try again later.</p>
              </GlassmorphismCard>
            </div>
          ) : weather ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in-50 duration-500 overflow-y-auto">
                {/* Current Weather */}
                <GlassmorphismCard className="md:col-span-2 xl:col-span-2 text-foreground">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className='flex flex-col'>
                      <CardTitle className="text-2xl sm:text-3xl">{weather.current.city}</CardTitle>
                      <CardDescription className='text-base sm:text-lg text-muted-foreground'>{weather.current.condition}</CardDescription>
                    </div>
                    {getIcon(weather.current.condition, 'w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg')}
                  </CardHeader>
                  <CardContent className='flex flex-row items-end justify-between'>
                      <p className="text-7xl sm:text-8xl font-bold">{displayTemp(weather.current.temperature)}°</p>
                      <p className="text-xl sm:text-2xl text-muted-foreground mb-2">Feels like {displayTemp(weather.current.feelsLike)}°</p>
                  </CardContent>
                </GlassmorphismCard>

                {/* Outfit Suggestion */}
                <GlassmorphismCard className="md:col-span-1 xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
                      <Shirt />
                      Outfit Suggestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-md text-muted-foreground">{weather.current.outfitSuggestion.replace(/(\d+)\s?°C/g, `${displayTemp(parseInt('$1'))}°${unit}`)}</p>
                  </CardContent>
                </GlassmorphismCard>

                {/* Air Quality */}
                <GlassmorphismCard className="md:col-span-1 xl:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
                         <WindIcon /> Air Quality Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className='relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24'>
                        <Gauge className={cn('w-20 h-20 sm:w-24 sm:h-24', getAqiColor(weather.current.aqi))} style={{ transform: 'scaleX(-1)' }} />
                        <p className='absolute text-2xl sm:text-3xl font-bold'>{weather.current.aqi}</p>
                      </div>
                      <p className={cn('text-base sm:text-lg font-semibold mt-2', getAqiColor(weather.current.aqi))}>{getAqiDescription(weather.current.aqi)}</p>
                    </CardContent>
                </GlassmorphismCard>

                {/* Pollen Details */}
                <GlassmorphismCard className="md:col-span-1 xl:col-span-2 text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Flower /> Pollen Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Leaf className="w-6 h-6 text-green-400" />
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Grass</span>
                          <span className='font-semibold text-muted-foreground'>{weather.pollen.grass.level}</span>
                        </div>
                        <Progress value={weather.pollen.grass.value} className="h-2 bg-black/20 dark:bg-white/20 [&>div]:bg-green-400" />
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <Flower className="w-6 h-6 text-purple-400" />
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Weed</span>
                          <span className='font-semibold text-muted-foreground'>{weather.pollen.weed.level}</span>
                        </div>
                        <Progress value={weather.pollen.weed.value} className="h-2 bg-black/20 dark:bg-white/20 [&>div]:bg-purple-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Trees className="w-6 h-6 text-amber-500" />
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Tree</span>
                          <span className='font-semibold text-muted-foreground'>{weather.pollen.tree.level}</span>
                        </div>
                        <Progress value={weather.pollen.tree.value} className="h-2 bg-black/20 dark:bg-white/20 [&>div]:bg-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </GlassmorphismCard>
                
                 <GlassmorphismCard className="md:col-span-2 xl:col-span-2 text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <WindIcon /> Air Pollutants
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Ozone (O₃)</span>
                          <span className='font-semibold text-muted-foreground'>{weather.airPollutants.ozone.level}</span>
                        </div>
                        <Progress value={weather.airPollutants.ozone.value} className={cn("h-2 bg-black/20 dark:bg-white/20", getProgressColor(weather.airPollutants.ozone.level))} />
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Carbon Monoxide (CO)</span>
                          <span className='font-semibold text-muted-foreground'>{weather.airPollutants.carbonMonoxide.level}</span>
                        </div>
                        <Progress value={weather.airPollutants.carbonMonoxide.value} className={cn("h-2 bg-black/20 dark:bg-white/20", getProgressColor(weather.airPollutants.carbonMonoxide.level))} />
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className='font-medium'>Sulfur Dioxide (SO₂)</span>
                          <span className='font-semibold text-muted-foreground'>{weather.airPollutants.sulfurDioxide.level}</span>
                        </div>
                        <Progress value={weather.airPollutants.sulfurDioxide.value} className={cn("h-2 bg-black/20 dark:bg-white/20", getProgressColor(weather.airPollutants.sulfurDioxide.level))} />
                      </div>
                    </div>
                  </CardContent>
                </GlassmorphismCard>

                 {/* Activity Suggestions */}
                <GlassmorphismCard className="md:col-span-2 xl:col-span-4 text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Drama />
                      Activity Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {weather.activitySuggestions.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-black/10 dark:bg-white/10 rounded-lg">
                              {getActivityIcon(activity.icon, 'w-8 h-8 text-primary shrink-0 mt-1')}
                              <div>
                                  <h3 className="font-bold text-base">{activity.name}</h3>
                                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                              </div>
                          </div>
                      ))}
                  </CardContent>
                </GlassmorphismCard>

                {/* Current Conditions */}
                <GlassmorphismCard className="md:col-span-2 xl:col-span-4 text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      Current Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-base">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <p className="text-xs">Humidity</p>
                        <p className="font-medium">{weather.current.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <p className="text-xs">Wind Speed</p>
                        <p className="font-medium">{weather.current.windSpeed} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Compass className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <p className="text-xs">Direction</p>
                        <p className="font-medium">{weather.current.windDirection}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-6 h-6 text-muted-foreground" />
                       <div>
                        <p className="text-xs">Visibility</p>
                        <p className="font-medium">{weather.current.visibility} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <p className='text-2xl font-bold'>UV</p>
                       <div>
                        <p className="text-xs">UV Index</p>
                        <p className="font-medium">{weather.current.uvIndex}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-muted-foreground'><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-2.4-4.2-4.8-4.8-.4-.1-.7-.2-1.1-.2-1.4.1-2.7.7-3.9.7s-2.5-.7-3.9-.7c-.4 0-.8.1-1.1.2-2.4.6-4.2 2.4-4.8 4.8-.3 1.4 0 2.7.7 3.9.7 1.2 1.8 2.1 3.1 2.7.4.2.8.3 1.2.4 1.4-.1 2.7-.7 3.9-.7s2.5.7 3.9.7c.4 0 .8-.1 1.2-.4 1.3-.6 2.4-1.5 3.1-2.7z"/><path d="M12 15.5a.5.5 0 0 0-1 0V16a1 1 0 0 0 1 1h.5a.5.5 0 0 0 0-1H12v-.5z"/></svg>
                       <div>
                        <p className="text-xs">Pressure</p>
                        <p className="font-medium">{weather.current.pressure} hPa</p>
                      </div>
                    </div>
                  </CardContent>
                </GlassmorphismCard>
                
                {/* Sunrise & Sunset */}
                <GlassmorphismCard className='md:col-span-2 xl:col-span-2 text-foreground'>
                  <CardContent className='pt-6 flex items-center justify-around'>
                    <div className="flex flex-col items-center gap-1">
                      <Sunrise className="w-8 h-8 text-yellow-400" />
                      <p className="text-base font-bold">{weather.current.sunrise}</p>
                      <p className="text-xs text-muted-foreground">Sunrise</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Sunset className="w-8 h-8 text-orange-400" />
                      <p className="text-base font-bold">{weather.current.sunset}</p>
                      <p className="text-xs text-muted-foreground">Sunset</p>
                    </div>
                  </CardContent>
                </GlassmorphismCard>
                
                {/* Hourly Forecast */}
                <GlassmorphismCard className="md:col-span-2 xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
                      <Clock />
                      Hourly Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent className="-ml-2">
                        {weather.hourly.map((hour, index) => (
                          <CarouselItem key={index} className="basis-1/4 sm:basis-1/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/4 pl-2">
                            <div className="flex flex-col items-center text-center p-2 bg-black/10 dark:bg-white/10 rounded-lg h-full justify-between">
                              <p className="text-sm font-medium">{hour.time}</p>
                              <div className="my-1">{getIcon(hour.condition, 'w-8 h-8')}</div>
                              <p className="text-base font-bold">{displayTemp(hour.temperature)}°</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className='-left-4 text-foreground bg-white/30 hover:bg-white/50 border-white/40' />
                      <CarouselNext className='-right-4 text-foreground bg-white/30 hover:bg-white/50 border-white/40' />
                    </Carousel>
                  </CardContent>
                </GlassmorphismCard>
                
                {/* 7-Day Forecast */}
                <GlassmorphismCard className="md:col-span-2 xl:col-span-4 text-foreground">
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <BarChart />
                      7-Day Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="grid grid-cols-4 sm:grid-cols-7 xl:col-span-1 gap-2 text-center">
                      {weather.forecast.map((day, index) => (
                        <div key={index} className="flex flex-col items-center p-2 bg-black/10 dark:bg-white/10 rounded-lg">
                          <p className="font-semibold text-sm">{day.day.substring(0,3)}</p>
                          <div className="my-1">{getIcon(day.condition, 'w-8 h-8')}</div>
                          <p className="text-base font-bold">{displayTemp(day.temperature)}°</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-56 sm:h-64 xl:col-span-1">
                      <ChartContainer config={{}} className='text-foreground'>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weather.forecast.map(d => ({...d, temperature: displayTemp(d.temperature)}))} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.substring(0, 3)} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} />
                                <CartesianGrid strokeDasharray="3 3" stroke='hsla(var(--border) / 0.2)' />
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
            ) : (
             <div className="grid place-items-center h-full text-center text-foreground">
                <GlassmorphismCard className='p-8 max-w-md w-full'>
                  <div className='mb-4'>
                    <p className='text-5xl font-bold'>{time}</p>
                    <p className='text-muted-foreground'>{date}</p>
                  </div>
                  <p className="mt-4 text-base text-foreground">Welcome! Enter a city to get the forecast, or select one below.</p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {majorCities.slice(0, 6).map((c) => (
                      <Button key={c} variant='ghost' onClick={() => { setCity(c); handleSearch(c); }} className='bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-foreground'>
                        {c}
                      </Button>
                    ))}
                  </div>
                </GlassmorphismCard>
              </div>
            )}
        </main>
      </div>
    </SidebarProvider>
  );
}
