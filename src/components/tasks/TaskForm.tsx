import { useState } from 'react'
import type { Priority, Tag } from '../../types'

interface TaskFormProps {
  onAdd: (data: {
    title: string
    priority: Priority
    tag: Tag
    dueDate: string
  }) => void
  onCancel: () => void
}

export function TaskForm({ onAdd, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [tag, setTag] = useState<Tag>('work')
  const [date, setDate] = useState('')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), priority, tag, dueDate: date })
  }

  return (
    <div className="tm-add-form">
      <div className="tm-add-form-row">
        <input
          className="tm-add-input"
          type="text"
          placeholder="Nombre de la tarea..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          autoFocus
        />
      </div>
      <div className="tm-add-form-row">
        <select
          className="tm-add-select"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
        >
          <option value="high">🔴 Alta</option>
          <option value="medium">🔵 Media</option>
          <option value="low">⚪ Baja</option>
        </select>
        <select
          className="tm-add-select"
          value={tag}
          onChange={e => setTag(e.target.value as Tag)}
        >
          <option value="work">Trabajo</option>
          <option value="personal">Personal</option>
          <option value="urgent">Urgente</option>
          <option value="idea">Idea</option>
        </select>
        <input
          className="tm-add-select"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
      <div className="tm-add-form-actions">
        <button className="tm-btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="tm-btn-primary" onClick={handleAdd}>
          Agregar tarea
        </button>
      </div>
    </div>
  )
}
