import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { Navbar } from '../components/layout/Navbar'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskList } from '../components/tasks/TaskList'
import { FILTER_LABELS } from '../utils/helpers'
import type { Filter } from '../types'

export default function TaskPage() {
  const {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  } = useTasks()

  const [showForm, setShowForm] = useState(false)

  return (
    <div className="tm-app">
      <div className="tm-container">

        <Navbar />

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

        {/* Formulario o botón de agregar */}
        {showForm ? (
          <TaskForm
            onAdd={(data) => {
              addTask(data)
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            className="tm-add-trigger"
            onClick={() => setShowForm(true)}
          >
            + Crear Nueva tarea
          </button>
        )}

        {/* Lista */}
        <TaskList
          tasks={filtered}
          search={search}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />

      </div>
    </div>
  )
}
