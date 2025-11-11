import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/cuenta'

  if (code) {
    const supabase = createServerClient()
    
    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code)
    
    // Obtener el usuario
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Verificar si el usuario ya existe en la tabla users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      
      // Si no existe, crearlo
      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            auth_id: user.id,
            email: user.email!,
            name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Usuario',
            avatar_url: user.user_metadata.avatar_url,
          })
      }
    }
  }

  // Redirigir a la URL final
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
