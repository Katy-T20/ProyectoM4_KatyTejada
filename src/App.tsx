import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoutes'
import { PublicOnlyRoute } from './routes/PublicOnlyRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TaskPage from './pages/TaskPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Redirige raíz a /tasks */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/* Rutas públicas: redirigen a /tasks si ya hay sesión */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Ruta protegida: redirige a /login si no hay sesión */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />

          {/* Cualquier ruta desconocida → /tasks */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
