'use server';

import { analyzeSkinImageAndPredictCondition } from '@/ai/flows/analyze-skin-image-and-predict-condition';
import { getPersonalizedSkincareRoutine } from '@/ai/flows/get-personalized-skincare-routine';

export type Prediction = {
  condition: string;
  probability: number;
};

export type AnalysisSuccess = {
  predictions: Prediction[];
  recommendations: string;
};

export type AnalysisError = {
  error: string;
};

export async function handleImageAnalysisAction(photoDataUri: string): Promise<AnalysisSuccess | AnalysisError> {
  if (!photoDataUri) {
    return { error: 'No image data provided.' };
  }

  try {
    const analysis = await analyzeSkinImageAndPredictCondition({ photoDataUri });
    
    if (!analysis.predictions || analysis.predictions.length === 0) {
      return { error: 'Could not analyze the image. The AI was unable to identify any conditions. Please try a different photo.' };
    }

    const topPrediction = analysis.predictions.sort((a, b) => b.probability - a.probability)[0];

    if (!topPrediction) {
      return { error: 'Analysis returned no valid predictions.' };
    }

    // Disable AI routine text on request; just return predictions.
    // If you ever want to re-enable, call getPersonalizedSkincareRoutine here.
    return {
      predictions: analysis.predictions,
      recommendations: '',
    };
  } catch (error) {
    console.error('Error during image analysis action:', error);
    return { error: 'Could not analyze the image. Please ensure the Python server is running and try a different photo.' };
  }
}
