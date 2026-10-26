# Condolink Global Enterprise V20.8
## Documentación Oficial del Esquema de Base de Datos JSON (`/db_json`)

### 1. Resumen Ejecutivo de la Migración

Con el objetivo de garantizar autonomía, alta velocidad de respuesta, integridad referencial y desacoplamiento de dependencias externas (Google Sheets y Google Drive), todo el subsistema de almacenamiento y persistencia de **Condolink Global Enterprise** ha sido migrado a un esquema relacional persistente basado en archivos JSON estructurados, almacenados en el directorio raíz `/db_json/`.

Cada entidad representa una tabla normalizada con identificadores primarios únicos (`PK`), claves foráneas (`FK`), sellos de tiempo (`timestamps`) e índices conceptuales que aseguran la consistencia entre condominios, administradoras, propietarios, juntas y módulos contables.

---

### 2. Diagrama Entidad - Relación (Modelo Conceptual)

```text
+-------------------+
|  configuracion    |  (Ajustes globales, Tasa BCV Oficial B2, Datos sede)
+-------------------+
          |
          v
+-------------------+       1:N       +-------------------+
|      tenants      | <-------------- |     usuarios      | (13 Roles del Ecosistema)
+-------------------+                 +-------------------+
   |             |                              |
   | 1:N         | 1:N                          | 1:N
   v             v                              v
+-------------+ +-------------------+ +-------------------+
| propiedades | | administradores   | |     mensajes      | (6 Canales de Chat)
+-------------+ +-------------------+ +-------------------+
   |
   | 1:N
   v
+-------------+
|   juntas    | (Juntas de Condominio Independientes)
+-------------+
   |         \
   | 1:N      \ 1:N
   v           v
+-------------+ +-------------------+
|  unidades   | |   libro_diario    | (Asientos Contables y Cierres)
+-------------+ +-------------------+

+-----------------------+     +-----------------------+     +-------------------+
| servicios_contratados |     |      solicitudes      |     |     auditoria     |
+-----------------------+     +-----------------------+     +-------------------+
(Proveedores y Contratos)     (Bandeja de Registro)         (Logs Forenses C4I)
```

---

### 3. Catálogo Detallado de Entidades y Esquemas

#### 3.1 `configuracion.json` (Parámetros Maestros y Tasa BCV)
* **Propósito**: Única fuente de verdad de configuración financiera y de entorno (`CLG_Configuracion!B2`).
* **Estructura**:
| Campo | Tipo | Descripción |
|---|---|---|
| `appName` | `String` | Nombre oficial de la aplicación ("Condolink Global Enterprise"). |
| `appVersion` | `String` | Versión del ecosistema ("V20.8"). |
| `tasaBCV` | `String` | Tasa oficial del Banco Central de Venezuela formateada a 2 decimales (e.g. "881.88"). |
| `tasaNumerica` | `Number` | Valor numérico flotante de la tasa oficial (e.g. 881.88). |
| `monedaBase` | `String` | Moneda estándar ("USD"). |
| `monedaLocal` | `String` | Moneda de liquidación soberana ("VES"). |
| `sede` | `String` | Dirección física de la sede central ("Torre Charam, Caracas"). |
| `fechaActualizacion` | `ISO String` | Marca de tiempo de la última sincronización. |

---

#### 3.2 `tenants.json` (Aislamiento Multi-Tenant)
* **Propósito**: Representa cada espacio de trabajo o inquilino corporativo (Master, Monitor, Administradora, Condominio o Inversionista).
* **Campos**:
  - `id` (PK, `String`): Identificador único (e.g. `"CLG_MASTER_01"`, `"CLG_TENANT_ADMIN"`, `"TENANT-CHARAM-01"`).
  - `nombre` (`String`): Razón social o denominación del condominio.
  - `rif` (`String`): Registro de Información Fiscal.
  - `direccion` (`String`): Domicilio fiscal.
  - `telefono` (`String`): Teléfono de contacto corporativo.
  - `email` (`String`): Correo institucional.
  - `tipo` (`String`): Categoría (`"MASTER"`, `"MONITOR"`, `"ADMINISTRADORA"`, `"CONDOMINIO"`, `"INVERSIONISTA"`).
  - `activo` (`Boolean`): Estado operativo de la licencia.
  - `logoUrl` (`String`): URL del membrete/logo institucional.
  - `fechaCreacion` (`ISO String`): Fecha de alta.

---

