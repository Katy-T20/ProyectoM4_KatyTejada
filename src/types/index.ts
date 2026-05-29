//Tipos de tareas
export type Priority = 'high' | 'medium' | 'low'
export type Tag = 'work' | 'personal'
export type Filter = 'all' | 'pending' | 'completed'

export interface Task {
  id: string
  title: string
  priority: Priority
  tag: Tag
  dueDate: string
  completed: boolean
  createdAt: number
  userId: string
}

//Tipos de autenticación
export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
