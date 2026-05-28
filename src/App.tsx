import { useState, useMemo } from 'react'
import './App.css'

// ─── Tipos ────────────────────────────────────────────────────
type Priority = 'high' | 'medium' | 'low'
type Tag = 'work' | 'personal' | 'urgent' | 'idea'
type Filter = 'all' | 'pending' | 'completed'

interface Task {
  id: string
  title: string
  priority: Priority
  tag: Tag
  dueDate: string
  completed: boolean
  createdAt: number
}

// ─── Helpers ──────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9)

const isOverdue = (date: string, completed: boolean): boolean => {
  if (!date || completed) return false
  return new Date(date) < new Date(new Date().toDateString())
}

const formatDate = (date: string): string => {
  if (!date) return ''
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

const INITIAL_TASKS: Task[] = [
  { id: genId(), title: 'Diseñar sistema de componentes', priority: 'high', tag: 'work', dueDate: '2025-06-01', completed: false, createdAt: Date.now() - 4000 },
  { id: genId(), title: 'Revisar pull requests del sprint', priority: 'medium', tag: 'work', dueDate: '2025-05-30', completed: false, createdAt: Date.now() - 3000 },
  { id: genId(), title: 'Leer sobre RSC en Next.js', priority: 'low', tag: 'idea', dueDate: '', completed: false, createdAt: Date.now() - 2000 },
  { id: genId(), title: 'Reunión de planeación Q3', priority: 'high', tag: 'urgent', dueDate: '2025-05-28', completed: true, createdAt: Date.now() - 1000 },
]

// ─── Mapas de clases CSS ──────────────────────────────────────
const PRIORITY_CARD_MAP: Record<Priority, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
}

const PRIORITY_BADGE_MAP: Record<Priority, string> = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
}

const TAG_CLASS_MAP: Record<Tag, string> = {
  work: 'tag-work',
  personal: 'tag-personal',
  urgent: 'tag-urgent',
  idea: 'tag-idea',
}

const TAG_LABELS: Record<Tag, string> = {
  work: 'Trabajo', personal: 'Personal', urgent: 'Urgente', idea: 'Idea',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Alta', medium: 'Media', low: 'Baja',
}

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Todas', pending: 'Pendientes', completed: 'Completadas',
}

// ─── Componente principal ─────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [newTag, setNewTag] = useState<Tag>('work')
  const [newDate, setNewDate] = useState('')

  // ─── Acciones ───────────────────────────────────────────────
  const addTask = () => {
    if (!newTitle.trim()) return
    const task: Task = {
      id: genId(),
      title: newTitle.trim(),
      priority: newPriority,
      tag: newTag,
      dueDate: newDate,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks(prev => [task, ...prev])
    setNewTitle('')
    setNewPriority('medium')
    setNewTag('work')
    setNewDate('')
    setShowForm(false)
  }

  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

  const deleteTask = (id: string) =>
    setTasks(prev => prev.filter(t => t.id !== id))

  const editTask = (id: string, changes: Partial<Pick<Task, 'title' | 'priority' | 'tag' | 'dueDate'>>) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))

  // ─── Filtrado ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return tasks
      .filter(t => {
        if (filter === 'pending') return !t.completed
        if (filter === 'completed') return t.completed
        return true
      })
      .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return b.createdAt - a.createdAt
      })
  }, [tasks, filter, search])

  const pendingCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="tm-app">
      <div className="tm-container">

        {/* Header */}
        <header className="tm-header">
          <div className="tm-header-left">
            <span className="tm-header-eyebrow">MateCode</span>
            <h1 className="tm-header-title">Mis Tareas</h1>
          </div>
          <div className="tm-header-stats">
            <div className="tm-stat-item">
              <div className="tm-stat-num">{pendingCount}</div>
              <div className="tm-stat-label">pendientes</div>
            </div>
            <div className="tm-stat-divider" />
            <div className="tm-stat-item">
              <div className="tm-stat-num">{completedCount}</div>
              <div className="tm-stat-label">completadas</div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="tm-toolbar">
          <div className="tm-search-wrapper">
            <span className="tm-search-icon">⌕</span>
            <input
              className="tm-search-input"
              type="text"
              placeholder="Buscar tarea..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {(['all', 'pending', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              className={`tm-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Formulario nueva tarea */}
        {showForm ? (
          <div className="tm-add-form">
            <div className="tm-add-form-row">
              <input
                className="tm-add-input"
                type="text"
                placeholder="Nombre de la tarea..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                autoFocus
              />
            </div>
            <div className="tm-add-form-row">
              <select
                className="tm-add-select"
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as Priority)}
              >
                <option value="high">🔴 Alta</option>
                <option value="medium">🔵 Media</option>
                <option value="low">⚪ Baja</option>
              </select>
              <select
                className="tm-add-select"
                value={newTag}
                onChange={e => setNewTag(e.target.value as Tag)}
              >
                <option value="work">Trabajo</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgente</option>
                <option value="idea">Idea</option>
              </select>
              <input
                className="tm-add-select"
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <div className="tm-add-form-actions">
              <button className="tm-btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button className="tm-btn-primary" onClick={addTask}>
                Agregar tarea
              </button>
            </div>
          </div>
        ) : (
          <button className="tm-add-trigger" onClick={() => setShowForm(true)}>
            + Crear Nueva tarea
          </button>
        )}

        {/* Lista de tareas */}
        <div className="tm-task-list">
          {filtered.length === 0 ? (
            <div className="tm-empty-state">
              <div className="tm-empty-icon">◎</div>
              <p className="tm-empty-text">
                {search ? 'Sin resultados para tu búsqueda.' : 'No hay tareas aún. ¡Agrega una!'}
              </p>
            </div>
          ) : (
            <>
              {filtered.some(t => !t.completed) && (
                <div className="tm-section-label">Pendientes</div>
              )}
              {filtered.filter(t => !t.completed).map(task => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
              ))}

              {filtered.some(t => t.completed) && (
                <div className="tm-section-label">Completadas</div>
              )}
              {filtered.filter(t => t.completed).map(task => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  )
}


// ─── Sub-componente: Tarjeta ───────────────────────────────────
interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, changes: Partial<Pick<Task, 'title' | 'priority' | 'tag' | 'dueDate'>>) => void
}

