import { genId } from '../utils/helpers'
import type { User } from '../types'

const USERS_KEY = 'matecode_users'
const SESSION_KEY = 'matecode_session'

//Tipos internos
interface StoredUser extends User {
  password: string
}

//Helpers internos
const getUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

const saveUsers = (users: StoredUser[]) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

//API pública
export const authService = {
  register(name: string, email: string, password: string): User {
    const users = getUsers()

    if (users.find(u => u.email === email)) {
      throw new Error('Este email ya está registrado')
    }

    const newUser: StoredUser = {
      id: genId(),
      name,
      email,
      password,
    }

    saveUsers([...users, newUser])

    const { password: _, ...user } = newUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  },

  login(email: string, password: string): User {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)

    if (!found) throw new Error('Email o contraseña incorrectos')

    const { password: _, ...user } = found
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
}
