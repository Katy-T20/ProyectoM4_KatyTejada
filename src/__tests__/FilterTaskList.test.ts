import { describe, it, expect } from 'vitest'
import type { Task } from '../types'

// ─── Datos de prueba ──────────────────────────────────────────
const mockTasks: Task[] = [
  {
    id: '1',
    userId: 'user-1',
    title: 'Tarea pendiente 1',
    priority: 'high',
    tag: 'work',
    dueDate: '2099-12-31',
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: '2',
    userId: 'user-1',
    title: 'Tarea pendiente 2',
    priority: 'medium',
    tag: 'personal',
    dueDate: '',
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: '3',
    userId: 'user-1',
    title: 'Tarea completada',
    priority: 'low',
    tag: 'work',
    dueDate: '',
    completed: true,
    createdAt: Date.now(),
  },
]

// ─── Funciones de filtrado (igual a useTasks) ─────────────────
const filterTasks = (tasks: Task[], filter: string, search: string) => {
  return tasks
    .filter(t => {
      if (filter === 'pending') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
}

// ─── Tests ────────────────────────────────────────────────────
describe('FilterTaskList', () => {
  it('filtro "all" devuelve todas las tareas', () => {
    const result = filterTasks(mockTasks, 'all', '')
    expect(result).toHaveLength(3)
  })

  it('filtro "pending" devuelve solo tareas pendientes', () => {
    const result = filterTasks(mockTasks, 'pending', '')
    expect(result).toHaveLength(2)
    expect(result.every(t => !t.completed)).toBe(true)
  })

  it('filtro "completed" devuelve solo tareas completadas', () => {
    const result = filterTasks(mockTasks, 'completed', '')
    expect(result).toHaveLength(1)
    expect(result[0].completed).toBe(true)
  })

  it('búsqueda filtra por título', () => {
    const result = filterTasks(mockTasks, 'all', 'pendiente')
    expect(result).toHaveLength(2)
  })

  it('búsqueda es case-insensitive', () => {
    const result = filterTasks(mockTasks, 'all', 'COMPLETADA')
    expect(result).toHaveLength(1)
  })

  it('búsqueda sin resultados devuelve array vacío', () => {
    const result = filterTasks(mockTasks, 'all', 'xyz123')
    expect(result).toHaveLength(0)
  })

  it('combinación de filtro y búsqueda funciona', () => {
    const result = filterTasks(mockTasks, 'pending', 'pendiente 1')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Tarea pendiente 1')
  })
})
