export type AIProvider = 'groq' | 'claude';

export type Severity = 'low' | 'medium' | 'high';
export type Confidence = 'low' | 'medium' | 'high';

export interface SkillClaim {
  name: string;
  confidence: Confidence;
  reason: string;
}

export interface InterviewQuestion {
  id: string;
  skill: string;
  question: string;
  severity: Severity;
}

export interface AnalysisResult {
  score: number;
  verdict: string;
  skills: SkillClaim[];
  questions: InterviewQuestion[];
}

export interface AnswerEvaluation {
  passed: boolean;
  feedback: string;
  confidence: string;
}

export interface SessionData {
  id: string;
  user_id: string | null;
  resume_text: string;
  score: number;
  verdict: string;
  results_json: AnalysisResult;
  ai_provider: AIProvider;
  created_at: string;
}

export interface AnswerData {
  id: string;
  session_id: string;
  question: string;
  skill: string;
  answer: string;
  passed: boolean;
  feedback: string;
  created_at: string;
}

export interface LocalSession {
  id: string;
  resume_text: string;
  score: number;
  verdict: string;
  results: AnalysisResult;
  ai_provider: AIProvider;
  answers: {
    question: string;
    skill: string;
    answer: string;
    passed: boolean;
    feedback: string;
  }[];
  created_at: string;
}

export interface PricingTier {
  name: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
  aiProvider: AIProvider;
}
