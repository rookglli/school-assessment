export interface AnswerOption {
  id: string;
  text: string;
}

export interface PublicTestQuestion {
  id: string;
  text: string;
  options: AnswerOption[];
}

export interface PublicTest {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  questions: PublicTestQuestion[];
}

export interface SubmitTestRequest {
  answers: Record<string, string>;
  timeExpired?: boolean;
}

export interface TestResult {
  attemptId: string;
  testId: string;
  testTitle: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  answers: Record<string, string>;
  timeExpired: boolean;
}