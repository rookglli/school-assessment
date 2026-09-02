import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import { ApiError } from '../api/http';
import { getTest } from '../api/tests-api';
import type { PublicTest } from '../types/test';

function TestDetailsPage() {
  const { testId } = useParams<{ testId: string }>();

  const [test, setTest] = useState<PublicTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) {
        setError('Некоректний ідентифікатор тесту.');
        setIsLoading(false);

        return;
      }

      try {
        const testData = await getTest(testId);

        setTest(testData);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError(
            'Не вдалося з’єднатися із сервером. Спробуйте ще раз пізніше.',
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadTest();
  }, [testId]);

  if (isLoading) {
    return (
      <main className="page">
        <div className="page-container">
          <p className="page-description">
            Завантаження...
          </p>
        </div>
      </main>
    );
  }

  if (error || !test) {
    return (
      <main className="page">
        <div className="page-container">
          <h1 className="page-title">
            Тест не знайдено
          </h1>

          <p className="page-description">
            {error ??
              'На жаль, такого тесту не існує або посилання є неправильним.'}
          </p>

          <Link
            className="primary-link"
            to="/subjects"
          >
            Повернутися до предметів
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-container">
        <Link
          className="back-link"
          to="/subjects"
        >
          ← До вибору предмета
        </Link>

        <p className="page-label">
          {test.subject}
        </p>

        <h1 className="page-title">
          {test.title}
        </h1>

        <p className="page-description">
          {test.description}
        </p>

        <div className="test-information">
          <p>
            Тема: <strong>{test.topic}</strong>
          </p>

          <p>
            Кількість запитань:{' '}
            <strong>{test.questions.length}</strong>
          </p>

          <p>
            Приблизний час проходження:{' '}
            <strong>
              {test.durationMinutes} хвилин
            </strong>
          </p>

          <p>
            Для кожного запитання потрібно обрати одну
            відповідь.
          </p>
        </div>

        <Link
          className="primary-link"
          to={`/tests/${test.id}/start`}
        >
          Розпочати тест
        </Link>
      </div>
    </main>
  );
}

export default TestDetailsPage;