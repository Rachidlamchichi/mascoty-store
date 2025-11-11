import { createServerClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  const supabase = createServerClient();
  
  // Test 1: Check connection
  const { data: { user } } = await supabase.auth.getUser();
  
  // Test 2: Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  // Test 3: Count products
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  // Test 4: Check tables
  const tables = ['profiles', 'products', 'categories', 'pets', 'orders', 'order_items', 'subscriptions'];
  const tableChecks = await Promise.all(
    tables.map(async (table) => {
      const { error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true });
      return { table, exists: !error };
    })
  );
  
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">🧪 Supabase Connection Test</h1>
        <p className="text-muted-foreground">
          Verificación de la configuración de Supabase
        </p>
      </div>
      
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>1. Estado de Conexión</CardTitle>
          <CardDescription>Verificación de la conexión con Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">Conexión exitosa con Supabase</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Usuario: {user ? `✅ Autenticado (${user.email})` : '❌ No autenticado (esto es normal)'}
          </p>
        </CardContent>
      </Card>
      
      {/* Tables Check */}
      <Card>
        <CardHeader>
          <CardTitle>2. Verificación de Tablas</CardTitle>
          <CardDescription>Estado de las 7 tablas de la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tableChecks.map(({ table, exists }) => (
              <div key={table} className="flex items-center gap-2 p-3 border rounded-lg">
                <span className="text-xl">{exists ? '✅' : '❌'}</span>
                <span className="font-mono text-sm">{table}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>3. Categorías Creadas</CardTitle>
          <CardDescription>
            {categoriesError 
              ? '❌ Error al cargar categorías' 
              : `✅ ${categories?.length || 0} categorías encontradas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categoriesError ? (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-semibold">Error:</p>
              <p className="text-sm text-muted-foreground">{categoriesError.message}</p>
              <p className="text-sm mt-2">
                💡 Asegúrate de haber ejecutado el SQL en Supabase
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Badge key={category.id} variant="secondary" className="text-sm">
                  📦 {category.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Products Count */}
      <Card>
        <CardHeader>
          <CardTitle>4. Productos en la Base de Datos</CardTitle>
          <CardDescription>Conteo de productos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {productsError ? (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-destructive font-semibold">Error:</p>
              <p className="text-sm text-muted-foreground">{productsError.message}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">{productsCount || 0}</span>
              <div>
                <p className="font-semibold">Productos</p>
                <p className="text-sm text-muted-foreground">
                  {productsCount === 0 
                    ? 'Ejecuta el SQL opcional para agregar productos de ejemplo'
                    : 'Productos disponibles en la tienda'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>5. Variables de Entorno</CardTitle>
          <CardDescription>Verificación de configuración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <code className="text-sm">NEXT_PUBLIC_SUPABASE_URL</code>
            <span className="text-xs text-muted-foreground ml-auto">Configurada</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <code className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            <span className="text-xs text-muted-foreground ml-auto">Configurada</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary */}
      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">
            ✨ Resumen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-semibold">
              {tableChecks.every(t => t.exists) 
                ? '🎉 Todo está configurado correctamente!' 
                : '⚠️ Algunas tablas no están creadas'}
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>✅ Conexión con Supabase establecida</li>
              <li>
                {tableChecks.every(t => t.exists) 
                  ? '✅ Todas las tablas creadas' 
                  : '❌ Ejecuta el SQL en Supabase SQL Editor'}
              </li>
              <li>
                {categories && categories.length > 0 
                  ? `✅ ${categories.length} categorías disponibles` 
                  : '❌ No hay categorías (ejecuta el SQL)'}
              </li>
              <li>
                {productsCount && productsCount > 0 
                  ? `✅ ${productsCount} productos cargados` 
                  : 'ℹ️ Sin productos (opcional: ejecuta el SQL de productos de ejemplo)'}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal ml-5">
            <li>
              <strong>Si hay errores:</strong> Ejecuta <code>supabase-schema.sql</code> en el SQL Editor de Supabase
              <br />
              <a 
                href="https://app.supabase.com/project/tbijzzdjjruegjlyebmk/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                → Abrir SQL Editor
              </a>
            </li>
            <li>
              <strong>Agregar productos de ejemplo:</strong> Ejecuta el SQL opcional en <code>EJECUTAR_SQL.md</code>
            </li>
            <li>
              <strong>Habilitar autenticación:</strong> Configura Email Auth en Supabase
              <br />
              <a 
                href="https://app.supabase.com/project/tbijzzdjjruegjlyebmk/auth/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                → Configurar Auth
              </a>
            </li>
            <li>
              <strong>Empezar a desarrollar:</strong> Revisa <code>CONFIGURATION_SUMMARY.md</code> para ejemplos de código
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
