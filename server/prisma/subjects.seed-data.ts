import type { Subject, Topic } from '../src/types/subject.js';
export const subjects: Subject[] = [
  {
    id: 'mathematics',
    title: 'Математика',
    description: 'Перевір свої знання з математики.',
  },
];

export const topics: Topic[] = [
  {
    id: 'natural-numbers',
    title: 'Натуральні числа',
    description:
      'Перевір свої знання з теми «Натуральні числа та дії з ними».',
    subjectId: 'mathematics',
    testId: 'natural-numbers',
  },
];