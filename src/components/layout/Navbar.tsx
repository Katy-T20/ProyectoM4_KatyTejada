import { useAuth } from '../../hooks/useAuth'

interface NavbarProps {
  pendingCount: number
  completedCount: number
}

export function Navbar({ pendingCount, completedCount }: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      {/* ─── Barra superior — logo + logout ─── */}
      <nav className="tm-navbar">
        <div className="tm-logo">
          <span className="tm-logo-mc">MC</span>
          <span className="tm-logo-word">MateCode</span>
        </div>
        <button className="tm-logout-btn" onClick={logout}>
          ⎋ Cerrar sesión
        </button>
      </nav>

      {/* Header — título + saludo + stats*/}
      <header className="tm-header">
        <div className="tm-header-left">
          <h1 className="tm-header-title">NovaTask</h1>
          <div className="tm-greeting">
            <div className="tm-greeting">
              Hola <span className="tm-greeting-name">{user?.name}</span> 🌟 Hoy es un gran día para avanzar!
            </div>
          </div>
        </div>
        <div className="tm-header-stats">
          <div className="tm-stat-item">
            <div className="tm-stat-num pending">{pendingCount}</div>
            <div className="tm-stat-label">pendientes</div>
          </div>
          <div className="tm-stat-divider" />
          <div className="tm-stat-item">
            <div className="tm-stat-num completed">{completedCount}</div>
            <div className="tm-stat-label">completadas</div>
          </div>
        </div>
      </header>
    </>
  )
}
