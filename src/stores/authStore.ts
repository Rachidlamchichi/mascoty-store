import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  signUp: (email: string, password: string, userData?: { name?: string }) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; avatar_url?: string; phone?: string }) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  initialize: () => Promise<void>
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),

      signUp: async (email, password, userData) => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
            },
          })

          if (authError) throw authError

          if (authData.user) {
            // Crear registro en tabla users
            const { error: dbError } = await supabase
              .from('users')
              .insert({
                auth_id: authData.user.id,
                email,
                name: userData?.name || email.split('@')[0],
              })

            if (dbError) throw dbError

            set({
              user: authData.user,
              session: authData.session,
              isAuthenticated: true,
            })
          }

          return { error: null }
        } catch (error: any) {
          console.error('Error en signUp:', error)
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      signIn: async (email, password) => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
          })

          return { error: null }
        } catch (error: any) {
          console.error('Error en signIn:', error)
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      signInWithGoogle: async () => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })

          if (error) throw error

          return { error: null }
        } catch (error: any) {
          console.error('Error en signInWithGoogle:', error)
          set({ loading: false })
          return { error }
        }
      },

      signOut: async () => {
        const supabase = createClient()
        set({ loading: true })

        try {
          await supabase.auth.signOut()
          set({
            user: null,
            session: null,
            isAuthenticated: false,
          })
        } catch (error) {
          console.error('Error en signOut:', error)
        } finally {
          set({ loading: false })
        }
      },

      updateProfile: async (data) => {
        const supabase = createClient()
        const { user } = get()

        if (!user) {
          return { error: new Error('No authenticated user') }
        }

        set({ loading: true })

        try {
          // Actualizar en Supabase Auth (metadata)
          const { error: authError } = await supabase.auth.updateUser({
            data,
          })

          if (authError) throw authError

          // Actualizar en tabla users
          const { error: dbError } = await supabase
            .from('users')
            .update(data)
            .eq('auth_id', user.id)

          if (dbError) throw dbError

          // Actualizar estado local
          const { data: updatedAuthData } = await supabase.auth.getUser()
          if (updatedAuthData.user) {
            set({ user: updatedAuthData.user })
          }

          return { error: null }
        } catch (error: any) {
          console.error('Error en updateProfile:', error)
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      updatePassword: async (newPassword) => {
        const supabase = createClient()
        set({ loading: true })

        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          })

          if (error) throw error

          return { error: null }
        } catch (error: any) {
          console.error('Error en updatePassword:', error)
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      initialize: async () => {
        const supabase = createClient()
        set({ loading: true })

        try {
          // Obtener sesión actual
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
            })
          }

          // Suscribirse a cambios de autenticación
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session,
              isAuthenticated: !!session?.user,
            })
          })
        } catch (error) {
          console.error('Error al inicializar auth:', error)
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Solo persistir estos campos
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
