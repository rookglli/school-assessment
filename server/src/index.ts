import cors from 'cors';
import express from 'express';

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'Сервер працює',
  });
});

app.listen(port, () => {
  console.log(`Сервер запущено: http://localhost:${port}`);
});