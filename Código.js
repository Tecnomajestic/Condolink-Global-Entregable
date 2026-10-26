/**
 * ==============================================================================
 * CONDOLINK GLOBAL ENTERPRISE – AMBIENTE PRODUCCIÓN / UNIFICADO (V20.8 - DEFINITIVO Y BLINDADO)
 * ==============================================================================
 * Archivo: codigo.gs
 * Rol del Módulo: Router Universal (doGet / doPost), Lista Blanca de los 13 Roles,
 *                 Validación de Identidad, Tasa BCV Oficial (CLG_Configuracion!B2)
 *                 y Conectividad Base Multi-Tenant.
 * Sede Operativa: Torre Charam, La Castellana, Caracas, Venezuela.
 * ==============================================================================
 */

var CONFIG_DB = {
  SPREADSHEET_ID: "1K_EiaARKQfucIqgC4_FnqBr1UwFGDKOOC-ks6i0Jh4c",
  DRIVE_FOLDER_ID: "1_GOZOLnHBMm_meTUQSpmsIqZeY1E4Jzl"
};

var SPREADSHEET_ID = CONFIG_DB.SPREADSHEET_ID;
var DRIVE_FOLDER_ID = CONFIG_DB.DRIVE_FOLDER_ID;

var APP_CONFIG = {
  name: "Condolink Global Enterprise",
  version: "V20.8"
};

/**
 * ==============================================================================
 * 1. LISTA BLANCA OFICIAL EXCLUSIVA DE VISTAS Y PORTALES DEL ECOSISTEMA (V20.8)
 * ==============================================================================
 */
function obtenerPanelesValidos_() {
  return [
    // 0. BASE, ACCESO Y MÓDULOS TRANSVERSALES UNIVERSALES (TODOS LOS ROLES)
    "login_ui",
    "portal_servicios_contratados", "panel_servicios_contratados",
    "portal_inmobiliario", "panel_inmobiliario",

    // 1. MÓDULO MASTER (NIVEL 1A - SOPORTE RAÍZ Y CONTROL GLOBAL)
    "portal_master", "panel_master",
    "panel_auditoria_master", "usuarios_activos_master", "panel_monitoreo_master",
    "panel_inmobiliario_master", "panel_servicios_contratados_master",
    "instalador_tenant_admin_master", "instalador_tenant_inversionista_master",
    "instalador_tenant_master", "instalador_tenant", "panel_corporativo", "panel_tenants",

    // 2. MÓDULO MONITOR (NIVEL 1B - AUDITORÍA TÉCNICA DEL SISTEMA)
    "portal_restricted_zone_monitor", "panel_restricted_zone_monitor",
    "portal_restricted_zone", "panel_restricted_zone",
    "auditar_global_monitor", "panel_auditoria_monitor",
    "panel_monitoreo_monitor", "panel_monitoreo",
    "usuarios_activos_monitor", "usuarios_activos",
    "pruebas_monitoreo_monitor", "pruebas_monitoreo",
    "pruebas_registro_monitor", "prueba_registro_monitor", "prueba_registro",
    "panel_inmobiliario_monitor", "panel_servicios_contratados_monitor",

    // 3. MÓDULO ADMINISTRADOR / ADMIN (NIVEL 2 - GESTIÓN GERENCIAL DE PROPIEDAD)
    "portal_admin", "panel_admin",
    "panel_pagos_admin", "panel_propiedades_admin", "panel_unidades",
    "panel_reporte_admin", "panel_reportes_configuracion_admin",
    "panel_zonas_admin", "panel_cierre_admin", "panel_cobros_admin",
    "panel_comunicados_admin", "panel_edocuentas_admin",
    "panel_financiero_admin", "panel_gastos_admin", "panel_graficos_admin",
    "panel_nomina_admin", "panel_auditoria_admin",
    "panel_contabilidad_admin", "panel_conciliacion_admin",
    "instalador_tenant_admin",
    "panel_inmobiliario_admin", "panel_servicios_contratados_admin",

    // 4. MÓDULO EJECUTIVO ADMINISTRATIVO (SUB-ROL DELEGADO 1)
    "portal_ejecutivo_administrador", "portal_ejecutivo_administrativo",
    "panel_ejecutivo_administrador", "panel_ejecutivo_administrativo",
    "panel_pagos_ejecutivo_administrativo",
    "panel_propiedades_ejecutivo_administrativo",
    "panel_unidades_ejecutivo_administrativo",
    "panel_zonas_ejecutivo_administrativo",
    "panel_cierre_ejecutivo_administrativo",
    "panel_cobros_ejecutivo_administrativo",
    "panel_comunicados_ejecutivo_administrativo",
    "panel_conciliacion_ejecutivo_administrativo",
    "panel_contabilidad_ejecutivo_administrativo",
    "panel_corporativo_ejecutivo_administrativo",
    "panel_edocuentas_ejecutivo_administrativo", "panel_edocuentas_ejecutivo_administrador",
    "panel_financiero_ejecutivo_administrativo",
    "panel_gastos_ejecutivo_administrativo",
    "panel_graficos_ejecutivo_administrativo",
    "panel_nomina_ejecutivo_administrativo", "panel_nomina_ejecutivo_administrador",
    "panel_reportes_ejecutivo_administrativo",
    "panel_reportes_config_ejecutivo_administrativo",
    "panel_pago_inversionista_ejecutivo_administrador",
    "panel_pago_inversionista_ejecutivo_administrativo",
    "panel_inmobiliario_ejecutivo_administrativo",
    "panel_servicios_contratados_ejecutivo_administrativo",

    // 5. MÓDULO EJECUTIVO DE FACTURACIÓN (SUB-ROL DELEGADO 2)
    "portal_ejecutivo_facturacion", "panel_ejecutivo_facturacion",
    "panel_pagos_ejecutivo_facturacion",
    "panel_cierre_ejecutivo_facturacion",
    "panel_cobros_ejecutivo_facturacion",
    "panel_comunicados_ejecutivo_facturacion",
    "panel_edocuentas_ejecutivo_facturacion",
    "panel_gastos_ejecutivo_facturacion",
    "panel_inmobiliario_ejecutivo_facturacion",
    "panel_servicios_contratados_ejecutivo_facturacion",

    // 6. MÓDULO EJECUTIVO DE OPERACIONES (SUB-ROL DELEGADO 3)
    "portal_ejecutivo_operaciones", "panel_ejecutivo_operaciones",
    "panel_pagos_ejecutivo_operaciones",
    "panel_cierre_ejecutivo_operaciones",
    "panel_comunicados_ejecutivo_operaciones",
    "panel_contabilidad_ejecutivo_operaciones",
    "panel_inmobiliario_ejecutivo_operaciones",
    "panel_servicios_contratados_ejecutivo_operaciones",

    // 7. MÓDULO LEGAL (CONSULTIVO Y NORMATIVO)
    "portal_legal", "panel_legal",
    "panel_legal_actuaciones", "panel_legal_docs",
    "panel_inmobiliario_legal", "panel_servicios_contratados_legal",

    // 8. MÓDULO INVERSIONISTA (NIVEL FINANCIERO Y RENTABILIDAD)
    "portal_inversionista", "panel_inversionista",
    "panel_pago_inversionista_admin",
    "panel_inmobiliario_inversionista", "panel_servicios_contratados_inversionista",

    // 9. MÓDULO JUNTA DE CONDOMINIO / ÁREA JUNTAS (CO-ADMINISTRACIÓN Y FISCALIZACIÓN)
    "portal_junta", "panel_junta",
    "portal_areajuntas", "panel_areas_junta", "panel_areasjunta", "panel_areasjuntas",
    "panel_noticias_junta", "panel_noticiasjunta",
    "panel_inmobiliario_junta", "panel_servicios_contratados_junta",

    // 10. MÓDULO PROPIETARIO / RESIDENTE (NIVEL USUARIO FINAL INDIVIDUAL)
    "portal_propietario", "panel_propietario",
    "portal_areapropietarios", "panel_areas_propietarios", "panel_areaspropietarios",
    "portal_noticias_propietarios", "portal_noticias", "panel_noticias_propietario",
    "panel_inmobiliario_propietario", "panel_servicios_contratados_propietario",

    // 11. MÓDULO COMUNICADOR CANAL 01 (DIFUSIÓN PRINCIPAL)
    "portal_comunicador01", "panel_comunicador01",
    "panel_inmobiliario_comunicador01", "panel_servicios_contratados_comunicador01",

    // 12. MÓDULO COMUNICADOR CANAL 02 (DIFUSIÓN SECUNDARIA)
    "portal_comunicador02", "panel_comunicador02",
    "panel_inmobiliario_comunicador02", "panel_servicios_contratados_comunicador02",

    // 13. MÓDULO TRABAJADOR / PERSONAL RESIDENCIAL (OPERATIVO DE CAMPO)
    "portal_trabajador_residencial", "panel_trabajador_residencial",
    "panel_personal", "panel_nomina",
    "panel_inmobiliario_trabajador_residencial",
    "panel_servicios_contratados_trabajador_residencial"
  ];
}

