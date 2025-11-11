'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

/**
 * Hook de autenticación que usa Zustand para state global
 * 
 * @returns {Object} Estado y métodos de autenticación
 * @property {User | null} user - Usuario autenticado
 * @property {Session | null} session - Sesión actual
 * @property {boolean} loading - Estado de carga
 * @property {boolean} isAuthenticated - Si hay usuario autenticado
 * @property {Function} signUp - Registrar nuevo usuario
 * @property {Function} signIn - Iniciar sesión con email/password
 * @property {Function} signInWithGoogle - Iniciar sesión con Google
 * @property {Function} signOut - Cerrar sesión
 * @property {Function} updateProfile - Actualizar perfil de usuario
 * @property {Function} updatePassword - Cambiar contraseña
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, signIn, signOut, isAuthenticated } = useAuth()
 *   
 *   if (isAuthenticated) {
 *     return <div>Welcome {user?.email}</div>
 *   }
 *   
 *   return <button onClick={() => signIn('email', 'pass')}>Login</button>
 * }
 * ```
 */
export function useAuth() {
  const store = useAuthStore()

  // Inicializar auth al montar el hook
  useEffect(() => {
    store.initialize()
  }, [])

  return {
    // Estado
    user: store.user,
    session: store.session,
    loading: store.loading,
    isAuthenticated: store.isAuthenticated,

    // Métodos de autenticación
    signUp: store.signUp,
    signIn: store.signIn,
    signInWithGoogle: store.signInWithGoogle,
    signOut: store.signOut,

    // Métodos de actualización
    updateProfile: store.updateProfile,
    updatePassword: store.updatePassword,
  }
}
