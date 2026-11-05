export type User = {
  id: string
  name: string
  email: string
}

type LoginResponse = {
  user: User
  token: string
  expiresAt: string
}

type ApiErrorBody = {
  message?: string
  issues?: { path: string; message: string }[]
}

export class AuthError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function createAuthApi(baseUrl: string) {
  const host = baseUrl.replace(/\/+$/, '')

  async function request<T>(path: string, options: RequestInit = {}) {
    if (!host) {
      throw new Error('Set VITE_API_URL in .env.local and restart the app.')
    }

    let response: Response

    try {
      response = await fetch(`${host}${path}`, {
        ...options,

        signal: options.signal ?? AbortSignal.timeout(15000),
      })
    } catch (cause) {
      if (options.signal?.aborted) throw cause

      throw new Error('Cannot reach the server. Please try again.', { cause })
    }

    if (!response.ok) {
      const error: ApiErrorBody = await response.json().catch(() => ({}))

      const message =
        error.issues?.map((issue) => issue.message).join(' ') ||
        error.message ||
        'Something went wrong. Please try again.'

      throw new AuthError(
        response.status === 401
          ? 'Your email or password is incorrect.'
          : message,
        response.status,
      )
    }

    if (response.status === 204) return undefined as T

    return response.json() as Promise<T>
  }

  return {
    login: (email: string, password: string) =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email, password }),
      }),

    me: (token: string, signal: AbortSignal) =>
      request<{ user: User }>('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      }),

    logout: (token: string) =>
      request<void>('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }),
  }
}

export const authApi = createAuthApi(import.meta.env?.VITE_API_URL ?? '')
