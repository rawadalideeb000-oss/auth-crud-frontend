import { useNavigate } from 'react-router'
import axios from 'axios'
import type { LoginResponse } from './auth.types'

export function useLogin() {
  const navigate = useNavigate()

  async function login(email: string, password: string) {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email: email.trim().toLowerCase(), password },
      { validateStatus: () => true },
    )
    if (response.status < 200 || response.status >= 300) return

    sessionStorage.setItem('auth-crud.token', response.data.token)
    navigate('/account', { state: { user: response.data.user }, replace: true })
  }

  return { login }
}
