import type { Request, Response } from 'express';

import prisma from '../lib/prisma.js';

export const getSubjects = async (
  _request: Request,
  response: Response
) => {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    response.status(200).json(subjects);
  } catch (error) {
    console.error('Не вдалося отримати предмети:', error);

    response.status(500).json({
      message: 'Не вдалося отримати предмети',
    });
  }
};

export const getSubjectTopics = async (
  request: Request,
  response: Response
) => {
  const { subjectId } = request.params;

  if (typeof subjectId !== 'string') {
    response.status(400).json({
      message: 'Некоректний ідентифікатор предмета',
    });

    return;
  }

  try {
    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
      select: {
        id: true,
      },
    });

    if (!subject) {
      response.status(404).json({
        message: 'Предмет не знайдено',
      });

      return;
    }

    const topics = await prisma.topic.findMany({
      where: {
        subjectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        subjectId: true,
        test: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    const publicTopics = topics.flatMap(topic => {
      if (!topic.test) {
        return [];
      }

      return [
        {
          id: topic.id,
          title: topic.title,
          description: topic.description,
          subjectId: topic.subjectId,
          testId: topic.test.id,
        },
      ];
    });

    response.status(200).json(publicTopics);
  } catch (error) {
    console.error('Не вдалося отримати теми:', error);

    response.status(500).json({
      message: 'Не вдалося отримати теми',
    });
  }
};