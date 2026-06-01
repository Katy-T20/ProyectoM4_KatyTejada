export interface ValidationError {
  field: string
  message: string
}

export function validateLogin(email: string, password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'El email es requerido.' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'El formato del email no es válido.' })
  }

  if (!password) {
    errors.push({ field: 'password', message: 'La contraseña es requerida.' })
  }

  return errors
}

export function validateRegister(
  name: string,
  email: string,
  password: string
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name.trim()) {
    errors.push({ field: 'name', message: 'El nombre es requerido.' })
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'El nombre debe tener al menos 2 caracteres.' })
  }

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'El email es requerido.' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'El formato del email no es válido.' })
  }

  if (!password) {
    errors.push({ field: 'password', message: 'La contraseña es requerida.' })
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'La contraseña debe tener al menos 6 caracteres.' })
  }

  return errors
}
