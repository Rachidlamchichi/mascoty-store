import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Truck, Shield, HeartHandshake, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-mascoty-secondary via-mascoty-secondary/90 to-mascoty-primary py-20 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}/>
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <Badge className="bg-mascoty-accent text-black w-fit">
                🎉 Envío gratis en pedidos +$50
              </Badge>
              <h1 className="font-display text-5xl font-bold leading-tight lg:text-6xl">
                Todo lo que tu mascota necesita
              </h1>
              <p className="text-lg text-white/90">
                Descubre productos de calidad premium para el cuidado, alimentación y diversión de tu mejor amigo.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-mascoty-accent text-black hover:bg-mascoty-warning font-semibold" asChild>
                  <Link href="/productos">
                    Ver Productos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/ofertas">
                    Ver Ofertas 🔥
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 border border-white/20">
                <div className="text-center space-y-4">
                  <div className="text-8xl">🐕</div>
                  <p className="text-2xl font-semibold">+10,000 productos</p>
                  <p className="text-white/80">Para todas las mascotas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mascoty-primary/10">
                <Truck className="h-6 w-6 text-mascoty-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Envío Gratis</h3>
                <p className="text-sm text-muted-foreground">En pedidos +$50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mascoty-success/10">
                <Shield className="h-6 w-6 text-mascoty-success" />
              </div>
              <div>
                <h3 className="font-semibold">Compra Segura</h3>
                <p className="text-sm text-muted-foreground">Pago protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mascoty-accent/10">
                <HeartHandshake className="h-6 w-6 text-mascoty-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Garantía Total</h3>
                <p className="text-sm text-muted-foreground">30 días devolución</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mascoty-secondary/10">
                <Star className="h-6 w-6 text-mascoty-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Calidad Premium</h3>
                <p className="text-sm text-muted-foreground">Productos verificados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold text-mascoty-secondary mb-4">
              Compra por Mascota
            </h2>
            <p className="text-lg text-muted-foreground">
              Encuentra productos específicos para tu compañero
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[
              { emoji: "🐕", name: "Perros", href: "/categoria/perros", color: "mascoty-primary" },
              { emoji: "🐈", name: "Gatos", href: "/categoria/gatos", color: "mascoty-secondary" },
              { emoji: "🐦", name: "Aves", href: "/categoria/aves", color: "mascoty-accent" },
              { emoji: "🐠", name: "Peces", href: "/categoria/peces", color: "mascoty-success" },
              { emoji: "🐹", name: "Otros", href: "/categoria/otros", color: "mascoty-warning" },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >
                <Card className="transition-all hover:scale-105 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      {category.emoji}
                    </div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="font-display text-4xl font-bold text-mascoty-secondary mb-2">
                Productos Destacados
              </h2>
              <p className="text-lg text-muted-foreground">
                Los favoritos de nuestros clientes
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/productos">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative aspect-square bg-gradient-to-br from-mascoty-primary/10 to-mascoty-accent/10 flex items-center justify-center">
                  <span className="text-7xl">🦴</span>
                  <Badge className="absolute top-2 right-2 bg-mascoty-danger text-white">
                    -20%
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-mascoty-primary transition-colors">
                    Producto Premium {i}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-mascoty-accent text-mascoty-accent" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground line-through">$49.99</span>
                      <p className="text-2xl font-bold text-mascoty-primary">$39.99</p>
                    </div>
                    <Button size="sm" className="bg-mascoty-primary hover:bg-mascoty-warning">
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/productos">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-mascoty-primary to-mascoty-warning text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold mb-6">
            ¿Listo para mimar a tu mascota?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Regístrate y obtén 10% de descuento en tu primera compra
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" className="bg-white text-mascoty-primary hover:bg-gray-100 font-semibold" asChild>
              <Link href="/register">
                Crear Cuenta Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/productos">
                Explorar Productos
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
