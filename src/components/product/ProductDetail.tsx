import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductDetailProps {
  product: any; // TODO: Replace with proper Product type
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="aspect-square bg-muted rounded-lg" />
      
      {/* Product Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Product Name</h1>
        <Badge>Category</Badge>
        <p className="text-2xl font-bold">$0.00</p>
        <p className="text-muted-foreground">Product description goes here</p>
        <Button size="lg" className="w-full md:w-auto">
          Agregar al Carrito
        </Button>
      </div>
    </div>
  );
}
