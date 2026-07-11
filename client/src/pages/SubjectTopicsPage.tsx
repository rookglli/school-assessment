import { Link, useParams } from 'react-router';

const topics = [
  {
    id: 'natural-numbers',
    title: 'Натуральні числа',
  },
  {
    id: 'fractions',
    title: 'Звичайні дроби',
  },
  {
    id: 'geometry',
    title: 'Геометричні фігури',
  },
];

function SubjectTopicsPage() {
  const { subjectId } = useParams();

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

        <ul className="topic-list">
          {topics.map(topic => (
            <li className="topic-item" key={topic.id}>
              <h2 className="topic-title">{topic.title}</h2>

              <Link
                className="topic-link"
                to={`/tests/${topic.id}`}
              >
                Перейти до тесту
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default SubjectTopicsPage;