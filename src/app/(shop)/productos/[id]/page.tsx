'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, Heart, Star, Truck, Shield, Package, 
  ChevronLeft, ChevronRight, Share2, AlertCircle, Check
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  rating?: number
  reviews?: number
}

export default function ProductoDetallePage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('default')

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[600px] bg-muted rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p className="text-muted-foreground mb-8">
          El producto que buscas no existe o ha sido eliminado
        </p>
        <Link href="/productos">
          <Button>Volver a productos</Button>
        </Link>
      </div>
    )
  }

  const hasImages = product.images && product.images.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/productos" className="hover:text-foreground">Productos</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/categorias/${product.category.toLowerCase()}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              {hasImages ? (
                <>
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  🐾
                </div>
              )}

              {product.featured && (
                <Badge className="absolute top-4 left-4">
                  ⭐ Destacado
                </Badge>
              )}
              {product.stock < 5 && product.stock > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  ¡Solo quedan {product.stock}!
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="secondary" className="absolute top-4 right-4">
                  Agotado
                </Badge>
              )}
            </div>

            {/* Miniaturas */}
            {hasImages && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= (product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews || 0} reseñas)
                </span>
              </div>
              <div className="text-5xl font-bold text-primary mb-4">
                ${product.price.toFixed(2)}
              </div>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">En stock ({product.stock} disponibles)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-600">Sin stock</span>
                </>
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-sm font-medium mb-2 block">Cantidad</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="w-20 text-center font-medium text-lg">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-3">
              <Button
                className="w-full h-14 text-lg"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al Carrito
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <Heart className="h-5 w-5 mr-2" />
                  Favoritos
                </Button>
                <Button variant="outline" className="h-12">
                  <Share2 className="h-5 w-5 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>

            <Separator />

            {/* Beneficios */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Envío gratis</div>
                  <div className="text-sm text-muted-foreground">
                    En compras mayores a $50
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Garantía</div>
                  <div className="text-sm text-muted-foreground">
                    30 días de devolución
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Entrega rápida</div>
                  <div className="text-sm text-muted-foreground">
                    3-5 días hábiles
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Información Adicional */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Producto</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Este producto es ideal para el cuidado y bienestar de tu mascota. 
                    Fabricado con materiales de alta calidad y siguiendo estrictos estándares 
                    de seguridad.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Especificaciones Técnicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Categoría:</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">SKU:</span>
                      <span className="text-muted-foreground">{product.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Stock disponible:</span>
                      <span className="text-muted-foreground">{product.stock} unidades</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Garantía:</span>
                      <span className="text-muted-foreground">30 días</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas de Clientes</CardTitle>
                  <CardDescription>
                    {product.reviews || 0} reseñas - Calificación promedio: {product.rating || 0}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Aún no hay reseñas para este producto.</p>
                    <p className="text-sm mt-2">¡Sé el primero en dejar una reseña!</p>
                    <Button className="mt-4" variant="outline">
                      Escribir reseña
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
