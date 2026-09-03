import prisma from '../src/lib/prisma.js';
import { subjects, topics } from './subjects.seed-data.js';
import { tests } from './tests.seed-data.js';

async function main() {
  await prisma.$transaction(async transaction => {
    for (const subject of subjects) {
      await transaction.subject.upsert({
        where: {
          id: subject.id,
        },
        update: {
          title: subject.title,
          description: subject.description,
        },
        create: {
          id: subject.id,
          title: subject.title,
          description: subject.description,
        },
      });
    }

    for (const topic of topics) {
      await transaction.topic.upsert({
        where: {
          id: topic.id,
        },
        update: {
          title: topic.title,
          description: topic.description,
          subjectId: topic.subjectId,
        },
        create: {
          id: topic.id,
          title: topic.title,
          description: topic.description,
          subjectId: topic.subjectId,
        },
      });
    }

    for (const test of tests) {
      const topic = topics.find(item => item.testId === test.id);

      if (!topic) {
        throw new Error(`Topic for test "${test.id}" was not found`);
      }

      await transaction.test.upsert({
        where: {
          id: test.id,
        },
        update: {
          title: test.title,
          description: test.description,
          durationMinutes: test.durationMinutes,
          topicId: topic.id,
        },
        create: {
          id: test.id,
          title: test.title,
          description: test.description,
          durationMinutes: test.durationMinutes,
          topicId: topic.id,
        },
      });

      for (const [questionIndex, question] of test.questions.entries()) {
        await transaction.question.upsert({
          where: {
            id: question.id,
          },
          update: {
            text: question.text,
            explanation: question.explanation,
            position: questionIndex + 1,
            testId: test.id,
          },
          create: {
            id: question.id,
            text: question.text,
            explanation: question.explanation,
            position: questionIndex + 1,
            testId: test.id,
          },
        });

        for (const [optionIndex, option] of question.options.entries()) {
          await transaction.answerOption.upsert({
            where: {
              id: option.id,
            },
            update: {
              text: option.text,
              isCorrect: option.id === question.correctAnswerId,
              position: optionIndex + 1,
              questionId: question.id,
            },
            create: {
              id: option.id,
              text: option.text,
              isCorrect: option.id === question.correctAnswerId,
              position: optionIndex + 1,
              questionId: question.id,
            },
          });
        }
      }
    }
  });

  console.log('Початкові дані успішно додано до бази.');
}

main()
  .catch(error => {
    console.error('Не вдалося заповнити базу даних:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });