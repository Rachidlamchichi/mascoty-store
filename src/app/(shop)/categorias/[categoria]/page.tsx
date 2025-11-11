'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Heart, Star, Filter, Search, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Mapeo de categorías
const categoryInfo = {
  perros: {
    name: 'Perros',
    icon: '🐕',
    description: 'Todo lo que tu perro necesita para ser feliz',
    subcategories: ['Alimento', 'Juguetes', 'Accesorios', 'Higiene', 'Salud'],
  },
  gatos: {
    name: 'Gatos',
    icon: '🐈',
    description: 'Productos premium para tu felino',
    subcategories: ['Alimento', 'Arena', 'Rascadores', 'Juguetes', 'Accesorios'],
  },
  aves: {
    name: 'Aves',
    icon: '🦜',
    description: 'Cuidados especiales para aves',
    subcategories: ['Alimento', 'Jaulas', 'Juguetes', 'Suplementos', 'Accesorios'],
  },
  peces: {
    name: 'Peces',
    icon: '🐠',
    description: 'Equipo y alimento para acuarios',
    subcategories: ['Alimento', 'Acuarios', 'Filtros', 'Decoración', 'Tratamiento de agua'],
  },
  otros: {
    name: 'Otros',
    icon: '🐾',
    description: 'Para todas tus mascotas exóticas',
    subcategories: ['Alimento', 'Hábitat', 'Accesorios', 'Salud', 'Juguetes'],
  },
}

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

export default function CategoriaPage() {
  const params = useParams()
  const categoria = params.categoria as string
  const categoryData = categoryInfo[categoria as keyof typeof categoryInfo]

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [categoria, sortBy])

  const loadProducts = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', categoryData?.name || categoria)

      // Ordenamiento
      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true })
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false })
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true })
      } else {
        query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    // Filtro de búsqueda
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Filtro de precio
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // Filtro de subcategorías (si se implementa en el futuro)
    // if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(product.subcategory)) {
    //   return false
    // }

    return true
  })

  if (!categoryData) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Categoría no encontrada</h1>
        <p className="text-muted-foreground mb-8">La categoría que buscas no existe.</p>
        <Link href="/productos">
          <Button>Ver todos los productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{categoryData.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {categoryData.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {categoryData.description}
              </p>
            </div>
          </div>

          {/* Subcategorías rápidas */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categoryData.subcategories.map((sub) => (
              <Badge
                key={sub}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {sub}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Búsqueda */}
                  <div>
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Rango de Precio */}
                  <div>
                    <Label>Precio: ${priceRange[0]} - ${priceRange[1]}</Label>
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mt-4"
                    />
                  </div>

                  <Separator />

                  {/* Subcategorías */}
                  <div>
                    <Label className="mb-3 block">Subcategorías</Label>
                    <div className="space-y-2">
                      {categoryData.subcategories.map((sub) => (
                        <div key={sub} className="flex items-center space-x-2">
                          <Checkbox
                            id={sub}
                            checked={selectedSubcategories.includes(sub)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSubcategories([...selectedSubcategories, sub])
                              } else {
                                setSelectedSubcategories(
                                  selectedSubcategories.filter((s) => s !== sub)
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor={sub}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {sub}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm('')
                      setPriceRange([0, 1000])
                      setSelectedSubcategories([])
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="lg:col-span-3">
            {/* Barra de herramientas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort">Ordenar por:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destacados</SelectItem>
                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Productos */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
                <Button onClick={() => {
                  setSearchTerm('')
                  setPriceRange([0, 1000])
                  setSelectedSubcategories([])
                }}>
                  Limpiar filtros
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                          {categoryData.icon}
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
    </div>
  )
}
