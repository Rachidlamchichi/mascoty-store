import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl">🐾</span>
              <span className="font-display text-2xl font-bold text-mascoty-secondary">
                Mascoty
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Los mejores productos para el cuidado de tu mascota. 
              Calidad garantizada y envío rápido.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:text-mascoty-primary" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-mascoty-primary" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-mascoty-primary" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display font-semibold text-mascoty-secondary">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-display font-semibold text-mascoty-secondary">
              Atención al Cliente
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/cuenta/pedidos" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Información de Envío
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-mascoty-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-display font-semibold text-mascoty-secondary">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete y recibe ofertas exclusivas
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu email"
                className="flex-1"
              />
              <Button className="bg-mascoty-primary hover:bg-mascoty-warning text-white">
                Enviar
              </Button>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hola@mascoty.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              © {currentYear} Mascoty. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="transition-colors hover:text-mascoty-primary">
                Privacidad
              </Link>
              <Link href="/terminos" className="transition-colors hover:text-mascoty-primary">
                Términos
              </Link>
              <Link href="/cookies" className="transition-colors hover:text-mascoty-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
