'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-mascoty-secondary shadow-sm">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <span className="font-display text-2xl font-bold text-white">
              Mascoty
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 mx-8 max-w-xl md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-black"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-white hover:text-mascoty-accent hover:bg-white/10 md:inline-flex"
              asChild
            >
              <Link href="/cuenta/favoritos">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-mascoty-accent hover:bg-white/10"
              asChild
            >
              <Link href="/cuenta/perfil">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:text-mascoty-accent hover:bg-white/10"
              asChild
            >
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-mascoty-accent text-black text-xs">
                  3
                </Badge>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-mascoty-accent hover:bg-white/10 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden border-t border-white/10 md:block">
          <div className="flex items-center justify-center gap-8 px-4 py-3">
            <Link
              href="/productos"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Productos
            </Link>
            <Link
              href="/categoria/perros"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Perros
            </Link>
            <Link
              href="/categoria/gatos"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Gatos
            </Link>
            <Link
              href="/categoria/aves"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Aves
            </Link>
            <Link
              href="/categoria/peces"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Peces
            </Link>
            <Link
              href="/categoria/otros"
              className="text-sm font-medium text-white/90 transition-colors hover:text-mascoty-accent"
            >
              Otros
            </Link>
            <Link
              href="/ofertas"
              className="text-sm font-bold text-mascoty-accent transition-colors hover:text-mascoty-warning"
            >
              🔥 Ofertas
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-mascoty-secondary md:hidden">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Search Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Nav Links Mobile */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/productos"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Productos
              </Link>
              <Link
                href="/categoria/perros"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Perros
              </Link>
              <Link
                href="/categoria/gatos"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Gatos
              </Link>
              <Link
                href="/categoria/aves"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Aves
              </Link>
              <Link
                href="/categoria/peces"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Peces
              </Link>
              <Link
                href="/categoria/otros"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-mascoty-accent"
              >
                Otros
              </Link>
              <Link
                href="/ofertas"
                className="rounded-lg px-4 py-2 text-sm font-bold text-mascoty-accent transition-colors hover:bg-white/10"
              >
                🔥 Ofertas
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
