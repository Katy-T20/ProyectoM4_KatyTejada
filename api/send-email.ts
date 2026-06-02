import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { buildEmailTemplate } from './emailTemplate'

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

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
          Data: '📋 Tu resumen de tareas — MateCode',
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