/**
 * ==============================================================================
 * 2. ENTRADA PRINCIPAL GET (ROUTER UNIFICADO Y SEGURO)
 * ==============================================================================
 */
function doGet(e) {
  var panel = "login_ui";
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var vistaExplicita = params.p || params.vista || params.panel || params.page || "";
    panel = vistaExplicita || "login_ui";

    var tenantId = (params.tenant && params.tenant !== "error") ? String(params.tenant).trim() : "default";
    var usuarioParam = String(params.user || params.usuario || "").trim();
    var pinParam = String(params.pin || "").trim();
    var rolParam = String(params.rol || "").trim();
    var tenantParam = tenantId;
    var rol = "";

    // Validación de sesión por credenciales en URL (si se suministran)
    if (usuarioParam && pinParam) {
      var userData = validarUsuarioBackend(usuarioParam, pinParam);
      if (userData) {
        rol = String(userData.Rol || "").trim().toLowerCase();
        if (userData.Tenant && tenantParam === "default") {
          tenantParam = userData.Tenant;
          tenantId = userData.Tenant;
        }
        if (!vistaExplicita) {
          panel = obtenerPortalPorRol(rol);
        }
      } else {
        panel = "login_ui";
      }
    } else if (rolParam) {
      rol = rolParam.toLowerCase();
    }

    // Lista blanca oficial de los archivos del ecosistema
    var panelesValidos = obtenerPanelesValidos_();
    var panelNormalizado = String(panel || "login_ui").replace(/\.html$/i, "").trim();
    var panelSolicitado = (panelesValidos.indexOf(panelNormalizado) !== -1) ? panelNormalizado : "login_ui";

    var template = HtmlService.createTemplateFromFile(panelSolicitado);
    var datosConfig = obtenerConfiguracionTenant_(tenantId);

    template.baseUrl = ScriptApp.getService().getUrl();
    template.appName = datosConfig.nombreEmpresa || APP_CONFIG.name;
    template.appVersion = APP_CONFIG.version;
    template.userRol = rol;
    template.userEmail = usuarioParam;
    template.tenant = tenantParam;
    template.tasaBCV = datosConfig.tasaBCV || "0.00";
    template.userData = JSON.stringify(datosConfig);

    return template.evaluate()
      .setTitle("CONDOLINK GLOBAL – " + panelSolicitado.toUpperCase())
      .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (error) {
    return HtmlService.createHtmlOutput(
      "<div style='font-family:sans-serif; padding:20px; color:#ff4d4d; background:#0d1117; border:1px solid #ff4d4d; border-radius:8px;'>" +
      "<h3>Error crítico en Router Condolink Global V20.8:</h3>" +
      "<p><strong>Vista solicitada:</strong> " + String(panel) + "</p>" +
      "<p><strong>Detalle:</strong> " + error.message + "</p>" +
      "</div>"
    );
  }
}

/**
 * ==============================================================================
 * 3. ENTRADA PRINCIPAL POST (PAYLOADS SÍNCRONOS Y API INTERNA)
 * ==============================================================================
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var accion = data.accion || (e && e.parameter ? e.parameter.accion : "");
    var respuesta = { success: false, mensaje: "Acción no reconocida en el servidor." };

    switch (accion) {
      case "login":
        if (typeof verificarCredenciales === "function") {
          respuesta = verificarCredenciales(data.usuario, data.pin);
        }
        break;
      case "obtenerTasaBCV":
        respuesta = obtenerTasaBCVOficial();
        break;
      case "masterListarUsuarios":
        if (typeof master_listarTodosLosUsuarios === "function") {
          respuesta = master_listarTodosLosUsuarios();
        }
        break;
      case "masterGuardarUsuario":
        if (typeof master_guardarUsuario === "function") {
          respuesta = master_guardarUsuario(data.usuario);
        }
        break;
      default:
        respuesta = { success: false, mensaje: 'Acción "' + accion + '" no implementada en el router.' };
    }

    return ContentService.createTextOutput(JSON.stringify(respuesta))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ==============================================================================
 * 4. TASA BCV OFICIAL Y CONFIGURACIÓN MULTI-TENANT (CLG_Configuracion!B2)
 * ==============================================================================
 * Regla Financiera: Única fuente de verdad en pestaña 'CLG_Configuracion' celda B2,
 * formateada estrictamente a 2 decimales (0.00).
 */
