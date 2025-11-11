import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartItem({ id, name, price, quantity }: CartItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">Cantidad: {quantity}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-bold">${price * quantity}</p>
        <Button variant="destructive" size="sm">Eliminar</Button>
      </div>
    </div>
  );
}
