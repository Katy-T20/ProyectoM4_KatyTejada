import type { Task } from '../types'

interface SendEmailParams {
  userEmail: string
  userName: string
  tasks: Task[]
}

export const emailService = {
  async sendTaskSummary({ userEmail, userName, tasks }: SendEmailParams): Promise<void> {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, userName, tasks }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error ?? 'Error al enviar el email')
    }
  },
}
