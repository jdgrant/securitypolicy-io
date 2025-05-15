import React from 'react';
import type { Question as QuestionType } from '../types/survey';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (questionId: number, response: boolean) => void;
  answer?: boolean;
}

export const Question: React.FC<QuestionProps> = ({ question, onAnswer, answer }) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{question.questionText}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Risk: </span>
          {question.relatedRisk}
        </p>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Potential Impacts: </span>
          {question.possibleImpacts.join(', ')}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => onAnswer(question.id, true)}
          className={`px-4 py-2 rounded ${
            answer === true
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-green-100'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer(question.id, false)}
          className={`px-4 py-2 rounded ${
            answer === false
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 hover:bg-red-100'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}; 