import React, { useState } from 'react';
import type { UserContact, UserAuth, AssessmentData } from '../types/user';
import { AuthForm } from './AuthForm';
import { EmailVerification } from './EmailVerification';
import { sendVerificationEmail } from '../services/emailService';

interface ContactFormProps {
  onSubmit: (data: AssessmentData) => void;
  answers: { questionId: number; response: boolean }[];
}

type FormStep = 'contact' | 'auth' | 'verification';

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, answers }) => {
  const [step, setStep] = useState<FormStep>('contact');
  const [contactData, setContactData] = useState<UserContact>({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: ''
  });
  const [authData, setAuthData] = useState<UserAuth | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof UserContact, string>>>({});

  const validateContactForm = () => {
    const newErrors: Partial<Record<keyof UserContact, string>> = {};
    
    if (!contactData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!contactData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!contactData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!contactData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!contactData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactForm()) {
      setStep('auth');
    }
  };

  const handleAuthSubmit = async (auth: UserAuth) => {
    setAuthData(auth);
    await sendVerificationEmail(auth.email, auth.verificationToken!);
    setStep('verification');
  };

  const handleVerificationComplete = () => {
    if (authData && contactData) {
      onSubmit({
        contact: contactData,
        auth: { ...authData, isEmailVerified: true },
        answers,
        completedAt: new Date().toISOString()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof UserContact]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (step === 'auth') {
    return <AuthForm email={contactData.email} onSubmit={handleAuthSubmit} />;
  }

  if (step === 'verification' && authData) {
    return (
      <EmailVerification
        email={authData.email}
        verificationToken={authData.verificationToken!}
        onVerificationComplete={handleVerificationComplete}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Get Your Free Assessment Results</h2>
      <p className="text-gray-600 mb-6">
        Please provide your contact information to create your account and receive your detailed security assessment report.
      </p>
      
      <form onSubmit={handleContactSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={contactData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={contactData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Email *
          </label>
          <input
            type="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={contactData.companyName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            value={contactData.jobTitle}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.jobTitle ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={contactData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="text-sm text-gray-500 mt-4">
          * Required fields
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}; 