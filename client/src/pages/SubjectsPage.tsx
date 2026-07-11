import { Link } from 'react-router';

const subjects = [
  {
    id: 'mathematics',
    title: 'Математика',
    description: 'Числа, вирази, рівняння та геометричні задачі.',
  },
  {
    id: 'ukrainian-language',
    title: 'Українська мова',
    description: 'Граматика, правопис, лексика та будова речення.',
  },
  {
    id: 'history-of-ukraine',
    title: 'Історія України',
    description: 'Основні події, дати та історичні постаті.',
  },
];

function SubjectsPage() {
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

        <ul className="subject-list">
          {subjects.map(subject => (
            <li className="subject-item" key={subject.id}>
              <h2 className="subject-title">{subject.title}</h2>

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
      </div>
    </main>
  );
}

export default SubjectsPage;