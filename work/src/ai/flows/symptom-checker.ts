'use server';

/**
 * @fileOverview An AI flow to check symptoms and suggest a medical specialization.
 *
 * - symptomCheck - A function that suggests a medical specialization based on user symptoms.
 * - SymptomCheckInput - The input type for the symptomCheck function.
 * - SymptomCheckOutput - The return type for the symptomCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the symptoms the user is experiencing.'),
});
export type SymptomCheckInput = z.infer<typeof SymptomCheckInputSchema>;

const SymptomCheckOutputSchema = z.object({
  specialization: z.string().describe('The suggested medical specialization based on the symptoms.'),
  reasoning: z.string().describe('A brief explanation for why this specialization is recommended.'),
});
export type SymptomCheckOutput = z.infer<typeof SymptomCheckOutputSchema>;

export async function symptomCheck(input: SymptomCheckInput): Promise<SymptomCheckOutput> {
  return symptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckInputSchema},
  output: {schema: SymptomCheckOutputSchema},
  prompt: `أنت مساعد فرز طبي يعمل بالذكاء الاصطناعي. مهمتك هي قراءة وصف أعراض المستخدم واقتراح التخصص الطبي الأنسب الذي يجب عليه زيارته.

  وصف أعراض المستخدم:
  {{{symptoms}}}

  بناءً على الأعراض، حدد التخصص الطبي الأكثر صلة (على سبيل المثال، "طب القلب"، "الأمراض الجلدية"، "طب الأعصاب").
  قدم أيضًا سببًا موجزًا لتوصيتك.

  ملاحظة هامة: يجب أن تذكر دائمًا أن هذه مجرد توصية وأن المستخدم يجب عليه استشارة أخصائي طبي حقيقي للحصول على تشخيص دقيق. قم بتضمين هذا التنبيه في حقل "المنطق".

  قم بالرد بالتخصص المقترح والمنطق.`,
});

const symptomCheckFlow = ai.defineFlow(
  {
    name: 'symptomCheckFlow',
    inputSchema: SymptomCheckInputSchema,
    outputSchema: SymptomCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
