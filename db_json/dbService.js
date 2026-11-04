// Condolink Global V20.8 - Unified Single-File JSON Database Service
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UNIFIED_DB_PATH = path.join(__dirname, 'base_datos_unificada.json');

const DEFAULT_DB = {
  _meta: {
    sistema: 'Condolink Global Enterprise V20.8',
    descripcion: 'Base de Datos JSON Unificada (13 tablas integradas en un solo archivo)',
    spreadsheetId: '1K_EiaARKQfucIqgC4_FnqBr1UwFGDKOOC-ks6i0Jh4c',
    driveFolderId: '1_GOZOLnHBMm_meTUQSpmsIqZeY1E4Jzl',
    fechaUnificacion: new Date().toISOString()
  },
  configuracion: {
    appName: 'Condolink Global Enterprise',
    appVersion: 'V20.8',
    tasaBCV: '445.78',
    tasaNumerica: 445.78,
    monedaBase: 'USD',
    monedaLocal: 'VES',
    sede: 'Torre Charam, Caracas, Venezuela'
  },
  usuarios: [],
  tenants: [],
  propiedades: [],
  juntas: [],
  unidades: [],
  solicitudes: [],
  servicios_contratados: [],
  auditoria: [],
  libro_diario: [],
  mensajes: [],
  administradores: [],
  inversionistas: []
};

function loadFullDb() {
  try {
    if (!fs.existsSync(UNIFIED_DB_PATH)) {
      fs.writeFileSync(UNIFIED_DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    const raw = fs.readFileSync(UNIFIED_DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[DB_UNIFICADA Error reading base_datos_unificada.json]:', error);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

function saveFullDb(db) {
  try {
    if (db._meta) {
      db._meta.ultimaActualizacion = new Date().toISOString();
    }
    fs.writeFileSync(UNIFIED_DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('[DB_UNIFICADA Error writing base_datos_unificada.json]:', error);
    return false;
  }
}

function readEntity(key, defaultValue) {
  const db = loadFullDb();
  if (db[key] === undefined) {
    db[key] = defaultValue;
    saveFullDb(db);
  }
  return db[key];
}

// Native Supabase PostgREST + Storage connector (activates automatically when SUPABASE_URL & SUPABASE_KEY are set)
const SUPABASE_BUCKET = 'condolink-db-v208';
let _bucketEnsured = false;

function getSupabaseConfig() {
  const url = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
  return { enabled: Boolean(url && key && url.startsWith('http')), url, key };
}

async function ensureSupabaseBucket() {
  if (_bucketEnsured) return true;
  const supa = getSupabaseConfig();
  if (!supa.enabled) return false;
  try {
    const res = await fetch(`${supa.url}/storage/v1/bucket/${SUPABASE_BUCKET}`, {
      headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` }
    });
    if (res.ok) {
      _bucketEnsured = true;
      return true;
    }
    const createRes = await fetch(`${supa.url}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: SUPABASE_BUCKET, name: SUPABASE_BUCKET, public: false })
    });
    _bucketEnsured = createRes.ok;
    return createRes.ok;
  } catch {
    return false;
  }
}

function mapRecordToRelationalRow(key, item) {
  if (!item || typeof item !== 'object') return null;
  const id = String(item.id || item.ID || `${key.toUpperCase().slice(0, 3)}-${Date.now()}`);
  switch (key) {
    case 'configuracion':
      return {
        id: 'GLOBAL',
        app_name: String(item.appName || 'Condolink Global Enterprise'),
        app_version: String(item.appVersion || 'V20.8'),
        tasa_bcv: String(item.tasaBCV || '445.78'),
        tasa_numerica: Number(item.tasaNumerica || 445.78),
        moneda_base: String(item.monedaBase || 'USD'),
        moneda_local: String(item.monedaLocal || 'VES'),
        sede: String(item.sede || 'Torre Charam, Caracas, Venezuela'),
        actualizado_en: new Date().toISOString()
      };
    case 'tenants':
      return {
        id,
        nombre: String(item.nombre || 'Tenant Condolink'),
        rif: String(item.rif || ''),
        tipo: String(item.tipo || 'CONDOMINIO'),
        modalidad: String(item.modalidad || 'Contratación de Servicios'),
        email: String(item.email || ''),
        telefono: String(item.telefono || ''),
        direccion: String(item.direccion || ''),
        estado: item.activo === false ? 'INACTIVO' : 'ACTIVO',
        logo_url: String(item.logoUrl || ''),
        rif_drive_url: String(item.rifDriveUrl || ''),
        datos_extra: item,
        payload: item
      };
    case 'usuarios':
      return {
        id,
        usuario: String(item.usuario || item.email || id).toLowerCase(),
        email: String(item.email || ''),
        pin: String(item.pin || ''),
        nombre: String(item.nombre || 'Usuario Condolink'),
        rol: String(item.rol || 'admin'),
        tenant_id: String(item.tenant_id || 'default'),
        estado: String(item.estado || 'Activo'),
        modalidad: String(item.modalidad || 'Contratación de Servicios'),
        telefono: String(item.telefono || ''),
        rif: String(item.rif || ''),
        datos_extra: item,
        payload: item
      };
    case 'solicitudes':
      return {
        id,
        tipo_solicitud: String(item.tipoSolicitud || 'Contratar Servicio'),
        modalidad: String(item.modalidadServicio || item.tipoSolicitud || 'Contratar Servicio'),
        rol_destino: String(item.rol || 'Administrador'),
        instalador_destino: String(item.instaladorDestino || 'instalador_tenant_admin_master'),
        nombre: String(item.nombre || 'Solicitante'),
        rif: String(item.rif || ''),
        email: String(item.email || ''),
        telefono: String(item.telefono || ''),
        direccion: String(item.direccion || ''),
        pin_registro: String(item.pin || ''),
        rif_drive_url: String(item.urlRifDrive || ''),
        logo_drive_url: String(item.urlLogoDrive || ''),
        estado: String(item.estado || 'Pendiente'),
        datos_extra: item,
        payload: item
      };
    case 'administradores':
      return {
        id,
        tenant_id: String(item.tenant_id || 'CLG_TENANT_ADMIN'),
        nombre: String(item.nombre || 'Administradora'),
        rif: String(item.cedula || item.rif || ''),
        email: String(item.correo || item.email || ''),
        telefono: String(item.telefono || ''),
        direccion: String(item.apellido || item.direccion || ''),
        modalidad: String(item.modalidadServicio || 'Contratación de Servicios'),
        rif_drive_url: String(item.rifDriveUrl || ''),
        logo_url: String(item.logoUrl || ''),
        estado: String(item.estatus || 'ACTIVO'),
        datos_extra: item,
        payload: item
      };
    case 'inversionistas':
      return {
        id,
        tenant_id: String(item.tenant_id || 'CLG_INV_01'),
        nombre: String(item.nombre || 'Inversionista'),
        rif: String(item.rif || ''),
        email: String(item.correo || item.email || ''),
        telefono: String(item.telefono || ''),
        logo_url: String(item.logoUrl || ''),
        rif_drive_url: String(item.rifDriveUrl || ''),
        estado: String(item.estado || 'ACTIVO'),
        datos_extra: item,
        payload: item
      };
    case 'juntas':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        nombre: String(item.nombreJunta || item.condominio || 'Junta de Condominio'),
        rif: String(item.rif || ''),
        direccion: String(item.direccion || ''),
        estado: String(item.estado || 'ACTIVO'),
        datos_extra: item,
        payload: item
      };
    case 'unidades':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        junta_id: String(item.junta_id || ''),
        codigo: String(item.codigoUnidad || 'U-01'),
        propietario: String(item.nombrePropietario || 'Propietario'),
        email: String(item.emailPropietario || ''),
        telefono: String(item.telefonoPropietario || ''),
        alicuota: Number(item.alicuota || 0),
        saldo_usd: Number(item.saldoUsd || 0),
        estado: String(item.estadoSolvencia || 'SOLVENTE'),
        datos_extra: item,
        payload: item
      };
    case 'propiedades':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        titulo: String(item.nombre || item.titulo || 'Propiedad'),
        tipo_operacion: String(item.tipo || 'CONDOMINIO'),
        precio_usd: Number(item.precio || 0),
        ubicacion: String(item.direccion || ''),
        estado: String(item.estadoOperativo || 'ACTIVO'),
        datos_extra: item,
        payload: item
      };
    case 'servicios_contratados':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        proveedor: String(item.proveedor || 'Proveedor'),
        servicio: String(item.categoria || 'Servicio'),
        monto_usd: Number(item.costoMensual || 0),
        estado: String(item.estado || 'ACTIVO'),
        datos_extra: item,
        payload: item
      };
    case 'libro_diario':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        tipo: String(item.cuentaDebe || 'ASIENTO'),
        concepto: String(item.concepto || 'Asiento contable'),
        referencia: String(item.codigoDebe || ''),
        monto_usd: Number(item.montoUsd || 0),
        monto_ves: Number(item.montoVes || 0),
        tasa_bcv: Number(item.tasaBcv || 445.78),
        estado: 'CONCILIADO',
        datos_extra: item,
        payload: item
      };
    case 'mensajes':
      return {
        id,
        tenant_id: String(item.tenant_id || 'default'),
        remitente: String(item.emisor || item.autor || 'SISTEMA'),
        destinatario: String(item.canal || 'JUNTA'),
        asunto: String(item.canal || 'NOTIFICACION'),
        mensaje: String(item.texto || ''),
        leido: Boolean(item.leido),
        datos_extra: item,
        payload: item
      };
    case 'auditoria':
      return {
        id,
        tipo: String(item.tipo || 'INFO'),
        modulo: String(item.modulo || 'SISTEMA'),
        usuario: String(item.usuario || 'SISTEMA'),
        tenant_id: String(item.tenant_id || 'default'),
        detalle: String(item.detalle || ''),
        datos_extra: item,
        payload: item
      };
    default:
      return null;
  }
}

