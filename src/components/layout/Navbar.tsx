/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { emailService } from '../../services/emailService'
import type { Task } from '../../types'

interface NavbarProps {
  pendingCount: number
  completedCount: number
  tasks: Task[]
}

export function Navbar({ pendingCount, completedCount, tasks }: NavbarProps) {
  const { user, logout } = useAuth()
  const [sending, setSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSendEmail() {
    if (!user?.email) return
    setSending(true)
    setEmailStatus('idle')
    try {
      await emailService.sendTaskSummary({
        userEmail: user.email,
        userName: user.name,
        tasks,
      })
      setEmailStatus('success')
      setTimeout(() => setEmailStatus('idle'), 3000)
    } catch (err) {
      setEmailStatus('error')
      setTimeout(() => setEmailStatus('idle'), 3000)
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Barra superior — logo + acciones */}
      <nav className="tm-navbar">
        <div className="tm-logo">
          <span className="tm-logo-mc">MC</span>
          <span className="tm-logo-word">MateCode</span>
        </div>

        <div className="tm-navbar-actions">
          <button
            className={`tm-email-btn${emailStatus === 'success' ? ' success' : emailStatus === 'error' ? ' error' : ''}`}
            onClick={handleSendEmail}
            disabled={sending}
            title="Enviar resumen por email"
          >
            {sending
              ? '⏳ Enviando...'
              : emailStatus === 'success'
              ? '✓ Enviado!'
              : emailStatus === 'error'
              ? '✕ Error'
              : '📧 Resumen'}
          </button>

          <button className="tm-logout-btn" onClick={logout}>
            ⎋ Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Header — título + saludo + stats */}
      <header className="tm-header">
        <div className="tm-header-left">
          <h1 className="tm-header-title">NovaTask</h1>
          <div className="tm-greeting">
            Hola <span className="tm-greeting-name">{user?.name}</span> 🌟 Hoy es un gran día para avanzar!
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
