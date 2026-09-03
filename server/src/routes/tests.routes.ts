import { Router } from 'express';

import {
  getTest,
  getTestResult,
  submitTest,
} from '../controllers/tests.controller.js';

const testsRouter = Router();

testsRouter.get('/tests/:testId', getTest);

testsRouter.post(
  '/tests/:testId/submit',
  submitTest
);

testsRouter.get(
  '/results/:attemptId',
  getTestResult
);

export default testsRouter;