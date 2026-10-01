export interface NewsTranslation {
  verdict: string;
  verdictEmoji: string;
  simpleTitle: string;
  simpleExplanation: string;
  questionMessage: string;
  impactScore: number;
  keyTakeaway: string;
  isFallback?: boolean;
}

export type AIProvider = 'gemini' | 'openai' | 'groq';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  technicalTerm: string;
  analogyTitle: string;
  analogyDescription: string;
  iconName: string;
  realExample: string;
}

export interface TimelineStep {
  period: string;
  title: string;
  description: string;
  icon: string;
  statusType: 'success' | 'warning' | 'danger' | 'neutral';
  impactText: string;
}

export interface TimelineScenario {
  id: string;
  title: string;
  type: 'short_term' | 'long_term';
  subtitle: string;
  summary: string;
  badge: string;
  steps: TimelineStep[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface CentralBankState {
  interestRate: number; // e.g. 2% to 18%
  temperature: 'frozen' | 'cool' | 'balanced' | 'warm' | 'overheated';
  inflationRate: number;
  consumptionLevel: number;
  unemploymentRate: number;
  creditFlow: number;
}
