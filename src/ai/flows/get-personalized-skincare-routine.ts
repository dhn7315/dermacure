'use server';
/**
 * @fileOverview Flow for generating personalized skincare routine recommendations based on AI skin condition prediction.
 *
 * - getPersonalizedSkincareRoutine - A function that generates skincare routine recommendations.
 * - SkincareRoutineInput - The input type for the getPersonalizedSkincareRoutine function.
 * - SkincareRoutineOutput - The return type for the getPersonalizedSkincareRoutine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkincareRoutineInputSchema = z.object({
  skinCondition: z
    .string()
    .describe('The predicted skin condition from the AI model.'),
  probability: z
    .number()
    .describe(
      'The probability score associated with the predicted skin condition.'
    ),
});
export type SkincareRoutineInput = z.infer<typeof SkincareRoutineInputSchema>;

const SkincareRoutineOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'Personalized skincare routine recommendations including natural remedies and conventional treatments.'
    ),
});
export type SkincareRoutineOutput = z.infer<typeof SkincareRoutineOutputSchema>;

export async function getPersonalizedSkincareRoutine(
  input: SkincareRoutineInput
): Promise<SkincareRoutineOutput> {
  return personalizedSkincareRoutineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSkincareRoutinePrompt',
  input: {schema: SkincareRoutineInputSchema},
  output: {schema: SkincareRoutineOutputSchema},
  prompt: `You are a skincare expert. Based on the AI analysis, generate personalized skincare routine recommendations for the following skin condition, suggest both natural remedies and conventional treatments:

Skin Condition: {{{skinCondition}}}
Probability Score: {{{probability}}}

Please provide a detailed skincare routine with specific product recommendations and lifestyle adjustments. If probability score is less than 0.5 then focus on natural remedies. If the probability score is more than 0.75 focus on conventional treatments. Otherwise, suggest a mix of both natural remedies and conventional treatments.
`,
});

const personalizedSkincareRoutineFlow = ai.defineFlow(
  {
    name: 'personalizedSkincareRoutineFlow',
    inputSchema: SkincareRoutineInputSchema,
    outputSchema: SkincareRoutineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

