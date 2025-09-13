'use server';

/**
 * @fileOverview AI flow to suggest alternate appointment times or doctors
 *
 * - suggestAlternateAppointments - A function that suggests alternate appointment times or doctors.
 * - SuggestAlternateAppointmentsInput - The input type for the suggestAlternateAppointments function.
 * - SuggestAlternateAppointmentsOutput - The return type for the suggestAlternateAppointments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternateAppointmentsInputSchema = z.object({
  preferredDoctorSpecialization: z
    .string()
    .describe('The preferred doctor specialization for the appointment.'),
  preferredTimeSlot: z.string().describe('The preferred time slot for the appointment.'),
  userPreferences: z
    .string()
    .describe('The user preferences for the appointment, such as location or gender.'),
  unavailableDoctors: z
    .array(z.string())
    .optional()
    .describe('A list of doctor IDs who are unavailable.'),
});
export type SuggestAlternateAppointmentsInput = z.infer<typeof SuggestAlternateAppointmentsInputSchema>;

const SuggestAlternateAppointmentsOutputSchema = z.object({
  alternateSuggestions: z
    .array(z.string())
    .describe('A list of suggestions for alternate appointment times or doctors.'),
});
export type SuggestAlternateAppointmentsOutput = z.infer<typeof SuggestAlternateAppointmentsOutputSchema>;

export async function suggestAlternateAppointments(input: SuggestAlternateAppointmentsInput): Promise<SuggestAlternateAppointmentsOutput> {
  return suggestAlternateAppointmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternateAppointmentsPrompt',
  input: {schema: SuggestAlternateAppointmentsInputSchema},
  output: {schema: SuggestAlternateAppointmentsOutputSchema},
  prompt: `أنت مساعد ذكاء اصطناعي تساعد المستخدمين في العثور على مواعيد أو أطباء بديلين.

  تخصص الطبيب المفضل لدى المستخدم هو: {{{preferredDoctorSpecialization}}}.
  الوقت المفضل لدى المستخدم هو: {{{preferredTimeSlot}}}.
  تفضيلات المستخدم هي: {{{userPreferences}}}.

  يرجى اقتراح بعض المواعيد أو الأطباء البديلين، مع مراعاة تفضيلات المستخدم.
  تأكد من عدم اقتراح أي من معرفات الأطباء التالية، لأنهم غير متاحين: {{{unavailableDoctors}}}.

  قم بالرد بقائمة من الاقتراحات لمواعيد أو أطباء بديلين. يجب أن تكون الاقتراحات محددة قدر الإمكان، بما في ذلك اسم الطبيب وتخصصه والمواعيد المتاحة.`,
});

const suggestAlternateAppointmentsFlow = ai.defineFlow(
  {
    name: 'suggestAlternateAppointmentsFlow',
    inputSchema: SuggestAlternateAppointmentsInputSchema,
    outputSchema: SuggestAlternateAppointmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
