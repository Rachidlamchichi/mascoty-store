// App Configuration
export const APP_NAME = 'Mascoty';
export const APP_DESCRIPTION = 'Tu tienda de productos para mascotas';

// API Routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  CART: '/api/cart',
  CHECKOUT: '/api/checkout',
  WEBHOOKS: '/api/webhooks',
} as const;

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/productos',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  PROFILE: '/cuenta/perfil',
  PETS: '/cuenta/mis-mascotas',
  ORDERS: '/cuenta/pedidos',
  SUBSCRIPTIONS: '/cuenta/suscripciones',
} as const;

// Product Categories
export const CATEGORIES = [
  'Alimento',
  'Juguetes',
  'Accesorios',
  'Higiene',
  'Salud',
] as const;
