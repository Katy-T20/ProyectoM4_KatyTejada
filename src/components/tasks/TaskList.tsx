import type { Task } from '../../types'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  search: string
  isLoading: boolean
  error: string | null
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, changes: Partial<Pick<Task,
    'title' | 'description' | 'priority' | 'tag' | 'dueDate'>>) => void
}

export function TaskList({
  tasks,
  search,
  isLoading,
  error,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps) {

  if (isLoading) {
    return (
      <div className="tm-empty-state">
        <div className="tm-empty-icon">⟳</div>
        <p className="tm-empty-text">Cargando tareas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="tm-empty-state">
        <div className="tm-empty-icon">⚠</div>
        <p className="tm-empty-text">{error}</p>
      </div>
    )
  }

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  if (tasks.length === 0) {
    return (
      <div className="tm-empty-state">
        <div className="tm-empty-icon">◎</div>
        <p className="tm-empty-text">
          {search
            ? 'Sin resultados para tu búsqueda.'
            : 'No hay tareas aún. ¡Agrega una!'}
        </p>
      </div>
    )
  }

  return (
    <div className="tm-task-list">
      {pending.length > 0 && (
        <>
          <div className="tm-section-label">Pendientes</div>
          {pending.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </>
      )}

      {completed.length > 0 && (
        <>
          <div className="tm-section-label">Completadas</div>
          {completed.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </>
      )}
    </div>
  )
}