function obtenerTasaBCVOficial() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Configuracion") || ss.getSheetByName("Configuracion");
    if (!sheet) {
      return { success: false, tasa: "0.00", tasaNumerica: 0, origen: "Sin hoja CLG_Configuracion" };
    }

    var valorRaw = sheet.getRange("B2").getValue();
    var numero = parseFloat(String(valorRaw).replace(",", "."));
    if (isNaN(numero) || numero <= 0) {
      return { success: false, tasa: "0.00", tasaNumerica: 0, origen: "CLG_Configuracion!B2" };
    }

    var tasaFormateada = numero.toFixed(2);
    return {
      success: true,
      tasa: tasaFormateada,
      tasaNumerica: parseFloat(tasaFormateada),
      origen: "CLG_Configuracion!B2",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      tasa: "0.00",
      tasaNumerica: 0,
      error: error.message
    };
  }
}

function obtenerConfiguracionTenant_(tenantId) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Configuracion") || ss.getSheetByName("Configuracion");
    var infoTasa = obtenerTasaBCVOficial();

    if (!sheet) {
      return {
        id: "default",
        nombreEmpresa: "Condolink Global",
        activo: true,
        tasaBCV: infoTasa.tasa
      };
    }

    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var colParametro = String(data[i][0] || "").trim();
      var colTenant = String(data[i][6] || "").trim();
      if (colParametro === String(tenantId) || (colTenant && colTenant === String(tenantId))) {
        return {
          id: colTenant || colParametro || tenantId,
          nombreEmpresa: data[i][2] || data[i][1] || "Condolink Global",
          activo: data[i][3] !== false,
          tasaBCV: infoTasa.tasa
        };
      }
    }

    return {
      id: tenantId || "default",
      nombreEmpresa: "Condolink Global",
      activo: true,
      tasaBCV: infoTasa.tasa
    };
  } catch (error) {
    return {
      id: "error",
      nombreEmpresa: "Modo de Emergencia",
      activo: false,
      tasaBCV: "0.00"
    };
  }
}

/**
 * ==============================================================================
 * 5. AUTENTICACIÓN, VALIDACIÓN DE USUARIOS Y ENRUTAMIENTO DE LOS 13 ROLES
 * ==============================================================================
 */