async function syncUsersToSupabaseAuth(usuariosList) {
  const supa = getSupabaseConfig();
  if (!supa.enabled || !Array.isArray(usuariosList)) return { synced: 0, total: 0 };
  try {
    const listRes = await fetch(`${supa.url}/auth/v1/admin/users?per_page=200`, {
      headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` }
    });
    if (!listRes.ok) return { synced: 0, total: usuariosList.length };
    const listData = await listRes.json();
    const existingUsers = Array.isArray(listData.users) ? listData.users : [];
    const byEmail = new Map();
    for (const eu of existingUsers) {
      if (eu && eu.email) byEmail.set(String(eu.email).toLowerCase(), eu);
    }

    let syncedCount = 0;
    for (const u of usuariosList) {
      if (!u) continue;
      const cleanUser = String(u.usuario || 'user').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
      const rawEmail = String(u.email || '').trim().toLowerCase();
      const validEmail = (rawEmail && rawEmail.includes('@') && rawEmail.includes('.'))
        ? rawEmail
        : `${cleanUser || 'usuario'}@condolinkglobal.com`;
      const pinStr = String(u.pin || '123456').trim();
      const password = pinStr.length >= 6 ? pinStr : `CLG#${pinStr.padEnd(4, '0')}`;
      const metadata = {
        clg_id: u.id,
        usuario: u.usuario || cleanUser,
        nombre: u.nombre || 'Usuario Condolink',
        rol: u.rol || 'admin',
        pin: pinStr,
        tenant_id: u.tenant_id || 'default',
        estado: u.estado || 'Activo',
        payload: u
      };

      const existing = byEmail.get(validEmail);
      if (existing) {
        const upRes = await fetch(`${supa.url}/auth/v1/admin/users/${existing.id}`, {
          method: 'PUT',
          headers: {
            'apikey': supa.key,
            'Authorization': `Bearer ${supa.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password,
            email_confirm: true,
            user_metadata: metadata
          })
        });
        if (upRes.ok) syncedCount++;
      } else {
        const crRes = await fetch(`${supa.url}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            'apikey': supa.key,
            'Authorization': `Bearer ${supa.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: validEmail,
            password,
            email_confirm: true,
            user_metadata: metadata
          })
        });
        if (crRes.ok) {
          const created = await crRes.json();
          byEmail.set(validEmail, created);
          syncedCount++;
        }
      }
    }
    return { synced: syncedCount, total: usuariosList.length };
  } catch (err) {
    return { synced: 0, total: usuariosList.length, error: err.message };
  }
}

async function pushEntityToSupabase(key, data) {
  const supa = getSupabaseConfig();
  if (!supa.enabled) return { ok: false };
  let pgSynced = false;
  let relationalSynced = false;
  let storageSynced = false;
  let authSynced = false;

  if (key === 'usuarios' && Array.isArray(data)) {
    const authRes = await syncUsersToSupabaseAuth(data);
    authSynced = authRes.synced > 0;
  }

  try {
    // 1. Upsert into typed relational PostgreSQL table public.clg_<key> with payload JSONB backup
    const items = Array.isArray(data) ? data : (data && typeof data === 'object' ? [data] : []);
    const mappedRows = items.map(item => mapRecordToRelationalRow(key, item)).filter(Boolean);
    if (mappedRows.length > 0) {
      const relRes = await fetch(`${supa.url}/rest/v1/clg_${key}`, {
        method: 'POST',
        headers: {
          'apikey': supa.key,
          'Authorization': `Bearer ${supa.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(mappedRows)
      });
      relationalSynced = relRes.ok;
    }
  } catch {}

  try {
    // 2. Upsert into mirror state PostgreSQL table public.clg_estado_unificado
    const pgRes = await fetch(`${supa.url}/rest/v1/clg_estado_unificado`, {
      method: 'POST',
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        entidad: key,
        datos: data,
        actualizado_en: new Date().toISOString()
      })
    });
    pgSynced = pgRes.ok;
  } catch {}

  try {
    // 3. Always mirror entity + unified DB to Supabase Cloud Storage bucket condolink-db-v208
    await ensureSupabaseBucket();
    const stRes = await fetch(`${supa.url}/storage/v1/object/${SUPABASE_BUCKET}/${key}.json`, {
      method: 'POST',
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true'
      },
      body: JSON.stringify(data, null, 2)
    });
    storageSynced = stRes.ok;

    // Also update unified snapshot in Supabase Storage
    const fullDb = loadFullDb();
    await fetch(`${supa.url}/storage/v1/object/${SUPABASE_BUCKET}/base_datos_unificada.json`, {
      method: 'POST',
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true'
      },
      body: JSON.stringify(fullDb, null, 2)
    });
  } catch {}

  return { ok: relationalSynced || pgSynced || storageSynced || authSynced, relationalSynced, pgSynced, storageSynced, authSynced };
}

let _lastBcvSyncAt = 0;
let _bcvSyncPromise = null;

async function fetchLiveBcvRateFromApis() {
  const endpoints = [
    'https://ve.dolarapi.com/v1/dolares/oficial',
    'https://ve.dolarapi.com/v1/dolares',
    'https://open.er-api.com/v6/latest/USD'
  ];
  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const data = await res.json();
      let rawVal = null;
      if (Array.isArray(data)) {
        const oficial = data.find(d => d && (d.fuente === 'oficial' || String(d.nombre || '').toLowerCase().includes('oficial') || String(d.nombre || '').toLowerCase().includes('bcv'))) || data[0];
        rawVal = oficial ? (oficial.promedio || oficial.venta || oficial.price) : null;
      } else if (data && typeof data === 'object') {
        rawVal = data.promedio || data.price || data.venta || (data.rates && data.rates.VES);
      }
      const num = Number(rawVal);
      if (!isNaN(num) && num > 1) {
        const rounded = Math.round(num * 100) / 100;
        return {
          ok: true,
          tasaNumerica: rounded,
          tasaBCV: rounded.toFixed(2),
          fuente: url,
          fechaActualizacion: (data && data.fechaActualizacion) || new Date().toISOString()
        };
      }
    } catch {}
  }
  return { ok: false };
}

async function sincronizarTasaBCVEnVivo(force = false) {
  const now = Date.now();
  if (!force && now - _lastBcvSyncAt < 60000) {
    const cfg = readEntity('configuracion', DEFAULT_DB.configuracion);
    return {
      ok: true,
      tasa: cfg.tasaBCV,
      tasaNumerica: Number(cfg.tasaNumerica || cfg.tasaBCV || 889.26),
      origen: cfg.origenTasa || 'BCV Oficial (Cache Activo)',
      timestamp: cfg.fechaActualizacion || new Date().toISOString()
    };
  }
  if (_bcvSyncPromise) return _bcvSyncPromise;

  _bcvSyncPromise = (async () => {
    try {
      const live = await fetchLiveBcvRateFromApis();
      const current = readEntity('configuracion', DEFAULT_DB.configuracion);
      if (live.ok) {
        _lastBcvSyncAt = Date.now();
        const changed = String(current.tasaBCV) !== String(live.tasaBCV);
        const updated = {
          ...current,
          tasaBCV: live.tasaBCV,
          tasaNumerica: live.tasaNumerica,
          origenTasa: `BCV Oficial Automático (${live.fuente})`,
          fechaActualizacion: new Date().toISOString()
        };
        if (changed || !current.origenTasa) {
          writeEntity('configuracion', updated);
        }
        return {
          ok: true,
          tasa: updated.tasaBCV,
          tasaNumerica: updated.tasaNumerica,
          origen: updated.origenTasa,
          timestamp: updated.fechaActualizacion
        };
      }
      return {
        ok: true,
        tasa: current.tasaBCV,
        tasaNumerica: Number(current.tasaNumerica || current.tasaBCV || 889.26),
        origen: current.origenTasa || 'db_json/configuracion.json',
        timestamp: current.fechaActualizacion || new Date().toISOString()
      };
    } finally {
      _bcvSyncPromise = null;
    }
  })();

  return _bcvSyncPromise;
}

