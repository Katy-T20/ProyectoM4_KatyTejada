import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/tasks')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
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
            <h1 className="tm-header-title">Crear cuenta</h1>
          </div>

          <form className="tm-auth-form" onSubmit={handleSubmit}>
            <div className="tm-auth-field">
              <label className="tm-auth-label">Nombre</label>
              <input
                className="tm-add-input"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="Mín. 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && <p className="tm-auth-error">{error}</p>}

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
