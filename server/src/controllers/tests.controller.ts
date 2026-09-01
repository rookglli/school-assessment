import type { Request, Response } from 'express';

import { getTestById } from '../data/tests';
import type {
  PublicTest,
  SubmitTestRequest,
  TestResult,
} from '../types/test';

export const getTest = (request: Request, response: Response) => {
  const { testId } = request.params;

  if (typeof testId !== 'string') {
    response.status(400).json({
      message: 'Некоректний ідентифікатор тесту',
    });

    return;
  }

  const test = getTestById(testId);

  if (!test) {
    response.status(404).json({
      message: 'Тест не знайдено',
    });

    return;
  }

  const publicTest: PublicTest = {
    id: test.id,
    title: test.title,
    description: test.description,
    subject: test.subject,
    topic: test.topic,
    durationMinutes: test.durationMinutes,
    questions: test.questions.map(question => ({
      id: question.id,
      text: question.text,
      options: question.options,
    })),
  };

  response.status(200).json(publicTest);
};

export const submitTest = (
  request: Request,
  response: Response
) => {
  const { testId } = request.params;

  if (typeof testId !== 'string') {
    response.status(400).json({
      message: 'Некоректний ідентифікатор тесту',
    });

    return;
  }

  const test = getTestById(testId);

  if (!test) {
    response.status(404).json({
      message: 'Тест не знайдено',
    });

    return;
  }

  const {
    answers,
    timeExpired = false,
  } = request.body as SubmitTestRequest;

  if (
    !answers ||
    typeof answers !== 'object' ||
    Array.isArray(answers)
  ) {
    response.status(400).json({
      message: 'Некоректні відповіді',
    });

    return;
  }

  const correctAnswers = test.questions.reduce(
    (total, question) => {
      const selectedAnswerId = answers[question.id];

      if (selectedAnswerId === question.correctAnswerId) {
        return total + 1;
      }

      return total;
    },
    0
  );

  const totalQuestions = test.questions.length;

  const percentage =
    totalQuestions === 0
      ? 0
      : Math.round((correctAnswers / totalQuestions) * 100);

  const result: TestResult = {
    attemptId: `attempt-${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    subject: test.subject,
    totalQuestions,
    correctAnswers,
    percentage,
    answers,
    timeExpired,
  };

  response.status(200).json(result);
};