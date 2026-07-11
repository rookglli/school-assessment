import { Link, useParams } from 'react-router';

function ResultsPage() {
  const { attemptId } = useParams();

  return (
    <main className="page">
      <div className="page-container">
        <p className="page-label">
          Результат спроби: {attemptId}
        </p>

        <h1 className="page-title">Тест завершено</h1>

        <div className="result-card">
          <p className="result-value">80%</p>

          <p className="result-description">
            Матеріал засвоєно добре. Рекомендуємо повторити запитання,
            у яких були допущені помилки.
          </p>
        </div>

        <Link className="primary-link" to="/subjects">
          Обрати інший тест
        </Link>
      </div>
    </main>
  );
}

export default ResultsPage;