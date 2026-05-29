import { useState, useMemo, useCallback } from 'react'
import { taskService } from '../services/taskService'
import { useAuth } from './useAuth'
import type { Task, Filter, Priority, Tag } from '../types'

//Hook principal
export function useTasks() {
  const { user } = useAuth()

  const [tasks, setTasks] = useState<Task[]>(() =>
    user ? taskService.getByUser(user.id) : []
  )
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  //Recargar desde storage 
  const refresh = useCallback(() => {
    if (user) setTasks(taskService.getByUser(user.id))
  }, [user])

  //Acciones
  const addTask = useCallback((data: {
    title: string
    priority: Priority
    tag: Tag
    dueDate: string
  }) => {
    if (!user) return
    taskService.create(user.id, data)
    refresh()
  }, [user, refresh])

  const toggleTask = useCallback((id: string) => {
    if (!user) return
    taskService.toggle(id, user.id)
    refresh()
  }, [user, refresh])

  const deleteTask = useCallback((id: string) => {
    if (!user) return
    taskService.delete(id, user.id)
    refresh()
  }, [user, refresh])

  const editTask = useCallback((
    id: string,
    changes: Partial<Pick<Task, 'title' | 'priority' | 'tag' | 'dueDate'>>
  ) => {
    if (!user) return
    taskService.update(id, user.id, changes)
    refresh()
  }, [user, refresh])

  //Filtrado
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

  //Stats
  const pendingCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  return {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    pendingCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  }
}
