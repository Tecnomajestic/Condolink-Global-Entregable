# Condolink Global Enterprise V20.8
## Manual de Persistencia y Referencia de la API JSON (`/Docs`)

Este manual documenta el funcionamiento técnico del motor de persistencia JSON de **Condolink Global Enterprise**, sus endpoints HTTP, los métodos RPC y la interacción con los 28 portales y paneles de la aplicación.

---

### 1. Ubicación y Archivos de la Base de Datos

Todos los datos se encuentran en el directorio raíz `/db_json/`:

| Archivo JSON | Entidad / Módulo Representado | Estado Inicial |
|---|---|---|
| `configuracion.json` | Parámetros maestros, tasa BCV y datos sede | Activo |
| `tenants.json` | Clientes multi-tenant y licencias | Activo |
| `usuarios.json` | Directorio de credenciales para los 13 roles | Activo |
| `propiedades.json` | Inmuebles, torres y edificios administrados | Activo |
| `juntas.json` | Juntas de condominio autónomas | Activo |
| `unidades.json` | Apartamentos, alícuotas y estados de cuenta | Activo |
| `solicitudes.json` | Bandeja de entrada de registros y contratos | Activo |
| `servicios_contratados.json` | Proveedores (ascensores, bombas, vigilancia) | Activo |
| `libro_diario.json` | Asientos contables de partida doble y balances | Activo |
| `mensajes.json` | Historial multicanal (6 canales de comunicación) | Activo |
| `auditoria.json` | Trazabilidad forense y logs de diagnóstico C4I | Activo |
| `administradores.json` | Ficha técnica de empresas administradoras | Activo |
| `inversionistas.json` | Portafolios de inversión y rendimientos | Activo |

---

### 2. Endpoints HTTP Disponibles

#### 2.1 `GET /health`
* **Descripción**: Endpoint de salud del sistema y diagnóstico del motor JSON.
* **Respuesta**:
```json
{
  "status": "healthy",
  "system": "Condolink Global Enterprise",
  "version": "V20.8",
  "storage": "JSON File Database (db_json)",
  "entities": [ ... ],
  "timestamp": "2026-10-26T16:00:00.000Z"
}
```

#### 2.2 `GET /?p={nombre_modulo}`
* **Descripción**: Router universal que evalúa y sirve las plantillas HTML con las variables maestras inyectadas (`baseUrl`, `tasaBCV`, `userRol`, `tenant`, etc.).
* **Ejemplos de navegación**:
  - `/?p=login_ui`: Consola principal de acceso.
  - `/?p=portal_master&rol=master`: Portal del superusuario Master.
  - `/?p=portal_admin&rol=admin`: Portal de la administradora.
  - `/?p=panel_admin&rol=admin`: Consola general LCARS multi-junta.
  - `/?p=panel_pagos_admin`: Panel de pagos multimoneda y avisos de cobro.
  - `/?p=panel_libro_diario_admin`: Libro diario y balance contable.
  - `/?p=panel_monitoreo_master`: Consola de monitoreo y diagnóstico C4I.

#### 2.3 `POST /api/rpc`
* **Descripción**: Dispatcher universal de llamadas de procedimiento remoto (RPC) compatible con la sintaxis nativa de `google.script.run`.
* **Cuerpo de la Solicitud**:
```json
{
  "action": "nombreDeLaFuncion",
  "args": [ ...parametros ]
}
```

---

### 3. Catálogo de Procedimientos RPC Implementados

#### 3.1 Autenticación y Sesión
* `verificarCredenciales(usuario, pin)`:
  Valida el correo/usuario y PIN contra `db_json/usuarios.json`. Devuelve el objeto de sesión, rol, tenant, tasa BCV y portal de destino.
* `enviarRecuperacionPINPorUsuarioBackend(usuario)`:
  Recupera y despacha el PIN al correo del usuario registrado.
* `obtenerSesionUsuario()`:
  Retorna la información del usuario en sesión activa.

#### 3.2 Tasa Oficial BCV y Finanzas
* `obtenerTasaBCVOficial()` / `obtenerTasaBCV()`:
  Obtiene la tasa oficial vigente desde `db_json/configuracion.json` garantizando 2 decimales estrictos.
* `registrarAsientoLibroDiarioAdminBackend(asiento)`:
  Registra un asiento contable de partida doble en `db_json/libro_diario.json`, calculando automáticamente la conversión en bolívares según la tasa BCV.

#### 3.3 Gestión de Usuarios y Ecosistemas Multi-Junta
* `masterListarUsuarios()`:
  Retorna la lista de todos los usuarios registrados con su respectivo badge y tenant.
* `masterGuardarUsuario(usuario)`:
  Inserta o actualiza un usuario en `db_json/usuarios.json`, validando la integridad del tenant.
* `registrarInstalacionTenantAdmin(data)`:
  Crea una junta de condominio independiente, asigna su edificio, propietarios y alícuotas en `db_json/juntas.json`, `db_json/propiedades.json` y `db_json/unidades.json`.
* `activarUsuarioRolDelegadoAdminBackend(payload)`:
  Habilita usuarios delegados (Legal y los 3 Ejecutivos) asociándolos a la junta respectiva.

#### 3.4 Inmobiliario y Servicios
* `listarInmueblesMasterBackend()`:
  Consulta todos los inmuebles disponibles en `db_json/propiedades.json`.
* `registrarInmuebleMasterBackend(inmueble)`:
  Inserta un nuevo inmueble en la base de datos JSON.
* `listarServiciosContratadosBackend()`:
  Consulta los contratos de mantenimiento de ascensores, bombas y seguridad en `db_json/servicios_contratados.json`.
* `registrarServicioContratadoBackend(servicio)`:
  Da de alta un nuevo proveedor o servicio contratado.
* `eliminarServicioContratado(id)`:
  Elimina un servicio contratado de la base de datos.

#### 3.5 Mensajería y Auditoría C4I
* `guardarMensajeAdminBackend(payload)` / `enviarMensajeBackend(payload)`:
  Guarda mensajes en `db_json/mensajes.json` categorizados por canal (`JUNTA`, `EJECUTIVO`, `MASTER`, `INVERSIONISTA`, `LEGAL`, `PROPIETARIO`).
* `obtenerMensajesAdminBackend()`:
  Retorna el historial persistente de mensajería para poblar los chats LCARS.
* `ejecutarMonitoreoGlobalSistema()`:
  Realiza un escaneo forense de los archivos JSON en `db_json`, certifica la integridad referencial y genera un log en `db_json/auditoria.json`.
* `ejecutarAuditoriaCompleta()`:
  Ejecuta una auditoría completa del sistema.

---

### 4. Compatibilidad con el Frontend (Shim `google.script.run`)

Para evitar cualquier modificación de código en los archivos `.html` originales, el servidor Node.js inyecta automáticamente en cada página el siguiente script de compatibilidad:

```javascript
window.google.script.run = new Proxy({}, {
  get(target, prop) {
    if (prop === 'withSuccessHandler') return (fn) => createRpcProxy(fn, failureHandler);
    if (prop === 'withFailureHandler') return (fn) => createRpcProxy(successHandler, fn);
    return (...args) => fetch('/api/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: prop, args: args })
    }).then(res => res.json()).then(successHandler).catch(failureHandler);
  }
});
```

Esto asegura que:
1. Las llamadas nativas existentes funcionan de manera 100% transparente.
2. Toda la persistencia viaja hacia `/db_json/`.
3. No se requiere conexión a Google Sheets para que el sistema funcione a máxima velocidad.
