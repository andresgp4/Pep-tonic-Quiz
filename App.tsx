
import React, { useState, useCallback, useMemo } from 'react';
import { generateMotivationalMessage } from './services/geminiService';
import type { Question } from './types';
import { SurveyQuestion } from './components/SurveyQuestion';
import { ProgressBar } from './components/ProgressBar';
import { LoadingSpinner } from './components/LoadingSpinner';

type SurveyState = 'intro' | 'survey' | 'loading' | 'results';

const surveyQuestions: Question[] = [
  {
    text: "How would you describe your energy levels throughout a typical day?",
    options: [
      "Consistently high, I feel energized.",
      "I have ups and downs, with peaks and crashes of energy.",
      "I often feel drained, especially in the afternoon.",
      "I rely on coffee or other stimulants to keep going."
    ]
  },
  {
    text: "How often do you experience 'brain fog' or difficulty concentrating?",
    options: [
      "Rarely, I feel mentally sharp and focused.",
      "Sometimes, especially after meals or at the end of the day.",
      "Frequently, it affects my productivity and clarity.",
      "Almost every day, it's a constant struggle."
    ]
  },
  {
    text: "After physical activity, how quickly do you feel your body recovers?",
    options: [
      "Very quickly, almost like in my prime.",
      "It takes a day or so to feel normal again.",
      "Noticeably slower than a few years ago.",
      "I feel sore or tired for several days."
    ]
  },
  {
    text: "When thinking about your overall well-being, do you feel your body reflects your actual age?",
    options: [
      "Yes, I feel young and full of vitality.",
      "Sometimes I feel a bit older than I am.",
      "I often feel like I've lost my former vigor.",
      "Definitely, I feel that fatigue makes me seem older."
    ]
  },
  {
    text: "How confident are you that your daily diet provides all the nutrients you need?",
    options: [
      "Very confident, I have a very balanced diet.",
      "Fairly confident, although I know it could be better.",
      "Not very confident, I'm likely missing some nutrients.",
      "Not confident at all, I find it very hard to eat healthily."
    ]
  }
];

const App: React.FC = () => {
  const [surveyState, setSurveyState] = useState<SurveyState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStartSurvey = () => {
    setSurveyState('survey');
  };

  const handleAnswerSelect = useCallback((answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSurveyState('loading');
      generateResults(newAnswers);
    }
  }, [answers, currentQuestionIndex]);

  const generateResults = async (finalAnswers: string[]) => {
    try {
      setError(null);
      const fullAnswers = finalAnswers.map((answer, index) => ({
        question: surveyQuestions[index].text,
        answer: answer,
      }));
      const message = await generateMotivationalMessage(fullAnswers);
      setResultMessage(message);
      setSurveyState('results');
    } catch (err) {
      console.error(err);
      setError("There was a problem generating your result. Please try again.");
      setSurveyState('results'); // Show error on results page
    }
  };

  const resetSurvey = () => {
    setSurveyState('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultMessage('');
    setError(null);
  }

  const progress = useMemo(() => {
    return ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;
  }, [currentQuestionIndex]);
  
  const renderContent = () => {
    switch (surveyState) {
      case 'intro':
        return (
          <div className="flex flex-col md:flex-row items-center gap-8 p-2 md:p-4 max-w-4xl mx-auto">
            <div className="md:w-1/2 flex-shrink-0">
              <img 
                src="https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Woman feeling energized and surprised" 
                className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[500px]"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-4 leading-tight">Reclaim the Vitality You Thought Was Lost</h1>
              <p className="text-lg text-gray-600 mb-8">
                In just 30 seconds, discover how you truly feel. Answer 5 brief questions to assess your current energy and vitality level.
              </p>
              <button
                onClick={handleStartSurvey}
                className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-full text-xl transition-transform transform hover:scale-105 shadow-lg"
              >
                Start the Survey
              </button>
            </div>
          </div>
        );
      case 'survey':
        return (
          <div className="w-full max-w-3xl mx-auto">
            <ProgressBar progress={progress} />
            <SurveyQuestion
              question={surveyQuestions[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>
        );
      case 'loading':
        return (
          <div className="text-center p-8">
            <LoadingSpinner />
            <h2 className="text-2xl font-semibold text-brand-text mt-6">Analyzing your answers...</h2>
            <p className="text-gray-500 mt-2">We are preparing your personalized result.</p>
          </div>
        );
      case 'results':
        return (
          <div className="text-center p-6 md:p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-100">
             <div className="w-16 h-16 bg-brand-light text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
             </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Your Path to Renewed Vitality Starts Now!</h2>
            {error ? (
              <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
            ) : (
              <p className="text-lg text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">{resultMessage}</p>
            )}
            <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-brand-text mb-3">Ready for a Change?</h3>
                <p className="text-gray-600 mb-6">Discover how Pep Tonic can help you reclaim your energy and feel like yourself again.</p>
                <a
                  href="#" // In a real app, this would link to the product page
                  onClick={(e) => { e.preventDefault(); alert('Redirecting to the product page...'); }}
                  className="bg-brand-secondary hover:bg-yellow-500 text-brand-text font-bold py-3 px-10 rounded-full text-xl transition-transform transform hover:scale-105 shadow-lg inline-block"
                >
                  Learn About the Solution
                </a>
            </div>
            <button
                onClick={resetSurvey}
                className="mt-8 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                Take the survey again
            </button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-light/30 to-transparent -z-10"></div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-4xl p-6 md:p-8 border border-gray-200">
           {renderContent()}
        </div>
    </main>
  );
};

export default App;
