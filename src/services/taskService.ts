import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, Priority, Tag } from '../types'

const TASKS_COLLECTION = 'tasks'

// API pública 
export const taskService = {
  async getByUser(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]
  },

  async create(userId: string, data: {
    title: string
    description?: string
    priority: Priority
    tag: Tag
    dueDate: string
  }): Promise<Task> {
    const newTask = {
      userId,
      completed: false,
      createdAt: Date.now(),
      ...data,
    }
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask)
    return { id: docRef.id, ...newTask }
  },

  async update(
    id: string,
    _userId: string,
    changes: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'tag' | 'dueDate' | 'completed'>>
  ): Promise<void> {
    const ref = doc(db, TASKS_COLLECTION, id)
    await updateDoc(ref, { ...changes, updatedAt: serverTimestamp() })
  },

  async delete(id: string, _userId: string): Promise<void> {
    const ref = doc(db, TASKS_COLLECTION, id)
    await deleteDoc(ref)
  },

  async toggle(id: string, _userId: string, completed: boolean): Promise<void> {
    const ref = doc(db, TASKS_COLLECTION, id)
    await updateDoc(ref, { completed: !completed, updatedAt: serverTimestamp() })
  },
}
