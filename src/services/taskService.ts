import { genId } from '../utils/helpers'
import type { Task, Priority, Tag } from '../types'

const TASKS_KEY = 'matecode_tasks'

//Helpers internos 
const getAllTasks = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]')
  } catch {
    return []
  }
}

const saveTasks = (tasks: Task[]) =>
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

//API pública
export const taskService = {
  getByUser(userId: string): Task[] {
    return getAllTasks().filter(t => t.userId === userId)
  },

  create(userId: string, data: {
    title: string
    priority: Priority
    tag: Tag
    dueDate: string
  }): Task {
    const task: Task = {
      id: genId(),
      userId,
      completed: false,
      createdAt: Date.now(),
      ...data,
    }
    saveTasks([task, ...getAllTasks()])
    return task
  },

  update(id: string, userId: string, changes: Partial<Pick<Task,
    'title' | 'priority' | 'tag' | 'dueDate' | 'completed'
  >>): Task {
    const all = getAllTasks()
    const idx = all.findIndex(t => t.id === id && t.userId === userId)
    if (idx === -1) throw new Error('Tarea no encontrada')
    all[idx] = { ...all[idx], ...changes }
    saveTasks(all)
    return all[idx]
  },

  delete(id: string, userId: string): void {
    saveTasks(getAllTasks().filter(t => !(t.id === id && t.userId === userId)))
  },

  toggle(id: string, userId: string): Task {
    const all = getAllTasks()
    const idx = all.findIndex(t => t.id === id && t.userId === userId)
    if (idx === -1) throw new Error('Tarea no encontrada')
    all[idx] = { ...all[idx], completed: !all[idx].completed }
    saveTasks(all)
    return all[idx]
  },
}
