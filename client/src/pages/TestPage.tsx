import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router';
import { getTestById } from '../data/tests';
import type { TestResult } from '../types/test';

function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const test = testId ? getTestById(testId) : undefined;

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>(
    {},
  );

  const [remainingSeconds, setRemainingSeconds] = useState(
    test ? test.durationMinutes * 60 : 0,
  );

  const isTestFinished = useRef(false);

  const handleFinishTest = useCallback(
    (timeExpired: boolean) => {
      if (!test || isTestFinished.current) {
        return;
      }

      isTestFinished.current = true;

      const correctAnswers = test.questions.reduce(
        (totalCorrectAnswers, question) => {
          const selectedAnswerId = answers[question.id];

          if (
            selectedAnswerId === question.correctAnswerId
          ) {
            return totalCorrectAnswers + 1;
          }

          return totalCorrectAnswers;
        },
        0,
      );

      const totalQuestions = test.questions.length;

      const percentage = Math.round(
        (correctAnswers / totalQuestions) * 100,
      );

      const attemptId = `${test.id}-${Date.now()}`;

      const result: TestResult = {
        attemptId,
        testId: test.id,
        testTitle: test.title,
        subject: test.subject,
        totalQuestions,
        correctAnswers,
        percentage,
        answers,
        timeExpired,
      };

      sessionStorage.setItem(
        `test-result:${attemptId}`,
        JSON.stringify(result),
      );

      navigate(`/results/${attemptId}`, {
        replace: true,
      });
    },
    [answers, navigate, test],
  );

  useEffect(() => {
    if (!test) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds(previousSeconds => {
        if (previousSeconds <= 1) {
          window.clearInterval(timerId);

          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [test]);

  useEffect(() => {
    if (remainingSeconds !== 0 || !test) {
      return;
    }

    handleFinishTest(true);
  }, [handleFinishTest, remainingSeconds, test]);

  if (!test) {
    return (
      <main className="test-page">
        <section className="test-error">
          <h1 className="test-error-title">
            Тест не знайдено
          </h1>

          <p className="test-error-text">
            На жаль, такого тесту не існує або посилання є
            неправильним.
          </p>

          <Link
            className="test-error-link"
            to="/subjects"
          >
            Повернутися до предметів
          </Link>
        </section>
      </main>
    );
  }

  const currentQuestion =
    test.questions[currentQuestionIndex];

  const totalQuestions = test.questions.length;

  const selectedAnswerId =
    answers[currentQuestion.id] ?? null;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const remainingMinutes = Math.floor(
    remainingSeconds / 60,
  );

  const remainingSecondsPart = remainingSeconds % 60;

  const formattedTime = `${String(
    remainingMinutes,
  ).padStart(2, '0')}:${String(
    remainingSecondsPart,
  ).padStart(2, '0')}`;

  const handleAnswerSelect = (answerId: string) => {
    setAnswers(previousAnswers => ({
      ...previousAnswers,
      [currentQuestion.id]: answerId,
    }));
  };

  const handlePreviousQuestion = () => {
    if (isFirstQuestion) {
      return;
    }

    setCurrentQuestionIndex(
      previousIndex => previousIndex - 1,
    );
  };

  const handleNextQuestion = () => {
    if (!selectedAnswerId || isLastQuestion) {
      return;
    }

    setCurrentQuestionIndex(
      previousIndex => previousIndex + 1,
    );
  };

  return (
    <main className="test-page">
      <section className="test-container">
        <header className="test-header">
          <div>
            <p className="test-subject">
              {test.subject}
            </p>

            <h1 className="test-title">{test.title}</h1>
          </div>

          <div className="test-header-information">
            <p className="test-question-counter">
              Питання {currentQuestionIndex + 1} з{' '}
              {totalQuestions}
            </p>

            <div
              className={`test-timer${
                remainingSeconds === 0
                  ? ' test-timer-finished'
                  : ''
              }`}
              aria-live="polite"
            >
              <span className="test-timer-label">
                Залишилося часу
              </span>

              <span className="test-timer-value">
                {formattedTime}
              </span>
            </div>
          </div>
        </header>

        <div className="test-progress">
          <div className="test-progress-information">
            <span>Прогрес тесту</span>

            <span>
              {Math.round(progressPercentage)}%
            </span>
          </div>

          <div
            className="test-progress-track"
            role="progressbar"
            aria-label="Прогрес проходження тесту"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              progressPercentage,
            )}
          >
            <div
              className="test-progress-bar"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <article className="question-card">
          <h2 className="question-title">
            {currentQuestion.text}
          </h2>

          <div className="answer-list">
            {currentQuestion.options.map(option => {
              const isSelected =
                selectedAnswerId === option.id;

              return (
                <button
                  className={`answer-button${
                    isSelected
                      ? ' answer-button-selected'
                      : ''
                  }`}
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleAnswerSelect(option.id)
                  }
                >
                  {isSelected && (
                    <span className="answer-check">
                      ✓
                    </span>
                  )}

                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="test-navigation">
            <button
              className="test-navigation-button"
              type="button"
              disabled={isFirstQuestion}
              onClick={handlePreviousQuestion}
            >
              Попереднє питання
            </button>

            {isLastQuestion ? (
              <button
                className="test-navigation-button test-navigation-button-primary"
                type="button"
                disabled={!selectedAnswerId}
                onClick={() =>
                  handleFinishTest(false)
                }
              >
                Завершити тест
              </button>
            ) : (
              <button
                className="test-navigation-button test-navigation-button-primary"
                type="button"
                disabled={!selectedAnswerId}
                onClick={handleNextQuestion}
              >
                Наступне питання
              </button>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

export default TestPage;