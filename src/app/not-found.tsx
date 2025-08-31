
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CloudFog, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlassmorphismCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn('bg-black/20 border border-white/10 backdrop-blur-lg shadow-2xl rounded-3xl text-white', className)}>
      {children}
    </div>
);

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <GlassmorphismCard className="p-8 md:p-12 w-full max-w-2xl text-center flex flex-col items-center">
        <CloudFog className="w-20 h-20 text-gray-300 mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          The page you are looking for seems to have drifted away into the clouds.
        </p>
        <div className="mt-8">
            <Button asChild size="lg" className="rounded-full bg-primary/80 hover:bg-primary text-white font-semibold text-lg px-8 py-6 transition-transform hover:scale-105">
                <Link href="/">
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Return Home
                </Link>
            </Button>
        </div>
      </GlassmorphismCard>
    </div>
  )
}
