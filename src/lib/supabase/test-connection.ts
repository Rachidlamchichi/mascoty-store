/**
 * Test Supabase Connection
 * 
 * Este archivo contiene funciones para verificar la conexión con Supabase
 * Ejecutar desde un componente o API route para verificar
 */

import { createClient as createBrowserClient } from './client';

/**
 * Test básico de conexión
 */
export async function testConnection() {
  try {
    const supabase = createBrowserClient();
    
    // Intenta obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Conexión exitosa con Supabase');
    console.log('📊 Sesión:', session ? 'Usuario autenticado' : 'Sin sesión');
    
    return { success: true, session };
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

/**
 * Test de lectura de tablas
 */
export async function testTableAccess() {
  try {
    const supabase = createBrowserClient();
    
    // Intenta leer productos (tabla pública)
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error al acceder a tablas:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Acceso a tablas exitoso');
    console.log('📦 Productos en base de datos:', count);
    
    return { success: true, count };
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

/**
 * Verificar configuración de environment variables
 */
export function checkEnvironmentVariables() {
  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
  
  console.log('🔍 Verificación de variables de entorno:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', checks.supabaseUrl ? '✅' : '❌');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', checks.supabaseKey ? '✅' : '❌');
  
  const allValid = Object.values(checks).every(Boolean);
  
  if (allValid) {
    console.log('✅ Todas las variables configuradas correctamente');
  } else {
    console.log('❌ Faltan variables de entorno');
  }
  
  return { success: allValid, checks };
}

/**
 * Ejecutar todos los tests
 */
export async function runAllTests() {
  console.log('🧪 Iniciando tests de Supabase...\n');
  
  // 1. Check environment variables
  console.log('1️⃣ Variables de entorno:');
  const envCheck = checkEnvironmentVariables();
  console.log('');
  
  if (!envCheck.success) {
    console.log('⚠️ Configura las variables de entorno antes de continuar');
    return;
  }
  
  // 2. Test connection
  console.log('2️⃣ Test de conexión:');
  const connectionTest = await testConnection();
  console.log('');
  
  // 3. Test table access
  console.log('3️⃣ Test de acceso a tablas:');
  const tableTest = await testTableAccess();
  console.log('');
  
  console.log('✨ Tests completados');
  
  return {
    environment: envCheck,
    connection: connectionTest,
    tables: tableTest,
  };
}
