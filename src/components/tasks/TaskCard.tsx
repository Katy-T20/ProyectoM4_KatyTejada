import { useState } from 'react'
import type { Task, Priority, Tag } from '../../types'
import {
  PRIORITY_CARD_MAP,
  PRIORITY_BADGE_MAP,
  TAG_CLASS_MAP,
  TAG_LABELS,
  PRIORITY_LABELS,
  isOverdue,
  formatDate,
} from '../../utils/helpers'

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, changes: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'tag' | 'dueDate'>>) => void
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description ?? '')
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editTag, setEditTag] = useState<Tag>(task.tag)
  const [editDate, setEditDate] = useState(task.dueDate)

  const overdue = isOverdue(task.dueDate, task.completed)

  const openEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description ?? '')
    setEditPriority(task.priority)
    setEditTag(task.tag)
    setEditDate(task.dueDate)
    setEditing(true)
  }

  const saveEdit = () => {
    if (!editTitle.trim()) return
    onEdit(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      tag: editTag,
      dueDate: editDate,
    })
    setEditing(false)
  }

  const cancelEdit = () => setEditing(false)

  // ─── Modo edición ─────────────────────────────────────────
  if (editing) {
    return (
      <div className="tm-edit-form">
        <div className="tm-add-form-row">
          <input
            className="tm-add-input"
            type="text"
            value={editTitle}
            placeholder="Nombre de la tarea..."
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            autoFocus
          />
        </div>
        <div className="tm-add-form-row">
          <textarea
            className="tm-add-input tm-add-textarea"
            placeholder="Descripción (opcional)..."
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="tm-add-form-row">
          <select
            className="tm-add-select"
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as Priority)}
          >
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select
            className="tm-add-select"
            value={editTag}
            onChange={e => setEditTag(e.target.value as Tag)}
          >
            <option value="work">Trabajo</option>
            <option value="personal">Personal</option>
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
          <button className="tm-btn-secondary" onClick={cancelEdit}>
            Cancelar
          </button>
          <button className="tm-btn-primary" onClick={saveEdit}>
            Guardar
          </button>
        </div>
      </div>
    )
  }

  // ─── Modo visualización ───────────────────────────────────
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

      {/* Cuerpo */}
      <div className="tm-task-body">

        {/* Línea 1 — badge + título + acciones */}
        <div className="tm-task-top">
          <span className={`tm-priority-badge ${PRIORITY_BADGE_MAP[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <p className={`tm-task-title${task.completed ? ' done' : ''}`}>
            {task.title}
          </p>
          <div className="tm-task-actions">
            <button
              className="tm-edit-btn"
              onClick={openEdit}
              aria-label={`Editar tarea: ${task.title}`}
            >
              ✎
            </button>
            <button
              className="tm-delete-btn"
              onClick={() => onDelete(task.id)}
              aria-label={`Eliminar tarea: ${task.title}`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Línea 2 — descripción (opcional) */}
        {task.description && (
          <p className={`tm-task-description${task.completed ? ' done' : ''}`}>
            {task.description}
          </p>
        )}

        {/* Línea 3 — fecha + tag */}
        <div className="tm-task-bottom">
          {task.dueDate && (
            <span className={`tm-task-date${overdue ? ' overdue' : ''}`}>
              {overdue ? '⚠ ' : '◷ '}
              {formatDate(task.dueDate)}
            </span>
          )}
          <span className={`tm-tag ${TAG_CLASS_MAP[task.tag]}`}>
            {TAG_LABELS[task.tag]}
          </span>
        </div>

      </div>
    </div>
  )
}
