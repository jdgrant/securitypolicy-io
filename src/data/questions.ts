import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    questionText: "Does your company store sensitive customer data (PII, financial, or health information)?",
    relatedRisk: "Data Privacy Breach",
    possibleImpacts: [
      "Regulatory fines and penalties",
      "Loss of customer trust",
      "Legal liabilities"
    ]
  },
  {
    id: 2,
    questionText: "Do your employees use personal devices for work (BYOD)?",
    relatedRisk: "Device Security Compromise",
    possibleImpacts: [
      "Data leakage",
      "Unauthorized access",
      "Malware infection"
    ]
  },
  {
    id: 3,
    questionText: "Does your company use cloud services (like AWS, Google Cloud, or Azure)?",
    relatedRisk: "Cloud Security Vulnerability",
    possibleImpacts: [
      "Data exposure",
      "Service disruption",
      "Account compromise"
    ]
  },
  {
    id: 4,
    questionText: "Do you have a process for regular software updates and patch management?",
    relatedRisk: "System Vulnerability",
    possibleImpacts: [
      "Security breaches",
      "System exploitation",
      "Performance issues"
    ]
  },
  {
    id: 5,
    questionText: "Does your company have a formal incident response plan?",
    relatedRisk: "Incident Response Failure",
    possibleImpacts: [
      "Extended downtime",
      "Uncoordinated response",
      "Increased damage from incidents"
    ]
  },
  {
    id: 6,
    questionText: "Do you conduct regular security awareness training for employees?",
    relatedRisk: "Human Error",
    possibleImpacts: [
      "Phishing success",
      "Data leaks",
      "Security policy violations"
    ]
  },
  {
    id: 7,
    questionText: "Do you have third-party vendors with access to your systems or data?",
    relatedRisk: "Third-party Security Risk",
    possibleImpacts: [
      "Supply chain attacks",
      "Data breaches through vendors",
      "Compliance violations"
    ]
  },
  {
    id: 8,
    questionText: "Is your company required to comply with specific regulations (GDPR, HIPAA, etc.)?",
    relatedRisk: "Compliance Risk",
    possibleImpacts: [
      "Regulatory penalties",
      "Loss of business opportunities",
      "Mandatory audits"
    ]
  },
  {
    id: 9,
    questionText: "Do you have a backup and disaster recovery plan?",
    relatedRisk: "Business Continuity Risk",
    possibleImpacts: [
      "Extended downtime",
      "Data loss",
      "Business disruption"
    ]
  },
  {
    id: 10,
    questionText: "Does your company process online payments or handle financial transactions?",
    relatedRisk: "Financial Fraud Risk",
    possibleImpacts: [
      "Financial losses",
      "Chargeback fees",
      "Payment system compromise"
    ]
  }
]; 