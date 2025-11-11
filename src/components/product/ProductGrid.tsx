import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[]; // TODO: Replace with proper Product type
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* TODO: Map through products and render ProductCard */}
      <p className="col-span-full text-center text-muted-foreground">
        No products available
      </p>
    </div>
  );
}
