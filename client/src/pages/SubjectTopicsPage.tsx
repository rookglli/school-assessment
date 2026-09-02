import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import { ApiError } from '../api/http';
import { getSubjectTopics } from '../api/subjects-api';
import type { Topic } from '../types/subject';

function SubjectTopicsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopics = async () => {
      if (!subjectId) {
        setError('Некоректний ідентифікатор предмета.');
        setIsLoading(false);

        return;
      }

      try {
        const topicsData = await getSubjectTopics(subjectId);

        setTopics(topicsData);
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

    void loadTopics();
  }, [subjectId]);

  return (
    <main className="page">
      <div className="page-container">
        <Link className="back-link" to="/subjects">
          ← До предметів
        </Link>

        <h1 className="page-title">Оберіть тему</h1>

        <p className="page-description">
          Ідентифікатор предмета: {subjectId}
        </p>

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
          topics.length === 0 && (
            <p className="page-description">
              Для цього предмета поки немає доступних тем.
            </p>
          )}

        {!isLoading &&
          !error &&
          topics.length > 0 && (
            <ul className="topic-list">
              {topics.map(topic => (
                <li
                  className="topic-item"
                  key={topic.id}
                >
                  <h2 className="topic-title">
                    {topic.title}
                  </h2>

                  <Link
                    className="topic-link"
                    to={`/tests/${topic.testId}`}
                  >
                    Перейти до тесту
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </main>
  );
}

export default SubjectTopicsPage;