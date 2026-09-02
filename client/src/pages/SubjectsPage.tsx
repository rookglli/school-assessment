import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { getSubjects } from '../api/subjects-api';
import { ApiError } from '../api/http';
import type { Subject } from '../types/subject';

function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await getSubjects();

        setSubjects(subjectsData);
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

    void loadSubjects();
  }, []);

  return (
    <main className="page">
      <div className="page-container">
        <Link className="back-link" to="/">
          ← На головну
        </Link>

        <h1 className="page-title">Оберіть клас і предмет</h1>

        <div className="class-selection">
          <label className="select-label" htmlFor="school-class">
            Клас
          </label>

          <select
            className="class-select"
            id="school-class"
            defaultValue="5"
          >
            <option value="1">1 клас</option>
            <option value="2">2 клас</option>
            <option value="3">3 клас</option>
            <option value="4">4 клас</option>
            <option value="5">5 клас</option>
            <option value="6">6 клас</option>
            <option value="7">7 клас</option>
            <option value="8">8 клас</option>
            <option value="9">9 клас</option>
            <option value="10">10 клас</option>
            <option value="11">11 клас</option>
          </select>
        </div>

        {isLoading && (
          <p className="page-description">
            Завантаження...
          </p>
        )}

        {error && (
          <p className="page-description">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          subjects.length === 0 && (
            <p className="page-description">
              Наразі немає доступних предметів.
            </p>
          )}

        {!isLoading &&
          !error &&
          subjects.length > 0 && (
            <ul className="subject-list">
              {subjects.map(subject => (
                <li
                  className="subject-item"
                  key={subject.id}
                >
                  <h2 className="subject-title">
                    {subject.title}
                  </h2>

                  <p className="subject-description">
                    {subject.description}
                  </p>

                  <Link
                    className="subject-link"
                    to={`/subjects/${subject.id}`}
                  >
                    Обрати предмет
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </main>
  );
}

export default SubjectsPage;