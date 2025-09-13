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
  prompt: `You are an AI assistant helping users find alternate appointment times or doctors.

  The user's preferred doctor specialization is: {{{preferredDoctorSpecialization}}}.
  The user's preferred time slot is: {{{preferredTimeSlot}}}.
  The user's preferences are: {{{userPreferences}}}.

  Please suggest some alternate appointment times or doctors, taking into account the user's preferences.
  Make sure to not suggest any of the following doctor IDs, because they are unavailable: {{{unavailableDoctors}}}.

  Respond with a list of suggestions for alternate appointment times or doctors. The suggestions should be as specific as possible, including the doctor's name, specialization, and available time slots.`,
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
