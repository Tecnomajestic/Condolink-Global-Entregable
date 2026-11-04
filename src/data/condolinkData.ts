export interface UnitResident {
  id: string;
  tower: string;
  unitNumber: string;
  floor: number;
  ownerName: string;
  residentType: 'Propietario' | 'Inquilino';
  phone: string;
  email: string;
  parkingSpots: string;
  aliquot: number; // %
  monthlyFee: number; // DOP / USD
  balanceDue: number;
  paymentStatus: 'Al Día' | 'Pendiente' | 'Vencido';
  lastPaymentDate: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Ingreso' | 'Egreso';
  category: string;
  description: string;
  unitOrVendor: string;
  amount: number;
  reference: string;
  status: 'Confirmado' | 'En Revisión';
}

export interface MaintenanceTicket {
  id: string;
  createdAt: string;
  title: string;
  area: string;
  reportedBy: string;
  priority: 'Alta' | 'Media' | 'Baja';
  assignedTo: string;
  estimatedCost: number;
  status: 'Abierto' | 'En Proceso' | 'Resuelto';
}

export interface AmenityReservation {
  id: string;
  amenityName: string;
  unitNumber: string;
  residentName: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  depositAmount: number;
  status: 'Confirmada' | 'Pendiente' | 'Completada';
}

export interface VisitorAccess {
  id: string;
  visitorName: string;
  documentId: string;
  unitNumber: string;
  authorizedBy: string;
  accessType: 'Visita Familiar' | 'Proveedor / Técnico' | 'Delivery / Paquetería';
  vehiclePlate: string;
  accessPin: string;
  entryTime: string;
  status: 'En Condominio' | 'Programado' | 'Salida Registrada';
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  category: 'Administración' | 'Mantenimiento' | 'Asamblea' | 'Seguridad';
  author: string;
  summary: string;
}

