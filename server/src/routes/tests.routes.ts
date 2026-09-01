import { Router } from 'express';

import {
  getTest,
  submitTest,
} from '../controllers/tests.controller';

const testsRouter = Router();

testsRouter.get('/tests/:testId', getTest);

testsRouter.post(
  '/tests/:testId/submit',
  submitTest
);

export default testsRouter;