#### 3.3 `usuarios.json` (Directorio de Acceso y los 13 Roles)
* **Propósito**: Control de identidad, autenticación por PIN y autorización para los 13 roles de Condolink Global.
* **Campos**:
  - `id` (PK, `String`): Código único de usuario (e.g. `"USR-001"`).
  - `nombre` (`String`): Nombre y apellido o denominación del operador.
  - `email` (`String`, Único): Correo electrónico de acceso.
  - `usuario` (`String`, Único): Identificador alfanumérico para login abreviado.
  - `rol` (`String`): Uno de los 13 roles oficiales:
    1. `master`
    2. `monitor`
    3. `admin`
    4. `ejecutivo_administrativo`
    5. `ejecutivo_facturacion`
    6. `ejecutivo_operaciones`
    7. `legal`
    8. `inversionista`
    9. `junta`
    10. `propietario`
    11. `comunicador01`
    12. `comunicador02`
    13. `trabajador_residencial`
  - `pin` (`String`): Clave numérica/alfanumérica de seguridad.
  - `tenant_id` (FK `tenants.id`, `String`): Inquilino al que pertenece.
  - `estado` (`String`): `"Activo"`, `"Inactivo"`, `"Suspendido"`.
  - `fechaRegistro` (`ISO String`): Fecha de enrolamiento.
  - `ultimoAcceso` (`ISO String`): Registro de última sesión.

---

#### 3.4 `propiedades.json` (Parque Inmobiliario y Edificios)
* **Propósito**: Gestión integral de inmuebles, torres residenciales, centros empresariales y apartamentos.
* **Campos**:
  - `id` (PK, `String`): Identificador del inmueble (e.g. `"PROP-101"`).
  - `nombre` (`String`): Nombre del inmueble (e.g. `"Torre Charam"`).
  - `tipo` (`String`): `"edificio"`, `"penthouse"`, `"apartamento"`, `"comercial"`.
  - `direccion` (`String`): Ubicación exacta.
  - `ciudad` (`String`): Ciudad (e.g. `"Caracas"`).
  - `estado` (`String`): Entidad federal.
  - `unidadesTotal` (`Number`): Total de unidades catastrales o apartamentos.
  - `adminAsignadoId` (FK `usuarios.id`, `String`): Administrador a cargo.
  - `tenant_id` (FK `tenants.id`, `String`): Tenant propietario.
  - `logoAdminUrl` (`String`): Logo del administrador gestor.
  - `alicuotaAdmin` (`Number`): Honorario administrativo en porcentaje.
  - `precio` (`Number`): Avalúo de mercado o valor de referencia.
  - `moneda` (`String`): `"USD"`.
  - `estadoOperativo` (`String`): `"ACTIVO"`, `"EN_CONSTRUCCION"`, `"VENDIDO"`.
  - `fechaRegistro` (`ISO String`): Fecha de registro en base de datos.

---

#### 3.5 `juntas.json` (Juntas de Condominio Independientes)
* **Propósito**: Registra juntas directivas y ecosistemas autónomos creados mediante el Instalador Tenant Admin.
* **Campos**:
  - `id` (PK, `String`): Código único de la junta (e.g. `"JTA-CHARAM-001"`).
  - `nombreJunta` (`String`): Denominación oficial de la junta.
  - `condominio` (`String`): Nombre del condominio representado.
  - `tenant_id` (FK `tenants.id`, `String`): Espacio tenant asignado.
  - `propiedad_id` (FK `propiedades.id`, `String`): Edificio físico.
  - `numUnidades` (`Number`): Cantidad de copropietarios afiliados.
  - `numTrabajadores` (`Number`): Personal operativo bajo nómina LOTTT.
  - `alicuotaBaseUnidad` (`Number`): Alícuota prorrateada promedio.
  - `logoAdminCreador` (`String`): Membrete del administrador creador.
  - `fechaConstitucion` (`ISO String`): Acta de asamblea y constitución.
  - `estado` (`String`): `"ACTIVA_INDEPENDIENTE"`.
  - `periodo` (`String`): Lapso de gestión (e.g. `"2026-2027"`).

---

#### 3.6 `unidades.json` (Apartamentos y Copropietarios)
* **Propósito**: Padrón de unidades residenciales/comerciales, porcentajes de alícuota y saldos.
* **Campos**:
  - `id` (PK, `String`): Código de unidad (e.g. `"UNI-101-01"`).
  - `codigoUnidad` (`String`): Identificador físico (`"PH-A"`, `"Apto 8-B"`).
  - `propiedad_id` (FK `propiedades.id`, `String`): Inmueble matriz.
  - `junta_id` (FK `juntas.id`, `String`): Junta correspondiente.
  - `tenant_id` (FK `tenants.id`, `String`): Tenant del condominio.
  - `nombrePropietario` (`String`): Nombre del titular.
  - `emailPropietario` (`String`): Correo para emisión de avisos de cobro.
  - `telefonoPropietario` (`String`): Teléfono del titular.
  - `alicuota` (`Number`): Porcentaje de participación sobre el 100% de la propiedad.
  - `saldoUsd` (`Number`): Deuda o superávit en divisa.
  - `saldoVes` (`Number`): Deuda convertida a tasa BCV en bolívares.
  - `estadoSolvencia` (`String`): `"SOLVENTE"`, `"PENDIENTE"`, `"MOROSO"`.
  - `fechaRegistro` (`ISO String`): Fecha de inscripción.