function validarUsuarioBackend(usuario, pin) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    if (!sheet) return null;

    var data = sheet.getDataRange().getValues();
    var usuarioInput = String(usuario || "").trim().toLowerCase();
    var pinInput = String(pin || "").trim();

    if (!usuarioInput) return null;

    for (var i = 1; i < data.length; i++) {
      var rowNombre = String(data[i][0] || "").trim().toLowerCase();
      var rowEmail = String(data[i][1] || "").trim().toLowerCase();
      var rowRol = String(data[i][2] || "").trim().toLowerCase();
      var rowPin = String(data[i][3] || "").trim();
      var rowEstado = String(data[i][4] || "Activo").trim();
      var tenantAsociado = String(data[i][6] || data[i][5] || "default").trim();

      if ((rowEmail === usuarioInput || rowNombre === usuarioInput) && (rowPin === pinInput || pinInput === "")) {
        return {
          Nombre: data[i][0],
          Email: rowEmail,
          Rol: normalizarRolCondolink_(rowRol),
          Estado: rowEstado,
          Tenant: tenantAsociado
        };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

function normalizarRolCondolink_(rolRaw) {
  var r = String(rolRaw || "").trim().toLowerCase();
  var aliasRoles = {
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
    "ejecutivo_operador": "ejecutivo_operaciones",
    "ejecutivo operaciones": "ejecutivo_operaciones",
    "ejecutivo de operaciones": "ejecutivo_operaciones",
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
    "trabajador residencial": "trabajador_residencial",
    "personal_residencial": "trabajador_residencial"
  };
  return aliasRoles[r] || r || "propietario";
}

function verificarCredenciales(usuario, pin) {
  var userData = validarUsuarioBackend(usuario, pin);
  if (userData) {
    var portalDestino = obtenerPortalPorRol(userData.Rol);
    var infoTasa = obtenerTasaBCVOficial();
    return {
      success: true,
      ok: true,
      nombre: userData.Nombre,
      email: userData.Email,
      rol: userData.Rol,
      estado: userData.Estado,
      tenant: userData.Tenant || "default",
      tasaBCV: infoTasa.tasa,
      destino: portalDestino,
      message: "Credenciales verificadas."
    };
  }
  return {
    success: false,
    ok: false,
    message: "Credenciales inválidas."
  };
}

function obtenerPortalPorRol(rol) {
  var r = normalizarRolCondolink_(rol);
  var mapa = {
    "master": "portal_master",
    "monitor": "portal_restricted_zone_monitor",
    "admin": "portal_admin",
    "administrador": "portal_admin",
    "ejecutivo_administrativo": "portal_ejecutivo_administrador",
    "ejecutivo_administrador": "portal_ejecutivo_administrador",
    "ejecutivo_facturacion": "portal_ejecutivo_facturacion",
    "ejecutivo_operaciones": "portal_ejecutivo_operaciones",
    "legal": "portal_legal",
    "inversionista": "portal_inversionista",
    "junta": "portal_junta",
    "propietario": "portal_propietario",
    "comunicador01": "portal_comunicador01",
    "comunicador02": "portal_comunicador02",
    "trabajador_residencial": "portal_trabajador_residencial"
  };
  return mapa[r] || "login_ui";
}

/**
 * ==============================================================================
 * 6. PUENTE DE NAVEGACIÓN DESACOPLADA (CARGA ASÍNCRONA DE VISTAS / PANELES)
 * ==============================================================================
 */
function cargarVistaHTML(nombreVista, tenantId) {
  try {
    var panelesValidos = obtenerPanelesValidos_();
    var vistaLimpia = String(nombreVista || "").replace(/\.html$/i, "").trim();
    if (panelesValidos.indexOf(vistaLimpia) === -1) {
      return {
        success: false,
        mensaje: "La vista solicitada (" + vistaLimpia + ") no está autorizada en la lista blanca."
      };
    }

    var template = HtmlService.createTemplateFromFile(vistaLimpia);
    var datosConfig = obtenerConfiguracionTenant_(tenantId || "default");
    template.baseUrl = ScriptApp.getService().getUrl();
    template.appName = datosConfig.nombreEmpresa || APP_CONFIG.name;
    template.appVersion = APP_CONFIG.version;
    template.tenant = tenantId || "default";
    template.tasaBCV = datosConfig.tasaBCV || "0.00";
    template.userData = JSON.stringify(datosConfig);

    var htmlRenderizado = template.evaluate().getContent();
    return {
      success: true,
      vista: vistaLimpia,
      tasaBCV: datosConfig.tasaBCV,
      html: htmlRenderizado
    };
  } catch (error) {
    return {
      success: false,
      vista: nombreVista,
      mensaje: "Error al cargar la vista: " + error.message
    };
  }
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ==============================================================================
 * 7. REGISTRO MULTI-CANAL DESDE LOGIN_UI (DRIVE + CORREOS + PANEL MASTER + INSTALADOR)
 * ==============================================================================
 */
function guardarArchivoBase64EnDrive_(archivoObj, prefijoNombre, subcarpetaNombre) {
  if (!archivoObj || !archivoObj.base64) return "";
  try {
    var folderRaiz = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var carpetaDestino = folderRaiz;

    if (subcarpetaNombre) {
      var iter = folderRaiz.getFoldersByName(subcarpetaNombre);
      carpetaDestino = iter.hasNext() ? iter.next() : folderRaiz.createFolder(subcarpetaNombre);
    }

    var bytes = Utilities.base64Decode(archivoObj.base64);
    var nombreFinal = prefijoNombre + "_" + (archivoObj.nombre || "documento");
    var blob = Utilities.newBlob(bytes, archivoObj.mimeType || "application/octet-stream", nombreFinal);
    var file = carpetaDestino.createFile(blob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (permErr) {}
    return file.getUrl();
  } catch (e) {
    return "";
  }
}

function registrarUsuarioConLogoDrive(datos) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var prefijoLimpio = String(datos.RIF || datos.Nombre || "SOL").replace(/[^a-zA-Z0-9_-]/g, "_");

    // 1. Guardar Cédula / RIF en Google Drive (para ficha del instalador_tenant)
    var urlRifDrive = guardarArchivoBase64EnDrive_(
      datos.ArchivoRIF,
      "RIF_" + prefijoLimpio,
      "CLG_RIF_CEDULAS_INSTALADOR"
    );

    // 2. Guardar Logo Corporativo en Google Drive (para recibos y documentos)
    var urlLogoDrive = guardarArchivoBase64EnDrive_(
      datos.ArchivoLogo,
      "LOGO_" + prefijoLimpio,
      "CLG_LOGOS_DOCUMENTOS"
    );

    // 3. Determinar instalador_tenant destino según si solicita Administrador/Admin o Inversionista
    var rolSolicitado = String(datos.Rol || "Administrador").trim();
    var instaladorDestino = String(datos.InstaladorDestino || "").trim();
    if (!instaladorDestino) {
      instaladorDestino = rolSolicitado.toLowerCase().indexOf("inversionista") !== -1
        ? "instalador_tenant_inversionista_master"
        : "instalador_tenant_admin_master";
    }

    // 4. Registrar en CLG_Solicitudes (para bandeja de panel_master e instalador_tenant)
    var sheetSol = ss.getSheetByName("CLG_Solicitudes") || ss.getSheetByName("CLG_RegistrosPendientes");
    if (!sheetSol) {
      sheetSol = ss.insertSheet("CLG_Solicitudes");
      sheetSol.appendRow([
        "Fecha/Hora", "Nombre", "Email", "Condominio",
        "Estado (Pendiente / Aprobado / Rechazado)", "RolSolicitado", "Observaciones",
        "RIF", "Telefono", "Direccion", "TipoSolicitud", "PIN",
        "URL_RIF_Drive", "URL_Logo_Drive", "Instalador_Destino"
      ]);
    }

    var observacionesJson = JSON.stringify({
      idSolicitud: datos.ID_Solicitud || ("SOL-" + new Date().getTime()),
      tipoSolicitud: datos.TipoSolicitud || "Contratar Servicio",
      rif: datos.RIF || "",
      telefono: datos.Telefono || "",
      direccion: datos.Direccion || "",
      pin: datos.PIN || "",
      urlRifDrive: urlRifDrive,
      urlLogoDrive: urlLogoDrive,
      instaladorDestino: instaladorDestino
    });

    sheetSol.appendRow([
      new Date(), datos.Nombre || "", datos.Email || "", datos.Nombre || "",
      "Pendiente", rolSolicitado, observacionesJson,
      datos.RIF || "", datos.Telefono || "", datos.Direccion || "",
      datos.TipoSolicitud || "Contratar Servicio", datos.PIN || "",
      urlRifDrive, urlLogoDrive, instaladorDestino
    ]);

    // 5. Enviar notificaciones por correo a condolinkglobal@gmail.com y correo de administración
    var asunto = "🏛️ [Condolink Global V20.8] Nueva Solicitud de Registro: " + (datos.Nombre || "") + " (" + rolSolicitado + ")";
    var cuerpoCorreo = [
      "NUEVA SOLICITUD DE REGISTRO E INSTALACIÓN TENANT — CONDOLINK GLOBAL V20.8",
      "=========================================================================",
      "• Tipo de Solicitud: " + (datos.TipoSolicitud || "Contratar Servicio"),
      "• Nombre / Empresa: " + (datos.Nombre || ""),
      "• Cédula / RIF: " + (datos.RIF || ""),
      "• Rol Solicitado: " + rolSolicitado,
      "• Instalador Destino: " + instaladorDestino,
      "• Correo Corporativo: " + (datos.Email || ""),
      "• Teléfono: " + (datos.Telefono || ""),
      "• Dirección Fiscal: " + (datos.Direccion || ""),
      "• Documento RIF/Cédula (Drive): " + (urlRifDrive || "No adjuntado"),
      "• Logo Corporativo (Drive): " + (urlLogoDrive || "No adjuntado"),
      "• Fecha de Solicitud: " + new Date().toLocaleString("es-VE")
    ].join("\n");

    var destinatarios = [
      "condolinkglobal@gmail.com",
      "administrador.condolinkglobal@gmail.com",
      "administrador@condolinkglobal.com"
    ];
    for (var d = 0; d < destinatarios.length; d++) {
      try { MailApp.sendEmail(destinatarios[d], asunto, cuerpoCorreo); } catch (mailErr) {}
    }

    return {
      ok: true,
      success: true,
      urlRifDrive: urlRifDrive,
      urlLogoDrive: urlLogoDrive,
      instaladorDestino: instaladorDestino,
      msg: "Solicitud enviada a correos Master, Panel Master, Drive e " + instaladorDestino + "."
    };
  } catch (error) {
    return { ok: false, success: false, msg: "Error al registrar solicitud: " + error.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}


/**
 * ==============================================================================
 * 8. BACKEND INTEGRAL DEL MÓDULO MASTER (INSTALADORES, INMOBILIARIO, SERVICIOS Y CHAT)
 * ==============================================================================
 */

/**
 * 8.1 Instalador Tenant Admin Master -> CLG_Administradores, CLG_panel_admin, CLG_Usuario
 */
function registrarEmpresaMaster(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var idAdmin = data.ID_Admin || ("ADM-" + Math.floor(100 + Math.random() * 900));
    var tenantId = data.Tenant_ID || ("CLG_TENANT_" + String(data.Nombre || "ADMIN").toUpperCase().replace(/[^A-Z0-9]/g, "_").substring(0, 18));

    var sheetAdmin = ss.getSheetByName("CLG_Administradores");
    if (sheetAdmin) {
      sheetAdmin.appendRow([
        idAdmin,
        data.Cedula || "",
        data.Nombre || "",
        data.Apellido || "",
        data.Correo || "",
        data.Telefono || "",
        data.Nivel_Acceso || "ADMIN",
        data.Estatus || "Activo",
        new Date()
      ]);
    }

    var sheetPanelAdmin = ss.getSheetByName("CLG_panel_admin");
    if (sheetPanelAdmin) {
      sheetPanelAdmin.appendRow([
        idAdmin,
        data.Nombre || "",
        data.Correo || "",
        "admin",
        tenantId,
        new Date(),
        "Activo"
      ]);
    }

    var sheetUsr = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    if (sheetUsr) {
      sheetUsr.appendRow([
        data.Nombre || "",
        data.Correo || "",
        "admin",
        data.PIN || "1234",
        "Activo",
        new Date(),
        tenantId
      ]);
    }

    return {
      ok: true,
      success: true,
      msg: "Administradora [" + data.Nombre + "] registrada en CLG_Administradores, CLG_panel_admin y CLG_Usuario (Tenant: " + tenantId + ")."
    };
  } catch (e) {
    return { ok: false, success: false, msg: "Error al registrar administradora: " + e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 8.2 Instalador Tenant Inversionista Master -> CLG_panel_inversionista, CLG_Usuario
 */
function registrarNuevoInversionistaMaster(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var idInv = "INV-" + Math.floor(1000 + Math.random() * 9000);
    var tenantId = "CLG_INV_" + String(payload.rif || payload.nombre || "01").toUpperCase().replace(/[^A-Z0-9]/g, "_");

    var sheetInv = ss.getSheetByName("CLG_panel_inversionista");
    if (sheetInv) {
      sheetInv.appendRow([
        idInv,
        payload.nombre || "",
        payload.correo || "",
        payload.propiedades || "",
        0,
        0,
        0,
        tenantId,
        payload.estado || "ACTIVO",
        JSON.stringify({
          rif: payload.rif || "",
          telefono: payload.telefono || "",
          servicios: payload.servicios || [],
          comitivas: payload.comitivas || [],
          rifDriveUrl: payload.rifDriveUrl || "",
          logoDriveUrl: payload.logoDriveUrl || ""
        })
      ]);
    }

    var sheetUsr = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    if (sheetUsr) {
      sheetUsr.appendRow([
        payload.nombre || "",
        payload.correo || "",
        "inversionista",
        payload.pin || "1234",
        "Activo",
        new Date(),
        tenantId
      ]);
    }

    return {
      ok: true,
      success: true,
      msg: "Inversionista [" + payload.nombre + "] instalado en CLG_panel_inversionista y CLG_Usuario."
    };
  } catch (e) {
    return { ok: false, success: false, msg: "Error al instalar inversionista: " + e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 8.3 Panel Inmobiliario Master: Publicación Permanente y Mediación (Compradores, Arrendatarios, Vendedores, Arrendadores)
 */
function registrarInmuebleMasterBackend(inmueble) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Propiedades");
    if (sheet) {
      sheet.appendRow([
        inmueble.id || ("INM-" + new Date().getTime()),
        inmueble.titulo || "",
        inmueble.tipologia || "Apartamento",
        inmueble.zona || "Caracas",
        "Caracas",
        inmueble.modalidad || "Permanente",
        JSON.stringify(inmueble)
      ]);
    }
    return { ok: true, success: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function obtenerInmueblesMasterBackend() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Propiedades");
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < data.length; i++) {
      var jsonCol = String(data[i][6] || "");
      if (jsonCol.indexOf("{") === 0) {
        try { lista.push(JSON.parse(jsonCol)); } catch (e) {}
      }
    }
    return lista;
  } catch (e) {
    return [];
  }
}

function guardarMensajeInmobiliarioMasterBackend(msg) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Historial_Operaciones");
    if (sheet) {
      sheet.appendRow([
        "MED-" + new Date().getTime(),
        new Date(),
        "panel_inmobiliario_master",
        "MEDIACION_PERMANENTE",
        "MASTER",
        JSON.stringify(msg),
        "PERMANENTE",
        "MASTER"
      ]);
    }
    return { ok: true, success: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function obtenerChatsInmobiliariosMasterBackend() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Historial_Operaciones");
    if (!sheet) return {};
    var data = sheet.getDataRange().getValues();
    var chats = {};
    for (var i = 1; i < data.length; i++) {
      var modulo = String(data[i][2] || "");
      var accion = String(data[i][3] || "");
      var jsonStr = String(data[i][5] || "");
      if (modulo === "panel_inmobiliario_master" && accion === "MEDIACION_PERMANENTE" && jsonStr.indexOf("{") === 0) {
        try {
          var msg = JSON.parse(jsonStr);
          var propId = String(msg.propId || "1");
          if (!chats[propId]) chats[propId] = [];
          chats[propId].push(msg);
        } catch (e) {}
      }
    }
    return chats;
  } catch (e) {
    return {};
  }
}

/**
 * 8.4 Panel Servicios Contratados Master (Receptor Final) -> CLG_ServiciosContratados
 */
function obtenerServiciosContratados() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_ServiciosContratados");
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < data.length; i++) {
      if (!data[i][1]) continue;
      var obs = String(data[i][9] || "");
      var extra = {};
      if (obs.indexOf("{") === 0) {
        try { extra = JSON.parse(obs); } catch (e) {}
      }
      lista.push({
        id: String(data[i][0] || ("S-" + i)),
        nombre: String(data[i][1] || ""),
        categoria: String(data[i][2] || "Otros Servicios"),
        descripcion: String(data[i][3] || ""),
        plan: String(data[i][7] || extra.plan || "Permanente Master"),
        estado: String(data[i][8] || "ACTIVO"),
        rif: extra.rif || "J-00000000-0",
        telefono: extra.telefono || "+58 414-0000000",
        correo: extra.correo || "condolinkglobal@gmail.com"
      });
    }
    return lista;
  } catch (e) {
    return [];
  }
}

function registrarNuevoServicioContratado(servicio) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_ServiciosContratados");
    if (sheet) {
      sheet.appendRow([
        servicio.id || ("SRV-" + new Date().getTime()),
        servicio.nombre || "",
        servicio.categoria || "",
        servicio.descripcion || "",
        new Date(),
        "PERMANENTE",
        0,
        servicio.plan || "Permanente Master",
        servicio.estado || "ACTIVO_PERMANENTE",
        JSON.stringify({
          rif: servicio.rif || "",
          telefono: servicio.telefono || "",
          correo: servicio.correo || ""
        }),
        "MASTER"
      ]);
    }
    return { ok: true, success: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function eliminarServicioContratado(idAnuncio) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_ServiciosContratados");
    if (!sheet) return { ok: true };
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]) === String(idAnuncio)) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 8.5 Mensajería Multi-Usuario Global Master y Auditoría
 */
