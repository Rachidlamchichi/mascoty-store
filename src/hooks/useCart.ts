'use client';

import { useCartStore } from '@/store/cartStore';

export function useCart() {
  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.getTotal());

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
  };
}
