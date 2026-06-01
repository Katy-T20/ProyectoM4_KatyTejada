import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './firebase'
import type { User } from '../types'

// Convertir FirebaseUser a nuestro tipo User
const toUser = (fbUser: FirebaseUser): User => ({
  id: fbUser.uid,
  name: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuario',
  email: fbUser.email ?? '',
})

// API pública
export const authService = {
  async register(name: string, email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    return toUser({ ...user, displayName: name })
  },

  async login(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    return toUser(user)
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },

  getCurrentUser(): User | null {
    const fbUser = auth.currentUser
    return fbUser ? toUser(fbUser) : null
  },

  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, fbUser => {
      callback(fbUser ? toUser(fbUser) : null)
    })
  },
}
