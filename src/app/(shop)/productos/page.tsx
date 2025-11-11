'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Heart, Star, Search, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    slug: 'perros',
    name: 'Perros',
    icon: '🐕',
    description: 'Todo para tu mejor amigo',
    color: 'from-blue-500 to-blue-600',
  },
  {
    slug: 'gatos',
    name: 'Gatos',
    icon: '🐈',
    description: 'Mima a tu felino',
    color: 'from-purple-500 to-purple-600',
  },
  {
    slug: 'aves',
    name: 'Aves',
    icon: '🦜',
    description: 'Cuidados para aves',
    color: 'from-green-500 to-green-600',
  },
  {
    slug: 'peces',
    name: 'Peces',
    icon: '🐠',
    description: 'Acuarios perfectos',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    slug: 'otros',
    name: 'Otros',
    icon: '🐾',
    description: 'Mascotas exóticas',
    color: 'from-orange-500 to-orange-600',
  },
]

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

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) =>
    searchTerm === '' ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Todo para tus Mascotas 🐾
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Encuentra los mejores productos para el cuidado, alimentación y diversión de tu mascota
            </p>
            
            {/* Barra de búsqueda */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categorías */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Explora por Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center text-primary group-hover:translate-x-2 transition-transform">
                      <span className="text-sm font-medium">Ver productos</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Productos Destacados */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Productos Destacados'}
            </h2>
            {!searchTerm && (
              <Link href="/categorias/perros">
                <Button variant="outline">
                  Ver todos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-64 bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta buscar con otros términos
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Ver todos los productos
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🐾
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 left-2">
                        ⭐ Destacado
                      </Badge>
                    )}
                    {product.stock < 5 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        ¡Últimas unidades!
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        Agotado
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-lg">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </div>
                  </CardContent>

                  <CardFooter className="gap-2">
                    <Link href={`/productos/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver detalles
                      </Button>
                    </Link>
                    <Button
                      className="flex-1"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
