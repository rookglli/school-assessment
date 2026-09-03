import cors from 'cors';
import express from 'express';

import healthRouter from './routes/health.routes.js';
import subjectsRouter from './routes/subjects.routes.js';
import testsRouter from './routes/tests.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', subjectsRouter);
app.use('/api', testsRouter);

export default app;