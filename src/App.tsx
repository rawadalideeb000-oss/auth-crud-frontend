import { Navigate, Routes, Route } from 'react-router'
import LoginPage from './Pages/LoginPage'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