export const INITIAL_UNITS: UnitResident[] = [
  {
    id: 'U-101',
    tower: 'Torre A',
    unitNumber: 'A-101',
    floor: 1,
    ownerName: 'Carlos Manuel Rodríguez',
    residentType: 'Propietario',
    phone: '809-555-0142',
    email: 'c.rodriguez@ejemplo.do',
    parkingSpots: 'P-01, P-02',
    aliquot: 4.25,
    monthlyFee: 8500,
    balanceDue: 0,
    paymentStatus: 'Al Día',
    lastPaymentDate: '2026-10-05',
  },
  {
    id: 'U-102',
    tower: 'Torre A',
    unitNumber: 'A-102',
    floor: 1,
    ownerName: 'Laura Patricia Méndez',
    residentType: 'Propietario',
    phone: '809-555-0198',
    email: 'laura.mendez@ejemplo.do',
    parkingSpots: 'P-03',
    aliquot: 3.80,
    monthlyFee: 7600,
    balanceDue: 0,
    paymentStatus: 'Al Día',
    lastPaymentDate: '2026-10-03',
  },
  {
    id: 'U-201',
    tower: 'Torre A',
    unitNumber: 'A-201',
    floor: 2,
    ownerName: 'Roberto Jiménez Báez',
    residentType: 'Inquilino',
    phone: '829-555-0211',
    email: 'r.jimenez@ejemplo.do',
    parkingSpots: 'P-07, P-08',
    aliquot: 4.25,
    monthlyFee: 8500,
    balanceDue: 8500,
    paymentStatus: 'Pendiente',
    lastPaymentDate: '2026-09-06',
  },
  {
    id: 'U-202',
    tower: 'Torre A',
    unitNumber: 'A-202',
    floor: 2,
    ownerName: 'María Fernanda Castillo',
    residentType: 'Propietario',
    phone: '809-555-0349',
    email: 'mf.castillo@ejemplo.do',
    parkingSpots: 'P-09',
    aliquot: 3.80,
    monthlyFee: 7600,
    balanceDue: 0,
    paymentStatus: 'Al Día',
    lastPaymentDate: '2026-10-08',
  },
  {
    id: 'U-301',
    tower: 'Torre A',
    unitNumber: 'A-301',
    floor: 3,
    ownerName: 'Héctor Emilio Guzmán',
    residentType: 'Propietario',
    phone: '849-555-0412',
    email: 'hector.guzman@ejemplo.do',
    parkingSpots: 'P-12, P-13',
    aliquot: 5.10,
    monthlyFee: 10200,
    balanceDue: 20400,
    paymentStatus: 'Vencido',
    lastPaymentDate: '2026-08-10',
  },
  {
    id: 'U-401',
    tower: 'Torre B',
    unitNumber: 'B-101',
    floor: 1,
    ownerName: 'Ana Sofía Peralta',
    residentType: 'Propietario',
    phone: '809-555-0520',
    email: 'ana.peralta@ejemplo.do',
    parkingSpots: 'P-18',
    aliquot: 3.80,
    monthlyFee: 7600,
    balanceDue: 0,
    paymentStatus: 'Al Día',
    lastPaymentDate: '2026-10-02',
  },
  {
    id: 'U-402',
    tower: 'Torre B',
    unitNumber: 'B-201',
    floor: 2,
    ownerName: 'Jorge Luis Almonte',
    residentType: 'Inquilino',
    phone: '829-555-0673',
    email: 'j.almonte@ejemplo.do',
    parkingSpots: 'P-21, P-22',
    aliquot: 4.25,
    monthlyFee: 8500,
    balanceDue: 8500,
    paymentStatus: 'Pendiente',
    lastPaymentDate: '2026-09-12',
  },
  {
    id: 'U-403',
    tower: 'Torre B',
    unitNumber: 'B-301 (PH)',
    floor: 3,
    ownerName: 'Valeria Santos Tavárez',
    residentType: 'Propietario',
    phone: '809-555-0890',
    email: 'v.santos@ejemplo.do',
    parkingSpots: 'P-25, P-26, P-27',
    aliquot: 6.50,
    monthlyFee: 13000,
    balanceDue: 0,
    paymentStatus: 'Al Día',
    lastPaymentDate: '2026-10-01',
  },
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TRX-8901',
    date: '2026-10-28',
    type: 'Ingreso',
    category: 'Cuota de Mantenimiento',
    description: 'Pago cuota Octubre 2026 · Transferencia ACH',
    unitOrVendor: 'Unidad A-202 · María F. Castillo',
    amount: 7600,
    reference: 'ACH-992841',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8900',
    date: '2026-10-26',
    type: 'Egreso',
    category: 'Mantenimiento de Ascensores',
    description: 'Servicio preventivo mensual de elevadores Torre A y B',
    unitOrVendor: 'Elevadores del Caribe SRL',
    amount: 18500,
    reference: 'FAC-40219',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8899',
    date: '2026-10-24',
    type: 'Ingreso',
    category: 'Cuota de Mantenimiento',
    description: 'Pago cuota Octubre 2026 · Depósito bancario',
    unitOrVendor: 'Unidad A-101 · Carlos M. Rodríguez',
    amount: 8500,
    reference: 'DEP-441209',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8898',
    date: '2026-10-20',
    type: 'Egreso',
    category: 'Seguridad y Vigilancia',
    description: 'Servicio de seguridad privada 24/7 (1ra quincena)',
    unitOrVendor: 'Seguridad Integral Dominicana',
    amount: 32000,
    reference: 'FAC-11802',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8897',
    date: '2026-10-15',
    type: 'Ingreso',
    category: 'Reserva Área Común',
    description: 'Depósito uso Salón Multiuso y Terraza Norte',
    unitOrVendor: 'Unidad B-301 (PH) · Valeria Santos',
    amount: 4500,
    reference: 'RES-2026-18',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8896',
    date: '2026-10-10',
    type: 'Egreso',
    category: 'Energía y Combustible Planta',
    description: 'Abastecimiento de gasoil para planta eléctrica de emergencia',
    unitOrVendor: 'Distribuidora Energética Nacional',
    amount: 14200,
    reference: 'FAC-78231',
    status: 'Confirmado',
  },
  {
    id: 'TRX-8895',
    date: '2026-10-03',
    type: 'Ingreso',
    category: 'Cuota de Mantenimiento',
    description: 'Pago cuota Octubre 2026 · Transferencia interbancaria',
    unitOrVendor: 'Unidad B-301 (PH) · Valeria Santos',
    amount: 13000,
    reference: 'ACH-882104',
    status: 'Confirmado',
  },
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TCK-408',
    createdAt: '2026-10-28',
    title: 'Calibración de sensor en puerta automática de parqueo soterrado',
    area: 'Acceso Vehicular · Nivel -1',
    reportedBy: 'Conserjería / Seguridad',
    priority: 'Alta',
    assignedTo: 'Automatismos & Portones RD',
    estimatedCost: 6500,
    status: 'En Proceso',
  },
  {
    id: 'TCK-407',
    createdAt: '2026-10-27',
    title: 'Reemplazo de luminarias LED en pasillo del 2do piso',
    area: 'Torre A · Piso 2',
    reportedBy: 'Unidad A-202 · María F. Castillo',
    priority: 'Baja',
    assignedTo: 'Personal Interno de Mantenimiento',
    estimatedCost: 1800,
    status: 'Abierto',
  },
  {
    id: 'TCK-406',
    createdAt: '2026-10-24',
    title: 'Revisión de presión en bomba hidroneumática cisterna principal',
    area: 'Cuarto de Máquinas',
    reportedBy: 'Administración',
    priority: 'Alta',
    assignedTo: 'HidroServicios Técnicos',
    estimatedCost: 9200,
    status: 'Resuelto',
  },
  {
    id: 'TCK-405',
    createdAt: '2026-10-21',
    title: 'Poda preventiva de jardineras perimetrales y limpieza de drenajes',
    area: 'Jardines y Patio Central',
    reportedBy: 'Junta de Condominio',
    priority: 'Media',
    assignedTo: 'Verde Urbano Paisajismo',
    estimatedCost: 4500,
    status: 'Resuelto',
  },
];

