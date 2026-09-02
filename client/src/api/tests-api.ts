import type {
  PublicTest,
  SubmitTestRequest,
  TestResult,
} from '../types/test';

import { apiRequest } from './http';

export const getTest = (
  testId: string
): Promise<PublicTest> => {
  return apiRequest<PublicTest>(
    `/tests/${encodeURIComponent(testId)}`
  );
};

export const submitTest = (
  testId: string,
  data: SubmitTestRequest
): Promise<TestResult> => {
  return apiRequest<TestResult>(
    `/tests/${encodeURIComponent(testId)}/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
};