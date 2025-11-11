
'use server';
/**
 * @fileOverview Analyzes a skin image by calling a local Python model API.
 *
 * - analyzeSkinImageAndPredictCondition - A function that handles the skin image analysis.
 * - AnalyzeSkinImageAndPredictConditionInput - The input type for the analyzeSkinImageAndPredictCondition function.
 * - AnalyzeSkinImageAndPredictConditionOutput - The return type for the analyzeSkinImageAndPredictCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkinImageAndPredictConditionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the skin, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSkinImageAndPredictConditionInput = z.infer<typeof AnalyzeSkinImageAndPredictConditionInputSchema>;

const AnalyzeSkinImageAndPredictConditionOutputSchema = z.object({
  predictions: z.array(
    z.object({
      condition: z.string().describe('The predicted skin condition.'),
      probability: z.number().describe('The probability score for the predicted condition.'),
    })
  ).describe('A list of predicted skin conditions with probability scores.'),
});
export type AnalyzeSkinImageAndPredictConditionOutput = z.infer<typeof AnalyzeSkinImageAndPredictConditionOutputSchema>;


async function callLocalPythonApi(input: AnalyzeSkinImageAndPredictConditionInput): Promise<AnalyzeSkinImageAndPredictConditionOutput> {
  const apiUrl = process.env.PYTHON_API_URL;
  if (!apiUrl) {
    throw new Error("PYTHON_API_URL environment variable is not set.");
  }
  
  console.log(`Calling local Python API at: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoDataUri: input.photoDataUri }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API response error:', errorBody);
      throw new Error(`Local API request failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    
    // Validate the response from the Python API against our Zod schema
    const parsed = AnalyzeSkinImageAndPredictConditionOutputSchema.safeParse(result);
    if (!parsed.success) {
      console.error("Invalid data format from Python API:", parsed.error);
      throw new Error("Received invalid data format from the Python API.");
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Error calling local Python API:', error);
    // Return a structured error that the frontend can display
    throw new Error('Could not connect to the local analysis model. Please ensure the Python server is running.');
  }
}


export async function analyzeSkinImageAndPredictCondition(input: AnalyzeSkinImageAndPredictConditionInput): Promise<AnalyzeSkinImageAndPredictConditionOutput> {
  // This now directly calls the local Python API wrapper function
  return callLocalPythonApi(input);
}


// We keep the Genkit flow definition in case you want to switch back
// or add other GenAI features later, but it's not being used by the export above.
const analyzeSkinImageAndPredictConditionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinImageAndPredictConditionFlow',
    inputSchema: AnalyzeSkinImageAndPredictConditionInputSchema,
    outputSchema: AnalyzeSkinImageAndPredictConditionOutputSchema,
  },
  async input => {
    // This flow is now a wrapper around our local API call
    return await callLocalPythonApi(input);
  }
);
