import { Link, useParams } from 'react-router';

function TestPage() {
  const { testId } = useParams();

  return (
    <main className="page">
      <div className="page-container">
        <p className="page-label">Демонстраційне запитання</p>

        <h1 className="page-title">Тест: {testId}</h1>

        <section className="question-card">
          <h2 className="question-title">
            Скільки буде 2 + 2?
          </h2>

          <div className="answer-list">
            <label className="answer-option">
              <input type="radio" name="answer" value="3" />
              <span>3</span>
            </label>

            <label className="answer-option">
              <input type="radio" name="answer" value="4" />
              <span>4</span>
            </label>

            <label className="answer-option">
              <input type="radio" name="answer" value="5" />
              <span>5</span>
            </label>
          </div>
        </section>

        <Link
          className="primary-link"
          to="/results/demo-attempt"
        >
          Завершити тест
        </Link>
      </div>
    </main>
  );
}

export default TestPage;