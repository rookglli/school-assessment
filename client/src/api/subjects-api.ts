import type { Subject, Topic } from '../types/subject';

import { apiRequest } from './http';

export const getSubjects = (): Promise<Subject[]> => {
  return apiRequest<Subject[]>('/subjects');
};

export const getSubjectTopics = (
  subjectId: string
): Promise<Topic[]> => {
  return apiRequest<Topic[]>(
    `/subjects/${encodeURIComponent(subjectId)}/topics`
  );
};