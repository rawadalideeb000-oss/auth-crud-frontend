import { useNavigate } from 'react-router'
import axios from 'axios'

export function useLogout() {
  const navigate = useNavigate()

  async function logout() {
    const token = sessionStorage.getItem('auth-crud.token')
    if (token) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        },
      )
      const success = response.status >= 200 && response.status < 300
      if (!success && response.status !== 401) return
    }

    sessionStorage.removeItem('auth-crud.token')
    navigate('/login', { replace: true })
  }

  return { logout }
}
