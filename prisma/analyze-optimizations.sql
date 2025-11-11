-- ============================================
-- ANÁLISIS DE OPTIMIZACIONES
-- ============================================
-- Ejecuta este script para ver todas las optimizaciones aplicadas

-- ============================================
-- 1. LISTAR TODOS LOS ÍNDICES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE '📊 ÍNDICES CREADOS';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  tablename as "Tabla",
  indexname as "Índice",
  indexdef as "Definición"
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 2. CONTAR ÍNDICES POR TABLA
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🔢 ÍNDICES POR TABLA';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  tablename as "Tabla",
  COUNT(*) as "Total Índices"
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY COUNT(*) DESC;

-- ============================================
-- 3. LISTAR POLÍTICAS RLS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🔒 POLÍTICAS RLS (Row Level Security)';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  tablename as "Tabla",
  policyname as "Política",
  cmd as "Comando",
  CASE 
    WHEN permissive THEN 'Permisiva'
    ELSE 'Restrictiva'
  END as "Tipo"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 4. CONTAR POLÍTICAS POR TABLA
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🔢 POLÍTICAS RLS POR TABLA';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  tablename as "Tabla",
  COUNT(*) as "Total Políticas"
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY COUNT(*) DESC;

-- ============================================
-- 5. COLUMNAS CON TIMESTAMPS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '⏱️ TIMESTAMPS AUTOMÁTICOS';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  table_name as "Tabla",
  column_name as "Columna",
  data_type as "Tipo",
  column_default as "Default"
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (column_name IN ('created_at', 'updated_at', 'deleted_at'))
ORDER BY table_name, column_name;

-- ============================================
-- 6. TABLAS CON SOFT DELETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🗑️ SOFT DELETES IMPLEMENTADOS';
  RAISE NOTICE '===========================================';
END $$;

SELECT DISTINCT
  table_name as "Tabla con Soft Delete"
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'deleted_at'
ORDER BY table_name;

-- ============================================
-- 7. COLUMNAS CON FULL-TEXT SEARCH
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🔍 FULL-TEXT SEARCH CONFIGURADO';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  table_name as "Tabla",
  column_name as "Columna",
  data_type as "Tipo"
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'search_vector'
ORDER BY table_name;

-- ============================================
-- 8. TRIGGERS AUTOMÁTICOS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '⚡ TRIGGERS AUTOMÁTICOS';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  event_object_table as "Tabla",
  trigger_name as "Trigger",
  event_manipulation as "Evento",
  action_statement as "Acción"
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 9. FUNCIONES HELPER CREADAS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🛠️ FUNCIONES HELPER';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  routine_name as "Función",
  routine_type as "Tipo",
  data_type as "Retorna"
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%search%'
ORDER BY routine_name;

-- ============================================
-- 10. VIEWS DE PERFORMANCE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '📈 VIEWS DE PERFORMANCE';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  table_name as "View",
  view_definition as "Definición (primeros 100 chars)"
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 11. TAMAÑO DE TABLAS
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '💾 TAMAÑO DE TABLAS';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  schemaname as "Schema",
  tablename as "Tabla",
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS "Tamaño Total",
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS "Tamaño Tabla",
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS "Tamaño Índices"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- 12. ESTADÍSTICAS DE USO
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '📊 ESTADÍSTICAS DE USO DE TABLAS';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  schemaname as "Schema",
  relname as "Tabla",
  seq_scan as "Scans Secuenciales",
  idx_scan as "Scans con Índice",
  n_tup_ins as "Inserciones",
  n_tup_upd as "Actualizaciones",
  n_tup_del as "Eliminaciones"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;

-- ============================================
-- 13. PERFORMANCE DE ÍNDICES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '⚡ PERFORMANCE DE ÍNDICES';
  RAISE NOTICE '===========================================';
END $$;

SELECT 
  schemaname as "Schema",
  tablename as "Tabla",
  indexname as "Índice",
  idx_scan as "Veces Usado",
  idx_tup_read as "Tuplas Leídas",
  idx_tup_fetch as "Tuplas Obtenidas"
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ============================================
-- 14. RESUMEN FINAL
-- ============================================

DO $$
DECLARE
  total_indices INTEGER;
  total_politicas INTEGER;
  total_tablas INTEGER;
  total_triggers INTEGER;
  total_funciones INTEGER;
  total_views INTEGER;
BEGIN
  -- Contar índices
  SELECT COUNT(*) INTO total_indices
  FROM pg_indexes
  WHERE schemaname = 'public';
  
  -- Contar políticas RLS
  SELECT COUNT(*) INTO total_politicas
  FROM pg_policies
  WHERE schemaname = 'public';
  
  -- Contar tablas
  SELECT COUNT(*) INTO total_tablas
  FROM pg_tables
  WHERE schemaname = 'public';
  
  -- Contar triggers
  SELECT COUNT(*) INTO total_triggers
  FROM information_schema.triggers
  WHERE trigger_schema = 'public';
  
  -- Contar funciones
  SELECT COUNT(*) INTO total_funciones
  FROM information_schema.routines
  WHERE routine_schema = 'public';
  
  -- Contar views
  SELECT COUNT(*) INTO total_views
  FROM information_schema.views
  WHERE table_schema = 'public';
  
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '✨ RESUMEN DE OPTIMIZACIONES';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Total Tablas:        %', total_tablas;
  RAISE NOTICE '🔍 Total Índices:       %', total_indices;
  RAISE NOTICE '🔒 Total Políticas RLS: %', total_politicas;
  RAISE NOTICE '⚡ Total Triggers:      %', total_triggers;
  RAISE NOTICE '🛠️ Total Funciones:     %', total_funciones;
  RAISE NOTICE '📈 Total Views:         %', total_views;
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '🎉 BASE DE DATOS TOTALMENTE OPTIMIZADA!';
  RAISE NOTICE '===========================================';
END $$;

-- ============================================
-- 15. TEST DE BÚSQUEDA (si hay datos)
-- ============================================

DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  
  IF product_count > 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '🔍 TEST DE BÚSQUEDA FULL-TEXT';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Ejecuta: SELECT * FROM search_products(''perro'');';
    RAISE NOTICE 'Ejecuta: SELECT * FROM fuzzy_search_products(''comida'');';
    RAISE NOTICE 'Ejecuta: SELECT * FROM popular_products LIMIT 5;';
  END IF;
END $$;
