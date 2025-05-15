import React, { useState, useEffect } from 'react';
import type { Question, Answer, SurveyResults } from '../types/survey';
import type { UserContact, AssessmentData } from '../types/user';
import { Question as QuestionComponent } from '../components/Question';
import { ContactForm } from '../components/ContactForm';

const calculateResults = (answers: Answer[], questions: Question[]): SurveyResults => {
  const totalQuestions = questions.length;
  const answeredYes = answers.filter(a => a.response).length;
  const score = (answeredYes / totalQuestions) * 100;

  const riskAreas = questions.reduce((acc, question) => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !answer.response) {
      const existing = acc.find(a => a.category === question.category);
      if (existing) {
        existing.risk += 1;
      } else {
        acc.push({ category: question.category, risk: 1 });
      }
    }
    return acc;
  }, [] as { category: string; risk: number }[]);

  const recommendations = [
    'Consider upgrading to our Small Business plan for enhanced security features',
    'Get access to advanced risk assessment tools with our Full Plan',
    'Protect your business with our comprehensive security solutions'
  ];

  return {
    answers,
    score,
    recommendations,
    riskAreas
  };
};

export const Assessment: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    // Load questions from the JSON file
    fetch('/questions/risk_questions_all_levels.json')
      .then(res => res.json())
      .then(data => {
        const freemiumQuestions = data.filter(
          (q: Question) => q.planLevel === 'Freemium'
        );
        setQuestions(freemiumQuestions);
      })
      .catch(error => console.error('Error loading questions:', error));
  }, []);

  const handleAnswer = (questionId: number, response: boolean) => {
    setAnswers(prev => {
      const newAnswers = prev.filter(a => a.questionId !== questionId);
      return [...newAnswers, { questionId, response }];
    });
  };

  const handleComplete = () => {
    const results = calculateResults(answers, questions);
    setResults(results);
    setShowContactForm(true);
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    
    // Store in localStorage
    const storedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    storedAssessments.push(data);
    localStorage.setItem('assessments', JSON.stringify(storedAssessments));

    setIsComplete(true);
  };

  if (questions.length === 0) {
    return <div className="text-center p-4">Loading questions...</div>;
  }

  if (showContactForm && !isComplete && results) {
    return <ContactForm onSubmit={handleAssessmentComplete} answers={answers} />;
  }

  if (isComplete && results && assessmentData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Thank you, {assessmentData.contact.firstName}!
          </h2>
          <p className="text-gray-600">
            Your personalized security assessment for {assessmentData.contact.companyName} is ready.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Your Security Assessment Results</h2>
        <div className="mb-6">
          <div className="text-xl mb-2">Score: {results.score.toFixed(1)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${results.score}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Risk Areas</h3>
          {results.riskAreas.map(area => (
            <div key={area.category} className="mb-2">
              <div className="flex justify-between">
                <span>{area.category}</span>
                <span className="text-red-500">{area.risk} issues found</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
          <ul className="list-disc pl-5">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="mb-2">{rec}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Security Assessment Survey</h1>
      <div className="mb-6">
        <div className="text-sm text-gray-600">
          Completed: {answers.length} / {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(answers.length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {questions.map(question => (
        <QuestionComponent
          key={question.id}
          question={question}
          onAnswer={handleAnswer}
          answer={answers.find(a => a.questionId === question.id)?.response}
        />
      ))}

      {answers.length === questions.length && (
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Complete Survey
          </button>
        </div>
      )}
    </div>
  );
}; 