import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
