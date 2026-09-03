import type { Request, Response } from 'express';

import prisma from '../lib/prisma.js';

import type {
  PublicTest,
  SubmitTestRequest,
  TestResult,
} from '../types/test.js';

export const getTest = async (
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

  try {
    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        topic: {
          select: {
            title: true,
            subject: {
              select: {
                title: true,
              },
            },
          },
        },
        questions: {
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            text: true,
            options: {
              orderBy: {
                position: 'asc',
              },
              select: {
                id: true,
                text: true,
              },
            },
          },
        },
      },
    });

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
      subject: test.topic.subject.title,
      topic: test.topic.title,
      durationMinutes: test.durationMinutes,
      questions: test.questions,
    };

    response.status(200).json(publicTest);
  } catch (error) {
    console.error('Не вдалося отримати тест:', error);

    response.status(500).json({
      message: 'Не вдалося отримати тест',
    });
  }
};

export const submitTest = async (
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

  try {
    const test = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      select: {
        id: true,
        title: true,
        topic: {
          select: {
            subject: {
              select: {
                title: true,
              },
            },
          },
        },
        questions: {
          select: {
            id: true,
            options: {
              select: {
                id: true,
                isCorrect: true,
              },
            },
          },
        },
      },
    });

    if (!test) {
      response.status(404).json({
        message: 'Тест не знайдено',
      });

      return;
    }

const evaluatedAnswers = test.questions.map(question => {
  const selectedAnswerId = answers[question.id];

  const selectedOption = question.options.find(
    option => option.id === selectedAnswerId
  );

  return {
    questionId: question.id,
    selectedOptionId: selectedOption?.id ?? null,
    isCorrect: selectedOption?.isCorrect ?? false,
  };
});

const correctAnswers = evaluatedAnswers.filter(
  answer => answer.isCorrect
).length;

const totalQuestions = test.questions.length;

const percentage =
  totalQuestions === 0
    ? 0
    : Math.round((correctAnswers / totalQuestions) * 100);

const attempt = await prisma.testAttempt.create({
  data: {
    testId: test.id,
    totalQuestions,
    correctAnswers,
    percentage,
    timeExpired: timeExpired === true,
    answers: {
      create: evaluatedAnswers,
    },
  },
  select: {
    id: true,
  },
});

const storedAnswers = evaluatedAnswers.reduce<Record<string, string>>(
  (result, answer) => {
    if (answer.selectedOptionId) {
      result[answer.questionId] = answer.selectedOptionId;
    }

    return result;
  },
  {}
);

const result: TestResult = {
  attemptId: attempt.id,
  testId: test.id,
  testTitle: test.title,
  subject: test.topic.subject.title,
  totalQuestions,
  correctAnswers,
  percentage,
  answers: storedAnswers,
  timeExpired: timeExpired === true,
};

response.status(200).json(result);
  } catch (error) {
    console.error('Не вдалося перевірити тест:', error);

    response.status(500).json({
      message: 'Не вдалося перевірити тест',
    });
  }
};

export const getTestResult = async (
  request: Request,
  response: Response
) => {
  const { attemptId } = request.params;

  if (typeof attemptId !== 'string') {
    response.status(400).json({
      message: 'Некоректний ідентифікатор спроби',
    });

    return;
  }

  try {
    const attempt = await prisma.testAttempt.findUnique({
      where: {
        id: attemptId,
      },
      select: {
        id: true,
        totalQuestions: true,
        correctAnswers: true,
        percentage: true,
        timeExpired: true,
        test: {
          select: {
            id: true,
            title: true,
            topic: {
              select: {
                subject: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        answers: {
          select: {
            questionId: true,
            selectedOptionId: true,
          },
        },
      },
    });

    if (!attempt) {
      response.status(404).json({
        message: 'Результат не знайдено',
      });

      return;
    }

    const answers = attempt.answers.reduce<Record<string, string>>(
      (result, answer) => {
        if (answer.selectedOptionId) {
          result[answer.questionId] = answer.selectedOptionId;
        }

        return result;
      },
      {}
    );

    const result: TestResult = {
      attemptId: attempt.id,
      testId: attempt.test.id,
      testTitle: attempt.test.title,
      subject: attempt.test.topic.subject.title,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      percentage: attempt.percentage,
      answers,
      timeExpired: attempt.timeExpired,
    };

    response.status(200).json(result);
  } catch (error) {
    console.error('Не вдалося отримати результат:', error);

    response.status(500).json({
      message: 'Не вдалося отримати результат',
    });
  }
};