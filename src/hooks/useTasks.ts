import { useState, useCallback, useMemo, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { useAuth } from './useAuth'
import type { Task, Filter, Priority, Tag } from '../types'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar tareas desde Firestore
  const refresh = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await taskService.getByUser(user.id)
      setTasks(data)
    } catch (err) {
      setError('Error al cargar las tareas')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Acciones
  const addTask = useCallback(async (data: {
    title: string
    description?: string
    priority: Priority
    tag: Tag
    dueDate: string
  }) => {
    if (!user) return
    setError(null)
    try {
      await taskService.create(user.id, data)
      await refresh()
    } catch (err) {
      setError('Error al crear la tarea')
      console.error(err)
    }
  }, [user, refresh])

  const toggleTask = useCallback(async (id: string) => {
    if (!user) return
    setError(null)
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      await taskService.toggle(id, user.id, task.completed)
      await refresh()
    } catch (err) {
      setError('Error al actualizar la tarea')
      console.error(err)
    }
  }, [user, tasks, refresh])

  const deleteTask = useCallback(async (id: string) => {
    if (!user) return
    setError(null)
    try {
      await taskService.delete(id, user.id)
      await refresh()
    } catch (err) {
      setError('Error al eliminar la tarea')
      console.error(err)
    }
  }, [user, refresh])

  const editTask = useCallback(async (
    id: string,
    changes: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'tag' | 'dueDate'>>
  ) => {
    if (!user) return
    setError(null)
    try {
      await taskService.update(id, user.id, changes)
      await refresh()
    } catch (err) {
      setError('Error al editar la tarea')
      console.error(err)
    }
  }, [user, refresh])

  // Filtrado
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

  return {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    isLoading,
    error,
    pendingCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  }
}
