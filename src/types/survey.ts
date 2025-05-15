export type PlanLevel = 'Freemium' | 'Small Business' | 'Full Plan';

export interface Question {
  id: number;
  category: string;
  planLevel: PlanLevel;
  questionText: string;
  relatedRisk: string;
  possibleImpacts: string[];
  nistCsf: string;
  iso27001: string;
  soc2Criteria: string;
}

export interface Answer {
  questionId: number;
  response: boolean;
}

export interface SurveyResults {
  answers: Answer[];
  score: number;
  recommendations: string[];
  riskAreas: { category: string; risk: number }[];
} 