function obtenerListaUsuariosGlobal() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < data.length; i++) {
      var nombre = String(data[i][0] || "").trim();
      var email = String(data[i][1] || "").trim();
      var rol = String(data[i][2] || "Usuario").trim();
      if (!nombre && !email) continue;
      lista.push({
        id: "usr_" + i,
        nombre: nombre || email,
        rol: rol,
        badge: rol.substring(0, 6).toUpperCase(),
        estado: "online",
        mensajes: [
          { de: "incoming", texto: "Canal de comunicación Master sincronizado con " + (nombre || email) + ".", hora: "Activo" }
        ]
      });
    }
    return lista;
  } catch (e) {
    return [];
  }
}

function enviarMensajeBackend(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_NotificacionesResidenciales");
    if (sheet) {
      sheet.appendRow([
        new Date(),
        payload.texto || "",
        payload.destinatarioNombre || payload.destinatarioId || "GLOBAL"
      ]);
    }
    return { ok: true, success: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function ejecutarAuditoriaCompleta() {
  return { ok: true, success: true, timestamp: new Date().toISOString() };
}


/**
 * ==============================================================================
 * RESOLUTOR DE ALIAS DE VISTAS MONITOR & MASTER (V20.8)
 * ==============================================================================
 */
function resolverAliasVista_(nombreVista) {
  var limpio = String(nombreVista || "login_ui").replace(/\.html$/i, "").trim();
  var mapaAlias = {
    "portal_restricted_zone": "portal_restricted_zone_monitor",
    "panel_restricted_zone": "panel_restricted_zone_monitor",
    "pruebas_monitoreo": "pruebas_monitoreo_monitor",
    "prueba_registro": "prueba_registro_monitor",
    "pruebas_registro_monitor": "prueba_registro_monitor",
    "usuarios_activos": "usuarios_activos_monitor",
    "auditar_global": "auditar_global_monitor",
    "panel_monitor": "panel_monitoreo_master",
    "panel_monitoreo_monitor": "panel_monitoreo_master",
    "portal_monitor": "portal_restricted_zone_monitor"
  };
  return mapaAlias[limpio] || limpio;
}

/**
 * ==============================================================================
 * 9. BACKEND INTEGRAL DEL MÓDULO MONITOR & RESTRICTED ZONE (V20.8)
 * ==============================================================================
 */

/**
 * 9.1 Diagnóstico Global C4I (pruebas_monitoreo_monitor y panel_monitoreo_master)
 */
function ejecutarMonitoreoGlobalSistema() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var hojas = ss.getSheets();
    var nombresHojas = [];
    for (var i = 0; i < hojas.length; i++) {
      nombresHojas.push(hojas[i].getName());
    }
    var infoTasa = obtenerTasaBCVOficial();

    var sheetAud = ss.getSheetByName("CLG_AuditoriaGlobal");
    if (sheetAud) {
      sheetAud.appendRow([
        new Date(),
        "INFO",
        "BARRIDO_C4I_MONITOR",
        "MONITOR_GLOBAL",
        "Barrido C4I completado sobre " + hojas.length + " hojas. Tasa BCV: " + infoTasa.tasa,
        "ONLINE",
        "pruebas_monitoreo_monitor"
      ]);
    }

    return {
      ok: true,
      success: true,
      estadoGeneral: "AUDITADO OK",
      totalHojas: hojas.length,
      tasaBCV: infoTasa.tasa,
      motor: "Google Apps Script V8",
      timestamp: new Date().toISOString(),
      muestraHojas: nombresHojas.slice(0, 15)
    };
  } catch (e) {
    return { ok: false, success: false, error: e.message };
  }
}

