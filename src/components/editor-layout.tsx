'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/code-editor';
import { UserPresence } from '@/components/user-presence';
import { Logo } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Share2, ArrowLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorLayoutProps {
  sessionId: string;
  initialLanguage: string;
}

export function EditorLayout({ sessionId, initialLanguage }: EditorLayoutProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const { toast } = useToast();
  const router = useRouter();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: 'URL Copied!',
          description: 'Session URL has been copied to your clipboard.',
        });
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background">
        <header className="px-4 h-16 flex items-center justify-between border-b bg-card shrink-0">
          <div className="flex items-center gap-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => router.push('/')}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Back to Home</p>
                </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">CollabCode</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserPresence />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy session URL</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 p-4 min-h-0">
          <div className="flex flex-col rounded-lg border bg-card min-h-0 shadow-sm">
            <CodeEditor language={language} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="font-semibold mb-4 text-lg">Session Controls</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language-select">Language</Label>
                   <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <p className="text-sm text-muted-foreground pt-2">
                    Session ID: <br/>
                    <span className="font-mono bg-muted px-2 py-1 rounded text-xs inline-block mt-1">{sessionId}</span>
                  </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4 flex-1 shadow-sm">
                <h3 className="font-semibold mb-4 text-lg">Connected Users</h3>
                <div className="overflow-y-auto">
                    <UserPresence orientation="vertical" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
