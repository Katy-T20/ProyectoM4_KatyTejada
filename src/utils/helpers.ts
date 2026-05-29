import type { Priority, Tag, Filter } from '../types'

//Generador de ID
export const genId = () => Math.random().toString(36).slice(2, 9)

//Fecha vencida
export const isOverdue = (date: string, completed: boolean): boolean => {
  if (!date || completed) return false
  return new Date(date) < new Date(new Date().toDateString())
}

// Formatear fecha
export const formatDate = (date: string): string => {
  if (!date) return ''
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

//Mapas de clases CSS
export const PRIORITY_CARD_MAP: Record<Priority, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
}

export const PRIORITY_BADGE_MAP: Record<Priority, string> = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
}

export const TAG_CLASS_MAP: Record<Tag, string> = {
  work: 'tag-work',
  personal: 'tag-personal',
  urgent: 'tag-urgent',
  idea: 'tag-idea',
}

//Etiquetas legibles
export const TAG_LABELS: Record<Tag, string> = {
  work: 'Trabajo',
  personal: 'Personal',
  urgent: 'Urgente',
  idea: 'Idea',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'Todas',
  pending: 'Pendientes',
  completed: 'Completadas',
}
