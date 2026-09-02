import type { Request, Response } from 'express';

import { subjects, topics } from '../data/subjects';

export const getSubjects = (_request: Request, response: Response) => {
  response.status(200).json(subjects);
};

export const getSubjectTopics = (
  request: Request,
  response: Response
) => {
  const { subjectId } = request.params;

  const subject = subjects.find(subject => subject.id === subjectId);

  if (!subject) {
    response.status(404).json({
      message: 'Предмет не знайдено',
    });

    return;
  }

  const subjectTopics = topics.filter(
    topic => topic.subjectId === subjectId
  );

  response.status(200).json(subjectTopics);
};