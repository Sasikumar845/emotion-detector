
export enum Emotion {
  Joy = 'Joy',
  Sadness = 'Sadness',
  Anger = 'Anger',
  Fear = 'Fear',
  Surprise = 'Surprise',
  Disgust = 'Disgust',
  Neutral = 'Neutral',
}

export interface EmotionAnalysis {
  emotion: Emotion;
  confidence: number;
}
