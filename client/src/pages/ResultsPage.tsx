import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import type { TestResult } from '../types/test';

function ResultsPage() {
  const { attemptId } = useParams<{
    attemptId: string;
  }>();

  const result = useMemo<TestResult | null>(() => {
    if (!attemptId) {
      return null;
    }

    const savedResult = sessionStorage.getItem(
      `test-result:${attemptId}`,
    );

    if (!savedResult) {
      return null;
    }

    try {
      return JSON.parse(savedResult) as TestResult;
    } catch {
      return null;
    }
  }, [attemptId]);

  if (!result) {
    return (
      <main className="page">
        <div className="page-container">
          <h1 className="page-title">
            Результат не знайдено
          </h1>

          <p className="page-description">
            Не вдалося завантажити результат цієї спроби.
            Можливо, дані були видалені або посилання є
            неправильним.
          </p>

          <Link
            className="primary-link"
            to="/subjects"
          >
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
        <p className="page-label">
          {result.subject}
        </p>

        <h1 className="page-title">
          Тест завершено
        </h1>

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

          <Link
            className="back-link"
            to="/subjects"
          >
            Обрати інший тест
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ResultsPage;