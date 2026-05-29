import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/tasks')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tm-app">
      <div className="tm-container">
        <div className="tm-auth-card">

          <div className="tm-header-left">
            <span className="tm-header-eyebrow">MateCode</span>
            <h1 className="tm-header-title">Iniciar sesión</h1>
          </div>

          <form className="tm-auth-form" onSubmit={handleSubmit}>
            <div className="tm-auth-field">
              <label className="tm-auth-label">Email</label>
              <input
                className="tm-add-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="tm-auth-field">
              <label className="tm-auth-label">Contraseña</label>
              <input
                className="tm-add-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="tm-auth-error">{error}</p>}

            <button
              className="tm-btn-primary tm-btn-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="tm-auth-footer">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="tm-auth-link">
              Registrate
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
