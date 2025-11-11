'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CheckoutForm() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="tu@email.com" />
      </div>
      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" placeholder="Calle Principal 123" />
      </div>
      {/* TODO: Add more checkout fields */}
      <Button type="submit" className="w-full">
        Procesar Pago
      </Button>
    </form>
  );
}
