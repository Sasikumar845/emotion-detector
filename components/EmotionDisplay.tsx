
import React from 'react';
import type { EmotionAnalysis } from '../types';
import { Emotion } from '../types';

interface EmotionDisplayProps {
  result: EmotionAnalysis;
}

const emotionConfig = {
  [Emotion.Joy]: { emoji: '😄', color: 'bg-yellow-500', textColor: 'text-yellow-300' },
  [Emotion.Sadness]: { emoji: '😢', color: 'bg-blue-500', textColor: 'text-blue-300' },
  [Emotion.Anger]: { emoji: '😡', color: 'bg-red-500', textColor: 'text-red-300' },
  [Emotion.Fear]: { emoji: '😨', color: 'bg-purple-500', textColor: 'text-purple-300' },
  [Emotion.Surprise]: { emoji: '😮', color: 'bg-pink-500', textColor: 'text-pink-300' },
  [Emotion.Disgust]: { emoji: '🤢', color: 'bg-green-500', textColor: 'text-green-300' },
  [Emotion.Neutral]: { emoji: '😐', color: 'bg-gray-500', textColor: 'text-gray-300' },
};

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ result }) => {
  const config = emotionConfig[result.emotion] || emotionConfig.Neutral;
  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700 text-center">
      <h2 className="text-xl font-semibold text-gray-400 mb-4">Analysis Result</h2>
      <div className="flex flex-col items-center">
        <span className="text-7xl mb-4" role="img" aria-label={result.emotion}>{config.emoji}</span>
        <p className={`text-4xl font-bold ${config.textColor}`}>{result.emotion}</p>
        <div className="w-full mt-6">
          <p className="text-sm text-gray-400 mb-2">Confidence</p>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full ${config.color} transition-all duration-500 ease-out`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <p className="text-lg font-mono mt-2 text-white">{confidencePercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionDisplay;