function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editTag, setEditTag] = useState<Tag>(task.tag)
  const [editDate, setEditDate] = useState(task.dueDate)

  const overdue = isOverdue(task.dueDate, task.completed)

  const openEdit = () => {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditTag(task.tag)
    setEditDate(task.dueDate)
    setEditing(true)
  }

  const saveEdit = () => {
    if (!editTitle.trim()) return
    onEdit(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      tag: editTag,
      dueDate: editDate,
    })
    setEditing(false)
  }

  const cancelEdit = () => setEditing(false)

  if (editing) {
    return (
      <div className="tm-edit-form">
        <div className="tm-add-form-row">
          <input
            className="tm-add-input"
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            autoFocus
          />
        </div>
        <div className="tm-add-form-row">
          <select
            className="tm-add-select"
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as Priority)}
          >
            <option value="high">🔴 Alta</option>
            <option value="medium">🔵 Media</option>
            <option value="low">⚪ Baja</option>
          </select>
          <select
            className="tm-add-select"
            value={editTag}
            onChange={e => setEditTag(e.target.value as Tag)}
          >
            <option value="work">Trabajo</option>
            <option value="personal">Personal</option>
            <option value="urgent">Urgente</option>
            <option value="idea">Idea</option>
          </select>
          <input
            className="tm-add-select"
            type="date"
            value={editDate}
            onChange={e => setEditDate(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div className="tm-add-form-actions">
          <button className="tm-btn-secondary" onClick={cancelEdit}>Cancelar</button>
          <button className="tm-btn-primary" onClick={saveEdit}>Guardar</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`tm-task-card ${PRIORITY_CARD_MAP[task.priority]}${task.completed ? ' completed' : ''}`}>

      {/* Checkbox */}
      <div
        className={`tm-checkbox${task.completed ? ' checked' : ''}`}
        onClick={() => onToggle(task.id)}
        role="checkbox"
        aria-checked={task.completed}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && onToggle(task.id)}
      >
        {task.completed && '✓'}
      </div>

      {/* Contenido */}
      <div className="tm-task-content">
        <div className={`tm-task-title${task.completed ? ' done' : ''}`}>
          {task.title}
        </div>
        <div className="tm-task-meta">
          <span className={`tm-tag ${TAG_CLASS_MAP[task.tag]}`}>
            {TAG_LABELS[task.tag]}
          </span>
          {task.dueDate && (
            <span className={`tm-task-date${overdue ? ' overdue' : ''}`}>
              {overdue ? '⚠ ' : '◷ '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Badge prioridad */}
      <span className={`tm-priority-badge ${PRIORITY_BADGE_MAP[task.priority]}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>

      {/* Editar */}
      <button
        className="tm-edit-btn"
        onClick={openEdit}
        aria-label={`Editar tarea: ${task.title}`}
      >
        ✎
      </button>

      {/* Eliminar */}
      <button
        className="tm-delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Eliminar tarea: ${task.title}`}
      >
        ✕
      </button>
    </div>
  )
}
