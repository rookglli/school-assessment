import { Link } from 'react-router';

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">Перевірка знань</p>

          <h1 className="hero-title">
            Перевір, наскільки добре засвоєна шкільна програма
          </h1>

          <p className="hero-description">
            Проходь тести зі шкільних предметів, дізнавайся свій
            результат та отримуй рекомендації щодо тем, які потрібно
            повторити.
          </p>

          <Link className="hero-button" to="/subjects">
            Розпочати тестування
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;