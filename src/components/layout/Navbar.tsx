import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="tm-header">
      <div className="tm-header-left">
        <span className="tm-header-eyebrow">MateCode</span>
        <h1 className="tm-header-title">Mis Tareas</h1>
      </div>
      <div className="tm-header-stats-wrapper">
        <span className="tm-header-user">👤 {user?.name}</span>
        <button className="tm-btn-secondary" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
