export interface UserContact {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string;
}

export interface UserAuth {
  email: string;
  password: string;
  username: string;
  isEmailVerified: boolean;
  verificationToken?: string;
}

export interface AssessmentData {
  contact: UserContact;
  auth: UserAuth;
  answers: { questionId: number; response: boolean }[];
  completedAt: string;
} 