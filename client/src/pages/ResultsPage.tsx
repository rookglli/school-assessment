import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import { ApiError } from '../api/http';
import { getTestResult } from '../api/tests-api';
import type { TestResult } from '../types/test';

function ResultsPage() {
  const { attemptId } = useParams<{
    attemptId: string;
  }>();

  const [result, setResult] = useState<TestResult | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    let isActive = true;

    const loadResult = async () => {
      if (!attemptId) {
        setErrorMessage(
          'Некоректний ідентифікатор спроби.',
        );
        setIsLoading(false);

        return;
      }

      try {
        const resultData = await getTestResult(attemptId);

        if (!isActive) {
          return;
        }

        setResult(resultData);

        sessionStorage.setItem(
          `test-result:${attemptId}`,
          JSON.stringify(resultData),
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        const savedResult = sessionStorage.getItem(
          `test-result:${attemptId}`,
        );

        if (savedResult) {
          try {
            setResult(JSON.parse(savedResult) as TestResult);

            return;
          } catch {
            sessionStorage.removeItem(
              `test-result:${attemptId}`,
            );
          }
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            'Не вдалося з’єднатися із сервером.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadResult();

    return () => {
      isActive = false;
    };
  }, [attemptId]);

  if (isLoading) {
    return (
      <main className="page">
        <div className="page-container">
          <h1 className="page-title">
            Завантаження результату...
          </h1>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="page">
        <div className="page-container">
          <h1 className="page-title">
            Результат не знайдено
          </h1>

          <p className="page-description">
            {errorMessage ??
              'Не вдалося завантажити результат цієї спроби.'}
          </p>

          <Link className="primary-link" to="/subjects">
            Обрати тест
          </Link>
        </div>
      </main>
    );
  }

  const getResultDescription = () => {
    if (result.percentage >= 80) {
      return 'Матеріал засвоєно добре. Можна переходити до наступної теми.';
    }

    if (result.percentage >= 60) {
      return 'Матеріал засвоєно частково. Рекомендуємо повторити запитання, у яких були допущені помилки.';
    }

    return 'Тему потрібно повторити. Рекомендуємо ще раз опрацювати навчальний матеріал і пройти тест повторно.';
  };

  return (
    <main className="page">
      <div className="page-container">
        <p className="page-label">{result.subject}</p>

        <h1 className="page-title">Тест завершено</h1>

        <p className="page-description">
          {result.testTitle}
        </p>

        {result.timeExpired && (
          <p className="result-warning">
            Час проходження тесту завершився. Результат
            розраховано за відповідями, які ви встигли
            надати.
          </p>
        )}

        <div className="result-card">
          <p className="result-value">
            {result.percentage}%
          </p>

          <div className="result-statistics">
            <p>
              Правильних відповідей:{' '}
              <strong>
                {result.correctAnswers} з{' '}
                {result.totalQuestions}
              </strong>
            </p>

            <p>
              Результат засвоєння теми:{' '}
              <strong>{result.percentage}%</strong>
            </p>
          </div>

          <p className="result-description">
            {getResultDescription()}
          </p>
        </div>

        <div className="result-actions">
          <Link
            className="primary-link"
            to={`/tests/${result.testId}/start`}
          >
            Пройти тест ще раз
          </Link>

          <Link className="back-link" to="/subjects">
            Обрати інший тест
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ResultsPage;