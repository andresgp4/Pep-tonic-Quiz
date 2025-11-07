
import React, { useState } from 'react';
import type { Question } from '../types';

interface SurveyQuestionProps {
  question: Question;
  onAnswerSelect: (answer: string) => void;
}

export const SurveyQuestion: React.FC<SurveyQuestionProps> = ({ question, onAnswerSelect }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsFadingOut(true);
        setTimeout(() => {
            onAnswerSelect(option);
            setSelectedOption(null);
            setIsFadingOut(false);
        }, 300); // Duration of the fade-out animation
    };

  return (
    <div className={`transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-brand-text text-center mb-8 px-4">{question.text}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`p-5 text-left rounded-lg border-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-secondary/50
            ${selectedOption === option 
                ? 'bg-brand-primary border-brand-dark text-white shadow-lg' 
                : 'bg-white hover:bg-brand-light/50 border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-semibold text-lg">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