---

#### 3.7 `solicitudes.json` (Bandeja de Registros Pendientes)
* **Propósito**: Solicitudes de contratación y enrolamiento enviadas desde `login_ui.html`.
* **Campos**:
  - `id` (PK, `String`): Clave de solicitud (`"SOL-2026-001"`).
  - `tipoSolicitud` (`String`): `"Contratar Servicio"`, `"Instalación Inversionista"`.
  - `nombre` (`String`): Razón social o solicitante.
  - `rif` (`String`): RIF o Cédula de Identidad.
  - `direccion` (`String`): Dirección física.
  - `telefono` (`String`): Contacto telefónico.
  - `email` (`String`): Correo institucional.
  - `rol` (`String`): Rol solicitado (`"Administrador"`, `"Inversionista"`).
  - `pin` (`String`): PIN propuesto.
  - `estado` (`String`): `"Pendiente"`, `"Aprobado"`, `"Rechazado"`.
  - `fechaRegistro` (`ISO String`): Momento del registro.
  - `instaladorDestino` (`String`): Ficha de destino en módulo Master.
  - `observaciones` (`Object`): Datos adicionales en formato JSON.
  - `urlRifDrive` (`String`): Enlace/almacenamiento de cédula o RIF.
  - `urlLogoDrive` (`String`): Enlace/almacenamiento de logotipo corporativo.

---

#### 3.8 `servicios_contratados.json` (Proveedores y Contratos)
* **Propósito**: Mantenimientos preventivos, seguridad 24/7, ascensores, bombas hidroneumáticas.
* **Campos**:
  - `id` (PK, `String`): Código del contrato (`"SRV-001"`).
  - `proveedor` (`String`): Nombre de la empresa proveedora.
  - `categoria` (`String`): Especialidad de servicio.
  - `costoMensual` (`Number`): Tarifa en divisa mensual.
  - `moneda` (`String`): `"USD"`.
  - `estado` (`String`): `"Vigente"`, `"Suspendido"`, `"Finalizado"`.
  - `contacto` (`String`): Correo o persona de contacto.
  - `telefono` (`String`): Teléfono de soporte del proveedor.
  - `tenant_id` (FK `tenants.id`, `String`): Inquilino contratante.
  - `propiedad_id` (FK `propiedades.id`, `String`): Inmueble donde se presta el servicio.
  - `fechaContrato` (`ISO String`): Fecha de firma.
  - `proximaRevision` (`ISO String`): Cronograma de mantenimiento.
  - `calificacion` (`Number`): Puntuación otorgada (1 a 5 estrellas).

---

#### 3.9 `libro_diario.json` (Contabilidad y Partida Doble)
* **Propósito**: Registro inmutable de transacciones financieras, débitos, créditos y cierres contables mensuales.
* **Campos**:
  - `id` (PK, `String`): Número de asiento contable (`"ASI-2026-001"`).
  - `fecha` (`ISO String`): Fecha de contabilización.
  - `junta_id` (FK `juntas.id`, `String`): Junta asociada.
  - `tenant_id` (FK `tenants.id`, `String`): Tenant asociado.
  - `codigoDebe` (`String`): Código contable de la cuenta cargada (e.g. `"1.1.01.001"`).
  - `cuentaDebe` (`String`): Denominación de la cuenta deudora.
  - `codigoHaber` (`String`): Código contable de la cuenta acreditada (e.g. `"4.1.01.001"`).
  - `cuentaHaber` (`String`): Denominación de la cuenta acreedora.
  - `montoUsd` (`Number`): Importe expresado en dólares estadounidenses.
  - `tasaBcv` (`Number`): Tasa de cambio oficial aplicada en la transacción.
  - `montoVes` (`Number`): Equivalente exacto en bolívares.
  - `concepto` (`String`): Glosa o descripción detallada de la operación.

---

#### 3.10 `mensajes.json` (Centro de Mensajería Multicanal Permanente)
* **Propósito**: Historial permanente de comunicación entre estamentos en los 6 canales del panel admin.
* **Campos**:
  - `id` (PK, `String`): Código del mensaje (`"MSG-001"`).
  - `canal` (`String`): `"JUNTA"`, `"EJECUTIVO"`, `"MASTER"`, `"INVERSIONISTA"`, `"LEGAL"`, `"PROPIETARIO"`.
  - `tenant_id` (FK `tenants.id`, `String`): Inquilino context.
  - `junta_id` (FK `juntas.id`, `String`): Junta vinculada.
  - `emisor` (`String`): Rol del remitente.
  - `autor` (`String`): Nombre o firma del remitente.
  - `texto` (`String`): Contenido del mensaje.
  - `fecha` (`ISO String`): Marca de tiempo del envío.
  - `leido` (`Boolean`): Indicador de lectura.

