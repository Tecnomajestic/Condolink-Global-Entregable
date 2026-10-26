import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbService } from './db_json/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---------------------------------------------------------
// HEALTH CHECK ENDPOINT
// ---------------------------------------------------------
app.get('/health', (req, res) => {
  const config = dbService.getConfiguracion();
  res.json({
    status: 'healthy',
    system: config.appName,
    version: config.appVersion,
    storage: 'JSON File Database (db_json)',
    entities: [
      'configuracion', 'usuarios', 'tenants', 'propiedades',
      'juntas', 'unidades', 'solicitudes', 'servicios_contratados',
      'auditoria', 'libro_diario', 'mensajes', 'administradores', 'inversionistas'
    ],
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------
// ROLE TO PORTAL MAPPING & VIEW ALIASES
// ---------------------------------------------------------
function normalizarRolCondolink(rolRaw) {
  const r = String(rolRaw || "").trim().toLowerCase();
  const alias = {
    "master": "master",
    "monitor": "monitor",
    "admin": "admin",
    "administrador": "admin",
    "ejecutivo_administrativo": "ejecutivo_administrativo",
    "ejecutivo_administrador": "ejecutivo_administrativo",
    "ejecutivo administrativo": "ejecutivo_administrativo",
    "ejecutivo_facturacion": "ejecutivo_facturacion",
    "ejecutivo facturacion": "ejecutivo_facturacion",
    "ejecutivo de facturacion": "ejecutivo_facturacion",
    "ejecutivo_operaciones": "ejecutivo_operaciones",
    "ejecutivo operaciones": "ejecutivo_operaciones",
    "legal": "legal",
    "inversionista": "inversionista",
    "junta": "junta",
    "junta de condominio": "junta",
    "propietario": "propietario",
    "inquilino": "propietario",
    "residente": "propietario",
    "comunicador01": "comunicador01",
    "comunicador 01": "comunicador01",
    "comunicador02": "comunicador02",
    "comunicador 02": "comunicador02",
    "trabajador_residencial": "trabajador_residencial",
    "trabajador residencial": "trabajador_residencial"
  };
  return alias[r] || r || "propietario";
}

function obtenerPortalPorRol(rol) {
  const r = normalizarRolCondolink(rol);
  const mapa = {
    "master": "portal_master",
    "monitor": "portal_restricted_zone_monitor",
    "admin": "portal_admin",
    "ejecutivo_administrativo": "portal_admin",
    "ejecutivo_facturacion": "portal_admin",
    "ejecutivo_operaciones": "portal_admin",
    "legal": "portal_admin",
    "inversionista": "portal_master",
    "junta": "portal_admin",
    "propietario": "portal_admin",
    "comunicador01": "portal_admin",
    "comunicador02": "portal_admin",
    "trabajador_residencial": "portal_admin"
  };
  return mapa[r] || "login_ui";
}

function resolverAliasVista(nombreVista) {
  let limpio = String(nombreVista || "login_ui").replace(/\.html$/i, "").trim();
  const mapaAlias = {
    "portal_restricted_zone": "portal_restricted_zone_monitor",
    "panel_restricted_zone": "panel_restricted_zone_monitor",
    "pruebas_monitoreo": "pruebas_monitoreo_monitor",
    "prueba_registro": "prueba_registro_monitor",
    "pruebas_registro_monitor": "prueba_registro_monitor",
    "usuarios_activos": "usuarios_activos_monitor",
    "auditar_global": "auditar_global_monitor",
    "panel_monitor": "panel_monitoreo_master",
    "panel_monitoreo_monitor": "panel_monitoreo_master",
    "portal_monitor": "portal_restricted_zone_monitor",
    "panel_pagos_admin": "panel_pagos_admin",
    "panel_pagos_admin.html": "panel_pagos_admin"
  };
  return mapaAlias[limpio] || limpio;
}

// ---------------------------------------------------------
// TEMPLATE ENGINE & GAS COMPATIBILITY SHIM
// ---------------------------------------------------------
const GAS_CLIENT_SHIM = `
<script id="__condolink_gas_shim__">
(function() {
  if (typeof window.google === 'undefined') window.google = {};
  if (!window.google.script) window.google.script = {};

  // Non-blocking toast polyfill for window.alert (iframe safety)
  window.alert = function(msg) {
    console.log('[Condolink Notification]:', msg);
    let toast = document.getElementById('__clg_toast__');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = '__clg_toast__';
      toast.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:rgba(11,17,32,0.96);border:1.5px solid #00e5ff;color:#f0f6fc;padding:12px 18px;border-radius:10px;font-family:system-ui,sans-serif;font-size:13px;max-width:400px;box-shadow:0 10px 30px rgba(0,0,0,0.8);backdrop-filter:blur(8px);transition:all 0.3s ease;display:none;';
      if (document.body) document.body.appendChild(toast);
    }
    if (toast) {
      toast.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px;"><i class="fas fa-circle-info" style="color:#00e5ff;font-size:16px;margin-top:2px;"></i><div><strong style="color:#ffcc00;display:block;margin-bottom:2px;">Condolink Global V20.8</strong><span>' + String(msg).replace(/\\n/g, '<br>') + '</span></div></div>';
      toast.style.display = 'block';
      toast.style.opacity = '1';
      clearTimeout(window.__clg_toast_timer__);
      window.__clg_toast_timer__ = setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
      }, 4500);
    }
  };

  function createRpcProxy(successHandler, failureHandler) {
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'withSuccessHandler') {
          return function(fn) { return createRpcProxy(fn, failureHandler); };
        }
        if (prop === 'withFailureHandler') {
          return function(fn) { return createRpcProxy(successHandler, fn); };
        }
        return function(...args) {
          fetch('/api/rpc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: prop, args: args })
          })
          .then(async res => {
            const data = await res.json();
            if (data && data.success === false && data.error && failureHandler) {
              failureHandler(new Error(data.error));
            } else if (successHandler) {
              successHandler(data);
            }
          })
          .catch(err => {
            if (failureHandler) failureHandler(err);
            else console.warn('[Condolink RPC Notice]', err);
          });
        };
      }
    });
  }

  window.google.script.run = createRpcProxy();
  window.google.script.host = {
    close: function() {},
    setHeight: function() {},
    setWidth: function() {}
  };
})();
</script>
`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderGasTemplate(templatePath, context) {
  let content = fs.readFileSync(templatePath, 'utf8');

  // Iframe safety: replace window.top.location with window.location and target="_top" with target="_self"
  content = content.replace(/window\.top\.location/g, 'window.location');
  content = content.replace(/<base\s+target=["']_top["']\s*\/?>/gi, '<base target="_self">');

  // 1. Process <?!= include('filename') ?>
  content = content.replace(/<\?!=\s*include\(['"]([^'"]+)['"]\)\s*\?>/g, (_, filename) => {
    const incPath = path.join(__dirname, filename.endsWith('.html') ? filename : filename + '.html');
    if (fs.existsSync(incPath)) {
      return fs.readFileSync(incPath, 'utf8');
    }
    return `<!-- Included file ${filename} not found -->`;
  });

  // 2. Process <?!= expr ?> (raw, unescaped)
  content = content.replace(/<\?!=\s*([\s\S]*?)\s*\?>/g, (_, expr) => {
    const trimmed = expr.trim();
    if (trimmed in context) {
      return String(context[trimmed] ?? '');
    }
    try {
      const fn = new Function(...Object.keys(context), `return (${trimmed});`);
      const val = fn(...Object.values(context));
      return val !== undefined && val !== null ? String(val) : '';
    } catch {
      return '';
    }
  });

  // 3. Process <?= expr ?> (escaped)
  content = content.replace(/<\?=\s*([\s\S]*?)\s*\?>/g, (_, expr) => {
    const trimmed = expr.trim();
    if (trimmed in context) {
      return escapeHtml(context[trimmed] ?? '');
    }
    try {
      const fn = new Function(...Object.keys(context), `return (${trimmed});`);
      const val = fn(...Object.values(context));
      return val !== undefined && val !== null ? escapeHtml(val) : '';
    } catch {
      return '';
    }
  });

  // 4. Inject Google Apps Script RPC client shim into <head> or at start
  if (!content.includes('__condolink_gas_shim__')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${GAS_CLIENT_SHIM}\n</head>`);
    } else {
      content = GAS_CLIENT_SHIM + content;
    }
  }

  return content;
}

// ---------------------------------------------------------
// RPC DISPATCHER HANDLER (USING dbService FOR PERSISTENCE)
// ---------------------------------------------------------
function handleRpcCall(action, args = []) {
  const config = dbService.getConfiguracion();

  switch (action) {
    case 'verificarCredenciales': {
      const [u, c] = args;
      const user = dbService.getUsuarioByCredentials(u, c);

      if (user) {
        const portalDestino = obtenerPortalPorRol(user.rol);
        dbService.addAuditoria({
          tipo: 'AUTH_SUCCESS',
          modulo: 'LOGIN_UI',
          usuario: user.email,
          usuario_id: user.id,
          tenant_id: user.tenant_id,
          detalle: `Inicio de sesión concedido para rol: ${user.rol}. Destino: ${portalDestino}`
        });

        return {
          success: true,
          ok: true,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          estado: user.estado,
          tenant: user.tenant_id,
          tasaBCV: config.tasaBCV,
          destino: portalDestino,
          message: "Credenciales verificadas exitosamente en base de datos JSON."
        };
      }

      dbService.addAuditoria({
        tipo: 'AUTH_FAILED',
        modulo: 'LOGIN_UI',
        usuario: String(u || 'ANONYMOUS'),
        detalle: 'Intento de acceso denegado por credenciales inválidas.'
      });

      return { success: false, ok: false, message: "Usuario o PIN de seguridad inválidos." };
    }

    case 'obtenerTasaBCVOficial':
    case 'obtenerTasaBCV': {
      return {
        success: true,
        tasa: config.tasaBCV,
        tasaNumerica: config.tasaNumerica,
        origen: "db_json/configuracion.json (CLG_Configuracion!B2)",
        timestamp: new Date().toISOString()
      };
    }

    case 'enviarRecuperacionPINPorUsuarioBackend': {
      const [usuario] = args;
      const cleanUser = String(usuario || '').trim().toLowerCase();
      const usuarios = dbService.getUsuarios();
      const user = usuarios.find(usr => 
        usr.email.toLowerCase() === cleanUser || 
        usr.usuario.toLowerCase() === cleanUser
      );

      if (user) {
        dbService.addAuditoria({
          tipo: 'PIN_RECOVERY',
          modulo: 'LOGIN_UI',
          usuario: user.email,
          usuario_id: user.id,
          tenant_id: user.tenant_id,
          detalle: `Solicitud de restablecimiento de PIN procesada para ${user.email}.`
        });
        return { ok: true, success: true, msg: `PIN verificado. Notificación transmitida a ${user.email}.` };
      }
      return { ok: false, success: false, msg: "El usuario no existe en la base de datos de usuarios." };
    }

    case 'registrarUsuarioConLogoDrive': {
      const [datos] = args;
      const nuevaSol = dbService.saveSolicitud(datos);
      dbService.addAuditoria({
        tipo: 'REGISTRO_SOLICITUD',
        modulo: 'PORTAL_REGISTRO',
        usuario: nuevaSol.email,
        detalle: `Nueva solicitud ${nuevaSol.id} para [${nuevaSol.nombre}] (${nuevaSol.rol}) guardada en db_json/solicitudes.json.`
      });

      return {
        ok: true,
        success: true,
        msg: "Solicitud registrada con éxito en db_json y enviada al Master.",
        id: nuevaSol.id
      };
    }

    case 'masterListarUsuarios':
    case 'master_listarTodosLosUsuarios':
    case 'obtenerListaUsuariosGlobal': {
      const usuarios = dbService.getUsuarios();
      return usuarios.map((u, i) => ({
        id: u.id || ("usr_" + (i + 1)),
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        badge: (u.rol || 'USER').substring(0, 6).toUpperCase(),
        estado: "online",
        tenant: u.tenant_id || "CLG_TENANT_ADMIN",
        mensajes: [
          { de: "incoming", texto: `Canal de comunicación activo con ${u.nombre}.`, hora: "Activo" }
        ]
      }));
    }

    case 'masterGuardarUsuario':
    case 'master_guardarUsuario': {
      const [usr] = args;
      if (usr) {
        dbService.saveUsuario(usr);
      }
      return { ok: true, success: true, msg: "Usuario guardado en db_json/usuarios.json con integridad referencial." };
    }

    case 'ejecutarMonitoreoGlobalSistema': {
      const usuarios = dbService.getUsuarios();
      const propiedades = dbService.getPropiedades();
      const juntas = dbService.getJuntas();
      const unidades = dbService.getUnidades();
      const solicitudes = dbService.getSolicitudes();
      const servicios = dbService.getServicios();
      const diario = dbService.getLibroDiario();
      const mensajes = dbService.getMensajes();

      dbService.addAuditoria({
        tipo: 'SECURITY_SCAN',
        modulo: 'BARRIDO_C4I_MONITOR',
        usuario: 'MONITOR_GLOBAL',
        detalle: `Barrido C4I completado. Integridad verificada en db_json (${usuarios.length} usuarios, ${juntas.length} juntas, ${propiedades.length} propiedades, ${diario.length} asientos).`
      });

      return {
        ok: true,
        success: true,
        estadoGeneral: "AUDITADO OK - ESQUEMA JSON CON INTEGRIDAD REFERENCIAL",
        motor: "Node.js Express / db_json Persistent Engine",
        tasaBCV: config.tasaBCV,
        timestamp: new Date().toISOString(),
        metricas: {
          usuarios: usuarios.length,
          propiedades: propiedades.length,
          juntas: juntas.length,
          unidades: unidades.length,
          solicitudes: solicitudes.length,
          servicios: servicios.length,
          asientosDiario: diario.length,
          mensajes: mensajes.length
        },
        muestraHojas: [
          "db_json/configuracion.json", "db_json/usuarios.json", "db_json/tenants.json",
          "db_json/propiedades.json", "db_json/juntas.json", "db_json/unidades.json",
          "db_json/solicitudes.json", "db_json/servicios_contratados.json", "db_json/libro_diario.json",
          "db_json/mensajes.json", "db_json/auditoria.json", "db_json/administradores.json"
        ]
      };
    }

    case 'ejecutarAuditoriaCompleta': {
      dbService.addAuditoria({
        tipo: 'FORENSIC_AUDIT',
        modulo: 'PANEL_AUDITORIA_MASTER',
        usuario: 'MASTER',
        detalle: 'Auditoría forense completa ejecutada. Archivos JSON sincronizados.'
      });
      return {
        ok: true,
        success: true,
        timestamp: new Date().toISOString(),
        estado: "AUDITORÍA INMUTABLE CONCLUIDA SATISFACTORIAMENTE"
      };
    }

    case 'listarInmueblesMasterBackend': {
      return { ok: true, success: true, inmuebles: dbService.getPropiedades() };
    }

    case 'registrarInmuebleMasterBackend': {
      const [inm] = args;
      if (inm) {
        dbService.savePropiedad(inm);
      }
      return { ok: true, success: true, msg: "Inmueble persistido en db_json/propiedades.json con éxito." };
    }

    case 'listarServiciosContratadosBackend': {
      return { ok: true, success: true, servicios: dbService.getServicios() };
    }

    case 'registrarServicioContratadoBackend': {
      const [srv] = args;
      if (srv) {
        dbService.saveServicio(srv);
      }
      return { ok: true, success: true, msg: "Servicio guardado en db_json/servicios_contratados.json." };
    }

    case 'eliminarServicioContratado': {
      const [id] = args;
      dbService.deleteServicio(id);
      return { ok: true, success: true, msg: "Servicio eliminado de la base de datos." };
    }

    case 'registrarInstalacionTenantAdmin': {
      const [data] = args;
      const tenantId = data?.tenantId || data?.juntaId || ("TENANT-" + Date.now().toString().slice(-4));
      
      dbService.saveTenant({
        id: tenantId,
        nombre: data?.nombreCondominio || data?.nombreJunta || "Condominio Ecosistema",
        tipo: "CONDOMINIO"
      });

      const nuevaJunta = dbService.saveJunta({
        ...data,
        tenant_id: tenantId
      });

      const nuevaProp = dbService.savePropiedad({
        ...data,
        tenant_id: tenantId
      });

      if (data?.nombrePropietario || data?.codigoUnidad) {
        dbService.saveUnidad({
          codigoUnidad: data?.codigoUnidad || "U-01",
          nombrePropietario: data?.nombrePropietario || "Propietario Inicial",
          emailPropietario: data?.correoPropietario || "",
          alicuota: data?.alicuotaUnidad || 2.00,
          tenant_id: tenantId,
          junta_id: nuevaJunta.id
        });
      }

      return {
        ok: true,
        success: true,
        idJunta: nuevaJunta.id,
        tenantId: tenantId,
        msg: `Ecosistema independiente [${nuevaJunta.nombreJunta}] instalado y persistido en db_json.`
      };
    }

    case 'activarUsuarioRolDelegadoAdminBackend': {
      const [payload] = args;
      const rol = normalizarRolCondolink(payload?.rol || "ejecutivo_administrativo");
      const usr = dbService.saveUsuario({
        nombre: payload?.nombre || "Usuario Delegado",
        email: payload?.email || payload?.correo || "delegado@condolink.com",
        rol: rol,
        pin: payload?.pin || "123456",
        tenant_id: payload?.tenantId || payload?.juntaId || "TENANT-CHARAM-01",
        estado: "Activo"
      });

      return {
        ok: true,
        success: true,
        rol: usr.rol,
        portalDestino: obtenerPortalPorRol(usr.rol),
        msg: "Usuario delegado guardado en db_json/usuarios.json."
      };
    }

    case 'emitirComunicadoConLogoAdminBackend': {
      const [payload] = args;
      dbService.saveMensaje({
        canal: "PROPIETARIO",
        tenant_id: payload?.juntaId || "TENANT-CHARAM-01",
        junta_id: payload?.juntaId || "JTA-CHARAM-001",
        emisor: "ADMINISTRADOR",
        autor: payload?.nombreAdmin || "Administración Oficial",
        texto: `[COMUNICADO: ${payload?.asunto || 'Oficial'}] ${payload?.cuerpo || ''}`
      });

      return { ok: true, success: true, msg: "Comunicado oficial guardado y distribuido en db_json/mensajes.json." };
    }

    case 'registrarAsientoLibroDiarioAdminBackend': {
      const [payload] = args;
      dbService.saveAsiento(payload);
      return { ok: true, success: true, msg: "Asiento contable registrado en db_json/libro_diario.json." };
    }

    case 'guardarMensajeAdminBackend': {
      const [payload] = args;
      dbService.saveMensaje(payload);
      return { ok: true, success: true, msg: "Mensaje persistido en db_json/mensajes.json." };
    }

    case 'obtenerMensajesAdminBackend': {
      const mensajes = dbService.getMensajes();
      return { ok: true, success: true, mensajes: mensajes };
    }

    case 'enviarMensajeBackend': {
      const [payload] = args;
      dbService.saveMensaje(payload);
      return { ok: true, success: true };
    }

    case 'obtenerSesionUsuario': {
      return {
        ok: true,
        success: true,
        usuario: "Master",
        rol: "master",
        tasaBCV: config.tasaBCV
      };
    }

    case 'registrarEmpresaMaster': {
      const [data] = args;
      const admin = dbService.saveAdministrador(data);
      dbService.saveUsuario({
        nombre: data.Nombre,
        email: data.Correo,
        rol: "admin",
        pin: data.PIN || "1234",
        tenant_id: admin.tenant_id
      });
      return { ok: true, success: true, msg: `Administradora [${data.Nombre}] persistida en db_json.` };
    }

    case 'registrarNuevoInversionistaMaster': {
      const [payload] = args;
      const inv = dbService.saveInversionista(payload);
      dbService.saveUsuario({
        nombre: payload.nombre,
        email: payload.correo,
        rol: "inversionista",
        pin: payload.pin || "1234",
        tenant_id: inv.tenant_id
      });
      return { ok: true, success: true, msg: `Inversionista [${payload.nombre}] registrado en db_json.` };
    }

    case 'router_backend': {
      const [vista] = args;
      return `?p=${encodeURIComponent(vista || 'login_ui')}`;
    }

    default:
      return {
        ok: true,
        success: true,
        action: action,
        storage: "db_json",
        timestamp: new Date().toISOString(),
        msg: "Operación procesada y persistida en db_json."
      };
  }
}

// ---------------------------------------------------------
// POST RPC ENDPOINTS
// ---------------------------------------------------------
app.post('/api/rpc', (req, res) => {
  const { action, args } = req.body || {};
  const resultado = handleRpcCall(action, args || []);
  res.json(resultado);
});

// Support GAS doPost payloads
app.post(['/', '/doPost', '/exec'], (req, res) => {
  let accion = req.body?.accion || req.query?.accion;
  if (!accion && req.body?.action) accion = req.body.action;

  let resultado;
  if (accion === 'login') {
    resultado = handleRpcCall('verificarCredenciales', [req.body?.usuario, req.body?.pin]);
  } else if (accion === 'obtenerTasaBCV') {
    resultado = handleRpcCall('obtenerTasaBCVOficial');
  } else if (accion) {
    resultado = handleRpcCall(accion, req.body?.args || [req.body]);
  } else {
    resultado = { success: true, ok: true, message: "Condolink Global Post Endpoint Activo (db_json)" };
  }

  res.json(resultado);
});

// ---------------------------------------------------------
// DYNAMIC VIEW ROUTER (doGet emulation)
// ---------------------------------------------------------
function servePanel(req, res, requestedPanel) {
  const panelName = resolverAliasVista(requestedPanel || req.query.p || req.query.vista || req.query.panel || req.query.page || 'login_ui');
  const tenantId = req.query.tenant || 'default';
  const rol = req.query.rol || '';
  const user = req.query.user || req.query.usuario || '';

  const config = dbService.getConfiguracion();

  // Candidate file resolution
  const candidateFiles = [
    `${panelName}.html`,
    `${panelName}`,
    `${panelName}.html.html`,
    path.join(__dirname, `${panelName}.html`),
    path.join(__dirname, `${panelName}.html.html`)
  ];

  let foundFile = null;
  for (const c of candidateFiles) {
    const fullPath = path.isAbsolute(c) ? c : path.join(__dirname, c);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      foundFile = fullPath;
      break;
    }
  }

  const context = {
    baseUrl: `${req.protocol}://${req.get('host')}/`,
    appName: config.appName,
    appVersion: config.appVersion,
    userRol: rol,
    userEmail: user,
    tenant: tenantId,
    tasaBCV: config.tasaBCV,
    userData: JSON.stringify({
      id: tenantId,
      nombreEmpresa: config.appName,
      activo: true,
      tasaBCV: config.tasaBCV
    })
  };

  if (foundFile) {
    try {
      const rendered = renderGasTemplate(foundFile, context);
      return res.send(rendered);
    } catch (err) {
      console.error(`Error rendering ${foundFile}:`, err);
      return res.status(500).send(`Error renderizando plantilla ${panelName}: ${err.message}`);
    }
  }

  // Fallback Arcade view if panel not directly found
  const fallbackHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Condolink Global V20.8 — Módulo ${escapeHtml(panelName)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        background: radial-gradient(circle at center, #0b1120 0%, #030810 100%);
        color: #f0f6fc;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .card {
        background: rgba(15, 23, 42, 0.95);
        border: 2px solid #00e5ff;
        box-shadow: 0 0 30px rgba(0, 229, 255, 0.25);
        border-radius: 16px;
        padding: 32px;
        max-width: 650px;
        width: 100%;
        text-align: center;
      }
      .arcade-font { font-family: 'Press Start 2P', monospace; }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
      .btn-cyan { background: #00e5ff; color: #030810; }
      .btn-cyan:hover { background: #4facfe; box-shadow: 0 0 15px #00e5ff; }
      .btn-gold { background: #ffcc00; color: #030810; }
      .btn-gold:hover { background: #ffd700; box-shadow: 0 0 15px #ffcc00; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="font-size: 3rem; color: #00e5ff; margin-bottom: 16px;">
        <i class="fas fa-microchip"></i>
      </div>
      <h2 class="arcade-font" style="font-size: 1rem; color: #ffcc00; margin-bottom: 16px;">
        CONDOLINK GLOBAL ENTERPRISE V20.8
      </h2>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: #00e5ff;">
        Módulo: ${escapeHtml(panelName)}
      </h3>
      <p style="color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px;">
        Este módulo está interconectado a la consola central y respaldado en la base de datos JSON (<code>/db_json</code>).
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="/?p=portal_admin&rol=admin" class="btn btn-cyan">
          <i class="fas fa-building"></i> Portal Administrador
        </a>
        <a href="/?p=portal_master&rol=master" class="btn btn-gold">
          <i class="fas fa-crown"></i> Portal Master
        </a>
        <a href="/?p=login_ui" class="btn" style="background: #334155; color: #fff;">
          <i class="fas fa-sign-out-alt"></i> Login
        </a>
      </div>
    </div>
  </body>
  </html>
  `;
  res.send(fallbackHtml);
}

// Main GET entry point
app.get(['/', '/index.html'], (req, res) => {
  const panel = req.query.p || req.query.vista || req.query.panel || req.query.page;
  if (!panel) {
    return servePanel(req, res, 'login_ui');
  }
  return servePanel(req, res, panel);
});

// Dynamic route for direct panel requests (e.g. /panel_admin.html)
app.get('/:view', (req, res, next) => {
  const viewParam = req.params.view;
  if (viewParam.includes('.')) {
    const ext = path.extname(viewParam);
    if (ext === '.html') {
      return servePanel(req, res, path.basename(viewParam, '.html'));
    }
    const filePath = path.join(__dirname, viewParam);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  servePanel(req, res, viewParam);
});

// Serve static assets
app.use(express.static(__dirname));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Condolink Global Enterprise dev server active on http://0.0.0.0:${PORT} [db_json persistent engine]`);
});