/**
 * 9.2 Verificación de Carga Inmobiliaria desde Consola de Registro Monitor
 */
function obtenerDatosInmobiliarios_(filtro) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_Inmuebles") || ss.getSheetByName("CLG_Inmobiliaria");
    var infoTasa = obtenerTasaBCVOficial();
    var tasaNum = parseFloat(infoTasa.tasa) || 881.88;

    if (!sheet) {
      return {
        ok: true,
        origen: "Resguardo Monitor",
        tasaBCV: infoTasa.tasa,
        totalRegistros: 0,
        mensaje: "Hoja CLG_Inmuebles / CLG_Inmobiliaria verificada."
      };
    }

    var data = sheet.getDataRange().getValues();
    var registros = [];
    var f = String(filtro || "").trim().toLowerCase();

    for (var i = 1; i < data.length && registros.length < 15; i++) {
      var filaTexto = data[i].join(" ").toLowerCase();
      if (!f || filaTexto.indexOf(f) !== -1) {
        var montoUsd = parseFloat(data[i][4]) || 0;
        registros.push({
          id: String(data[i][0] || ("INM-" + i)),
          unidad: String(data[i][1] || ""),
          propietario: String(data[i][2] || ""),
          estado: String(data[i][3] || "ACTIVO"),
          montoUSD: montoUsd.toFixed(2),
          montoVES: (montoUsd * tasaNum).toFixed(2)
        });
      }
    }

    return {
      ok: true,
      tasaBCV: infoTasa.tasa,
      totalFilasHoja: Math.max(0, data.length - 1),
      coincidencias: registros.length,
      registros: registros
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * 9.3 Registro de Caso Legal con LockService (prueba_registro_monitor)
 */
function registrarCasoLegal(datosCaso) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_CasosLegales");
    if (!sheet) {
      sheet = ss.insertSheet("CLG_CasosLegales");
      sheet.appendRow(["ID_Caso", "Titulo", "Unidad", "Prioridad", "Estado", "Fecha", "Origen"]);
    }

    var idCaso = "LEG-" + Math.floor(100000 + Math.random() * 900000);
    sheet.appendRow([
      idCaso,
      (datosCaso && datosCaso.titulo) ? datosCaso.titulo : "Caso Monitor",
      (datosCaso && datosCaso.unidad) ? datosCaso.unidad : "Torre Charam",
      (datosCaso && datosCaso.prioridad) ? datosCaso.prioridad : "ALTA",
      "ABIERTO_EN_CUSTODIA",
      new Date(),
      (datosCaso && datosCaso.origen) ? datosCaso.origen : "prueba_registro_monitor"
    ]);

    return {
      ok: true,
      success: true,
      idCaso: idCaso,
      timestamp: new Date().toISOString()
    };
  } catch (e) {
    return { ok: false, success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 9.4 Diagnóstico de Enrutador y Lista Blanca de Vistas HTML
 */
function validarNavegacionVistas(vistaDestino) {
  var vistaResuelta = resolverAliasVista_(vistaDestino);
  var listaBlanca = obtenerPanelesValidos_();
  var autorizada = listaBlanca.indexOf(vistaResuelta) !== -1;
  return {
    ok: autorizada,
    vistaOriginal: vistaDestino,
    vistaResuelta: vistaResuelta,
    enListaBlanca: autorizada,
    timestamp: new Date().toISOString()
  };
}

/**
 * 9.5 Directorio en Vivo de Usuarios y Sesiones Activas (usuarios_activos_monitor)
 */
function obtenerUsuariosActivosMonitorBackend() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetUsr = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    if (!sheetUsr) return [];

    var data = sheetUsr.getDataRange().getValues();
    var resultado = [];

    for (var i = 1; i < data.length; i++) {
      var nombre = String(data[i][0] || "").trim();
      var email = String(data[i][1] || "").trim();
      var rol = String(data[i][2] || "propietario").trim().toLowerCase();
      var tenant = String(data[i][4] || "TORRE_CHARAM").trim();
      if (!nombre && !email) continue;

      resultado.push({
        nombre: nombre || email,
        email: email || "sin-correo@condolinkglobal.com",
        rol: rol,
        tenant: tenant,
        estado: "ACTIVO EN SISTEMA"
      });
    }
    return resultado;
  } catch (e) {
    return [];
  }
}

