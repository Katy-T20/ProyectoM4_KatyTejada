import { describe, it, expect } from 'vitest'
import { validateLogin, validateRegister } from '../utils/validators'

describe('validateLogin', () => {
  it('devuelve error si el email está vacío', () => {
    const errors = validateLogin('', 'password123')
    expect(errors.some(e => e.field === 'email')).toBe(true)
  })

  it('devuelve error si el email es inválido', () => {
    const errors = validateLogin('no-es-email', 'password123')
    expect(errors.some(e => e.field === 'email')).toBe(true)
  })

  it('devuelve error si la contraseña está vacía', () => {
    const errors = validateLogin('test@email.com', '')
    expect(errors.some(e => e.field === 'password')).toBe(true)
  })

  it('no devuelve errores con datos válidos', () => {
    const errors = validateLogin('test@email.com', 'password123')
    expect(errors).toHaveLength(0)
  })
})

describe('validateRegister', () => {
  it('devuelve error si el nombre está vacío', () => {
    const errors = validateRegister('', 'test@email.com', 'password123')
    expect(errors.some(e => e.field === 'name')).toBe(true)
  })

  it('devuelve error si el nombre es muy corto', () => {
    const errors = validateRegister('a', 'test@email.com', 'password123')
    expect(errors.some(e => e.field === 'name')).toBe(true)
  })

  it('devuelve error si el email es inválido', () => {
    const errors = validateRegister('Katy', 'no-es-email', 'password123')
    expect(errors.some(e => e.field === 'email')).toBe(true)
  })

  it('devuelve error si la contraseña es muy corta', () => {
    const errors = validateRegister('Katy', 'test@email.com', '123')
    expect(errors.some(e => e.field === 'password')).toBe(true)
  })

  it('no devuelve errores con datos válidos', () => {
    const errors = validateRegister('Katy', 'test@email.com', 'password123')
    expect(errors).toHaveLength(0)
  })
})