function mergeUsersLists(localUsers = [], remoteUsers = []) {
  const map = new Map();
  const makeKey = (u) => {
    if (!u) return '';
    const email = String(u.email || u.correo || '').trim().toLowerCase();
    const usr = String(u.usuario || '').trim().toLowerCase();
    return email || usr || String(u.id || '');
  };
  for (const u of remoteUsers) {
    const k = makeKey(u);
    if (k) map.set(k, { ...u });
  }
  for (const u of localUsers) {
    const k = makeKey(u);
    if (!k) continue;
    const prev = map.get(k) || {};
    map.set(k, { ...prev, ...u });
  }
  return Array.from(map.values());
}

async function fetchUsersFromSupabaseRemote() {
  const supa = getSupabaseConfig();
  if (!supa.enabled) return [];
  const collected = [];

  // 1. Check PostgreSQL table public.clg_usuarios
  try {
    const r = await fetch(`${supa.url}/rest/v1/clg_usuarios?select=*`, {
      headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` }
    });
    if (r.ok) {
      const rows = await r.json();
      if (Array.isArray(rows)) {
        for (const row of rows) {
          const extra = (row.payload && typeof row.payload === 'object') ? row.payload : ((row.datos_extra && typeof row.datos_extra === 'object') ? row.datos_extra : {});
          collected.push({
            ...extra,
            id: row.id || extra.id,
            usuario: row.usuario || extra.usuario || String(row.email || '').split('@')[0],
            email: row.email || extra.email || '',
            pin: String(row.pin || extra.pin || '').trim(),
            nombre: row.nombre || extra.nombre || 'Usuario Condolink',
            rol: row.rol || extra.rol || 'propietario',
            tenant_id: row.tenant_id || extra.tenant_id || 'default',
            estado: row.estado || extra.estado || 'Activo'
          });
        }
      }
    }
  } catch {}

  // 2. Check Supabase Auth users (/auth/v1/admin/users) where CLG_usuario records are stored in user_metadata
  try {
    const authRes = await fetch(`${supa.url}/auth/v1/admin/users?per_page=1000`, {
      headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` }
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      const users = Array.isArray(authData.users) ? authData.users : [];
      for (const au of users) {
        const meta = au.user_metadata || {};
        const payload = (meta.payload && typeof meta.payload === 'object') ? meta.payload : {};
        const pin = String(meta.pin || payload.pin || '').trim();
        if (!pin && !meta.usuario && !payload.usuario) continue;
        collected.push({
          ...payload,
          id: payload.id || meta.clg_id || au.id,
          email: String(payload.email || au.email || '').trim().toLowerCase(),
          usuario: String(payload.usuario || meta.usuario || String(au.email || '').split('@')[0]).trim().toLowerCase(),
          nombre: payload.nombre || meta.nombre || 'Usuario Condolink',
          rol: payload.rol || meta.rol || 'propietario',
          pin: pin,
          tenant_id: payload.tenant_id || meta.tenant_id || 'default',
          junta_id: payload.junta_id || payload.tenant_id || meta.tenant_id || '',
          estado: payload.estado || meta.estado || 'Activo',
          fechaRegistro: payload.fechaRegistro || au.created_at || new Date().toISOString()
        });
      }
    }
  } catch {}

  return collected;
}

