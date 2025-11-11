'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviewCount = 0,
  category,
  inStock = true,
  isNew = false,
  discount,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <Link href={`/productos/${id}`}>
        <div className="relative aspect-square bg-gradient-to-br from-mascoty-primary/10 to-mascoty-accent/10 flex items-center justify-center overflow-hidden">
          {/* Placeholder or Image */}
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
              🦴
            </span>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-mascoty-success text-white">
                Nuevo
              </Badge>
            )}
            {category && (
              <Badge variant="secondary" className="bg-white/90">
                {category}
              </Badge>
            )}
          </div>

          {discount && (
            <Badge className="absolute top-2 right-2 bg-mascoty-danger text-white font-bold">
              -{discount}%
            </Badge>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-mascoty-danger text-white text-lg px-4 py-2">
                Agotado
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${discount ? 'top-12' : ''} bg-white/90 hover:bg-white ${
              isFavorite ? 'text-mascoty-danger' : 'text-gray-400'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Link>

      {/* Content Section */}
      <CardContent className="p-4">
        <Link href={`/productos/${id}`}>
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-mascoty-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? 'fill-mascoty-accent text-mascoty-accent'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through block">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <p className="text-2xl font-bold text-mascoty-primary">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-mascoty-primary hover:bg-mascoty-warning text-white font-semibold"
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inStock ? 'Agregar' : 'Agotado'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href={`/productos/${id}`}>
              <span className="sr-only">Ver detalles</span>
              →
            </Link>
          </Button>
        </div>

        {/* Stock Indicator */}
        {inStock && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-mascoty-success rounded-full animate-pulse"></div>
            <span className="text-xs text-mascoty-success font-medium">
              En Stock
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
