
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, CloudLightning, Gauge, Sun, Leaf, BarChart, Smartphone } from 'lucide-react';

export function LandingPage() {

    const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn('bg-black/20 border border-white/10 backdrop-blur-lg shadow-2xl rounded-3xl text-white', className)}>
          {children}
        </div>
    );

    return (
        <main className="flex flex-col min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8 space-y-12">
            <GlassmorphismCard className="p-8 md:p-12 w-full max-w-4xl text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <Sun className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                    <CloudLightning className="w-10 h-10 text-white" />
                    <Gauge className="w-10 h-10 text-blue-300" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                    Advanced Weather Dashboard
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    Get real-time weather data, 5-day forecasts, air quality, and personalized suggestions with our beautifully designed, AI-powered weather application.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" className="rounded-full bg-primary/80 hover:bg-primary text-white font-semibold text-lg px-8 py-6 transition-transform hover:scale-105">
                        <Link href="/weather">
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </GlassmorphismCard>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Real-Time Data</h3>
                    <p className="text-gray-300">Access up-to-the-minute weather information, including temperature, humidity, wind speed, and more.</p>
                </GlassmorphismCard>
                 <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Detailed Forecasts</h3>
                    <p className="text-gray-300">Plan ahead with our comprehensive 5-day and hourly forecasts, complete with charts and icons.</p>
                </GlassmorphismCard>
                 <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Lifestyle Suggestions</h3>
                    <p className="text-gray-300">Receive AI-powered suggestions for activities and places to visit based on the current weather.</p>
                </GlassmorphismCard>
                <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Air Quality & Pollen</h3>
                    <p className="text-gray-300">Stay informed about air quality (AQI, PM2.5) and pollen levels for a healthier day outdoors.</p>
                </GlassmorphismCard>
                <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Interactive Charts</h3>
                    <p className="text-gray-300">Visualize hourly temperature and "feels like" trends with our dynamic, easy-to-read charts.</p>
                </GlassmorphismCard>
                <GlassmorphismCard className="p-6">
                    <h3 className="font-bold text-xl mb-2">Sleek & Responsive</h3>
                    <p className="text-gray-300">Enjoy a premium, clean design that looks stunning and works perfectly on any device, from phones to desktops.</p>
                </GlassmorphismCard>
            </div>
        </main>
    );
}
