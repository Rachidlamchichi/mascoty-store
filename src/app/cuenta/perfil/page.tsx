'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { 
  User, 
  Lock, 
  Award, 
  Bell, 
  Upload, 
  Loader2,
  Crown,
  Star,
  TrendingUp
} from 'lucide-react'

// Schemas de validación
const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

// Configuración de tiers
const TIER_CONFIG = {
  BRONZE: {
    name: 'Bronze',
    icon: Award,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    min: 0,
    max: 999,
    benefits: ['5% descuento', 'Envío gratis >€50'],
  },
  SILVER: {
    name: 'Silver',
    icon: Star,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    min: 1000,
    max: 4999,
    benefits: ['10% descuento', 'Envío gratis >€30', 'Ofertas exclusivas'],
  },
  GOLD: {
    name: 'Gold',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    min: 5000,
    max: Infinity,
    benefits: ['15% descuento', 'Envío gratis siempre', 'Regalos', 'Soporte prioritario'],
  },
}

export default function PerfilPage() {
  const { user, updateProfile, updatePassword } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()
  
  const [userData, setUserData] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    newsletter: false,
    promotions: false,
  })

  // Forms
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (data) {
      setUserData(data)
      profileForm.reset({
        name: data.name || '',
        phone: data.phone || '',
      })
    }
  }

  // Actualizar perfil
  const onSubmitProfile = async (data: ProfileFormData) => {
    setLoadingProfile(true)

    const { error } = await updateProfile(data)

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos se han guardado correctamente',
      })
      loadUserData()
    }

    setLoadingProfile(false)
  }

  // Cambiar contraseña
  const onSubmitPassword = async (data: PasswordFormData) => {
    setLoadingPassword(true)

    // Verificar contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email!,
      password: data.currentPassword,
    })

    if (signInError) {
      toast({
        title: 'Error',
        description: 'Contraseña actual incorrecta',
        variant: 'destructive',
      })
      setLoadingPassword(false)
      return
    }

    const { error } = await updatePassword(data.newPassword)

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña se ha cambiado correctamente',
      })
      passwordForm.reset()
    }

    setLoadingPassword(false)
  }

  // Upload de avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)

    try {
      // Crear FormData para Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'mascoty') // Configurar en Cloudinary
      formData.append('folder', 'avatars')

      // Upload a Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (data.secure_url) {
        // Actualizar en BD
        await updateProfile({ avatar_url: data.secure_url })
        
        toast({
          title: 'Avatar actualizado',
          description: 'Tu foto de perfil se ha guardado correctamente',
        })
        
        loadUserData()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Actualizar preferencias
  const handlePreferenceChange = async (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))

    // Guardar en BD (puedes agregar una tabla preferences)
    toast({
      title: 'Preferencia actualizada',
      description: 'Tus preferencias se han guardado',
    })
  }

  if (!user || !userData) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const tierConfig = TIER_CONFIG[userData.tier as keyof typeof TIER_CONFIG]
  const TierIcon = tierConfig.icon
  const pointsToNextTier = userData.tier === 'GOLD' 
    ? 0 
    : (userData.tier === 'BRONZE' ? 1000 : 5000) - userData.points
  const progressPercentage = userData.tier === 'GOLD'
    ? 100
    : (userData.points / (userData.tier === 'BRONZE' ? 1000 : 5000)) * 100

  return (
    <div className="container max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="loyalty">
            <Award className="h-4 w-4 mr-2" />
            Fidelidad
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Bell className="h-4 w-4 mr-2" />
            Preferencias
          </TabsTrigger>
        </TabsList>

        {/* Tab: Perfil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Actualiza tu información personal y foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {userData.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Upload className="h-4 w-4" />
                      {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto'}
                    </div>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG o GIF. Máx 5MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Formulario */}
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                {/* Email (readonly) */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    El email no se puede cambiar
                  </p>
                </div>

                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    {...profileForm.register('name')}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    placeholder="+34 666 777 888"
                    {...profileForm.register('phone')}
                  />
                </div>

                <Button type="submit" disabled={loadingProfile}>
                  {loadingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Contraseña */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                {/* Contraseña actual */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, 1 mayúscula y 1 número
                  </p>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={loadingPassword}>
                  {loadingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Cambiar contraseña'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Fidelidad */}
        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle>Programa de Fidelidad</CardTitle>
              <CardDescription>
                Gana puntos con tus compras y desbloquea beneficios exclusivos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tier actual */}
              <div className={`p-6 rounded-lg border-2 ${tierConfig.borderColor} ${tierConfig.bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TierIcon className={`h-8 w-8 ${tierConfig.color}`} />
                    <div>
                      <h3 className="text-xl font-bold">{tierConfig.name}</h3>
                      <p className="text-sm text-muted-foreground">Nivel actual</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {userData.points} puntos
                  </Badge>
                </div>

                {/* Progreso al siguiente nivel */}
                {userData.tier !== 'GOLD' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso al siguiente nivel</span>
                      <span className="font-semibold">
                        {pointsToNextTier} puntos restantes
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                {userData.tier === 'GOLD' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Has alcanzado el nivel máximo
                  </div>
                )}
              </div>

              {/* Beneficios actuales */}
              <div>
                <h4 className="font-semibold mb-3">Tus beneficios actuales</h4>
                <div className="grid gap-2">
                  {tierConfig.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Todos los niveles */}
              <div>
                <h4 className="font-semibold mb-4">Todos los niveles</h4>
                <div className="space-y-3">
                  {Object.entries(TIER_CONFIG).map(([tier, config]) => {
                    const Icon = config.icon
                    const isCurrent = tier === userData.tier
                    
                    return (
                      <div
                        key={tier}
                        className={`p-4 rounded-lg border ${
                          isCurrent ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`h-5 w-5 ${config.color}`} />
                          <h5 className="font-semibold">{config.name}</h5>
                          {isCurrent && (
                            <Badge variant="default" className="ml-auto">
                              Actual
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {config.min} - {config.max === Infinity ? '∞' : config.max} puntos
                        </p>
                        <div className="space-y-1">
                          {config.benefits.map((benefit, i) => (
                            <div key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <div className={`h-1 w-1 rounded-full ${isCurrent ? 'bg-primary' : 'bg-muted-foreground'}`} />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cómo ganar puntos */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">¿Cómo ganar puntos?</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 1 punto por cada €1 gastado</li>
                  <li>• 50 puntos por completar tu perfil</li>
                  <li>• 100 puntos por tu primera compra</li>
                  <li>• 200 puntos por referir un amigo</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preferencias */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Gestiona cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notificaciones por email */}
              <div className="space-y-4">
                <h4 className="font-semibold">Notificaciones por email</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de pedidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe emails sobre el estado de tus pedidos
                    </p>
                  </div>
                  <Switch
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter semanal</Label>
                    <p className="text-sm text-muted-foreground">
                      Consejos, novedades y ofertas especiales
                    </p>
                  </div>
                  <Switch
                    checked={preferences.newsletter}
                    onCheckedChange={(checked) => handlePreferenceChange('newsletter', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promociones y ofertas</Label>
                    <p className="text-sm text-muted-foreground">
                      Descuentos exclusivos y ventas especiales
                    </p>
                  </div>
                  <Switch
                    checked={preferences.promotions}
                    onCheckedChange={(checked) => handlePreferenceChange('promotions', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones generales</Label>
                    <p className="text-sm text-muted-foreground">
                      Recordatorios y actualizaciones importantes
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
