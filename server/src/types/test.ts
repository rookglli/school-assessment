export interface AnswerOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: AnswerOption[];
  correctAnswerId: string;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  questions: TestQuestion[];
}

export type PublicTestQuestion = Omit<
  TestQuestion,
  'correctAnswerId' | 'explanation'
>;

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