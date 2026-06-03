import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateLogin } from '../utils/validators'
import { getAuthErrorMessage } from '../utils/authErrors'
import { authService } from '../services/authService'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [firebaseError, setFirebaseError] = useState('')
  const [googleError, setGoogleError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFirebaseError('')

    const validationErrors = validateLogin(email, password)
    if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {}
        validationErrors.forEach(err => { errorMap[err.field] = err.message })
        setErrors(errorMap)
        return
    }
    setErrors({})

    setLoading(true)
    try {
        //Verificar proveedor antes de intentar login
        const methods = await authService.getSignInMethods(email)
        if (methods.includes('google.com') && !methods.includes('password')) {
            setFirebaseError('Esta cuenta usa Google. Usá el botón "Continuar con Google".')
            setLoading(false)
            return
        }

        await login(email, password)
        navigate('/tasks')
    } catch (err: unknown) {
        const code = (err as { code?: string }).code ?? ''
        setFirebaseError(getAuthErrorMessage(code))
    } finally {
        setLoading(false)
    }
}

  async function handleGoogleLogin() {
    setGoogleError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/tasks')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setGoogleError(getAuthErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tm-app">
      <div className="tm-container">
        <div className="tm-auth-card">

          <div className="tm-header-left">
            <span className="tm-header-eyebrow">NovaTask</span>
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

            {firebaseError && <p className="tm-auth-error">{firebaseError}</p>}

            <button
              className="tm-btn-primary tm-btn-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="tm-auth-divider">
            <span>o</span>
          </div>

          <button
            type="button"
            className="tm-google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-2.9-11.9-7.1l-6.6 4.8C9.7 39.6 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.7 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continuar con Google
          </button>

          {googleError && <p className="tm-auth-error">{googleError}</p>}

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
