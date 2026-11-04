-- =============================================================================
-- CONDOLINK GLOBAL ENTERPRISE V20.8 - ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- Pegar y ejecutar este script en el SQL Editor de tu cuenta de Supabase
-- =============================================================================

-- 1. Tabla Espejo de Estado Unificado (Sincronización instantánea con dbService.js y codigo.gs)
CREATE TABLE IF NOT EXISTS public.clg_estado_unificado (
  entidad TEXT PRIMARY KEY,
  datos JSONB NOT NULL DEFAULT '[]'::jsonb,
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Configuración Global (CLG_Configuracion)
CREATE TABLE IF NOT EXISTS public.clg_configuracion (
  id TEXT PRIMARY KEY DEFAULT 'GLOBAL',
  app_name TEXT NOT NULL DEFAULT 'Condolink Global Enterprise',
  app_version TEXT NOT NULL DEFAULT 'V20.8',
  tasa_bcv TEXT NOT NULL DEFAULT '881.88',
  tasa_numerica NUMERIC(14,2) NOT NULL DEFAULT 881.88,
  moneda_base TEXT NOT NULL DEFAULT 'USD',
  moneda_local TEXT NOT NULL DEFAULT 'VES',
  sede TEXT NOT NULL DEFAULT 'Torre Charam, Caracas, Venezuela',
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Tenants / Inquilinos Corporativos (clg_tenants)
CREATE TABLE IF NOT EXISTS public.clg_tenants (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  rif TEXT,
  tipo TEXT DEFAULT 'ADMINISTRADORA',
  modalidad TEXT DEFAULT 'Contratación de Servicios (Licencia Activa 2 Años)',
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  estado TEXT DEFAULT 'ACTIVO',
  logo_url TEXT,
  rif_drive_url TEXT,
  fecha_vencimiento TEXT,
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Usuarios y Credenciales Únicas por Rol (clg_usuarios)
CREATE TABLE IF NOT EXISTS public.clg_usuarios (
  id TEXT PRIMARY KEY,
  usuario TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  pin TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  estado TEXT NOT NULL DEFAULT 'Activo',
  modalidad TEXT DEFAULT 'Contratación de Servicios',
  telefono TEXT,
  rif TEXT,
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Solicitudes de Prueba y Contratación de Servicios (clg_solicitudes)
CREATE TABLE IF NOT EXISTS public.clg_solicitudes (
  id TEXT PRIMARY KEY,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipo_solicitud TEXT NOT NULL,
  modalidad TEXT NOT NULL,
  rol_destino TEXT NOT NULL,
  instalador_destino TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rif TEXT,
  email TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  pin_registro TEXT NOT NULL,
  rif_drive_url TEXT,
  logo_drive_url TEXT,
  email_notificacion_master TEXT DEFAULT 'condolinkglobal@gmail.com',
  estado TEXT NOT NULL DEFAULT 'Pendiente de Aprobación Master',
  tenant_id_asignado TEXT,
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb
);

-- 6. Tabla de Empresas Administradoras (clg_administradores)
CREATE TABLE IF NOT EXISTS public.clg_administradores (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  nombre TEXT NOT NULL,
  rif TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  modalidad TEXT,
  pin TEXT,
  rif_drive_url TEXT,
  logo_url TEXT,
  estado TEXT DEFAULT 'ACTIVO',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tabla de Inversionistas (clg_inversionistas)
CREATE TABLE IF NOT EXISTS public.clg_inversionistas (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  nombre TEXT NOT NULL,
  rif TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  modalidad TEXT,
  pin TEXT,
  rif_drive_url TEXT,
  logo_url TEXT,
  estado TEXT DEFAULT 'ACTIVO',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabla de Juntas de Condominio (clg_juntas)
CREATE TABLE IF NOT EXISTS public.clg_juntas (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  nombre TEXT NOT NULL,
  rif TEXT,
  direccion TEXT,
  presidente TEXT,
  email TEXT,
  telefono TEXT,
  estado TEXT DEFAULT 'ACTIVO',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Tabla de Unidades Inmobiliarias / Propietarios (clg_unidades)
CREATE TABLE IF NOT EXISTS public.clg_unidades (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  junta_id TEXT,
  codigo TEXT NOT NULL,
  propietario TEXT NOT NULL,
  cedula_rif TEXT,
  email TEXT,
  telefono TEXT,
  alicuota NUMERIC(8,4) DEFAULT 0,
  saldo_usd NUMERIC(14,2) DEFAULT 0,
  estado TEXT DEFAULT 'SOLVENTE',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Tabla de Propiedades y Mercado Inmobiliario (clg_propiedades)
CREATE TABLE IF NOT EXISTS public.clg_propiedades (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  titulo TEXT NOT NULL,
  tipo_operacion TEXT DEFAULT 'VENTA',
  precio_usd NUMERIC(14,2) DEFAULT 0,
  ubicacion TEXT,
  contacto TEXT,
  destacado BOOLEAN DEFAULT FALSE,
  estado TEXT DEFAULT 'DISPONIBLE',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Tabla de Servicios Contratados y Proveedores (clg_servicios_contratados)
CREATE TABLE IF NOT EXISTS public.clg_servicios_contratados (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  proveedor TEXT NOT NULL,
  servicio TEXT NOT NULL,
  monto_usd NUMERIC(14,2) DEFAULT 0,
  estado TEXT DEFAULT 'ACTIVO',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Tabla de Libro Diario y Movimientos Contables (clg_libro_diario)
CREATE TABLE IF NOT EXISTS public.clg_libro_diario (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipo TEXT NOT NULL,
  concepto TEXT NOT NULL,
  referencia TEXT,
  monto_usd NUMERIC(14,2) DEFAULT 0,
  monto_ves NUMERIC(18,2) DEFAULT 0,
  tasa_bcv NUMERIC(14,2) DEFAULT 881.88,
  estado TEXT DEFAULT 'CONCILIADO',
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb
);

-- 13. Tabla de Mensajería y Comunicaciones (clg_mensajes)
CREATE TABLE IF NOT EXISTS public.clg_mensajes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  remitente TEXT NOT NULL,
  destinatario TEXT NOT NULL,
  asunto TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb
);

-- 14. Tabla de Auditoría y Telemetría (clg_auditoria)
CREATE TABLE IF NOT EXISTS public.clg_auditoria (
  id TEXT PRIMARY KEY,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tipo TEXT NOT NULL,
  modulo TEXT NOT NULL,
  usuario TEXT,
  tenant_id TEXT DEFAULT 'default',
  detalle TEXT,
  datos_extra JSONB DEFAULT '{}'::jsonb,
  payload JSONB DEFAULT '{}'::jsonb
);

-- Índices para consultas rápidas multi-tenant y login
CREATE INDEX IF NOT EXISTS idx_clg_usuarios_login ON public.clg_usuarios (LOWER(usuario), LOWER(email));
CREATE INDEX IF NOT EXISTS idx_clg_solicitudes_estado ON public.clg_solicitudes (estado);
CREATE INDEX IF NOT EXISTS idx_clg_unidades_tenant ON public.clg_unidades (tenant_id);
CREATE INDEX IF NOT EXISTS idx_clg_libro_diario_tenant ON public.clg_libro_diario (tenant_id);

-- Permisos de acceso PostgREST para service_role, authenticated y anon en el esquema public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

