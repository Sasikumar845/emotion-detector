
import React, { useState, useCallback } from 'react';
import { analyzeEmotion } from './services/geminiService';
import type { EmotionAnalysis } from './types';
import EmotionDisplay from './components/EmotionDisplay';
import Loader from './components/Loader';

const BrainIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-2.387-.477a2 2 0 01-.547-1.806l.477-2.387a6 6 0 013.86-.517l.318.158a6 6 0 003.86-.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-3.86-.517l-.318-.158a6 6 0 01-3.86-.517l-2.387-.477a2 2 0 00-1.806-.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 003.86.517l.318.158a6 6 0 003.86.517l2.387-.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-3.86-.517l-.318-.158a6 6 0 01-3.86-.517L6.05 6.79a2 2 0 00-1.806-.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 01-.517 3.86l-.158.318a6 6 0 01-.517 3.86L3.58 19.428a2 2 0 00.547 1.806a2 2 0 001.806.547l2.387-.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-2.387-.477a2 2 0 01-1.806-.547a2 2 0 01-.547-1.806l.477-2.387a6 6 0 013.86-.517l.318.158a6 6 0 003.86-.517l2.387.477a2 2 0 011.806.547a2 2 0 01.547 1.806l-.477 2.387a6 6 0 01-3.86.517l-.318.158a6 6 0 00-3.86.517l-2.387-.477a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 003.86.517l.318.158a6 6 0 003.86.517l2.387-.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-3.86-.517l-.318-.158a6 6 0 01-3.86-.517z" />
  </svg>
);

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<EmotionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeEmotion(text);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8 w-full">
          <div className="flex justify-center items-center gap-4 mb-2">
            <BrainIcon />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-light text-transparent bg-clip-text">
              Emotion Detector AI
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Uncover the emotional tone of any text with the power of Gemini.
          </p>
        </header>

        <div className="w-full bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-40 p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow duration-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="mt-4 w-full flex justify-center items-center h-12 px-6 font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? <Loader /> : 'Analyze Emotion'}
          </button>
        </div>

        <div className="w-full mt-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {result && !isLoading && (
            <div className="transition-opacity duration-500 ease-in-out animate-[fadeIn_0.5s]">
              <EmotionDisplay result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
