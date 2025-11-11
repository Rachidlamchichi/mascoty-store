import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Categories
  console.log('📂 Creating categories...');
  
  const perrosCategory = await prisma.category.create({
    data: {
      name: 'Perros',
      slug: 'perros',
      description: 'Productos para perros',
      icon: '🐕',
    },
  });

  const gatosCategory = await prisma.category.create({
    data: {
      name: 'Gatos',
      slug: 'gatos',
      description: 'Productos para gatos',
      icon: '🐈',
    },
  });

  const avesCategory = await prisma.category.create({
    data: {
      name: 'Aves',
      slug: 'aves',
      description: 'Productos para aves',
      icon: '🐦',
    },
  });

  const pecesCategory = await prisma.category.create({
    data: {
      name: 'Peces',
      slug: 'peces',
      description: 'Productos para peces',
      icon: '🐠',
    },
  });

  const otrosCategory = await prisma.category.create({
    data: {
      name: 'Otros',
      slug: 'otros',
      description: 'Productos para otras mascotas',
      icon: '🐹',
    },
  });

  // Create Subcategories for Perros
  const alimentosPerros = await prisma.category.create({
    data: {
      name: 'Alimentos',
      slug: 'perros-alimentos',
      description: 'Alimentos para perros',
      parent_id: perrosCategory.id,
    },
  });

  const accesoriosPerros = await prisma.category.create({
    data: {
      name: 'Accesorios',
      slug: 'perros-accesorios',
      description: 'Accesorios para perros',
      parent_id: perrosCategory.id,
    },
  });

  const juguetesPerros = await prisma.category.create({
    data: {
      name: 'Juguetes',
      slug: 'perros-juguetes',
      description: 'Juguetes para perros',
      parent_id: perrosCategory.id,
    },
  });

  // Create Products
  console.log('🛍️ Creating products...');

  const products = [
    {
      name: 'Alimento Premium para Perros Adultos',
      slug: 'alimento-premium-perros-adultos',
      description: 'Alimento balanceado premium para perros adultos de todas las razas. Rico en proteínas y nutrientes esenciales.',
      short_desc: 'Alimento balanceado premium para perros adultos',
      price: 49.99,
      original_price: 59.99,
      sku: 'DOG-FOOD-001',
      stock: 150,
      category_id: alimentosPerros.id,
      images: [
        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
      tags: ['perros', 'alimento', 'premium', 'adultos'],
      weight: 15.0,
      dimensions: '45x30x15cm',
    },
    {
      name: 'Collar Ajustable con LED',
      slug: 'collar-ajustable-led',
      description: 'Collar reflectante con luces LED recargables. Perfecto para paseos nocturnos. Resistente al agua.',
      short_desc: 'Collar LED recargable para paseos nocturnos',
      price: 24.99,
      original_price: 34.99,
      sku: 'DOG-ACC-001',
      stock: 80,
      category_id: accesoriosPerros.id,
      images: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
      tags: ['perros', 'collar', 'led', 'seguridad'],
      weight: 0.2,
    },
    {
      name: 'Pelota Interactiva con Dispensador',
      slug: 'pelota-interactiva-dispensador',
      description: 'Pelota interactiva que dispensa premios mientras tu perro juega. Mantiene a tu mascota entretenida y activa.',
      short_desc: 'Pelota con dispensador de premios',
      price: 19.99,
      sku: 'DOG-TOY-001',
      stock: 120,
      category_id: juguetesPerros.id,
      images: [
        'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
      tags: ['perros', 'juguetes', 'interactivo', 'premios'],
      weight: 0.3,
    },
    {
      name: 'Arena Premium para Gatos',
      slug: 'arena-premium-gatos',
      description: 'Arena aglomerante premium con control de olores. Extra absorbente y fácil de limpiar.',
      short_desc: 'Arena aglomerante con control de olores',
      price: 15.99,
      original_price: 19.99,
      sku: 'CAT-LIT-001',
      stock: 200,
      category_id: gatosCategory.id,
      images: [
        'https://images.unsplash.com/photo-1611003228941-98852ba62227',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1611003228941-98852ba62227',
      tags: ['gatos', 'arena', 'higiene'],
      weight: 10.0,
    },
    {
      name: 'Rascador Torre con Plataformas',
      slug: 'rascador-torre-plataformas',
      description: 'Torre rascadora con múltiples niveles, plataformas y escondites. Perfecta para gatos activos.',
      short_desc: 'Torre rascadora multinivel',
      price: 89.99,
      original_price: 119.99,
      sku: 'CAT-ACC-001',
      stock: 35,
      category_id: gatosCategory.id,
      images: [
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f',
      tags: ['gatos', 'rascador', 'torre', 'juegos'],
      weight: 12.0,
      dimensions: '60x60x150cm',
    },
    {
      name: 'Alimento para Peces Tropicales',
      slug: 'alimento-peces-tropicales',
      description: 'Alimento en escamas para peces tropicales. Fórmula balanceada con vitaminas.',
      short_desc: 'Escamas nutritivas para peces tropicales',
      price: 8.99,
      sku: 'FISH-FOOD-001',
      stock: 180,
      category_id: pecesCategory.id,
      images: [
        'https://images.unsplash.com/photo-1520990501695-615154d715d5',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1520990501695-615154d715d5',
      tags: ['peces', 'alimento', 'tropicales'],
      weight: 0.1,
    },
    {
      name: 'Jaula Grande para Aves',
      slug: 'jaula-grande-aves',
      description: 'Jaula espaciosa con múltiples perchas y comederos. Ideal para loros y cotorras.',
      short_desc: 'Jaula espaciosa para aves grandes',
      price: 129.99,
      original_price: 159.99,
      sku: 'BIRD-CAG-001',
      stock: 25,
      category_id: avesCategory.id,
      images: [
        'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      tags: ['aves', 'jaula', 'grande'],
      weight: 8.0,
      dimensions: '80x60x120cm',
    },
    {
      name: 'Hábitat Completo para Hámster',
      slug: 'habitat-completo-hamster',
      description: 'Hábitat completo con rueda, túneles, bebedero y comedero. Todo lo necesario para tu hámster.',
      short_desc: 'Kit completo para hámster',
      price: 45.99,
      sku: 'HAM-HAB-001',
      stock: 60,
      category_id: otrosCategory.id,
      images: [
        'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
      tags: ['hámster', 'hábitat', 'completo'],
      weight: 3.5,
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log(`📂 ${products.length} products created`);
  console.log(`📁 8 categories created`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
