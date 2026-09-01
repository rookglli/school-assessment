import type { Test } from '../types/test';

export const tests: Test[] = [
  {
    id: 'natural-numbers',
    title: 'Натуральні числа',
    description:
      'Перевір свої знання з теми «Натуральні числа та дії з ними».',
    subject: 'Математика',
    topic: 'Натуральні числа',
    durationMinutes: 10,
    questions: [
      {
        id: 'question-1',
        text: 'Яке з наведених чисел є натуральним?',
        options: [
          {
            id: 'question-1-option-1',
            text: '-5',
          },
          {
            id: 'question-1-option-2',
            text: '0,5',
          },
          {
            id: 'question-1-option-3',
            text: '7',
          },
          {
            id: 'question-1-option-4',
            text: '-2,3',
          },
        ],
        correctAnswerId: 'question-1-option-3',
        explanation:
          'Число 7 є натуральним, оскільки натуральні числа використовують для лічби предметів.',
      },
      {
        id: 'question-2',
        text: 'Який результат додавання 24 + 18?',
        options: [
          {
            id: 'question-2-option-1',
            text: '32',
          },
          {
            id: 'question-2-option-2',
            text: '42',
          },
          {
            id: 'question-2-option-3',
            text: '44',
          },
          {
            id: 'question-2-option-4',
            text: '48',
          },
        ],
        correctAnswerId: 'question-2-option-2',
        explanation: '24 + 18 = 42.',
      },
      {
        id: 'question-3',
        text: 'Який результат віднімання 56 − 29?',
        options: [
          {
            id: 'question-3-option-1',
            text: '27',
          },
          {
            id: 'question-3-option-2',
            text: '33',
          },
          {
            id: 'question-3-option-3',
            text: '37',
          },
          {
            id: 'question-3-option-4',
            text: '25',
          },
        ],
        correctAnswerId: 'question-3-option-1',
        explanation: '56 − 29 = 27.',
      },
      {
        id: 'question-4',
        text: 'Який результат множення 8 × 6?',
        options: [
          {
            id: 'question-4-option-1',
            text: '42',
          },
          {
            id: 'question-4-option-2',
            text: '46',
          },
          {
            id: 'question-4-option-3',
            text: '48',
          },
          {
            id: 'question-4-option-4',
            text: '54',
          },
        ],
        correctAnswerId: 'question-4-option-3',
        explanation: '8 × 6 = 48.',
      },
      {
        id: 'question-5',
        text: 'Який результат ділення 72 ÷ 9?',
        options: [
          {
            id: 'question-5-option-1',
            text: '6',
          },
          {
            id: 'question-5-option-2',
            text: '7',
          },
          {
            id: 'question-5-option-3',
            text: '8',
          },
          {
            id: 'question-5-option-4',
            text: '9',
          },
        ],
        correctAnswerId: 'question-5-option-3',
        explanation: '72 ÷ 9 = 8, оскільки 9 × 8 = 72.',
      },
    ],
  },
];

export const getTestById = (testId: string): Test | undefined => {
  return tests.find(test => test.id === testId);
};