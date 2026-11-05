import { Navigate, Routes, Route } from 'react-router'
import LoginPage from './Pages/LoginPage'
import AccountPage from './Pages/AccountPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  )
}

export default App
