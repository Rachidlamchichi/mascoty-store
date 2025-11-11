export default function ThemePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-bold text-mascoty-secondary mb-4">
            🎨 Paleta de Colores Mascoty
          </h1>
          <p className="font-sans text-lg text-muted-foreground">
            Guía visual de los colores del tema
          </p>
        </div>

        {/* Color Palette */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Primary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-primary"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Primary</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Naranja cálido - Energía y vitalidad
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-primary
              </code>
            </div>
          </div>

          {/* Secondary */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-secondary"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Secondary</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Azul confianza - Profesionalismo
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-secondary
              </code>
            </div>
          </div>

          {/* Accent */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-accent"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Accent</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Amarillo juguetón - Alegría
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-accent
              </code>
            </div>
          </div>

          {/* Success */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-success"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Success</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Verde éxito - Confirmaciones
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-success
              </code>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-warning"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Warning</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Naranja advertencia - Precaución
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-warning
              </code>
            </div>
          </div>

          {/* Danger */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="h-32 bg-mascoty-danger"></div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2">Danger</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Rojo peligro - Errores
              </p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                bg-mascoty-danger
              </code>
            </div>
          </div>
        </div>

        {/* Typography Examples */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-3xl font-bold text-mascoty-secondary mb-6">
            Tipografía
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Font Display (Poppins)</p>
              <h1 className="font-display text-4xl font-bold">
                The quick brown fox jumps
              </h1>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Font Sans (Inter)</p>
              <p className="font-sans text-lg">
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="space-y-8">
          <h2 className="font-display text-3xl font-bold text-mascoty-secondary">
            Ejemplos de Componentes
          </h2>

          {/* Buttons */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="font-display text-2xl font-bold mb-6">Botones</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-mascoty-primary hover:bg-mascoty-warning text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Primary Button
              </button>
              <button className="bg-mascoty-secondary hover:bg-mascoty-secondary/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Secondary Button
              </button>
              <button className="bg-mascoty-accent hover:bg-mascoty-accent/80 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                Accent Button
              </button>
              <button className="bg-mascoty-danger hover:bg-mascoty-danger/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Delete Button
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="font-display text-2xl font-bold mb-6">Alertas</h3>
            <div className="space-y-4">
              <div className="bg-mascoty-success/10 border-l-4 border-mascoty-success p-4 rounded">
                <p className="text-mascoty-success font-semibold">
                  ✅ ¡Operación completada exitosamente!
                </p>
              </div>
              <div className="bg-mascoty-warning/10 border-l-4 border-mascoty-warning p-4 rounded">
                <p className="text-mascoty-warning font-semibold">
                  ⚠️ Solo quedan 3 unidades en stock
                </p>
              </div>
              <div className="bg-mascoty-danger/10 border-l-4 border-mascoty-danger p-4 rounded">
                <p className="text-mascoty-danger font-semibold">
                  ❌ Error al procesar la solicitud
                </p>
              </div>
            </div>
          </div>

          {/* Product Card Example */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="font-display text-2xl font-bold mb-6">Card de Producto</h3>
            <div className="max-w-sm border-2 border-mascoty-primary/20 rounded-xl p-6 hover:border-mascoty-primary transition-colors">
              <div className="w-full h-48 bg-gradient-to-br from-mascoty-primary/20 to-mascoty-accent/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🐕</span>
              </div>
              <h4 className="font-display text-xl font-bold text-mascoty-secondary mb-2">
                Alimento Premium
              </h4>
              <p className="text-muted-foreground mb-4">
                Alimento balanceado para perros adultos. 15kg.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-mascoty-primary">$45.99</span>
                <button className="bg-mascoty-accent hover:bg-mascoty-warning text-black px-4 py-2 rounded-lg font-semibold transition-colors">
                  Comprar
                </button>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="font-display text-2xl font-bold mb-6">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1 bg-mascoty-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Destacado
              </span>
              <span className="inline-flex items-center gap-1 bg-mascoty-accent text-black px-3 py-1 rounded-full text-sm font-semibold">
                🎉 OFERTA -25%
              </span>
              <span className="inline-flex items-center gap-1 bg-mascoty-success text-white px-3 py-1 rounded-full text-sm font-semibold">
                ✓ En Stock
              </span>
              <span className="inline-flex items-center gap-1 bg-mascoty-warning text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⚡ Stock Bajo
              </span>
              <span className="inline-flex items-center gap-1 bg-mascoty-danger text-white px-3 py-1 rounded-full text-sm font-semibold">
                × Agotado
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-muted-foreground">
          <p className="font-sans">
            🐾 Mascoty Theme - Hecho con amor para las mascotas
          </p>
        </div>
      </div>
    </div>
  );
}
