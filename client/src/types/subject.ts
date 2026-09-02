export interface Subject {
  id: string;
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  testId: string;
}