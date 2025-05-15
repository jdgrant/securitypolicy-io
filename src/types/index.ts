export type Answer = 'yes' | 'no' | 'not_sure';

export interface Question {
  id: number;
  questionText: string;
  relatedRisk: string;
  possibleImpacts: string[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface UserResponse {
  questionId: number;
  answer: Answer;
} 