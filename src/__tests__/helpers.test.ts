import { describe, it, expect } from 'vitest'
import { formatDate, isOverdue } from '../utils/helpers'

describe('formatDate', () => {
  it('devuelve string vacío si no hay fecha', () => {
    expect(formatDate('')).toBe('')
  })

  it('formatea una fecha correctamente', () => {
    const result = formatDate('2025-06-01')
    expect(result).toMatch(/jun/i)
  })
})

describe('isOverdue', () => {
  it('devuelve false si no hay fecha', () => {
    expect(isOverdue('', false)).toBe(false)
  })

  it('devuelve false si la tarea está completada', () => {
    expect(isOverdue('2020-01-01', true)).toBe(false)
  })

  it('devuelve true si la fecha ya pasó y no está completada', () => {
    expect(isOverdue('2020-01-01', false)).toBe(true)
  })

  it('devuelve false si la fecha es futura', () => {
    const future = '2099-12-31'
    expect(isOverdue(future, false)).toBe(false)
  })
})