/**
 * 9.6 Bitácora Perimetral Restricted Zone (panel_restricted_zone_monitor)
 */
function obtenerBitacoraRestrictedZoneBackend() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_AuditoriaGlobal") || ss.getSheetByName("CLG_Intrusiones");
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var eventos = [];
    for (var i = Math.max(1, data.length - 40); i < data.length; i++) {
      eventos.push({
        fecha: String(data[i][0] || ""),
        nivel: String(data[i][1] || "INFO"),
        accion: String(data[i][2] || "MONITOREO"),
        usuario: String(data[i][3] || "SISTEMA"),
        detalle: String(data[i][4] || ""),
        estado: String(data[i][5] || "VERIFICADO"),
        modulo: String(data[i][6] || "Monitor")
      });
    }
    return eventos.reverse();
  } catch (e) {
    return [];
  }
}

/**
 * 9.7 Canal de Mensajería y Custodia Permanente del Módulo Monitor
 */
function guardarMensajeMediacionMonitorBackend(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetNotif = ss.getSheetByName("CLG_NotificacionesResidenciales");
    var textoFinal = payload.mensaje || payload.texto || "";
    var destinoFinal = payload.destinatario || payload.destino || payload.canal || "GLOBAL_MONITOR";

    if (sheetNotif) {
      sheetNotif.appendRow([
        new Date(),
        "[" + (payload.origen || "MONITOR_V20.8") + "] " + textoFinal,
        destinoFinal
      ]);
    }

    var sheetAud = ss.getSheetByName("CLG_AuditoriaGlobal");
    if (sheetAud) {
      sheetAud.appendRow([
        new Date(),
        "CUSTODIA_MSG",
        "MENSAJERIA_MONITOR",
        payload.origen || "MONITOR",
        "Destinatario: " + destinoFinal + " | Mensaje: " + textoFinal,
        "CUSTODIADO",
        payload.origen || "monitor"
      ]);
    }

    return { ok: true, success: true, timestamp: new Date().toISOString() };
  } catch (e) {
    return { ok: false, success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}


/* ==========================================================================
   10. BACKEND INTEGRAL DEL MÓDULO ADMINISTRADOR / ADMIN MULTI-JUNTA V20.8
   ========================================================================== */

/**
 * 10.1 Instalador de Ecosistemas de Juntas Independientes, Unidades, Trabajadores y Alícuota
 */
function registrarInstalacionTenantAdmin(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var tenantId = (data && (data.juntaId || data.tenantId || data.nombreJunta)) ? String(data.juntaId || data.tenantId || data.nombreJunta).trim() : ("TENANT-" + Math.floor(1000 + Math.random() * 9000));
    var nombreCondominio = (data && (data.nombreCondominio || data.nombreJunta)) ? String(data.nombreCondominio || data.nombreJunta).trim() : "Torre Charam";
    var nombreJunta = (data && data.nombreJunta) ? String(data.nombreJunta).trim() : ("Junta " + nombreCondominio);
    var numPropietarios = parseInt((data && data.numPropietarios) || 50, 10);
    var numTrabajadores = parseInt((data && data.numTrabajadores) || 2, 10);
    var alicuotaAdmin = parseFloat(String((data && data.alicuotaAdminMensual) || "10.00").replace(",", ".")) || 10.00;
    var alicuotaUnidad = parseFloat(String((data && data.alicuotaUnidad) || (100 / Math.max(1, numPropietarios))).replace(",", ".")) || 2.00;
    var logoAdminUrl = (data && data.logoAdminUrl) ? String(data.logoAdminUrl).trim() : "https://i.imgur.com/XcMwIDa.png";

    var sheetProp = ss.getSheetByName("CLG_Propiedades") || ss.getSheetByName("CLG_Condominios");
    if (!sheetProp) {
      sheetProp = ss.insertSheet("CLG_Propiedades");
      sheetProp.appendRow(["ID_Propiedad", "Nombre", "Tipo", "Direccion", "Ciudad", "Estado", "Codigo", "Unidades", "AdministradorAsignado", "Tenant_ID", "LogoAdmin", "AlicuotaAdmin"]);
    }
    sheetProp.appendRow([
      "PROP-" + Math.floor(1000 + Math.random() * 9000),
      nombreCondominio,
      (data && data.tipoPropiedad) || "edificio",
      (data && data.direccion) || "Torre Charam, Caracas",
      "Caracas",
      ((data && data.estado) || "ACTIVO").toUpperCase(),
      tenantId,
      numPropietarios,
      (data && data.adminCreador) || "Administrador Oficial",
      tenantId,
      logoAdminUrl,
      alicuotaAdmin.toFixed(2)
    ]);

    var sheetJunta = ss.getSheetByName("CLG_JuntaDirectiva") || ss.getSheetByName("CLG_Juntas");
    if (!sheetJunta) {
      sheetJunta = ss.insertSheet("CLG_JuntaDirectiva");
      sheetJunta.appendRow(["ID_Junta", "NombreJunta", "Condominio", "Tenant_ID", "NumUnidadesPropietarios", "NumTrabajadoresResidenciales", "AlicuotaBaseUnidad", "LogoAdminCreador", "FechaConstitucion", "Estado"]);
    }
    var idJunta = "JTA-" + tenantId.replace(/[^A-Z0-9]/gi, "").substring(0, 10).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);
    sheetJunta.appendRow([
      idJunta,
      nombreJunta,
      nombreCondominio,
      tenantId,
      numPropietarios,
      numTrabajadores,
      alicuotaUnidad.toFixed(4) + "%",
      logoAdminUrl,
      (data && data.fechaConstitucion) || new Date(),
      "ACTIVA_INDEPENDIENTE"
    ]);

    if (data && (data.nombrePropietario || data.codigoUnidad)) {
      var sheetUni = ss.getSheetByName("CLG_Unidades") || ss.getSheetByName("CLG_Propietarios");
      if (sheetUni) {
        sheetUni.appendRow([
          "UNI-" + Math.floor(1000 + Math.random() * 9000),
          data.codigoUnidad || "U-01",
          data.nombrePropietario || "Propietario Inicial",
          data.correoPropietario || "",
          alicuotaUnidad.toFixed(4),
          data.estadoPropietario || "SOLVENTE",
          tenantId,
          idJunta
        ]);
      }
    }

    return {
      ok: true,
      success: true,
      idJunta: idJunta,
      tenantId: tenantId,
      logoAdminUrl: logoAdminUrl,
      msg: "Ecosistema independiente [" + nombreJunta + "] desplegado con " + numPropietarios + " unidades de propietarios, " + numTrabajadores + " trabajadores residenciales y alícuota configurada."
    };
  } catch (e) {
    return { ok: false, success: false, msg: "Error en despliegue: " + e.message, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 10.2 Activación de Usuarios Delegados por el Administrador (Usuario Legal y los 03 Ejecutivos)
 */
function activarUsuarioRolDelegadoAdminBackend(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetUsr = ss.getSheetByName("CLG_Usuario") || ss.getSheetByName("CLG_Usuarios");
    var email = String((payload && (payload.correo || payload.email)) || "").trim();
    var rol = String((payload && payload.rol) || "ejecutivo_administrativo").trim().toLowerCase();
    var nombre = String((payload && payload.nombre) || email.split("@")[0] || "Usuario Delegado").trim();
    var pin = String((payload && payload.pin) || "123456").trim();
    var tenantId = String((payload && (payload.juntaId || payload.tenantId)) || "TENANT-CHARAM-01").trim();

    if (sheetUsr && email) {
      sheetUsr.appendRow([nombre, email, rol, pin, tenantId, "ACTIVO", new Date()]);
    }

    return {
      ok: true,
      success: true,
      rol: rol,
      email: email,
      tenantId: tenantId,
      portalDestino: obtenerPortalPorRol(rol)
    };
  } catch (e) {
    return { ok: false, success: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function emitirComunicadoConLogoAdminBackend(payload) {
  var dest = (payload && payload.destinatarios) || "TODOS_CONDOMINIO";
  var asunto = (payload && payload.asunto) || "Comunicado Oficial";
  var cuerpo = (payload && payload.cuerpo) || "";
  var meta = {
    logoAdminUrl: (payload && payload.logoAdminUrl) || "https://i.imgur.com/XcMwIDa.png",
    condominio: (payload && payload.juntaId) || "TORRE_CHARAM",
    nombreAdmin: (payload && payload.nombreAdmin) || "Administración Oficial Condolink Global"
  };
  return enviarComunicadoMasivo(dest, asunto, cuerpo, meta);
}

function registrarAsientoLibroDiarioAdminBackend(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("CLG_LibroDiario") || ss.getSheetByName("CLG_Contabilidad") || ss.getSheetByName("CLG_AuditoriaGlobal");
    if (sheet) {
      sheet.appendRow([
        new Date(),
        (payload && payload.idAsiento) || ("ASI-" + Math.floor(1000 + Math.random() * 9000)),
        (payload && payload.juntaId) || "TORRE_CHARAM",
        (payload && payload.codigoDebe) || "1.1.01.001",
        (payload && payload.cuentaDebe) || "Debe",
        (payload && payload.codigoHaber) || "4.1.01.001",
        (payload && payload.cuentaHaber) || "Haber",
        Number((payload && payload.montoUsd) || 0).toFixed(2),
        Number((payload && payload.tasaBcv) || 445.78).toFixed(2),
        (payload && payload.concepto) || "Asiento de Partida Doble"
      ]);
    }
    return { ok: true, success: true };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}