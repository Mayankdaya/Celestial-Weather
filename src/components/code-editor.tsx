'use client';

import { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestCodeCompletion } from '@/ai/flows/suggest-code-completion';

interface CodeEditorProps {
  language: string;
}

const placeholderCode: Record<string, string> = {
    javascript: `// Welcome to your collaborative JavaScript session!
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');`,
    python: `# Welcome to your collaborative Python session!
def greet(name):
    print(f"Hello, {name}!")

greet("World")`,
    java: `// Welcome to your collaborative Java session!
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}`,
    typescript: `// Welcome to your collaborative TypeScript session!
function greet(name: string): void {
  console.log('Hello, ' + name + '!');
}

greet('World');`,
    html: `<!-- Welcome to your collaborative HTML session! -->
<!DOCTYPE html>
<html>
<head>
  <title>CollabCode</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`,
    css: `/* Welcome to your collaborative CSS session! */
body {
  font-family: sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
}`,
}


export function CodeEditor({ language }: CodeEditorProps) {
  const [code, setCode] = useState(placeholderCode[language] || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSuggestion = () => {
    startTransition(async () => {
      setSuggestions([]);
      const result = await suggestCodeCompletion({
        language,
        code,
        cursorPosition: code.length,
      });
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      }
    });
  };

  const applySuggestion = (suggestion: string) => {
    // A simple implementation: appends the suggestion.
    setCode(prev => prev + suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b flex items-center justify-between bg-muted/50">
        <p className="text-sm font-medium capitalize">{language}</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleSuggestion} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Suggest
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">AI Suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  Click a suggestion to add it to your code.
                </p>
              </div>
              {suggestions.length > 0 ? (
                <div className="grid gap-2">
                  {suggestions.map((s, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="justify-start font-mono text-left h-auto whitespace-pre-wrap"
                      onClick={() => applySuggestion(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              ) : (
                !isPending && <p className="text-sm text-muted-foreground">No suggestions found.</p>
              )}
               {isPending && <div className="flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`// Write your ${language} code here...`}
        className="flex-1 w-full h-full rounded-none border-0 resize-none focus-visible:ring-0 p-4 text-base font-mono bg-card"
      />
    </div>
  );
}
