import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Cliente SES 
const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Tipos 
interface Task {
  title: string
  description?: string
  completed: boolean
  priority: string
  tag: string
  dueDate?: string
}

// Helpers del template 
const priorityLabel = (p: string) =>
  p === 'high' ? 'Alta' : p === 'medium' ? 'Media' : 'Baja'

const taskRow = (t: Task) => `
  <tr>
    <td style="padding:8px 12px;border-bottom:1px solid #1C2333;color:#E2E8F0">${t.title}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #1C2333;color:#AFA9EC">${priorityLabel(t.priority)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #1C2333;color:#94A3B8">${t.dueDate ?? '—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #1C2333;color:#64748B">${t.description ?? '—'}</td>
  </tr>
`

const tableSection = (tasks: Task[], title: string, headerColor: string) => `
  <h2 style="color:#AFA9EC;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px">${title}</h2>
  <table style="width:100%;border-collapse:collapse;background:rgba(28,35,51,0.75);border-radius:10px;overflow:hidden;margin-bottom:24px">
    <thead>
      <tr style="background:${headerColor}">
        <th style="padding:10px 12px;text-align:left;color:#AFA9EC;font-size:11px;letter-spacing:1px">TAREA</th>
        <th style="padding:10px 12px;text-align:left;color:#AFA9EC;font-size:11px;letter-spacing:1px">PRIORIDAD</th>
        <th style="padding:10px 12px;text-align:left;color:#AFA9EC;font-size:11px;letter-spacing:1px">FECHA</th>
        <th style="padding:10px 12px;text-align:left;color:#AFA9EC;font-size:11px;letter-spacing:1px">DESCRIPCIÓN</th>
      </tr>
    </thead>
    <tbody>${tasks.map(taskRow).join('')}</tbody>
  </table>
`

const buildEmailTemplate = (userName: string, tasks: Task[]): string => {
  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)
  const date = new Date().toLocaleDateString('es-MX', { dateStyle: 'long' })

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a14;font-family:sans-serif">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px">

        <div style="background:linear-gradient(135deg,#C026D3,#7F77DD);border-radius:10px;padding:8px 16px;display:inline-block;margin-bottom:24px">
          <span style="font-size:20px;font-weight:900;color:white;letter-spacing:-1px">MC</span>
          <span style="font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.75);display:block;text-transform:uppercase">MateCode</span>
        </div>

        <h1 style="color:#E879F9;font-size:28px;font-weight:900;margin:0 0 8px;letter-spacing:-1px">
          Resumen de Tareas
        </h1>
        <p style="color:#AFA9EC;font-size:14px;margin:0 0 32px">
          Hola <strong style="color:#E879F9">${userName}</strong> 🌟 Aquí está tu resumen actualizado.
        </p>

        <div style="display:flex;gap:16px;margin-bottom:32px">
          <div style="background:rgba(192,38,211,0.15);border:1px solid rgba(192,38,211,0.3);border-radius:10px;padding:16px 24px;flex:1;text-align:center">
            <p style="font-size:32px;font-weight:900;color:#E879F9;margin:0">${pending.length}</p>
            <p style="font-size:11px;color:#AFA9EC;margin:4px 0 0;letter-spacing:0.5px">pendientes</p>
          </div>
          <div style="background:rgba(96,165,250,0.15);border:1px solid rgba(96,165,250,0.3);border-radius:10px;padding:16px 24px;flex:1;text-align:center">
            <p style="font-size:32px;font-weight:900;color:#60A5FA;margin:0">${completed.length}</p>
            <p style="font-size:11px;color:#AFA9EC;margin:4px 0 0;letter-spacing:0.5px">completadas</p>
          </div>
        </div>

        ${pending.length > 0 ? tableSection(pending, 'Pendientes', 'rgba(192,38,211,0.1)') : ''}
        ${completed.length > 0 ? tableSection(completed, 'Completadas', 'rgba(96,165,250,0.1)') : ''}

        <p style="color:#475569;font-size:11px;text-align:center;margin-top:32px">
          Enviado desde NovaTask · ${date}
        </p>

      </div>
    </body>
    </html>
  `
}

// Handler principal 
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { userEmail, userName, tasks } = req.body

  if (!userEmail || !userName || !tasks) {
    return res.status(400).json({ error: 'Faltan datos requeridos' })
  }

  try {
    const htmlBody = buildEmailTemplate(userName, tasks)

    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL!,
      Destination: { ToAddresses: [userEmail] },
      Message: {
        Subject: {
          Data: '📋 Tu resumen de tareas — NovaTask',
          Charset: 'UTF-8',
        },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
        },
      },
    })

    await ses.send(command)
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('SES error:', error)
    return res.status(500).json({ error: 'Error al enviar el email' })
  }
}
