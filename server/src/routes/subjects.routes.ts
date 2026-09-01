import { Router } from 'express';

import {
  getSubjects,
  getSubjectTopics,
} from '../controllers/subjects.controller';

const subjectsRouter = Router();

subjectsRouter.get('/subjects', getSubjects);

subjectsRouter.get(
  '/subjects/:subjectId/topics',
  getSubjectTopics
);

export default subjectsRouter;