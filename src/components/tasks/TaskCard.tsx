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
  onEdit: (id: string, changes: Partial<Pick<Task,
    'title' | 'priority' | 'tag' | 'dueDate'>>) => void
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
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
            onKeyDown={e => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            autoFocus
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

  return (
    <div className={`tm-task-card ${PRIORITY_CARD_MAP[task.priority]}${task.completed ? ' completed' : ''}`}>
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

      <span className={`tm-priority-badge ${PRIORITY_BADGE_MAP[task.priority]}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>

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
  )
}
