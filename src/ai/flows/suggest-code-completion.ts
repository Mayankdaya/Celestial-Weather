'use server';

/**
 * @fileOverview Provides intelligent code completion suggestions based on the current syntax of the active user.
 *
 * - suggestCodeCompletion - A function that handles the code completion suggestion process.
 * - SuggestCodeCompletionInput - The input type for the suggestCodeCompletion function.
 * - SuggestCodeCompletionOutput - The return type for the suggestCodeCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeCompletionInputSchema = z.object({
  language: z.string().describe('The programming language of the code.'),
  code: z.string().describe('The current code snippet from the active user.'),
  cursorPosition: z.number().describe('The current cursor position in the code.'),
});
export type SuggestCodeCompletionInput = z.infer<typeof SuggestCodeCompletionInputSchema>;

const SuggestCodeCompletionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of code completion suggestions.'),
});
export type SuggestCodeCompletionOutput = z.infer<typeof SuggestCodeCompletionOutputSchema>;

export async function suggestCodeCompletion(input: SuggestCodeCompletionInput): Promise<SuggestCodeCompletionOutput> {
  return suggestCodeCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeCompletionPrompt',
  input: {schema: SuggestCodeCompletionInputSchema},
  output: {schema: SuggestCodeCompletionOutputSchema},
  prompt: `You are an AI code completion assistant. Given the current code snippet and the programming language, suggest possible code completions.

Language: {{{language}}}
Code:
{{{code}}}

Suggestions:
`,
});

const suggestCodeCompletionFlow = ai.defineFlow(
  {
    name: 'suggestCodeCompletionFlow',
    inputSchema: SuggestCodeCompletionInputSchema,
    outputSchema: SuggestCodeCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
