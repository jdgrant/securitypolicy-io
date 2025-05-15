import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Answer, UserResponse } from '../types';
import { questions } from '../data/questions';

const Start: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserResponse[]>([]);

  const handleAnswer = (answer: Answer) => {
    const newAnswers = [...answers, {
      questionId: questions[currentQuestionIndex].id,
      answer
    }];
    setAnswers(newAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      // Store answers in sessionStorage before navigating
      sessionStorage.setItem('riskAnswers', JSON.stringify(newAnswers));
      navigate('/summary');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {currentQuestion.questionText}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleAnswer('yes')}
              className="px-6 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer('no')}
              className="px-6 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              No
            </button>
            <button
              onClick={() => handleAnswer('not_sure')}
              className="px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Not Sure
            </button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Answer to the best of your knowledge. Your responses help us identify potential security risks.
        </div>
      </div>
    </div>
  );
};

export default Start; 