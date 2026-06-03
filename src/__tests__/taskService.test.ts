import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Firestore
vi.mock('../services/firebase', () => ({
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id-123' }),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  getDocs: vi.fn().mockResolvedValue({
    docs: [
      {
        id: 'task-1',
        data: () => ({
          userId: 'user-1',
          title: 'Tarea de prueba',
          description: 'Descripción de prueba',
          priority: 'high',
          tag: 'work',
          dueDate: '2025-06-01',
          completed: false,
          createdAt: Date.now(),
        }),
      },
    ],
  }),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn().mockReturnValue('mock-timestamp'),
}))

import { taskService } from '../services/taskService'

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getByUser devuelve tareas del usuario', async () => {
    const tasks = await taskService.getByUser('user-1')
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Tarea de prueba')
    expect(tasks[0].id).toBe('task-1')
  })

  it('create devuelve la tarea creada con id', async () => {
    const task = await taskService.create('user-1', {
      title: 'Nueva tarea',
      priority: 'medium',
      tag: 'personal',
      dueDate: '2025-07-01',
    })
    expect(task.id).toBe('mock-id-123')
    expect(task.title).toBe('Nueva tarea')
    expect(task.completed).toBe(false)
    expect(task.userId).toBe('user-1')
  })

  it('update llama a updateDoc', async () => {
    const { updateDoc } = await import('firebase/firestore')
    await taskService.update('task-1', 'user-1', { title: 'Título editado' })
    expect(updateDoc).toHaveBeenCalled()
  })

  it('delete llama a deleteDoc', async () => {
    const { deleteDoc } = await import('firebase/firestore')
    await taskService.delete('task-1', 'user-1')
    expect(deleteDoc).toHaveBeenCalled()
  })

  it('toggle llama a updateDoc con completed invertido', async () => {
    const { updateDoc } = await import('firebase/firestore')
    await taskService.toggle('task-1', 'user-1', false)
    expect(updateDoc).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ completed: true })
    )
  })
})