export const INITIAL_RESERVATIONS: AmenityReservation[] = [
  {
    id: 'RES-109',
    amenityName: 'Terraza Lounge & Área BBQ',
    unitNumber: 'A-101',
    residentName: 'Carlos Manuel Rodríguez',
    date: '2026-11-02',
    timeSlot: '16:00 - 22:00',
    guestsCount: 18,
    depositAmount: 3500,
    status: 'Confirmada',
  },
  {
    id: 'RES-110',
    amenityName: 'Salón Climatizado de Eventos',
    unitNumber: 'B-301 (PH)',
    residentName: 'Valeria Santos Tavárez',
    date: '2026-11-08',
    timeSlot: '18:00 - 23:30',
    guestsCount: 35,
    depositAmount: 5000,
    status: 'Confirmada',
  },
  {
    id: 'RES-111',
    amenityName: 'Sala de Co-Working y Reuniones',
    unitNumber: 'A-202',
    residentName: 'María Fernanda Castillo',
    date: '2026-10-30',
    timeSlot: '09:00 - 13:00',
    guestsCount: 6,
    depositAmount: 0,
    status: 'Pendiente',
  },
];

export const INITIAL_VISITORS: VisitorAccess[] = [
  {
    id: 'VIS-701',
    visitorName: 'Ing. Miguel Ángel Polanco',
    documentId: '001-1429831-0',
    unitNumber: 'B-101',
    authorizedBy: 'Ana Sofía Peralta',
    accessType: 'Proveedor / Técnico',
    vehiclePlate: 'L-409281',
    accessPin: '482910',
    entryTime: '10:15',
    status: 'En Condominio',
  },
  {
    id: 'VIS-702',
    visitorName: 'Gabriela Domínguez',
    documentId: '402-2819402-5',
    unitNumber: 'A-102',
    authorizedBy: 'Laura Patricia Méndez',
    accessType: 'Visita Familiar',
    vehiclePlate: 'A-882910',
    accessPin: '739104',
    entryTime: '14:30',
    status: 'Programado',
  },
  {
    id: 'VIS-703',
    visitorName: 'Mensajería Expreso Caribe',
    documentId: '001-0981234-2',
    unitNumber: 'A-301',
    authorizedBy: 'Héctor Emilio Guzmán',
    accessType: 'Delivery / Paquetería',
    vehiclePlate: 'M-192041',
    accessPin: '910248',
    entryTime: '09:05',
    status: 'Salida Registrada',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-01',
    date: '2026-10-28',
    title: 'Mantenimiento preventivo de planta eléctrica este sábado 31 de octubre',
    category: 'Mantenimiento',
    author: 'Junta Directiva del Condominio',
    summary:
      'El sábado de 10:00 a 11:30 se realizará la prueba de transferencia automática y cambio de filtros de la planta de emergencia. No habrá interrupción del suministro eléctrico comercial.',
  },
  {
    id: 'ANN-02',
    date: '2026-10-22',
    title: 'Convocatoria a Asamblea Ordinaria Trimestral de Propietarios',
    category: 'Asamblea',
    author: 'Administración Condolink',
    summary:
      'Se invita a todos los titulares de unidades de las Torres A y B a la presentación del balance financiero del tercer trimestre y presupuesto de mejoras de seguridad perimetral.',
  },
  {
    id: 'ANN-03',
    date: '2026-10-15',
    title: 'Actualización de protocolo de registro de visitas por código PIN',
    category: 'Seguridad',
    author: 'Comité de Seguridad',
    summary:
      'Para agilizar el ingreso en garita, recuerde pre-registrar a sus visitantes y técnicos desde el módulo de Control de Accesos para generar su código numérico de validación.',
  },
];