---

#### 3.11 `auditoria.json` (Bitácora Forense C4I)
* **Propósito**: Registro de eventos del sistema, barridos de seguridad y auditorías de acceso.
* **Campos**:
  - `id` (PK, `String`): Identificador del evento (`"AUD-001"`).
  - `fecha` (`ISO String`): Estampa cronológica UTC.
  - `tipo` (`String`): `"INFO"`, `"AUTH_SUCCESS"`, `"AUTH_FAILED"`, `"SECURITY_SCAN"`, `"FORENSIC_AUDIT"`.
  - `modulo` (`String`): Componente que originó el registro (`"ROUTER_CENTRAL"`, `"LOGIN_UI"`, `"BARRIDO_C4I_MONITOR"`).
  - `usuario` (`String`): Cuenta u operador involucrado.
  - `usuario_id` (FK `usuarios.id`, `String`): Identificador del usuario.
  - `tenant_id` (FK `tenants.id`, `String`): Inquilino asociado.
  - `detalle` (`String`): Descripción textual del suceso.
  - `estado` (`String`): `"ONLINE"`, `"EXITOSO"`, `"AUDITADO_OK"`.
  - `vista` (`String`): Plantilla HTML desde donde se originó la acción.

---

#### 3.12 `administradores.json` (Ficha de Administradoras)
* **Propósito**: Padrón de empresas y gerentes de administración inmobiliaria (`CLG_Administradores`).
* **Campos**:
  - `id` (PK, `String`): `"ADM-001"`.
  - `cedula` (`String`): Documento de identidad del titular.
  - `nombre` (`String`): Nombre de pila o razón social.
  - `apellido` (`String`): Apellido.
  - `correo` (`String`): Correo principal.
  - `telefono` (`String`): Teléfono móvil o de oficina.
  - `nivelAcceso` (`String`): `"ADMIN"`, `"ADMIN_MASTER"`.
  - `estatus` (`String`): `"Activo"`.
  - `tenant_id` (FK `tenants.id`, `String`): Tenant administrado.
  - `usuario_id` (FK `usuarios.id`, `String`): Usuario vinculado.
  - `juntasAsignadas` (`Array<String>`): Lista de IDs de juntas bajo su gestión.
  - `fechaRegistro` (`ISO String`): Fecha de alta.

---

#### 3.13 `inversionistas.json` (Ficha de Inversionistas y Rendimientos)
* **Propósito**: Padrón de inversionistas, carteras de activos inmobiliarios y rentabilidad (`CLG_panel_inversionista`).
* **Campos**:
  - `id` (PK, `String`): `"INV-001"`.
  - `nombre` (`String`): Nombre de la persona o consorcio inversor.
  - `rif` (`String`): Registro fiscal.
  - `correo` (`String`): Email de contacto.
  - `telefono` (`String`): Teléfono de atención de inversiones.
  - `propiedades` (`String`): Inmuebles asignados en portafolio.
  - `inversionTotalUsd` (`Number`): Capital colocado en divisa.
  - `rendimientoEstimadoAnual` (`Number`): ROI proyectado en porcentaje anual.
  - `tenant_id` (FK `tenants.id`, `String`): Tenant del grupo inversionista.
  - `usuario_id` (FK `usuarios.id`, `String`): Cuenta de acceso.
  - `estado` (`String`): `"ACTIVO"`.
  - `fechaRegistro` (`ISO String`): Fecha de inicio de operaciones.

---

### 4. Capa de Servicio y Reglas de Integridad (`/db_json/dbService.js`)

La interacción con los archivos se realiza exclusivamente mediante la librería central `dbService`:

1. **Lectura y Escritura Atómica**: Toda operación de escritura formatea los JSON con indentación estándar de 2 espacios, previendo corrupciones de sintaxis mediante captura de excepciones y valores por defecto automáticos.
2. **Validación de Claves Foráneas (`FK Integrity`)**: Al registrar un usuario, junta o inmueble, se valida la existencia previa del `tenant_id`. En caso de que se suministre un nuevo tenant, el servicio crea automáticamente el registro correspondiente en `tenants.json`.
3. **Sincronización Transversal**: Al enviar una solicitud de registro desde `login_ui.html`, el sistema guarda el registro en `solicitudes.json` e inmediatamente da de alta el usuario en `usuarios.json` con su rol y credenciales correspondientes, permitiendo el ingreso inmediato sin intervención manual.
4. **Cálculo Automático Bimonetario**: En el módulo de contabilidad (`libro_diario.json`), el importe en bolívares (`montoVes`) se calcula en tiempo real multiplicando el `montoUsd` por la tasa oficial BCV registrada en `configuracion.json`.
