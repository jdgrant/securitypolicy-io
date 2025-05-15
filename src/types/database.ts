export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  phone_number?: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  answers: {
    question_id: number;
    response: boolean;
  }[];
  score: number;
  recommendations: string[];
  risk_areas: {
    category: string;
    risk: number;
  }[];
  completed_at: string;
  created_at: string;
}

export interface DbUser {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  createdAt: string;
}

export interface DbAssessment {
  userId: string;
  answers: {
    questionId: number;
    response: boolean;
  }[];
  score: number;
  recommendations: string[];
  riskAreas: {
    category: string;
    risk: number;
  }[];
  completedAt: string;
}

export interface DbSession {
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface User {
  UserId: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CompanyName: string;
  JobTitle: string;
  PhoneNumber?: string;
  IsEmailVerified: boolean;
  VerificationToken?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface AssessmentAnswer {
  questionId: number;
  response: boolean;
}

export interface RiskArea {
  category: string;
  risk: number;
} 