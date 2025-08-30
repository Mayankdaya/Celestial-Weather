'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSessionDialog } from '@/components/create-session-dialog';
import { Code, Users, Languages, Share2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import Image from 'next/image';

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Real-Time Editing',
    description: 'See changes from other users as they type, with live cursor positions and names.',
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: 'Multi-Language Support',
    description: 'Syntax highlighting for Python, JavaScript, Java, and more to keep your code readable.',
  },
  {
    icon: <Share2 className="h-8 w-8 text-primary" />,
    title: 'Session Management',
    description: 'Create, share, and join coding sessions instantly with a unique, shareable URL.',
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'AI Code Suggestions',
    description: 'Leverage generative AI to get intelligent code completions based on your current syntax.',
  },
];

export function LandingPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <a className="flex items-center justify-center" href="#">
          <Logo className="h-6 w-6 text-primary" />
          <span className="ml-2 font-semibold text-lg">CollabCode</span>
        </a>
        <nav className="ml-auto">
          <Button onClick={() => setDialogOpen(true)}>
            Start a New Session
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Code Together, From Anywhere.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A real-time collaborative code editor with syntax highlighting, live cursors, and AI-powered completions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" onClick={() => setDialogOpen(true)}>
                    Try it Free
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/600/400"
                alt="Collaborative coding session screenshot"
                data-ai-hint="code editor collaboration"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Collaborate</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  CollabCode is packed with features designed to make remote pair programming and technical interviews seamless.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 pt-12">
              {features.map((feature) => (
                <div key={feature.title} className="grid gap-1 text-center">
                    <div className="flex justify-center items-center mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Start Collaborating?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create a free session and invite your team. No sign-up required.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button size="lg" onClick={() => setDialogOpen(true)}>
                  Start a New Session
                </Button>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CollabCode. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs text-muted-foreground">Built with Next.js, ShadCN, and Genkit.</p>
        </nav>
      </footer>
      <CreateSessionDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
