import { Link, useParams } from 'react-router';

function TestDetailsPage() {
  const { testId } = useParams();

  return (
    <main className="page">
      <div className="page-container">
        <Link className="back-link" to="/subjects">
          ← До вибору предмета
        </Link>

        <h1 className="page-title">Інформація про тест</h1>

        <p className="page-description">
          Тема тесту: {testId}
        </p>

        <div className="test-information">
          <p>Кількість запитань: 10</p>
          <p>Приблизний час проходження: 10 хвилин</p>
          <p>Для кожного запитання потрібно обрати одну відповідь.</p>
        </div>

        <Link
          className="primary-link"
          to={`/tests/${testId}/start`}
        >
          Розпочати тест
        </Link>
      </div>
    </main>
  );
}

export default TestDetailsPage;