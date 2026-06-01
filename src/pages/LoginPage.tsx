import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateLogin } from '../utils/validators'
import { getAuthErrorMessage } from '../utils/authErrors'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [firebaseError, setFirebaseError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFirebaseError('')

    // Validación local
    const validationErrors = validateLogin(email, password)
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach(err => { errorMap[err.field] = err.message })
      setErrors(errorMap)
      return
    }
    setErrors({})

    // Login con Firebase
    setLoading(true)
    try {
      await login(email, password)
      navigate('/tasks')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setFirebaseError(getAuthErrorMessage(code))
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
            <h1 className="tm-auth-title">Iniciar sesión</h1>
          </div>

          <form className="tm-auth-form" onSubmit={handleSubmit}>

            <div className="tm-auth-field">
              <label className="tm-auth-label">Email</label>
              <input
                className={`tm-add-input${errors.email ? ' tm-input-error' : ''}`}
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                autoComplete="email"
              />
              {errors.email && <p className="tm-field-error">{errors.email}</p>}
            </div>

            <div className="tm-auth-field">
              <label className="tm-auth-label">Contraseña</label>
              <input
                className={`tm-add-input${errors.password ? ' tm-input-error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                autoComplete="current-password"
              />
              {errors.password && <p className="tm-field-error">{errors.password}</p>}
            </div>

            {firebaseError && (
              <p className="tm-auth-error">{firebaseError}</p>
            )}

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
