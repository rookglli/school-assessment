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

import { ApiError } from '../api/http';
import {
  getTest,
  submitTest,
} from '../api/tests-api';
import type { PublicTest } from '../types/test';

function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<PublicTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [loadErrorTitle, setLoadErrorTitle] = useState<
    string | null
  >(null);

  const [loadError, setLoadError] = useState<string | null>(
    null,
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [remainingSeconds, setRemainingSeconds] =
    useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<
    string | null
  >(null);

  const isTestFinished = useRef(false);

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) {
        setLoadErrorTitle('Помилка');
        setLoadError(
          'Некоректний ідентифікатор тесту.',
        );
        setIsLoading(false);

        return;
      }

      try {
        const testData = await getTest(testId);

        setTest(testData);
        setRemainingSeconds(
          testData.durationMinutes * 60,
        );
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 404) {
            setLoadErrorTitle('Тест не знайдено');
          } else {
            setLoadErrorTitle(
              'Не вдалося завантажити тест',
            );
          }

          setLoadError(error.message);
        } else {
          setLoadErrorTitle(
            'Не вдалося завантажити тест',
          );

          setLoadError(
            'Не вдалося з’єднатися із сервером. Спробуйте ще раз пізніше.',
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadTest();
  }, [testId]);

  const handleFinishTest = useCallback(
    async (timeExpired: boolean) => {
      if (
        !test ||
        !testId ||
        isTestFinished.current
      ) {
        return;
      }

      isTestFinished.current = true;
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await submitTest(testId, {
          answers,
          timeExpired,
        });

        sessionStorage.setItem(
          `test-result:${result.attemptId}`,
          JSON.stringify(result),
        );

        navigate(`/results/${result.attemptId}`, {
          replace: true,
        });
      } catch (error) {
        isTestFinished.current = false;

        if (error instanceof ApiError) {
          setSubmitError(error.message);
        } else {
          setSubmitError(
            'Не вдалося з’єднатися із сервером. Перевірте підключення та спробуйте ще раз.',
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, navigate, test, testId],
  );

  useEffect(() => {
    if (!test) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds(previousSeconds => {
        if (previousSeconds === null) {
          return null;
        }

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
    if (
      remainingSeconds === null ||
      remainingSeconds !== 0 ||
      !test
    ) {
      return;
    }

    const finishTimerId = window.setTimeout(() => {
      void handleFinishTest(true);
    }, 0);

    return () => {
      window.clearTimeout(finishTimerId);
    };
  }, [handleFinishTest, remainingSeconds, test]);

  if (isLoading) {
    return (
      <main className="test-page">
        <section className="test-error">
          <p className="test-error-text">
            Завантаження...
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !test) {
    return (
      <main className="test-page">
        <section className="test-error">
          <h1 className="test-error-title">
            {loadErrorTitle ??
              'Не вдалося завантажити тест'}
          </h1>

          <p className="test-error-text">
            {loadError ??
              'На жаль, тест недоступний.'}
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

  if (!currentQuestion) {
    return (
      <main className="test-page">
        <section className="test-error">
          <h1 className="test-error-title">
            Запитання відсутні
          </h1>

          <p className="test-error-text">
            У цьому тесті поки немає доступних запитань.
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

  const totalQuestions = test.questions.length;

  const selectedAnswerId =
    answers[currentQuestion.id] ?? null;

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const safeRemainingSeconds =
    remainingSeconds ?? 0;

  const remainingMinutes = Math.floor(
    safeRemainingSeconds / 60,
  );

  const remainingSecondsPart =
    safeRemainingSeconds % 60;

  const formattedTime = `${String(
    remainingMinutes,
  ).padStart(2, '0')}:${String(
    remainingSecondsPart,
  ).padStart(2, '0')}`;

  const handleAnswerSelect = (answerId: string) => {
    if (isSubmitting) {
      return;
    }

    setAnswers(previousAnswers => ({
      ...previousAnswers,
      [currentQuestion.id]: answerId,
    }));
  };

  const handlePreviousQuestion = () => {
    if (isFirstQuestion || isSubmitting) {
      return;
    }

    setCurrentQuestionIndex(
      previousIndex => previousIndex - 1,
    );
  };

  const handleNextQuestion = () => {
    if (
      !selectedAnswerId ||
      isLastQuestion ||
      isSubmitting
    ) {
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

            <h1 className="test-title">
              {test.title}
            </h1>
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
                  disabled={isSubmitting}
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

          {submitError && (
            <div>
              <p>{submitError}</p>

              <button
                className="test-navigation-button"
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  void handleFinishTest(
                    remainingSeconds === 0,
                  )
                }
              >
                Спробувати ще раз
              </button>
            </div>
          )}

          <div className="test-navigation">
            <button
              className="test-navigation-button"
              type="button"
              disabled={
                isFirstQuestion || isSubmitting
              }
              onClick={handlePreviousQuestion}
            >
              Попереднє питання
            </button>

            {isLastQuestion ? (
              <button
                className="test-navigation-button test-navigation-button-primary"
                type="button"
                disabled={
                  !selectedAnswerId || isSubmitting
                }
                onClick={() =>
                  void handleFinishTest(false)
                }
              >
                {isSubmitting
                  ? 'Надсилання...'
                  : 'Завершити тест'}
              </button>
            ) : (
              <button
                className="test-navigation-button test-navigation-button-primary"
                type="button"
                disabled={
                  !selectedAnswerId || isSubmitting
                }
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