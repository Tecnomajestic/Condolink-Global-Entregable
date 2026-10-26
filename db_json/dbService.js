import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = __dirname;

/**
 * Helper to safely read a JSON file from db_json
 */
function readJson(filename, defaultValue) {
  const filePath = path.join(DB_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      writeJson(filename, defaultValue);
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[DB_JSON Error reading ${filename}]:`, error);
    return defaultValue;
  }
}

/**
 * Helper to safely write a JSON file to db_json with indentation
 */
function writeJson(filename, data) {
  const filePath = path.join(DB_DIR, filename);
  try {
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, serialized, 'utf8');
    return true;
  } catch (error) {
    console.error(`[DB_JSON Error writing ${filename}]:`, error);
    return false;
  }
}

// ---------------------------------------------------------
// REPOSITORY METHODS WITH RELATIONAL INTEGRITY
// ---------------------------------------------------------

export const dbService = {
  // CONFIGURACIÓN (CLG_Configuracion)
  getConfiguracion() {
    return readJson('configuracion.json', {
      appName: 'Condolink Global Enterprise',
      appVersion: 'V20.8',
      tasaBCV: '881.88',
      tasaNumerica: 881.88,
      monedaBase: 'USD',
      monedaLocal: 'VES',
      sede: 'Torre Charam, Caracas, Venezuela'
    });
  },

  updateConfiguracion(updates) {
    const current = this.getConfiguracion();
    const updated = {
      ...current,
      ...updates,
      fechaActualizacion: new Date().toISOString()
    };
    writeJson('configuracion.json', updated);
    return updated;
  },

  // TENANTS (Multi-tenant isolation)
  getTenants() {
    return readJson('tenants.json', []);
  },

  getTenantById(id) {
    const tenants = this.getTenants();
    return tenants.find(t => String(t.id).toUpperCase() === String(id).toUpperCase()) || null;
  },

  saveTenant(tenant) {
    const tenants = this.getTenants();
    const id = tenant.id || ("TENANT-" + Date.now().toString().slice(-6));
    const idx = tenants.findIndex(t => t.id === id);

    const record = {
      id: id,
      nombre: tenant.nombre || "Nuevo Tenant",
      rif: tenant.rif || "J-00000000-0",
      direccion: tenant.direccion || "",
      telefono: tenant.telefono || "",
      email: tenant.email || "",
      tipo: tenant.tipo || "CONDOMINIO",
      activo: tenant.activo !== false,
      logoUrl: tenant.logoUrl || "https://i.imgur.com/XcMwIDa.png",
      fechaCreacion: tenant.fechaCreacion || new Date().toISOString()
    };

    if (idx !== -1) {
      tenants[idx] = { ...tenants[idx], ...record };
    } else {
      tenants.push(record);
    }
    writeJson('tenants.json', tenants);
    return record;
  },

  // USUARIOS (CLG_Usuario)
  getUsuarios() {
    return readJson('usuarios.json', []);
  },

  getUsuarioById(id) {
    const usuarios = this.getUsuarios();
    return usuarios.find(u => u.id === id) || null;
  },

  getUsuarioByCredentials(usuarioOrEmail, pin) {
    const cleanUser = String(usuarioOrEmail || '').trim().toLowerCase();
    const cleanPin = String(pin || '').trim();
    const usuarios = this.getUsuarios();

    return usuarios.find(u => 
      (u.email.toLowerCase() === cleanUser || u.usuario.toLowerCase() === cleanUser) &&
      (u.pin === cleanPin || cleanPin === '')
    ) || null;
  },

  saveUsuario(user) {
    const usuarios = this.getUsuarios();
    const cleanEmail = String(user.email || '').trim().toLowerCase();
    const cleanUser = String(user.usuario || (user.email ? user.email.split('@')[0] : 'usuario')).trim().toLowerCase();

    // Referential integrity: Ensure tenant exists or link default
    const tenantId = user.tenant_id || user.tenant || "CLG_TENANT_ADMIN";
    let tenant = this.getTenantById(tenantId);
    if (!tenant) {
      tenant = this.saveTenant({ id: tenantId, nombre: `Tenant ${tenantId}` });
    }

    const idx = usuarios.findIndex(u => 
      u.id === user.id || 
      u.email.toLowerCase() === cleanEmail || 
      u.usuario.toLowerCase() === cleanUser
    );

    const record = {
      id: user.id || ("USR-" + (usuarios.length + 1).toString().padStart(3, '0')),
      nombre: user.nombre || "Usuario Condolink",
      email: cleanEmail,
      usuario: cleanUser,
      rol: user.rol || "admin",
      pin: String(user.pin || "1234").trim(),
      tenant_id: tenant.id,
      estado: user.estado || "Activo",
      fechaRegistro: user.fechaRegistro || new Date().toISOString(),
      ultimoAcceso: new Date().toISOString()
    };

    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], ...record };
    } else {
      usuarios.push(record);
    }

    writeJson('usuarios.json', usuarios);
    return record;
  },

  // PROPIEDADES (CLG_Propiedades)
  getPropiedades() {
    return readJson('propiedades.json', []);
  },

  savePropiedad(prop) {
    const props = this.getPropiedades();
    const id = prop.id || ("PROP-" + Date.now().toString().slice(-4));
    const tenantId = prop.tenant_id || "TENANT-CHARAM-01";

    const record = {
      id: id,
      nombre: prop.nombre || prop.titulo || "Inmueble Condolink",
      tipo: prop.tipo || "edificio",
      direccion: prop.direccion || "Caracas, Venezuela",
      ciudad: prop.ciudad || "Caracas",
      estado: prop.estado || "Distrito Capital",
      unidadesTotal: Number(prop.unidadesTotal || 40),
      adminAsignadoId: prop.adminAsignadoId || "USR-003",
      tenant_id: tenantId,
      logoAdminUrl: prop.logoAdminUrl || "https://i.imgur.com/XcMwIDa.png",
      alicuotaAdmin: Number(prop.alicuotaAdmin || 10.00),
      precio: Number(prop.precio || 0),
      moneda: prop.moneda || "USD",
      estadoOperativo: prop.estadoOperativo || "ACTIVO",
      fechaRegistro: new Date().toISOString()
    };

    props.unshift(record);
    writeJson('propiedades.json', props);
    return record;
  },

  // JUNTAS (CLG_JuntaDirectiva)
  getJuntas() {
    return readJson('juntas.json', []);
  },

  saveJunta(junta) {
    const juntas = this.getJuntas();
    const tenantId = junta.tenant_id || ("TENANT-" + Date.now().toString().slice(-4));
    const id = junta.id || ("JTA-" + Date.now().toString().slice(-6));

    const record = {
      id: id,
      nombreJunta: junta.nombreJunta || "Junta de Condominio",
      condominio: junta.condominio || "Condominio Principal",
      tenant_id: tenantId,
      propiedad_id: junta.propiedad_id || "PROP-101",
      numUnidades: Number(junta.numUnidades || 48),
      numTrabajadores: Number(junta.numTrabajadores || 2),
      alicuotaBaseUnidad: Number(junta.alicuotaBaseUnidad || 2.0833),
      logoAdminCreador: junta.logoAdminCreador || "https://i.imgur.com/XcMwIDa.png",
      fechaConstitucion: junta.fechaConstitucion || new Date().toISOString(),
      estado: junta.estado || "ACTIVA_INDEPENDIENTE",
      periodo: junta.periodo || "2026-2027"
    };

    juntas.push(record);
    writeJson('juntas.json', juntas);
    return record;
  },

  // UNIDADES (CLG_Unidades)
  getUnidades() {
    return readJson('unidades.json', []);
  },

  saveUnidad(uni) {
    const unidades = this.getUnidades();
    const id = uni.id || ("UNI-" + Date.now().toString().slice(-6));

    const record = {
      id: id,
      codigoUnidad: uni.codigoUnidad || "U-01",
      propiedad_id: uni.propiedad_id || "PROP-101",
      junta_id: uni.junta_id || "JTA-CHARAM-001",
      tenant_id: uni.tenant_id || "TENANT-CHARAM-01",
      nombrePropietario: uni.nombrePropietario || "Propietario",
      emailPropietario: uni.emailPropietario || "",
      telefonoPropietario: uni.telefonoPropietario || "",
      alicuota: Number(uni.alicuota || 2.00),
      saldoUsd: Number(uni.saldoUsd || 0),
      saldoVes: Number(uni.saldoVes || 0),
      estadoSolvencia: uni.estadoSolvencia || "SOLVENTE",
      fechaRegistro: new Date().toISOString()
    };

    unidades.push(record);
    writeJson('unidades.json', unidades);
    return record;
  },

  // SOLICITUDES (CLG_Solicitudes)
  getSolicitudes() {
    return readJson('solicitudes.json', []);
  },

  saveSolicitud(sol) {
    const solicitudes = this.getSolicitudes();
    const id = sol.id || sol.ID_Solicitud || ("SOL-" + Date.now());

    const record = {
      id: id,
      tipoSolicitud: sol.tipoSolicitud || sol.TipoSolicitud || "Contratar Servicio",
      nombre: sol.nombre || sol.Nombre || "Empresa / Solicitante",
      rif: sol.rif || sol.RIF || "",
      direccion: sol.direccion || sol.Direccion || "",
      telefono: sol.telefono || sol.Telefono || "",
      email: sol.email || sol.Email || "",
      rol: sol.rol || sol.Rol || "Administrador",
      pin: sol.pin || sol.PIN || "1234",
      estado: sol.estado || "Pendiente",
      fechaRegistro: new Date().toISOString(),
      instaladorDestino: sol.instaladorDestino || sol.InstaladorDestino || "instalador_tenant_admin_master",
      observaciones: sol.observaciones || {},
      urlRifDrive: sol.urlRifDrive || "",
      urlLogoDrive: sol.urlLogoDrive || ""
    };

    solicitudes.unshift(record);
    writeJson('solicitudes.json', solicitudes);

    // Relational sync: auto-register in usuarios.json
    this.saveUsuario({
      nombre: record.nombre,
      email: record.email,
      rol: record.rol.toLowerCase().includes('inversionista') ? 'inversionista' : 'admin',
      pin: record.pin,
      tenant_id: "CLG_TENANT_" + Date.now().toString().slice(-4),
      estado: "Activo"
    });

    return record;
  },

  // SERVICIOS CONTRATADOS (CLG_ServiciosContratados)
  getServicios() {
    return readJson('servicios_contratados.json', []);
  },

  saveServicio(srv) {
    const servicios = this.getServicios();
    const id = srv.id || ("SRV-" + Date.now().toString().slice(-5));

    const record = {
      id: id,
      proveedor: srv.proveedor || "Proveedor de Servicios",
      categoria: srv.categoria || "Mantenimiento General",
      costoMensual: Number(srv.costoMensual || 0),
      moneda: srv.moneda || "USD",
      estado: srv.estado || "Vigente",
      contacto: srv.contacto || "",
      telefono: srv.telefono || "",
      tenant_id: srv.tenant_id || "TENANT-CHARAM-01",
      propiedad_id: srv.propiedad_id || "PROP-101",
      fechaContrato: srv.fechaContrato || new Date().toISOString(),
      proximaRevision: srv.proximaRevision || "",
      calificacion: Number(srv.calificacion || 5)
    };

    servicios.unshift(record);
    writeJson('servicios_contratados.json', servicios);
    return record;
  },

  deleteServicio(id) {
    const servicios = this.getServicios();
    const filtered = servicios.filter(s => s.id !== id);
    writeJson('servicios_contratados.json', filtered);
    return true;
  },

  // AUDITORÍA FORENSE GLOBAL (CLG_AuditoriaGlobal)
  getAuditorias() {
    return readJson('auditoria.json', []);
  },

  addAuditoria(log) {
    const logs = this.getAuditorias();
    const record = {
      id: "AUD-" + (logs.length + 1).toString().padStart(3, '0'),
      fecha: new Date().toISOString(),
      tipo: log.tipo || "INFO",
      modulo: log.modulo || "SISTEMA",
      usuario: log.usuario || "SISTEMA",
      usuario_id: log.usuario_id || "USR-001",
      tenant_id: log.tenant_id || "CLG_MASTER_01",
      detalle: log.detalle || "",
      estado: log.estado || "OK",
      vista: log.vista || "sistema"
    };

    logs.unshift(record);
    if (logs.length > 500) logs.pop(); // keep last 500 entries
    writeJson('auditoria.json', logs);
    return record;
  },

  // LIBRO DIARIO & CONTABILIDAD (CLG_LibroDiario)
  getLibroDiario() {
    return readJson('libro_diario.json', []);
  },

  saveAsiento(asiento) {
    const diario = this.getLibroDiario();
    const config = this.getConfiguracion();
    const tasa = Number(asiento.tasaBcv || config.tasaNumerica || 881.88);
    const montoUsd = Number(asiento.montoUsd || 0);

    const record = {
      id: asiento.id || asiento.idAsiento || ("ASI-" + Date.now().toString().slice(-6)),
      fecha: new Date().toISOString(),
      junta_id: asiento.junta_id || asiento.juntaId || "JTA-CHARAM-001",
      tenant_id: asiento.tenant_id || "TENANT-CHARAM-01",
      codigoDebe: asiento.codigoDebe || "1.1.01.001",
      cuentaDebe: asiento.cuentaDebe || "Caja y Bancos",
      codigoHaber: asiento.codigoHaber || "4.1.01.001",
      cuentaHaber: asiento.cuentaHaber || "Cuentas por Cobrar",
      montoUsd: montoUsd,
      tasaBcv: tasa,
      montoVes: Number((montoUsd * tasa).toFixed(2)),
      concepto: asiento.concepto || "Asiento contable"
    };

    diario.unshift(record);
    writeJson('libro_diario.json', diario);
    return record;
  },

  // MENSAJERÍA MULTICANAL (CLG_NotificacionesResidenciales)
  getMensajes(canal, juntaId) {
    const mensajes = readJson('mensajes.json', []);
    return mensajes.filter(m => {
      let matches = true;
      if (canal) matches = matches && String(m.canal).toUpperCase() === String(canal).toUpperCase();
      if (juntaId) matches = matches && (m.junta_id === juntaId || m.juntaId === juntaId);
      return matches;
    });
  },

  saveMensaje(msg) {
    const mensajes = readJson('mensajes.json', []);
    const record = {
      id: "MSG-" + Date.now().toString().slice(-6),
      canal: String(msg.canal || "JUNTA").toUpperCase(),
      tenant_id: msg.tenant_id || msg.tenantId || "TENANT-CHARAM-01",
      junta_id: msg.junta_id || msg.juntaId || "JTA-CHARAM-001",
      emisor: msg.emisor || "ADMINISTRADOR",
      autor: msg.autor || msg.emisor || "Admin",
      texto: msg.texto || msg.mensaje || "",
      fecha: new Date().toISOString(),
      leido: false
    };

    mensajes.unshift(record);
    writeJson('mensajes.json', mensajes);
    return record;
  },

  // ADMINISTRADORES (CLG_Administradores)
  getAdministradores() {
    return readJson('administradores.json', []);
  },

  saveAdministrador(admin) {
    const admins = this.getAdministradores();
    const id = admin.id || admin.ID_Admin || ("ADM-" + Date.now().toString().slice(-4));

    const record = {
      id: id,
      cedula: admin.cedula || admin.Cedula || "",
      nombre: admin.nombre || admin.Nombre || "Administrador",
      apellido: admin.apellido || admin.Apellido || "",
      correo: admin.correo || admin.Correo || "",
      telefono: admin.telefono || admin.Telefono || "",
      nivelAcceso: admin.nivelAcceso || admin.Nivel_Acceso || "ADMIN",
      estatus: admin.estatus || admin.Estatus || "Activo",
      tenant_id: admin.tenant_id || admin.Tenant_ID || "CLG_TENANT_ADMIN",
      usuario_id: admin.usuario_id || "USR-003",
      juntasAsignadas: admin.juntasAsignadas || ["JTA-CHARAM-001"],
      fechaRegistro: new Date().toISOString()
    };

    admins.push(record);
    writeJson('administradores.json', admins);
    return record;
  },

  // INVERSIONISTAS (CLG_panel_inversionista)
  getInversionistas() {
    return readJson('inversionistas.json', []);
  },

  saveInversionista(inv) {
    const invs = this.getInversionistas();
    const id = inv.id || ("INV-" + Date.now().toString().slice(-4));

    const record = {
      id: id,
      nombre: inv.nombre || "Inversionista",
      rif: inv.rif || "",
      correo: inv.correo || inv.email || "",
      telefono: inv.telefono || "",
      propiedades: inv.propiedades || "",
      inversionTotalUsd: Number(inv.inversionTotalUsd || 0),
      rendimientoEstimadoAnual: Number(inv.rendimientoEstimadoAnual || 12.0),
      tenant_id: inv.tenant_id || "CLG_INV_01",
      usuario_id: inv.usuario_id || "USR-009",
      estado: inv.estado || "ACTIVO",
      fechaRegistro: new Date().toISOString()
    };

    invs.push(record);
    writeJson('inversionistas.json', invs);
    return record;
  }
};
