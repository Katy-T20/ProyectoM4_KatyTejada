import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateRegister } from '../utils/validators'
import { getAuthErrorMessage } from '../utils/authErrors'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [firebaseError, setFirebaseError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFirebaseError('')

    // Validación local
    const validationErrors = validateRegister(name, email, password)
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach(err => { errorMap[err.field] = err.message })
      setErrors(errorMap)
      return
    }
    setErrors({})

    // Registro con Firebase
    setLoading(true)
    try {
      await register(name, email, password)
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
            <h1 className="tm-auth-title">Crear cuenta</h1>
          </div>

          <form className="tm-auth-form" onSubmit={handleSubmit}>

            <div className="tm-auth-field">
              <label className="tm-auth-label">Nombre</label>
              <input
                className={`tm-add-input${errors.name ? ' tm-input-error' : ''}`}
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                autoComplete="name"
              />
              {errors.name && <p className="tm-field-error">{errors.name}</p>}
            </div>

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
                placeholder="Mín. 6 caracteres"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                autoComplete="new-password"
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
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="tm-auth-footer">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="tm-auth-link">
              Iniciá sesión
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
