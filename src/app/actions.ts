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

    const routine = await getPersonalizedSkincareRoutine({
      skinCondition: topPrediction.condition,
      probability: topPrediction.probability,
    });
    
    return {
      predictions: analysis.predictions,
      recommendations: routine.recommendations,
    };
  } catch (error) {
    console.error('Error during image analysis action:', error);
    return { error: 'An unexpected error occurred during analysis. Please try again later.' };
  }
}