async function pullFullDbFromSupabase() {
  const supa = getSupabaseConfig();
  if (!supa.enabled) return { synced: false, reason: 'SUPABASE_URL / SUPABASE_KEY not configured' };
  try {
    const db = loadFullDb();

    // 0. Pull all users from Supabase Auth & clg_usuarios first so we NEVER lose remote CLG_usuario records
    const remoteUsers = await fetchUsersFromSupabaseRemote();
    if (remoteUsers.length > 0) {
      db.usuarios = mergeUsersLists(db.usuarios || [], remoteUsers);
      saveFullDb(db);
      try {
        fs.writeFileSync(path.join(__dirname, 'usuarios.json'), JSON.stringify(db.usuarios, null, 2), 'utf8');
      } catch {}
    }

    // Sync all Condolink users into PostgreSQL auth.users
    const authSyncResult = await syncUsersToSupabaseAuth(db.usuarios || []);

    // 1. Check PostgreSQL table public.clg_estado_unificado
    const res = await fetch(`${supa.url}/rest/v1/clg_estado_unificado?select=entidad,datos`, {
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`
      }
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          if (row && row.entidad && row.datos !== undefined) {
            if (row.entidad === 'usuarios') {
              db.usuarios = mergeUsersLists(db.usuarios || [], Array.isArray(row.datos) ? row.datos : []);
            } else {
              db[row.entidad] = row.datos;
            }
          }
        }
        saveFullDb(db);
        const keys = Object.keys(DEFAULT_DB).filter(k => k !== '_meta');
        for (const k of keys) {
          await pushEntityToSupabase(k, db[k]);
        }
        return {
          synced: true,
          mode: 'PostgreSQL Relacional (clg_*) + Auth + Storage Activo',
          entitiesUpdated: rows.length,
          authUsersSynced: authSyncResult.synced
        };
      }
      const keys = Object.keys(DEFAULT_DB).filter(k => k !== '_meta');
      for (const k of keys) {
        await pushEntityToSupabase(k, db[k]);
      }
      return {
        synced: true,
        mode: 'PostgreSQL Relacional + Auth + Storage Inicializado',
        seededRemote: keys.length,
        authUsersSynced: authSyncResult.synced
      };
    }

    // 2. Sync all 13 entities to Supabase Storage bucket + PostgreSQL auth.users immediately
    await ensureSupabaseBucket();
    const keys = Object.keys(DEFAULT_DB).filter(k => k !== '_meta');
    let pushedCount = 0;
    for (const k of keys) {
      const r = await pushEntityToSupabase(k, db[k]);
      if (r.storageSynced) pushedCount++;
    }

    return {
      synced: pushedCount > 0,
      mode: 'Supabase PostgreSQL Auth + Cloud Storage Activo (13 Entidades Sincronizadas)',
      bucket: SUPABASE_BUCKET,
      entitiesSyncedToSupabase: pushedCount,
      authUsersSynced: authSyncResult.synced
    };
  } catch (err) {
    return { synced: false, error: err.message };
  }
}

function writeEntity(key, data) {
  const db = loadFullDb();
  db[key] = data;
  const saved = saveFullDb(db);
  try {
    // Also keep individual /db_json/<key>.json file synchronized locally
    const entityFilePath = path.join(__dirname, `${key}.json`);
    fs.writeFileSync(entityFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
  // Asynchronous mirror to Supabase in real time
  pushEntityToSupabase(key, data).catch(() => {});
  return saved;
}

// Perform initial background hydration/seed & live BCV rate sync
pullFullDbFromSupabase().catch(() => {});
sincronizarTasaBCVEnVivo(true).catch(() => {});
setInterval(() => {
  sincronizarTasaBCVEnVivo(true).catch(() => {});
}, 300000);

function matchUserCredentialsInList(usuarios, usuarioOrEmail, pin) {
  const cleanUser = String(usuarioOrEmail || '').trim().toLowerCase();
  const cleanPin = String(pin || '').trim().toLowerCase();
  if (!cleanUser || !cleanPin || !Array.isArray(usuarios)) return null;
  const cleanUserPrefix = cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser;

  return usuarios.find(u => {
    if (!u) return false;
    const uPin = String(u.pin || u.PIN || u.clave || '').trim().toLowerCase();
    if (!uPin || uPin !== cleanPin) return false;

    const uEmail = String(u.email || u.correo || '').trim().toLowerCase();
    const uEmailPrefix = uEmail.includes('@') ? uEmail.split('@')[0] : uEmail;
    const uLogin = String(u.usuario || '').trim().toLowerCase();
    const uLoginPrefix = uLogin.includes('@') ? uLogin.split('@')[0] : uLogin;
    const uNombre = String(u.nombre || '').trim().toLowerCase();
    const uNombrePila = String(u.nombrePila || '').trim().toLowerCase();
    const uId = String(u.id || '').trim().toLowerCase();
    const uCedula = String(u.cedula || u.rif || '').trim().toLowerCase();

    return (
      uEmail === cleanUser ||
      uLogin === cleanUser ||
      uNombre === cleanUser ||
      uNombrePila === cleanUser ||
      uId === cleanUser ||
      (uCedula && uCedula === cleanUser) ||
      (uEmailPrefix && uEmailPrefix === cleanUserPrefix) ||
      (uLoginPrefix && uLoginPrefix === cleanUserPrefix)
    );
  }) || null;
}

export const dbService = {
  getFullDatabase() {
    return loadFullDb();
  },

  async sincronizarTasaBCVEnVivo(force = false) {
    return await sincronizarTasaBCVEnVivo(force);
  },

  getSupabaseStatus() {
    const supa = getSupabaseConfig();
    return {
      configured: supa.enabled,
      projectUrl: supa.enabled ? supa.url : null
    };
  },

  async syncWithSupabase() {
    return await pullFullDbFromSupabase();
  },

  async testSupabaseConnection() {
    const supa = getSupabaseConfig();
    if (!supa.enabled) {
      return { ok: false, configured: false, error: 'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados' };
    }
    try {
      const [restRes, authRes, storageRes] = await Promise.all([
        fetch(`${supa.url}/rest/v1/`, { headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` } }),
        fetch(`${supa.url}/auth/v1/admin/users?per_page=200`, { headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}` } }),
        fetch(`${supa.url}/storage/v1/object/list/${SUPABASE_BUCKET}`, {
          method: 'POST',
          headers: { 'apikey': supa.key, 'Authorization': `Bearer ${supa.key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefix: '' })
        })
      ]);

      const openApi = restRes.ok ? await restRes.json() : {};
      const publicTables = Object.keys(openApi.paths || {}).filter(p => p !== '/').map(p => p.replace(/^\//, ''));
      const authData = authRes.ok ? await authRes.json() : { users: [] };
      const storageObjects = storageRes.ok ? await storageRes.json() : [];

      return {
        ok: restRes.ok || authRes.ok || storageRes.ok,
        configured: true,
        projectUrl: supa.url,
        postgrestReachable: restRes.ok,
        publicSqlTablesCount: publicTables.length,
        publicSqlTables: publicTables,
        postgresAuthUsersCount: Array.isArray(authData.users) ? authData.users.length : 0,
        postgresAuthUsers: Array.isArray(authData.users)
          ? authData.users.map(u => ({
              id: u.id,
              email: u.email,
              rol: u.user_metadata?.rol || 'admin',
              usuario: u.user_metadata?.usuario || u.email,
              nombre: u.user_metadata?.nombre || ''
            }))
          : [],
        storageBucket: SUPABASE_BUCKET,
        storageFilesCount: Array.isArray(storageObjects) ? storageObjects.length : 0,
        storageFiles: Array.isArray(storageObjects) ? storageObjects.map(o => o.name) : [],
        sqlEditorUrl: `https://supabase.com/dashboard/project/${supa.url.split('//')[1]?.split('.')[0] || ''}/sql/new`,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return { ok: false, configured: true, projectUrl: supa.url, error: err.message };
    }
  },

  // CONFIGURACIÓN (CLG_Configuracion)
  getConfiguracion() {
    return readEntity('configuracion', DEFAULT_DB.configuracion);
  },

  updateConfiguracion(updates) {
    const current = this.getConfiguracion();
    const updated = {
      ...current,
      ...updates,
      fechaActualizacion: new Date().toISOString()
    };
    writeEntity('configuracion', updated);
    return updated;
  },

  // TENANTS (Multi-tenant isolation)
  getTenants() {
    return readEntity('tenants', []);
  },

  getTenantById(id) {
    const tenants = this.getTenants();
    return tenants.find(t => String(t.id).toUpperCase() === String(id).toUpperCase()) || null;
  },

  saveTenant(tenant) {
    const tenants = this.getTenants();
    const id = tenant.id || ('TENANT-' + Date.now().toString().slice(-6));
    const idx = tenants.findIndex(t => t.id === id);

    const record = {
      id: id,
      nombre: tenant.nombre || 'Nuevo Tenant',
      rif: tenant.rif || 'J-00000000-0',
      direccion: tenant.direccion || '',
      telefono: tenant.telefono || '',
      email: tenant.email || '',
      tipo: tenant.tipo || 'CONDOMINIO',
      activo: tenant.activo !== false,
      logoUrl: tenant.logoUrl || 'https://i.imgur.com/XcMwIDa.png',
      fechaCreacion: tenant.fechaCreacion || new Date().toISOString()
    };

    if (idx !== -1) {
      tenants[idx] = { ...tenants[idx], ...record };
    } else {
      tenants.push(record);
    }
    writeEntity('tenants', tenants);
    return record;
  },

  // USUARIOS (CLG_Usuario)
  getUsuarios() {
    const dbUsers = readEntity('usuarios', []);
    try {
      const fileUsersPath = path.join(__dirname, 'usuarios.json');
      if (fs.existsSync(fileUsersPath)) {
        const fileUsers = JSON.parse(fs.readFileSync(fileUsersPath, 'utf8'));
        if (Array.isArray(fileUsers) && fileUsers.length > dbUsers.length) {
          const merged = mergeUsersLists(dbUsers, fileUsers);
          const db = loadFullDb();
          db.usuarios = merged;
          saveFullDb(db);
          return merged;
        }
      }
    } catch {}
    return dbUsers;
  },

  getUsuarioById(id) {
    const usuarios = this.getUsuarios();
    return usuarios.find(u => u.id === id) || null;
  },

  generarPinUnico() {
    const usuarios = this.getUsuarios();
    const pinesUsados = new Set(usuarios.map(u => String(u.pin || '').trim()));
    let intento = '';
    let guard = 0;
    do {
      const num = Math.floor(1000 + Math.random() * 9000);
      intento = String(num);
      guard++;
    } while (pinesUsados.has(intento) && guard < 9000);
    return intento;
  },

  getUsuarioByCredentials(usuarioOrEmail, pin) {
    const cleanUser = String(usuarioOrEmail || '').trim().toLowerCase();
    const cleanPin = String(pin || '').trim();
    if (!cleanUser || !cleanPin) return null;

    // 1. Search in CLG_Usuario (usuarios)
    const usuarios = this.getUsuarios();
    const matched = matchUserCredentialsInList(usuarios, cleanUser, cleanPin);
    if (matched) return matched;

    // 2. Also check Unidades (propietarios configured in CLG_Unidades)
    const unidades = this.getUnidades();
    const uniMatch = unidades.find(u => {
      const uPin = String(u.pinAcceso || u.pin || '').trim().toLowerCase();
      if (!uPin || uPin !== cleanPin.toLowerCase()) return false;
      const uMail = String(u.emailPropietario || '').trim().toLowerCase();
      const uAsig = String(u.usuarioAsignado || '').trim().toLowerCase();
      const uNom = String(u.nombrePropietario || '').trim().toLowerCase();
      const uCod = String(u.codigoUnidad || '').trim().toLowerCase();
      return uMail === cleanUser || uAsig === cleanUser || uNom === cleanUser || uCod === cleanUser || (uMail && uMail.split('@')[0] === cleanUser);
    });
    if (uniMatch) {
      return this.saveUsuario({
        nombre: uniMatch.nombrePropietario || 'Propietario',
        email: uniMatch.emailPropietario || `${uniMatch.usuarioAsignado || 'propietario'}@condolink.com`,
        usuario: uniMatch.usuarioAsignado || uniMatch.emailPropietario || uniMatch.codigoUnidad,
        rol: 'propietario',
        pin: uniMatch.pinAcceso || cleanPin,
        tenant_id: uniMatch.junta_id || uniMatch.tenant_id || 'default',
        junta_id: uniMatch.junta_id || '',
        codigoUnidad: uniMatch.codigoUnidad || '',
        estado: 'Activo'
      });
    }

    // 3. Also check Juntas (CLG_JuntaDirectiva)
    const juntas = this.getJuntas();
    const juntaMatch = juntas.find(j => {
      const jPin = String(j.pinJunta || j.pin || '').trim().toLowerCase();
      if (!jPin || jPin !== cleanPin.toLowerCase()) return false;
      const jUsr = String(j.usuarioJunta || '').trim().toLowerCase();
      const jId = String(j.id || '').trim().toLowerCase();
      const jNom = String(j.nombreJunta || '').trim().toLowerCase();
      return jUsr === cleanUser || jId === cleanUser || `junta_${jId}` === cleanUser || jNom === cleanUser;
    });
    if (juntaMatch) {
      return this.saveUsuario({
        nombre: juntaMatch.nombreJunta || 'Junta de Condominio',
        email: `${juntaMatch.usuarioJunta || ('junta_' + juntaMatch.id)}@condolink.com`,
        usuario: juntaMatch.usuarioJunta || `junta_${juntaMatch.id}`,
        rol: 'junta',
        pin: juntaMatch.pinJunta || cleanPin,
        tenant_id: juntaMatch.tenant_id || juntaMatch.id,
        junta_id: juntaMatch.id,
        estado: 'Activo'
      });
    }

    return null;
  },

  async getUsuarioByCredentialsAsync(usuarioOrEmail, pin) {
    const localMatch = this.getUsuarioByCredentials(usuarioOrEmail, pin);
    if (localMatch) return localMatch;

    // Live check against Supabase (clg_usuarios + auth.users) in case a user was added/updated remotely
    const remoteUsers = await fetchUsersFromSupabaseRemote();
    if (remoteUsers.length > 0) {
      const db = loadFullDb();
      db.usuarios = mergeUsersLists(db.usuarios || [], remoteUsers);
      saveFullDb(db);
      try {
        fs.writeFileSync(path.join(__dirname, 'usuarios.json'), JSON.stringify(db.usuarios, null, 2), 'utf8');
      } catch {}
      const matchedRemote = matchUserCredentialsInList(db.usuarios, usuarioOrEmail, pin);
      if (matchedRemote) return matchedRemote;
    }
    return null;
  },

  saveUsuario(user) {
    const usuarios = this.getUsuarios();
    const cleanEmail = String(user.email || user.correo || '').trim().toLowerCase();
    const cleanUser = String(user.usuario || (cleanEmail ? cleanEmail.split('@')[0] : 'usuario')).trim().toLowerCase();

    const tenantId = user.tenant_id || user.tenant || 'CLG_TENANT_ADMIN';
    let tenant = this.getTenantById(tenantId);
    if (!tenant) {
      tenant = this.saveTenant({ id: tenantId, nombre: `Tenant ${tenantId}` });
    }

    const idx = usuarios.findIndex(u =>
      (user.id && u.id === user.id) ||
      (user.usuarioOriginal && String(u.usuario || '').toLowerCase() === String(user.usuarioOriginal).toLowerCase()) ||
      (cleanEmail && String(u.email || '').toLowerCase() === cleanEmail) ||
      (cleanUser && String(u.usuario || '').toLowerCase() === cleanUser)
    );

    const prev = idx !== -1 ? usuarios[idx] : {};
    let pinFinal = String(user.pin || '').trim();
    if (!pinFinal || user.regenerarPin4Digitos) {
      pinFinal = (prev.pin && /^\d{4}$/.test(String(prev.pin)) && !user.regenerarPin4Digitos)
        ? String(prev.pin)
        : this.generarPinUnico();
    }

    const nombreCompleto = user.nombre && user.apellido && !String(user.nombre).toLowerCase().includes(String(user.apellido).toLowerCase())
      ? `${String(user.nombre).trim()} ${String(user.apellido).trim()}`.trim()
      : (user.nombre || prev.nombre || 'Usuario Condolink');

    const record = {
      ...prev,
      id: user.id || prev.id || ('USR-' + (usuarios.length + 1).toString().padStart(3, '0')),
      nombre: nombreCompleto,
      nombrePila: user.nombrePila || user.nombre || prev.nombrePila || '',
      apellido: user.apellido !== undefined ? user.apellido : (prev.apellido || ''),
      cedula: user.cedula !== undefined ? user.cedula : (prev.cedula || ''),
      rif: user.rif !== undefined ? user.rif : (prev.rif || ''),
      telefono: user.telefono !== undefined ? user.telefono : (prev.telefono || ''),
      email: cleanEmail || prev.email || `${cleanUser}@condolink.com`,
      usuario: cleanUser || prev.usuario || 'usuario',
      rol: user.rol || prev.rol || 'admin',
      pin: pinFinal,
      tenant_id: tenant.id,
      junta_id: user.junta_id || user.juntaId || prev.junta_id || '',
      unidad_id: user.unidad_id || user.unidadId || prev.unidad_id || '',
      codigoUnidad: user.codigoUnidad || prev.codigoUnidad || '',
      cargo: user.cargo || prev.cargo || '',
      tituloPropiedadPdfNombre: user.tituloPropiedadPdfNombre !== undefined ? user.tituloPropiedadPdfNombre : (prev.tituloPropiedadPdfNombre || ''),
      tituloPropiedadPdfUrl: user.tituloPropiedadPdfUrl !== undefined ? user.tituloPropiedadPdfUrl : (prev.tituloPropiedadPdfUrl || ''),
      curriculumPdfNombre: user.curriculumPdfNombre !== undefined ? user.curriculumPdfNombre : (prev.curriculumPdfNombre || ''),
      curriculumPdfUrl: user.curriculumPdfUrl !== undefined ? user.curriculumPdfUrl : (prev.curriculumPdfUrl || ''),
      logoAdminUrl: user.logoAdminUrl || prev.logoAdminUrl || 'https://i.imgur.com/XcMwIDa.png',
      configurado: user.configurado !== undefined ? Boolean(user.configurado) : Boolean(prev.configurado),
      estado: user.estado || prev.estado || 'Activo',
      fechaRegistro: prev.fechaRegistro || user.fechaRegistro || new Date().toISOString(),
      ultimoAcceso: new Date().toISOString()
    };

    if (idx !== -1) {
      usuarios[idx] = record;
    } else {
      usuarios.push(record);
    }

    writeEntity('usuarios', usuarios);
    return record;
  },

  // PROPIEDADES (CLG_Propiedades)
  getPropiedades() {
    return readEntity('propiedades', []);
  },

  savePropiedad(prop) {
    const props = this.getPropiedades();
    const id = prop.id || ('PROP-' + Date.now().toString().slice(-4));
    const tenantId = prop.tenant_id || 'TENANT-CHARAM-01';

    const record = {
      id: id,
      nombre: prop.nombre || prop.titulo || 'Inmueble Condolink',
      tipo: prop.tipo || 'edificio',
      direccion: prop.direccion || 'Caracas, Venezuela',
      ciudad: prop.ciudad || 'Caracas',
      estado: prop.estado || 'Distrito Capital',
      unidadesTotal: Number(prop.unidadesTotal || 40),
      adminAsignadoId: prop.adminAsignadoId || 'USR-003',
      tenant_id: tenantId,
      logoAdminUrl: prop.logoAdminUrl || 'https://i.imgur.com/XcMwIDa.png',
      alicuotaAdmin: Number(prop.alicuotaAdmin || 10.00),
      precio: Number(prop.precio || 0),
      moneda: prop.moneda || 'USD',
      estadoOperativo: prop.estadoOperativo || 'ACTIVO',
      fechaRegistro: new Date().toISOString()
    };

    const existingIdx = props.findIndex(p => p.id === id || (prop.nombre && String(p.nombre || '').toLowerCase() === String(prop.nombre).toLowerCase()));
    if (existingIdx !== -1) {
      props[existingIdx] = { ...props[existingIdx], ...record };
    } else {
      props.unshift(record);
    }
    writeEntity('propiedades', props);
    return record;
  },

  // JUNTAS (CLG_JuntaDirectiva)
  getJuntas() {
    return readEntity('juntas', []);
  },

  saveJunta(junta) {
    const juntas = this.getJuntas();
    const tenantId = junta.tenant_id || ('TENANT-' + Date.now().toString().slice(-4));
    const id = junta.id || ('JTA-' + Date.now().toString().slice(-6));
    const idx = juntas.findIndex(j => String(j.id).toLowerCase() === String(id).toLowerCase());
    const prev = idx !== -1 ? juntas[idx] : {};

    const record = {
      ...prev,
      id: id,
      nombreJunta: junta.nombreJunta || prev.nombreJunta || 'Junta de Condominio',
      condominio: junta.condominio || prev.condominio || 'Condominio Principal',
      tenant_id: tenantId,
      propiedad_id: junta.propiedad_id || prev.propiedad_id || 'PROP-101',
      numUnidades: Number(junta.numUnidades || prev.numUnidades || 48),
      numTrabajadores: Number(junta.numTrabajadores ?? prev.numTrabajadores ?? 2),
      alicuotaBaseUnidad: Number(junta.alicuotaBaseUnidad || prev.alicuotaBaseUnidad || 2.0833),
      logoAdminCreador: junta.logoAdminCreador || prev.logoAdminCreador || 'https://i.imgur.com/XcMwIDa.png',
      usuarioJunta: junta.usuarioJunta || prev.usuarioJunta || '',
      pinJunta: junta.pinJunta || prev.pinJunta || '',
      fechaConstitucion: prev.fechaConstitucion || junta.fechaConstitucion || new Date().toISOString(),
      estado: junta.estado || prev.estado || 'ACTIVA_INDEPENDIENTE',
      periodo: junta.periodo || prev.periodo || '2026-2027'
    };

    if (idx !== -1) {
      juntas[idx] = record;
    } else {
      juntas.push(record);
    }
    writeEntity('juntas', juntas);
    return record;
  },

  // UNIDADES (CLG_Unidades)
  getUnidades() {
    return readEntity('unidades', []);
  },

  saveUnidad(uni) {
    const unidades = this.getUnidades();
    const juntaId = uni.junta_id || 'JTA-CHARAM-001';
    const codigo = uni.codigoUnidad || 'U-01';
    const idx = unidades.findIndex(u =>
      (uni.id && u.id === uni.id) ||
      (String(u.junta_id || '').toLowerCase() === String(juntaId).toLowerCase() &&
       String(u.codigoUnidad || '').toLowerCase() === String(codigo).toLowerCase())
    );
    const prev = idx !== -1 ? unidades[idx] : {};
    const id = uni.id || prev.id || ('UNI-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 90 + 10));

    const record = {
      ...prev,
      id: id,
      codigoUnidad: codigo,
      propiedad_id: uni.propiedad_id || prev.propiedad_id || 'PROP-101',
      junta_id: juntaId,
      tenant_id: uni.tenant_id || prev.tenant_id || juntaId,
      nombre: uni.nombre !== undefined ? uni.nombre : (prev.nombre || ''),
      apellido: uni.apellido !== undefined ? uni.apellido : (prev.apellido || ''),
      nombrePropietario: uni.nombrePropietario || `${uni.nombre || prev.nombre || ''} ${uni.apellido || prev.apellido || ''}`.trim() || prev.nombrePropietario || 'Propietario',
      cedula: uni.cedula !== undefined ? uni.cedula : (prev.cedula || ''),
      rif: uni.rif !== undefined ? uni.rif : (prev.rif || ''),
      emailPropietario: uni.emailPropietario !== undefined ? uni.emailPropietario : (prev.emailPropietario || ''),
      telefonoPropietario: uni.telefonoPropietario !== undefined ? uni.telefonoPropietario : (prev.telefonoPropietario || ''),
      usuarioAsignado: uni.usuarioAsignado || prev.usuarioAsignado || '',
      pinAcceso: uni.pinAcceso || prev.pinAcceso || '',
      tituloPropiedadPdfNombre: uni.tituloPropiedadPdfNombre !== undefined ? uni.tituloPropiedadPdfNombre : (prev.tituloPropiedadPdfNombre || ''),
      tituloPropiedadPdfUrl: uni.tituloPropiedadPdfUrl !== undefined ? uni.tituloPropiedadPdfUrl : (prev.tituloPropiedadPdfUrl || ''),
      logoAdminUrl: uni.logoAdminUrl || prev.logoAdminUrl || 'https://i.imgur.com/XcMwIDa.png',
      configurado: uni.configurado !== undefined ? Boolean(uni.configurado) : Boolean(prev.configurado),
      alicuota: Number(uni.alicuota || prev.alicuota || 2.00),
      saldoUsd: Number(uni.saldoUsd ?? prev.saldoUsd ?? 0),
      saldoVes: Number(uni.saldoVes ?? prev.saldoVes ?? 0),
      estadoSolvencia: uni.estadoSolvencia || prev.estadoSolvencia || 'SOLVENTE',
      fechaRegistro: prev.fechaRegistro || new Date().toISOString()
    };

    if (idx !== -1) {
      unidades[idx] = record;
    } else {
      unidades.push(record);
    }
    writeEntity('unidades', unidades);
    return record;
  },

  getDetalleJuntaEcosistema(criterio = {}) {
    const juntaId = String(criterio.juntaId || criterio.junta_id || 'ejemplo01').trim();
    const numPropTarget = Math.min(200, Math.max(1, parseInt(criterio.numPropietarios || 0, 10) || 0));
    const numTrabTarget = Math.min(30, Math.max(0, parseInt(criterio.numTrabajadores ?? -1, 10)));
    const logoAdmin = criterio.logoAdminUrl || 'https://i.imgur.com/XcMwIDa.png';

    const juntas = this.getJuntas();
    let juntaObj = juntas.find(j => String(j.id).toLowerCase() === juntaId.toLowerCase() || String(j.tenant_id || '').toLowerCase() === juntaId.toLowerCase());
    if (!juntaObj) {
      const totalUnid = numPropTarget || 50;
      const totalTrab = numTrabTarget >= 0 ? numTrabTarget : 2;
      juntaObj = this.saveJunta({
        id: juntaId,
        tenant_id: juntaId,
        nombreJunta: criterio.nombrePropiedad || `Junta ${juntaId}`,
        condominio: criterio.nombrePropiedad || `Condominio ${juntaId}`,
        numUnidades: totalUnid,
        numTrabajadores: totalTrab,
        alicuotaBaseUnidad: Number((100 / totalUnid).toFixed(4)),
        logoAdminCreador: logoAdmin
      });
    }

    const totalProp = numPropTarget || Number(juntaObj.numUnidades || 50);
    const totalTrab = numTrabTarget >= 0 ? numTrabTarget : Number(juntaObj.numTrabajadores ?? 2);
    const alicuotaBase = Number((100 / Math.max(1, totalProp)).toFixed(4));
    let rawPrefijo = juntaId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'junta';

    // Ensure Junta user exists with 4-digit PIN
    const usuarios = this.getUsuarios();
    let usrJunta = usuarios.find(u =>
      String(u.rol || '').toLowerCase() === 'junta' &&
      (String(u.junta_id || '').toLowerCase() === juntaId.toLowerCase() ||
       String(u.tenant_id || '').toLowerCase() === juntaId.toLowerCase() ||
       String(u.usuario || '').toLowerCase().includes(rawPrefijo))
    );
    if (!usrJunta) {
      usrJunta = this.saveUsuario({
        nombre: `Junta de Condominio ${juntaObj.condominio || juntaId}`,
        usuario: `junta_${rawPrefijo}`,
        email: `junta_${rawPrefijo}@condolink.com`,
        rol: 'junta',
        pin: this.generarPinUnico(),
        tenant_id: juntaId,
        junta_id: juntaId,
        logoAdminUrl: juntaObj.logoAdminCreador || logoAdmin
      });
    }

    // Ensure all 1..totalProp units & propietario users exist
    let unidadesAll = this.getUnidades();
    let unidadesJunta = unidadesAll.filter(u =>
      String(u.junta_id || '').toLowerCase() === juntaId.toLowerCase() ||
      String(u.tenant_id || '').toLowerCase() === juntaId.toLowerCase()
    );

    if (unidadesJunta.length < totalProp) {
      for (let i = 1; i <= totalProp; i++) {
        const numStr = i < 10 ? `0${i}` : String(i);
        const cod = `U-${numStr}`;
        const yaExiste = unidadesJunta.some(u => String(u.codigoUnidad || '').toUpperCase() === cod);
        if (!yaExiste) {
          const usrAuto = `${rawPrefijo}_${numStr}`;
          const emailAuto = `${usrAuto}@condolink.com`;
          const usrCreated = this.saveUsuario({
            nombre: `Propietario ${cod}`,
            usuario: usrAuto,
            email: emailAuto,
            rol: 'propietario',
            tenant_id: juntaId,
            junta_id: juntaId,
            codigoUnidad: cod,
            logoAdminUrl: juntaObj.logoAdminCreador || logoAdmin
          });
          this.saveUnidad({
            codigoUnidad: cod,
            junta_id: juntaId,
            tenant_id: juntaId,
            nombrePropietario: `Propietario ${cod}`,
            emailPropietario: usrCreated.email,
            usuarioAsignado: usrCreated.usuario,
            pinAcceso: usrCreated.pin,
            alicuota: alicuotaBase,
            logoAdminUrl: juntaObj.logoAdminCreador || logoAdmin,
            configurado: false
          });
        }
      }
      unidadesJunta = this.getUnidades().filter(u =>
        String(u.junta_id || '').toLowerCase() === juntaId.toLowerCase() ||
        String(u.tenant_id || '').toLowerCase() === juntaId.toLowerCase()
      );
    }

    // Ensure all 1..totalTrab trabajadores residenciales exist
    const letras = 'abcdefghijklmnopqrstuvwxyz';
    let usuariosActualizados = this.getUsuarios();
    let trabajadoresJunta = usuariosActualizados.filter(u =>
      String(u.rol || '').toLowerCase() === 'trabajador_residencial' &&
      (String(u.junta_id || '').toLowerCase() === juntaId.toLowerCase() ||
       String(u.tenant_id || '').toLowerCase() === juntaId.toLowerCase())
    );

    if (trabajadoresJunta.length < totalTrab) {
      for (let t = trabajadoresJunta.length; t < totalTrab; t++) {
        const letra = letras.charAt(t) || String(t + 1);
        const usrTrab = `trab_${rawPrefijo}_${letra}`;
        this.saveUsuario({
          nombre: `Trabajador Residencial ${letra.toUpperCase()}`,
          usuario: usrTrab,
          email: `${usrTrab}@condolink.com`,
          rol: 'trabajador_residencial',
          cargo: 'Personal Residencial LOTTT',
          tenant_id: juntaId,
          junta_id: juntaId,
          logoAdminUrl: juntaObj.logoAdminCreador || logoAdmin,
          configurado: false
        });
      }
      usuariosActualizados = this.getUsuarios();
      trabajadoresJunta = usuariosActualizados.filter(u =>
        String(u.rol || '').toLowerCase() === 'trabajador_residencial' &&
        (String(u.junta_id || '').toLowerCase() === juntaId.toLowerCase() ||
         String(u.tenant_id || '').toLowerCase() === juntaId.toLowerCase())
      );
    }

    // Enrich unidadesJunta with latest user credentials from usuarios
    const propietariosDetalle = unidadesJunta.map((u, idx) => {
      const usr = usuariosActualizados.find(us =>
        (u.emailPropietario && String(us.email || '').toLowerCase() === String(u.emailPropietario).toLowerCase()) ||
        (u.usuarioAsignado && String(us.usuario || '').toLowerCase() === String(u.usuarioAsignado).toLowerCase()) ||
        (String(us.junta_id || '').toLowerCase() === juntaId.toLowerCase() && String(us.codigoUnidad || '') === String(u.codigoUnidad || ''))
      );
      return {
        ...u,
        numero: idx + 1,
        usuario: (usr && usr.usuario) || u.usuarioAsignado || u.emailPropietario,
        email: (usr && usr.email) || u.emailPropietario || '',
        pin: (usr && usr.pin) || u.pinAcceso || '1234',
        nombre: u.nombre || (usr && usr.nombrePila) || '',
        apellido: u.apellido || (usr && usr.apellido) || '',
        cedula: u.cedula || (usr && usr.cedula) || '',
        rif: u.rif || (usr && usr.rif) || '',
        telefono: u.telefonoPropietario || (usr && usr.telefono) || '',
        tituloPropiedadPdfNombre: u.tituloPropiedadPdfNombre || (usr && usr.tituloPropiedadPdfNombre) || '',
        tituloPropiedadPdfUrl: u.tituloPropiedadPdfUrl || (usr && usr.tituloPropiedadPdfUrl) || '',
        configurado: Boolean(u.configurado || (usr && usr.configurado))
      };
    });

    const rolesDelegados = ['ejecutivo_administrativo', 'ejecutivo_facturacion', 'ejecutivo_operaciones', 'legal', 'inversionista'];
    const ejecutivosLegal = usuariosActualizados.filter(u =>
      rolesDelegados.includes(String(u.rol || '').toLowerCase())
    );

    return {
      ok: true,
      success: true,
      junta: {
        ...juntaObj,
        usuarioJunta: usrJunta.usuario,
        emailJunta: usrJunta.email,
        pinJunta: usrJunta.pin
      },
      propietarios: propietariosDetalle,
      trabajadores: trabajadoresJunta,
      ejecutivosLegal: ejecutivosLegal
    };
  },

  // SOLICITUDES (CLG_Solicitudes)
  getSolicitudes() {
    return readEntity('solicitudes', []);
  },

  saveSolicitud(sol) {
    const solicitudes = this.getSolicitudes();
    const id = sol.id || sol.ID_Solicitud || ('SOL-' + Date.now());
    const rolStr = String(sol.rol || sol.Rol || 'Administrador').trim();
    const instalador = sol.instaladorDestino || sol.InstaladorDestino || (rolStr.toLowerCase().includes('inversionista') ? 'instalador_tenant_inversionista_master' : 'instalador_tenant_admin_master');

    const record = {
      id: id,
      tipoSolicitud: sol.tipoSolicitud || sol.TipoSolicitud || 'Contratar Servicio',
      nombre: sol.nombre || sol.Nombre || 'Empresa / Solicitante',
      rif: sol.rif || sol.RIF || '',
      direccion: sol.direccion || sol.Direccion || '',
      telefono: sol.telefono || sol.Telefono || '',
      email: String(sol.email || sol.Email || '').trim(),
      rol: rolStr,
      pin: String(sol.pin || sol.PIN || this.generarPinUnico(sol.nombre || 'CLG')).trim(),
      estado: sol.estado || 'Pendiente',
      correoNotificado: 'condolinkglobal@gmail.com',
      fechaRegistro: new Date().toISOString(),
      instaladorDestino: instalador,
      observaciones: sol.observaciones || {},
      urlRifDrive: sol.urlRifDrive || '',
      urlLogoDrive: sol.urlLogoDrive || ''
    };

    const existingIdx = solicitudes.findIndex(s =>
      (s.id && s.id === record.id) ||
      (record.email && String(s.email || '').toLowerCase() === record.email.toLowerCase() && String(s.estado || '').toLowerCase().includes('pendiente'))
    );
    if (existingIdx !== -1) {
      solicitudes[existingIdx] = { ...solicitudes[existingIdx], ...record };
    } else {
      solicitudes.unshift(record);
    }
    writeEntity('solicitudes', solicitudes);

    // NOTA DE SEGURIDAD V20.8: El usuario NO se habilita en CLG_Usuario ('usuarios') hasta que
    // la solicitud sea aprobada en panel_master, instalador_tenant_admin_master o instalador_tenant_inversionista_master.
    return record;
  },

  getSolicitudPendienteByCredentials(usuarioOrEmail, pin) {
    const cleanUser = String(usuarioOrEmail || '').trim().toLowerCase();
    const cleanPin = String(pin || '').trim();
    if (!cleanUser) return null;
    const solicitudes = this.getSolicitudes();
    return solicitudes.find(s => {
      const esPendiente = String(s.estado || 'Pendiente').toLowerCase().includes('pendiente');
      const emailMatch = String(s.email || '').trim().toLowerCase() === cleanUser;
      const userPrefixMatch = String(s.email || '').split('@')[0].trim().toLowerCase() === cleanUser;
      const nombreMatch = String(s.nombre || '').trim().toLowerCase() === cleanUser;
      const pinMatch = !cleanPin || String(s.pin || '').trim() === cleanPin;
      return esPendiente && (emailMatch || userPrefixMatch || nombreMatch) && pinMatch;
    }) || null;
  },

  aprobarSolicitud(criterio = {}) {
    const solicitudes = this.getSolicitudes();
    const cleanId = String(criterio.id || criterio.idSolicitud || '').trim();
    const cleanEmail = String(criterio.email || criterio.correo || '').trim().toLowerCase();
    const cleanNombre = String(criterio.nombre || criterio.tenant || '').trim().toLowerCase();
    const cleanRif = String(criterio.rif || '').trim().toUpperCase();

    let solEncontrada = null;
    for (let i = 0; i < solicitudes.length; i++) {
      const s = solicitudes[i];
      const matchId = cleanId && String(s.id || '') === cleanId;
      const matchEmail = cleanEmail && String(s.email || '').trim().toLowerCase() === cleanEmail;
      const matchNombre = cleanNombre && String(s.nombre || '').trim().toLowerCase() === cleanNombre;
      const matchRif = cleanRif && cleanRif !== 'J-00000000-0' && String(s.rif || '').trim().toUpperCase() === cleanRif;

      if (matchId || matchEmail || matchNombre || matchRif) {
        const modalidad = criterio.modalidadServicio || criterio.tipoSolicitud || s.tipoSolicitud || 'Contratar Servicio';
        const vigencia = criterio.vigencia || (String(modalidad).toLowerCase().includes('prueba') ? 'Periodo de Prueba (30 Días)' : '1 Año');
        solicitudes[i] = {
          ...s,
          estado: `Aprobado (${modalidad} - ${vigencia})`,
          modalidadServicio: modalidad,
          vigencia: vigencia,
          fechaAprobacion: new Date().toISOString(),
          pin: String(criterio.pin || s.pin || '123456').trim()
        };
        if (!solEncontrada) solEncontrada = solicitudes[i];
      }
    }
    writeEntity('solicitudes', solicitudes);
    return solEncontrada;
  },

  // SERVICIOS CONTRATADOS (CLG_ServiciosContratados)
  getServicios() {
    return readEntity('servicios_contratados', []);
  },

  saveServicio(srv) {
    const servicios = this.getServicios();
    const id = srv.id || ('SRV-' + Date.now().toString().slice(-5));

    const record = {
      id: id,
      proveedor: srv.proveedor || 'Proveedor de Servicios',
      categoria: srv.categoria || 'Mantenimiento General',
      costoMensual: Number(srv.costoMensual || 0),
      moneda: srv.moneda || 'USD',
      estado: srv.estado || 'Vigente',
      contacto: srv.contacto || '',
      telefono: srv.telefono || '',
      tenant_id: srv.tenant_id || 'TENANT-CHARAM-01',
      propiedad_id: srv.propiedad_id || 'PROP-101',
      fechaContrato: srv.fechaContrato || new Date().toISOString(),
      proximaRevision: srv.proximaRevision || '',
      calificacion: Number(srv.calificacion || 5)
    };

    servicios.unshift(record);
    writeEntity('servicios_contratados', servicios);
    return record;
  },

  deleteServicio(id) {
    const servicios = this.getServicios();
    const filtered = servicios.filter(s => s.id !== id);
    writeEntity('servicios_contratados', filtered);
    return true;
  },

  // AUDITORÍA FORENSE GLOBAL (CLG_AuditoriaGlobal)
  getAuditorias() {
    return readEntity('auditoria', []);
  },

  addAuditoria(log) {
    const logs = this.getAuditorias();
    const record = {
      id: 'AUD-' + (logs.length + 1).toString().padStart(3, '0'),
      fecha: new Date().toISOString(),
      tipo: log.tipo || 'INFO',
      modulo: log.modulo || 'SISTEMA',
      usuario: log.usuario || 'SISTEMA',
      usuario_id: log.usuario_id || 'USR-001',
      tenant_id: log.tenant_id || 'CLG_MASTER_01',
      detalle: log.detalle || '',
      estado: log.estado || 'OK',
      vista: log.vista || 'sistema'
    };

    logs.unshift(record);
    if (logs.length > 500) logs.pop();
    writeEntity('auditoria', logs);
    return record;
  },

  // LIBRO DIARIO & CONTABILIDAD (CLG_LibroDiario)
  getLibroDiario() {
    return readEntity('libro_diario', []);
  },

  saveAsiento(asiento) {
    const diario = this.getLibroDiario();
    const config = this.getConfiguracion();
    const tasa = Number(asiento.tasaBcv || config.tasaNumerica || 445.78);
    const montoUsd = Number(asiento.montoUsd || 0);

    const record = {
      id: asiento.id || asiento.idAsiento || ('ASI-' + Date.now().toString().slice(-6)),
      fecha: new Date().toISOString(),
      junta_id: asiento.junta_id || asiento.juntaId || 'JTA-CHARAM-001',
      tenant_id: asiento.tenant_id || 'TENANT-CHARAM-01',
      codigoDebe: asiento.codigoDebe || '1.1.01.001',
      cuentaDebe: asiento.cuentaDebe || 'Caja y Bancos',
      codigoHaber: asiento.codigoHaber || '4.1.01.001',
      cuentaHaber: asiento.cuentaHaber || 'Cuentas por Cobrar',
      montoUsd: montoUsd,
      tasaBcv: tasa,
      montoVes: Number((montoUsd * tasa).toFixed(2)),
      concepto: asiento.concepto || 'Asiento contable'
    };

    diario.unshift(record);
    writeEntity('libro_diario', diario);
    return record;
  },

  // MENSAJERÍA MULTICANAL (CLG_NotificacionesResidenciales)
  getMensajes(canal, juntaId) {
    const mensajes = readEntity('mensajes', []);
    return mensajes.filter(m => {
      let matches = true;
      if (canal) matches = matches && String(m.canal).toUpperCase() === String(canal).toUpperCase();
      if (juntaId) matches = matches && (m.junta_id === juntaId || m.juntaId === juntaId);
      return matches;
    });
  },

  saveMensaje(msg) {
    const mensajes = readEntity('mensajes', []);
    const record = {
      id: 'MSG-' + Date.now().toString().slice(-6),
      canal: String(msg.canal || 'JUNTA').toUpperCase(),
      tenant_id: msg.tenant_id || msg.tenantId || 'TENANT-CHARAM-01',
      junta_id: msg.junta_id || msg.juntaId || 'JTA-CHARAM-001',
      emisor: msg.emisor || 'ADMINISTRADOR',
      autor: msg.autor || msg.emisor || 'Admin',
      texto: msg.texto || msg.mensaje || '',
      fecha: new Date().toISOString(),
      leido: false
    };

    mensajes.unshift(record);
    writeEntity('mensajes', mensajes);
    return record;
  },

  // ADMINISTRADORES (CLG_Administradores)
  getAdministradores() {
    return readEntity('administradores', []);
  },

  saveAdministrador(admin) {
    const admins = this.getAdministradores();
    const id = admin.id || admin.ID_Admin || ('ADM-' + Date.now().toString().slice(-4));
    const cleanEmail = String(admin.correo || admin.Correo || admin.email || '').trim().toLowerCase();
    const tenantId = admin.tenant_id || admin.Tenant_ID || admin.tenantId || 'CLG_TENANT_ADMIN';

    const record = {
      id: id,
      cedula: admin.cedula || admin.Cedula || admin.rif || admin.rifEmpresa || 'J-41258963-0',
      nombre: admin.nombre || admin.Nombre || admin.nombreEmpresa || 'Administradora Condolink Global C.A.',
      apellido: admin.apellido || admin.Apellido || admin.direccion || '',
      correo: cleanEmail || 'admin@condolinkglobal.com',
      telefono: admin.telefono || admin.Telefono || admin.telefonoEmpresa || '+58 212-5559011',
      logoUrl: admin.logoUrl || admin.LogoURL || admin.logoAdminUrl || admin.urlLogoDrive || 'https://i.imgur.com/XcMwIDa.png',
      rifDriveUrl: admin.rifDriveUrl || admin.RifDriveURL || admin.urlRifDrive || '',
      modalidadServicio: admin.modalidadServicio || admin.ModalidadServicio || 'Contratación de Servicios',
      pagoCondominioBase: Number(admin.pagoCondominioBase || 65),
      alicuotaAdminMensual: Number(admin.alicuotaAdminMensual || 10),
      nivelAcceso: admin.nivelAcceso || admin.Nivel_Acceso || 'ADMIN',
      estatus: admin.estatus || admin.Estatus || 'Activo',
      tenant_id: tenantId,
      usuario_id: admin.usuario_id || 'USR-003',
      juntasAsignadas: admin.juntasAsignadas || ['JTA-CHARAM-001'],
      fechaRegistro: new Date().toISOString()
    };

    const idx = admins.findIndex(a =>
      (cleanEmail && String(a.correo || '').toLowerCase() === cleanEmail) ||
      (tenantId && tenantId !== 'CLG_TENANT_ADMIN' && String(a.tenant_id || '') === tenantId)
    );
    if (idx !== -1) {
      admins[idx] = { ...admins[idx], ...record };
    } else {
      admins.unshift(record);
    }
    writeEntity('administradores', admins);
    return record;
  },

  getPerfilAdmin(criterio = {}) {
    const admins = this.getAdministradores();
    const tenants = this.getTenants();
    const usuarios = this.getUsuarios();
    const solicitudes = this.getSolicitudes();
    const qUser = String(criterio.user || criterio.email || '').trim().toLowerCase();
    const qTenant = String(criterio.tenant || criterio.tenantId || '').trim().toUpperCase();

    let adminMatch = admins.find(a =>
      (qUser && (String(a.correo || '').toLowerCase() === qUser || String(a.correo || '').split('@')[0].toLowerCase() === qUser || String(a.nombre || '').toLowerCase() === qUser)) ||
      (qTenant && qTenant !== 'DEFAULT' && String(a.tenant_id || '').toUpperCase() === qTenant)
    );
    if (!adminMatch && admins.length > 0) {
      adminMatch = admins[0];
    }

    const solMatch = solicitudes.find(s =>
      (adminMatch && String(s.email || '').toLowerCase() === String(adminMatch.correo || '').toLowerCase()) ||
      (qUser && (String(s.email || '').toLowerCase() === qUser || String(s.email || '').split('@')[0].toLowerCase() === qUser))
    );

    const tenantMatch = tenants.find(t =>
      (adminMatch && String(t.id || '').toUpperCase() === String(adminMatch.tenant_id || '').toUpperCase()) ||
      (qTenant && qTenant !== 'DEFAULT' && String(t.id || '').toUpperCase() === qTenant)
    );

    const logoFinal =
      (adminMatch && adminMatch.logoUrl) ||
      (solMatch && solMatch.urlLogoDrive) ||
      (tenantMatch && tenantMatch.logoUrl) ||
      'https://i.imgur.com/XcMwIDa.png';

    const rifDriveFinal =
      (adminMatch && adminMatch.rifDriveUrl) ||
      (solMatch && solMatch.urlRifDrive) ||
      '';

    const juntas = this.getJuntas();
    const propiedades = this.getPropiedades();
    const unidades = this.getUnidades();
    const usuariosJunta = usuarios.filter(u => String(u.rol || '').toLowerCase() === 'junta');

    return {
      ok: true,
      success: true,
      nombre: (adminMatch && adminMatch.nombre) || (tenantMatch && tenantMatch.nombre) || (solMatch && solMatch.nombre) || 'Administradora Condolink Global C.A.',
      rif: (adminMatch && adminMatch.cedula) || (tenantMatch && tenantMatch.rif) || (solMatch && solMatch.rif) || 'J-41258963-0',
      email: (adminMatch && adminMatch.correo) || (tenantMatch && tenantMatch.email) || (solMatch && solMatch.email) || 'admin@condolinkglobal.com',
      telefono: (adminMatch && adminMatch.telefono) || (tenantMatch && tenantMatch.telefono) || (solMatch && solMatch.telefono) || '+58 212-5559011',
      direccion: (adminMatch && adminMatch.apellido) || (tenantMatch && tenantMatch.direccion) || (solMatch && solMatch.direccion) || 'Torre Charam, La Castellana, Caracas',
      logoUrl: logoFinal,
      rifDriveUrl: rifDriveFinal,
      modalidadServicio: (adminMatch && adminMatch.modalidadServicio) || (solMatch && solMatch.modalidadServicio) || 'Contratación de Servicios',
      estatus: (adminMatch && adminMatch.estatus) || 'Activo',
      tenantId: (adminMatch && adminMatch.tenant_id) || (tenantMatch && tenantMatch.id) || 'CLG_TENANT_ADMIN',
      pagoCondominioBase: (adminMatch && adminMatch.pagoCondominioBase) || 65,
      alicuotaAdminMensual: (adminMatch && adminMatch.alicuotaAdminMensual) || 10,
      juntas: juntas,
      propiedades: propiedades,
      unidades: unidades,
      usuariosJunta: usuariosJunta
    };
  },

  // INVERSIONISTAS (CLG_panel_inversionista)
  getInversionistas() {
    return readEntity('inversionistas', []);
  },

  saveInversionista(inv) {
    const invs = this.getInversionistas();
    const id = inv.id || ('INV-' + Date.now().toString().slice(-4));

    const record = {
      id: id,
      nombre: inv.nombre || 'Inversionista',
      rif: inv.rif || '',
      correo: inv.correo || inv.email || '',
      telefono: inv.telefono || '',
      propiedades: inv.propiedades || '',
      inversionTotalUsd: Number(inv.inversionTotalUsd || 0),
      rendimientoEstimadoAnual: Number(inv.rendimientoEstimadoAnual || 12.0),
      logoUrl: inv.logoUrl || inv.logoDriveUrl || inv.urlLogoDrive || 'https://i.imgur.com/XcMwIDa.png',
      rifDriveUrl: inv.rifDriveUrl || inv.urlRifDrive || '',
      tenant_id: inv.tenant_id || 'CLG_INV_01',
      usuario_id: inv.usuario_id || 'USR-009',
      estado: inv.estado || 'ACTIVO',
      fechaRegistro: new Date().toISOString()
    };

    invs.unshift(record);
    writeEntity('inversionistas', invs);
    return record;
  }
};
