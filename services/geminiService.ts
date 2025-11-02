
import { GoogleGenAI, Type } from "@google/genai";
import type { EmotionAnalysis } from '../types';
import { Emotion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const emotionValues = Object.values(Emotion);

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    emotion: {
      type: Type.STRING,
      description: 'The dominant emotion detected in the text.',
      enum: emotionValues,
    },
    confidence: {
      type: Type.NUMBER,
      description: 'A confidence score between 0.0 and 1.0 for the detected emotion.',
    },
  },
  required: ['emotion', 'confidence'],
};

export const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  try {
    const prompt = `Analyze the dominant emotion of the following text. Consider the context, tone, and word choice to determine the most fitting emotion. Text: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const responseText = response.text.trim();
    const parsedJson = JSON.parse(responseText);

    if (
        typeof parsedJson.emotion === 'string' &&
        emotionValues.includes(parsedJson.emotion) &&
        typeof parsedJson.confidence === 'number'
    ) {
        return {
            emotion: parsedJson.emotion as Emotion,
            confidence: parsedJson.confidence,
        };
    } else {
        throw new Error('Received an invalid or malformed response from the AI.');
    }

  } catch (error) {
    console.error("Error analyzing emotion:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error('Failed to get a valid analysis from the AI. Please try rephrasing your text.');
    }
    throw new Error('Could not connect to the AI service. Please check your connection and API key.');
  }
};
