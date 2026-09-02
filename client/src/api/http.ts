const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface ApiErrorResponse {
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiRequest = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    let message = 'Сталася помилка під час виконання запиту.';

    try {
      const errorData =
        (await response.json()) as ApiErrorResponse;

      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Якщо сервер не повернув JSON,
      // залишаємо стандартне повідомлення.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
};