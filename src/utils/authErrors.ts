export function getAuthErrorMessage(code: string): string {
  const errors: Record<string, string> = {
    'auth/invalid-credential':    'Email o contraseña incorrectos.',
    'auth/user-not-found':        'No existe una cuenta con este email.',
    'auth/wrong-password':        'Contraseña incorrecta.',
    'auth/email-already-in-use':  'Este email ya está registrado.',
    'auth/weak-password':         'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':         'El formato del email no es válido.',
    'auth/too-many-requests':     'Demasiados intentos. Intentá más tarde.',
    'auth/network-request-failed':'Error de conexión. Verificá tu internet.',
    'auth/user-disabled':         'Esta cuenta fue deshabilitada.',
  }
  return errors[code] ?? 'Ocurrió un error inesperado. Intentá de nuevo.'
}
