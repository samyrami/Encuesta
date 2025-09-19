export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
}

export interface ContactInfo {
  name: string;
  company: string;
  nit: string;
  email: string;
  phone: string;
  city: string;
}

export interface QuestionnaireState {
  currentStep: 'welcome' | 'contact' | 'questionnaire' | 'diagnosis' | 'chat';
  currentField?: keyof ContactInfo;
  currentQuestionIndex: number;
  contactInfo: Partial<ContactInfo>;
  answers: Record<number, string>;
  diagnosisGenerated: boolean;
}

export interface Question {
  id: number;
  pregunta: string;
  opcion_si: string | null;
  opcion_no: string | null;
  diagnostico: string | null;
  category: string;
}

export interface DiagnosisResult {
  company: string;
  name: string;
  city: string;
  date: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  score: number;
  category: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
}