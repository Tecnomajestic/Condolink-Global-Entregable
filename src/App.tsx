import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Wallet,
  Wrench,
  Calendar,
  ShieldCheck,
  Search,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Users,
  X,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import {
  UnitResident,
  FinancialTransaction,
  MaintenanceTicket,
  AmenityReservation,
  VisitorAccess,
  Announcement,
  INITIAL_UNITS,
  INITIAL_TICKETS,
  INITIAL_TRANSACTIONS,
  INITIAL_RESERVATIONS,
  INITIAL_VISITORS,
  INITIAL_ANNOUNCEMENTS,
} from './data/condolinkData';

type ActiveModule =
  | 'resumen'
  | 'finanzas'
  | 'unidades'
  | 'mantenimiento'
  | 'accesos';

const STORAGE_KEY = 'condolink_app_state_v1';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('resumen');

  // Persistent state
  const [units, setUnits] = useState<UnitResident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).units || INITIAL_UNITS;
      } catch {
        return INITIAL_UNITS;
      }
    }
    return INITIAL_UNITS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).transactions || INITIAL_TRANSACTIONS;
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).tickets || INITIAL_TICKETS;
      } catch {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  const [reservations, setReservations] = useState<AmenityReservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).reservations || INITIAL_RESERVATIONS;
      } catch {
        return INITIAL_RESERVATIONS;
      }
    }
    return INITIAL_RESERVATIONS;
  });

  const [visitors, setVisitors] = useState<VisitorAccess[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).visitors || INITIAL_VISITORS;
      } catch {
        return INITIAL_VISITORS;
      }
    }
    return INITIAL_VISITORS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).announcements || INITIAL_ANNOUNCEMENTS;
      } catch {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        units,
        transactions,
        tickets,
        reservations,
        visitors,
        announcements,
      })
    );
  }, [units, transactions, tickets, reservations, visitors, announcements]);

  // Filters & search
  const [unitSearch, setUnitSearch] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState<'Todos' | 'Al Día' | 'Pendiente' | 'Vencido'>('Todos');
  const [towerFilter, setTowerFilter] = useState<'Todas' | 'Torre A' | 'Torre B'>('Todas');
  const [trxFilter, setTrxFilter] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos');
  const [ticketFilter, setTicketFilter] = useState<'Todos' | 'Abierto' | 'En Proceso' | 'Resuelto'>('Todos');
  const [accessSubTab, setAccessSubTab] = useState<'visitantes' | 'reservas' | 'comunicados' | 'respaldo'>('visitantes');

  // Modals
  const [activeModal, setActiveModal] = useState<
    null | 'payment' | 'expense' | 'unit' | 'ticket' | 'visitor' | 'reservation'
  >(null);

  // Form states
  const [selectedUnitId, setSelectedUnitId] = useState<string>(INITIAL_UNITS[2].id);
  const [paymentAmount, setPaymentAmount] = useState<string>('8500');
  const [paymentReference, setPaymentReference] = useState<string>('');

  const [expenseCategory, setExpenseCategory] = useState('Mantenimiento General');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [newUnitTower, setNewUnitTower] = useState<'Torre A' | 'Torre B'>('Torre A');
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitOwner, setNewUnitOwner] = useState('');
  const [newUnitType, setNewUnitType] = useState<'Propietario' | 'Inquilino'>('Propietario');
  const [newUnitPhone, setNewUnitPhone] = useState('');
  const [newUnitEmail, setNewUnitEmail] = useState('');
  const [newUnitParking, setNewUnitParking] = useState('');
  const [newUnitFee, setNewUnitFee] = useState('8500');

  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketArea, setNewTicketArea] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [newTicketVendor, setNewTicketVendor] = useState('');
  const [newTicketCost, setNewTicketCost] = useState('3500');

  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorDoc, setNewVisitorDoc] = useState('');
  const [newVisitorUnit, setNewVisitorUnit] = useState('A-101');
  const [newVisitorType, setNewVisitorType] = useState<'Visita Familiar' | 'Proveedor / Técnico' | 'Delivery / Paquetería'>('Visita Familiar');
  const [newVisitorPlate, setNewVisitorPlate] = useState('');

  const [newResAmenity, setNewResAmenity] = useState('Terraza Lounge & Área BBQ');
  const [newResUnit, setNewResUnit] = useState('A-101');
  const [newResDate, setNewResDate] = useState('2026-11-15');
  const [newResSlot, setNewResSlot] = useState('16:00 - 22:00');
  const [newResGuests, setNewResGuests] = useState('15');

  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Financial KPIs
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'Ingreso')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'Egreso')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalReceivables = units.reduce((acc, u) => acc + u.balanceDue, 0);
    const unitsUpToDate = units.filter((u) => u.paymentStatus === 'Al Día').length;
    const collectionRate = units.length > 0 ? Math.round((unitsUpToDate / units.length) * 100) : 0;
    const openTickets = tickets.filter((t) => t.status !== 'Resuelto').length;
    const reserveBalance = 485000 + totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      totalReceivables,
      unitsUpToDate,
      collectionRate,
      openTickets,
      reserveBalance,
    };
  }, [units, transactions, tickets]);

  // Filtered lists
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchesQuery =
        u.unitNumber.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.ownerName.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(unitSearch.toLowerCase());
      const matchesStatus =
        unitStatusFilter === 'Todos' || u.paymentStatus === unitStatusFilter;
      const matchesTower = towerFilter === 'Todas' || u.tower === towerFilter;
      return matchesQuery && matchesStatus && matchesTower;
    });
  }, [units, unitSearch, unitStatusFilter, towerFilter]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => trxFilter === 'Todos' || t.type === trxFilter);
  }, [transactions, trxFilter]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => ticketFilter === 'Todos' || t.status === ticketFilter);
  }, [tickets, ticketFilter]);

  // Handlers
  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find((u) => u.id === selectedUnitId);
    const amountNum = Number(paymentAmount) || 0;
    if (!targetUnit || amountNum <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedUnits = units.map((u) => {
      if (u.id === targetUnit.id) {
        const nextBalance = Math.max(0, u.balanceDue - amountNum);
        return {
          ...u,
          balanceDue: nextBalance,
          paymentStatus: (nextBalance === 0 ? 'Al Día' : 'Pendiente') as UnitResident['paymentStatus'],
          lastPaymentDate: today,
        };
      }
      return u;
    });

    const newTrx: FinancialTransaction = {
      id: `TRX-${Math.floor(9000 + Math.random() * 900)}`,
      date: today,
      type: 'Ingreso',
      category: 'Cuota de Mantenimiento',
      description: `Abono / Pago de cuota · Unidad ${targetUnit.unitNumber}`,
      unitOrVendor: `Unidad ${targetUnit.unitNumber} · ${targetUnit.ownerName}`,
      amount: amountNum,
      reference: paymentReference.trim() || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmado',
    };

    setUnits(updatedUnits);
    setTransactions([newTrx, ...transactions]);
    setPaymentReference('');
    setActiveModal(null);
    showNotification(`Pago registrado para la unidad ${targetUnit.unitNumber} por RD$ ${amountNum.toLocaleString('es-DO')}`);
  };

  const handleRegisterExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(expenseAmount) || 0;
    if (!expenseVendor.trim() || amountNum <= 0) return;

    const today = new Date().toISOString().split('T')[0];
    const newTrx: FinancialTransaction = {
      id: `TRX-${Math.floor(9000 + Math.random() * 900)}`,
      date: today,
      type: 'Egreso',
      category: expenseCategory,
      description: expenseDescription.trim() || `Pago de servicio: ${expenseCategory}`,
      unitOrVendor: expenseVendor.trim(),
      amount: amountNum,
      reference: `FAC-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Confirmado',
    };

    setTransactions([newTrx, ...transactions]);
    setExpenseVendor('');
    setExpenseDescription('');
    setExpenseAmount('');
    setActiveModal(null);
    showNotification(`Gasto operativo registrado por RD$ ${amountNum.toLocaleString('es-DO')}`);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitNumber.trim() || !newUnitOwner.trim()) return;

    const feeNum = Number(newUnitFee) || 8500;
    const created: UnitResident = {
      id: `U-${Date.now().toString().slice(-4)}`,
      tower: newUnitTower,
      unitNumber: newUnitNumber.trim().toUpperCase(),
      floor: Number(newUnitNumber.replace(/\D/g, '')[0]) || 1,
      ownerName: newUnitOwner.trim(),
      residentType: newUnitType,
      phone: newUnitPhone.trim() || '809-555-0100',
      email: newUnitEmail.trim() || 'residente@condolink.do',
      parkingSpots: newUnitParking.trim() || 'P-30',
      aliquot: 4.0,
      monthlyFee: feeNum,
      balanceDue: 0,
      paymentStatus: 'Al Día',
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };

    setUnits([created, ...units]);
    setNewUnitNumber('');
    setNewUnitOwner('');
    setNewUnitPhone('');
    setNewUnitEmail('');
    setNewUnitParking('');
    setActiveModal(null);
    showNotification(`Unidad ${created.unitNumber} agregada al padrón del condominio.`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketArea.trim()) return;

    const created: MaintenanceTicket = {
      id: `TCK-${Math.floor(410 + Math.random() * 500)}`,
      createdAt: new Date().toISOString().split('T')[0],
      title: newTicketTitle.trim(),
      area: newTicketArea.trim(),
      reportedBy: 'Administración / Junta',
      priority: newTicketPriority,
      assignedTo: newTicketVendor.trim() || 'Personal Técnico de Planta',
      estimatedCost: Number(newTicketCost) || 0,
      status: 'Abierto',
    };

    setTickets([created, ...tickets]);
    setNewTicketTitle('');
    setNewTicketArea('');
    setNewTicketVendor('');
    setActiveModal(null);
    showNotification(`Orden de mantenimiento ${created.id} creada correctamente.`);
  };

  const handleCycleTicketStatus = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const nextStatus: MaintenanceTicket['status'] =
          t.status === 'Abierto'
            ? 'En Proceso'
            : t.status === 'En Proceso'
            ? 'Resuelto'
            : 'Abierto';
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName.trim()) return;
    const ownerObj = units.find((u) => u.unitNumber === newVisitorUnit);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const nowTime = new Date().toTimeString().slice(0, 5);

    const created: VisitorAccess = {
      id: `VIS-${Math.floor(710 + Math.random() * 200)}`,
      visitorName: newVisitorName.trim(),
      documentId: newVisitorDoc.trim() || '001-0000000-0',
      unitNumber: newVisitorUnit,
      authorizedBy: ownerObj ? ownerObj.ownerName : 'Residente Autorizado',
      accessType: newVisitorType,
      vehiclePlate: newVisitorPlate.trim().toUpperCase() || 'PEATONAL',
      accessPin: pin,
      entryTime: nowTime,
      status: 'En Condominio',
    };

    setVisitors([created, ...visitors]);
    setNewVisitorName('');
    setNewVisitorDoc('');
    setNewVisitorPlate('');
    setActiveModal(null);
    showNotification(`Pase de acceso PIN #${pin} generado para ${created.visitorName}.`);
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerObj = units.find((u) => u.unitNumber === newResUnit);
    const created: AmenityReservation = {
      id: `RES-${Math.floor(120 + Math.random() * 800)}`,
      amenityName: newResAmenity,
      unitNumber: newResUnit,
      residentName: ownerObj ? ownerObj.ownerName : 'Propietario Titular',
      date: newResDate,
      timeSlot: newResSlot,
      guestsCount: Number(newResGuests) || 10,
      depositAmount: 3500,
      status: 'Confirmada',
    };

    setReservations([created, ...reservations]);
    setActiveModal(null);
    showNotification(`Reserva de ${created.amenityName} confirmada para la unidad ${created.unitNumber}.`);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID,Torre,Unidad,Titular,Tipo,Telefono,Cuota_Mensual_RD,Balance_Pendiente_RD,Estado,Ultimo_Pago',
    ];
    const rows = units.map(
      (u) =>
        `${u.id},"${u.tower}","${u.unitNumber}","${u.ownerName}",${u.residentType},${u.phone},${u.monthlyFee},${u.balanceDue},"${u.paymentStatus}",${u.lastPaymentDate}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `condolink_estado_unidades_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Reporte financiero exportado en formato CSV.');
  };

  const handleExportJSONBackup = () => {
    const payload = {
      project: 'Condolink-App',
      repository: 'Tecnomajestic/Condolink-App',
      exportedAt: new Date().toISOString(),
      units,
      transactions,
      tickets,
      reservations,
      visitors,
      announcements,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `condolink_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Respaldo completo JSON descargado correctamente.');
  };

  const handleImportJSONBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result));
        if (parsed.units) setUnits(parsed.units);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.reservations) setReservations(parsed.reservations);
        if (parsed.visitors) setVisitors(parsed.visitors);
        showNotification('Datos restaurados exitosamente desde el archivo de respaldo.');
      } catch {
        showNotification('El archivo seleccionado no tiene un formato JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUnits(INITIAL_UNITS);
    setTransactions(INITIAL_TRANSACTIONS);
    setTickets(INITIAL_TICKETS);
    setReservations(INITIAL_RESERVATIONS);
    setVisitors(INITIAL_VISITORS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    showNotification('Datos restablecidos al estado inicial de Condolink-App.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('resumen');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
        >
          Condolink
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveModule('resumen')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeModule === 'resumen'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Panel General
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('finanzas')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeModule === 'finanzas'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Cuotas y Finanzas
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('unidades')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeModule === 'unidades'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Unidades
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('mantenimiento')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeModule === 'mantenimiento'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Mantenimiento
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('accesos')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeModule === 'accesos'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Accesos y Áreas
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveModal('payment')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Registrar Pago
          </button>
        </div>
      </header>

      {/* Main Workspace Canvas: Sidebar + Viewport */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation (260px) */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-white border-r border-slate-200 p-5">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-slate-400">Condominio Activo</p>
              <h2 className="text-sm font-semibold text-slate-900 mt-1">
                Residencial Torres del Mirador
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Santo Domingo, D.N. · RNC 4-30-99281-2
              </p>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveModule('resumen')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeModule === 'resumen'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Resumen Operativo</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('finanzas')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeModule === 'finanzas'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span>Cobranza y Finanzas</span>
                </span>
                <span className="font-mono text-xs opacity-80">{metrics.collectionRate}%</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('unidades')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeModule === 'unidades'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Padrón de Unidades</span>
                </span>
                <span className="font-mono text-xs opacity-80">{units.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('mantenimiento')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeModule === 'mantenimiento'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>Tickets e Incidencias</span>
                </span>
                <span className="font-mono text-xs opacity-80">{metrics.openTickets}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('accesos')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeModule === 'accesos'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Garita y Áreas Comunes</span>
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs font-medium text-slate-400">Acciones Rápidas</p>
              <button
                type="button"
                onClick={() => setActiveModal('expense')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Registrar Gasto Proveedor</span>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('visitor')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Autorizar Pase de Visita</span>
                <Plus className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModule('accesos');
                  setAccessSubTab('respaldo');
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Respaldo GitHub / JSON</span>
                <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-700">Condolink-App · Gestión</p>
            <p>Repositorio: Tecnomajestic/Condolink-App</p>
            <p className="text-slate-400">Entorno Administrativo Demostrativo</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Mobile Navigation Bar */}
          <div className="flex md:hidden items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
            {(
              [
                ['resumen', 'Panel'],
                ['finanzas', 'Finanzas'],
                ['unidades', 'Unidades'],
                ['mantenimiento', 'Tickets'],
                ['accesos', 'Accesos'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveModule(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeModule === key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Notification Banner */}
          {statusBanner && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white rounded-lg text-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{statusBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Contextual Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Administración Condominial</span>
                <span aria-hidden="true">·</span>
                <span>Período Octubre 2026</span>
                <span aria-hidden="true">·</span>
                <span>Torres A y B</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                {activeModule === 'resumen' && 'Panel General del Condominio'}
                {activeModule === 'finanzas' && 'Estado de Cobranza y Flujo de Caja'}
                {activeModule === 'unidades' && 'Directorio de Unidades y Titulares'}
                {activeModule === 'mantenimiento' && 'Control de Mantenimiento y Proveedores'}
                {activeModule === 'accesos' && 'Control de Garita, Reservas y Respaldo'}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('unit')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Unidad</span>
              </button>
            </div>
          </div>

          {/* KPI Strip (Always visible on Resumen & Finanzas) */}
          {(activeModule === 'resumen' || activeModule === 'finanzas') && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-xs font-medium text-slate-500">Fondo Operativo y Reserva</p>
                <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                  RD$ {metrics.reserveBalance.toLocaleString('es-DO')}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  <span>Balance conciliado en cuenta bancaria</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-xs font-medium text-slate-500">Recaudación del Mes (Ingresos)</p>
                <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                  RD$ {metrics.totalIncome.toLocaleString('es-DO')}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <span>{metrics.unitsUpToDate} de {units.length} unidades al día</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-medium text-slate-800">{metrics.collectionRate}%</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-xs font-medium text-slate-500">Gastos Operativos Ejecutados</p>
                <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                  RD$ {metrics.totalExpenses.toLocaleString('es-DO')}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                  <ArrowDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Seguridad, elevadores y energía</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <p className="text-xs font-medium text-slate-500">Cuotas por Cobrar (Mora)</p>
                <p className="text-2xl font-bold text-amber-700 font-mono tabular-nums mt-2">
                  RD$ {metrics.totalReceivables.toLocaleString('es-DO')}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{units.length - metrics.unitsUpToDate} unidades con saldo pendiente</span>
                </div>
              </div>
            </section>
          )}

          {/* MODULE 1: PANEL GENERAL (RESUMEN) */}
          {activeModule === 'resumen' && (
            <div className="space-y-8">
              {/* Two-column split: Cobranza por Unidad + Tickets de Mantenimiento */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left 7 cols: Estado de Unidades */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          Estado de Cuotas por Unidad
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Control de pagos mensuales y saldos pendientes
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModule('finanzas')}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4 whitespace-nowrap"
                      >
                        Ver todas las cuotas
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                            <th className="py-2.5 px-4">Unidad</th>
                            <th className="py-2.5 px-4">Titular / Residente</th>
                            <th className="py-2.5 px-4 text-right">Cuota</th>
                            <th className="py-2.5 px-4 text-right">Pendiente</th>
                            <th className="py-2.5 px-4">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                          {units.slice(0, 6).map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                                {u.unitNumber}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-slate-900">{u.ownerName}</div>
                                <div className="text-xs text-slate-500">
                                  {u.residentType} · {u.tower}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-700 whitespace-nowrap">
                                RD$ {u.monthlyFee.toLocaleString('es-DO')}
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-xs tabular-nums font-medium text-slate-900 whitespace-nowrap">
                                RD$ {u.balanceDue.toLocaleString('es-DO')}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {u.paymentStatus === 'Al Día' && (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>Al Día</span>
                                  </span>
                                )}
                                {u.paymentStatus === 'Pendiente' && (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    <span>Pendiente</span>
                                  </span>
                                )}
                                {u.paymentStatus === 'Vencido' && (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    <span>Vencido</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Corte de facturación: día 05 de cada mes</span>
                    <button
                      type="button"
                      onClick={() => setActiveModal('payment')}
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      + Registrar cobro de cuota
                    </button>
                  </div>
                </div>

                {/* Right 5 cols: Tickets Activos y Avisos */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">
                          Mantenimiento e Incidencias
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Haz clic en el estado para avanzar la orden
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModal('ticket')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                      >
                        + Nuevo Ticket
                      </button>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {tickets.map((t) => (
                        <div key={t.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono font-medium text-slate-700">{t.id}</span>
                                <span aria-hidden="true">·</span>
                                <span>{t.area}</span>
                                <span aria-hidden="true">·</span>
                                <span>Prioridad {t.priority}</span>
                              </div>
                              <h3 className="text-sm font-medium text-slate-900 mt-1">
                                {t.title}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">
                                Asignado a: {t.assignedTo} · Est.{' '}
                                <span className="font-mono tabular-nums">
                                  RD$ {t.estimatedCost.toLocaleString('es-DO')}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCycleTicketStatus(t.id)}
                              className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 whitespace-nowrap shrink-0"
                            >
                              {t.status}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>{metrics.openTickets} órdenes activas en seguimiento</span>
                    <button
                      type="button"
                      onClick={() => setActiveModule('mantenimiento')}
                      className="font-semibold text-slate-900 hover:underline"
                    >
                      Ver bitácora completa
                    </button>
                  </div>
                </div>
              </div>

              {/* Libro Diario Reciente & Comunicados */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Movimientos Financieros Recientes
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ingresos de cuotas y pagos a suplidores del condominio
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('expense')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                    >
                      + Registrar Egreso
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                          <th className="py-2.5 px-4">Fecha</th>
                          <th className="py-2.5 px-4">Concepto / Categoría</th>
                          <th className="py-2.5 px-4">Unidad / Suplidor</th>
                          <th className="py-2.5 px-4 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm">
                        {transactions.slice(0, 5).map((trx) => (
                          <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                              {trx.date}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-900">{trx.category}</div>
                              <div className="text-xs text-slate-500">{trx.description}</div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600">
                              {trx.unitOrVendor}
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-mono text-xs font-semibold tabular-nums whitespace-nowrap ${
                                trx.type === 'Ingreso' ? 'text-emerald-700' : 'text-slate-900'
                              }`}
                            >
                              {trx.type === 'Ingreso' ? '+' : '-'} RD${' '}
                              {trx.amount.toLocaleString('es-DO')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Comunicados de la Junta
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Avisos oficiales para propietarios y residentes
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-4 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono">{ann.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ann.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ann.author}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">{ann.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{ann.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: CUOTAS Y FINANZAS */}
          {activeModule === 'finanzas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(['Todos', 'Ingreso', 'Egreso'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTrxFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        trxFilter === tab
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab === 'Todos'
                        ? 'Todos los Movimientos'
                        : tab === 'Ingreso'
                        ? 'Ingresos (Cobros)'
                        : 'Egresos (Suplidores)'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal('payment')}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    + Registrar Ingreso / Cuota
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('expense')}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    + Registrar Gasto
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                        <th className="py-3 px-4">ID / Ref</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Categoría y Descripción</th>
                        <th className="py-3 px-4">Unidad o Proveedor</th>
                        <th className="py-3 px-4 text-right">Monto (RD$)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {filteredTransactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                            <div>{trx.id}</div>
                            <div className="text-slate-400">{trx.reference}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                            {trx.date}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium whitespace-nowrap">
                            {trx.type === 'Ingreso' ? (
                              <span className="text-emerald-700">Ingreso</span>
                            ) : (
                              <span className="text-slate-700">Egreso</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{trx.category}</div>
                            <div className="text-xs text-slate-500">{trx.description}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-700">
                            {trx.unitOrVendor}
                          </td>
                          <td
                            className={`py-3.5 px-4 text-right font-mono text-sm font-semibold tabular-nums whitespace-nowrap ${
                              trx.type === 'Ingreso' ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {trx.type === 'Ingreso' ? '+' : '-'} RD${' '}
                            {trx.amount.toLocaleString('es-DO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: UNIDADES Y RESIDENTES */}
          {activeModule === 'unidades' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={unitSearch}
                    onChange={(e) => setUnitSearch(e.target.value)}
                    placeholder="Buscar por unidad (ej. A-101), titular o correo..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['Todas', 'Torre A', 'Torre B'] as const).map((tw) => (
                      <button
                        key={tw}
                        type="button"
                        onClick={() => setTowerFilter(tw)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          towerFilter === tw
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tw}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['Todos', 'Al Día', 'Pendiente', 'Vencido'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setUnitStatusFilter(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          unitStatusFilter === st
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                        <th className="py-3 px-4">Unidad</th>
                        <th className="py-3 px-4">Propietario / Residente</th>
                        <th className="py-3 px-4">Contacto</th>
                        <th className="py-3 px-4">Parqueos · Alícuota</th>
                        <th className="py-3 px-4 text-right">Cuota Mensual</th>
                        <th className="py-3 px-4 text-right">Balance</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {filteredUnits.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                            <div>{u.unitNumber}</div>
                            <div className="text-slate-400 font-normal">{u.tower}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{u.ownerName}</div>
                            <div className="text-xs text-slate-500">{u.residentType}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            <div className="font-mono">{u.phone}</div>
                            <div className="text-slate-400">{u.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                            <span className="font-mono">{u.parkingSpots}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span className="font-mono">{u.aliquot.toFixed(2)}%</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-slate-700 whitespace-nowrap">
                            RD$ {u.monthlyFee.toLocaleString('es-DO')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold tabular-nums text-slate-900 whitespace-nowrap">
                            RD$ {u.balanceDue.toLocaleString('es-DO')}
                          </td>
                          <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                            {u.paymentStatus === 'Al Día' && (
                              <span className="text-emerald-700 font-medium">Al Día</span>
                            )}
                            {u.paymentStatus === 'Pendiente' && (
                              <span className="text-amber-700 font-medium">Pendiente</span>
                            )}
                            {u.paymentStatus === 'Vencido' && (
                              <span className="text-red-700 font-medium">Vencido</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUnitId(u.id);
                                setPaymentAmount(
                                  String(u.balanceDue > 0 ? u.balanceDue : u.monthlyFee)
                                );
                                setActiveModal('payment');
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            >
                              Registrar Cobro
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: MANTENIMIENTO E INCIDENCIAS */}
          {activeModule === 'mantenimiento' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(['Todos', 'Abierto', 'En Proceso', 'Resuelto'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTicketFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        ticketFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal('ticket')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap w-fit"
                >
                  + Crear Orden de Mantenimiento
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                        <th className="py-3 px-4">Código / Fecha</th>
                        <th className="py-3 px-4">Incidencia y Ubicación</th>
                        <th className="py-3 px-4">Prioridad</th>
                        <th className="py-3 px-4">Suplidor Asignado</th>
                        <th className="py-3 px-4 text-right">Costo Est.</th>
                        <th className="py-3 px-4 text-right">Estado (Clic para cambiar)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {filteredTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">{t.id}</div>
                            <div>{t.createdAt}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{t.title}</div>
                            <div className="text-xs text-slate-500">
                              {t.area} · Reportado por {t.reportedBy}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium whitespace-nowrap">
                            {t.priority === 'Alta' && (
                              <span className="text-red-700">Alta</span>
                            )}
                            {t.priority === 'Media' && (
                              <span className="text-amber-700">Media</span>
                            )}
                            {t.priority === 'Baja' && (
                              <span className="text-slate-600">Baja</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-700">
                            {t.assignedTo}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-slate-900 whitespace-nowrap">
                            RD$ {t.estimatedCost.toLocaleString('es-DO')}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleCycleTicketStatus(t.id)}
                              className="px-3 py-1 text-xs font-medium border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-800 transition-colors"
                            >
                              {t.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: ACCESOS, RESERVAS Y RESPALDO GITHUB */}
          {activeModule === 'accesos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setAccessSubTab('visitantes')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      accessSubTab === 'visitantes'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bitácora de Visitantes (Garita)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessSubTab('reservas')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      accessSubTab === 'reservas'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Reservas de Áreas Comunes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessSubTab('respaldo')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      accessSubTab === 'respaldo'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Respaldo & GitHub (Condolink-App)
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  {accessSubTab === 'visitantes' && (
                    <button
                      type="button"
                      onClick={() => setActiveModal('visitor')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      + Autorizar Visitante / PIN
                    </button>
                  )}
                  {accessSubTab === 'reservas' && (
                    <button
                      type="button"
                      onClick={() => setActiveModal('reservation')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      + Nueva Reserva de Área
                    </button>
                  )}
                </div>
              </div>

              {accessSubTab === 'visitantes' && (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                          <th className="py-3 px-4">PIN Acceso</th>
                          <th className="py-3 px-4">Visitante / Cédula</th>
                          <th className="py-3 px-4">Unidad Destino</th>
                          <th className="py-3 px-4">Tipo · Vehículo</th>
                          <th className="py-3 px-4">Hora</th>
                          <th className="py-3 px-4">Estado en Garita</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm">
                        {visitors.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                              #{v.accessPin}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-900">{v.visitorName}</div>
                              <div className="font-mono text-xs text-slate-500">{v.documentId}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-mono text-xs font-semibold text-slate-900">
                                {v.unitNumber}
                              </div>
                              <div className="text-xs text-slate-500">{v.authorizedBy}</div>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-600">
                              <span>{v.accessType}</span>
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span className="font-mono">{v.vehiclePlate}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                              {v.entryTime}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-medium text-slate-800 whitespace-nowrap">
                              {v.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {accessSubTab === 'reservas' && (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-medium text-slate-500 bg-slate-50/60">
                          <th className="py-3 px-4">Código</th>
                          <th className="py-3 px-4">Área Social Reservada</th>
                          <th className="py-3 px-4">Unidad y Titular</th>
                          <th className="py-3 px-4">Fecha y Horario</th>
                          <th className="py-3 px-4 text-right">Invitados</th>
                          <th className="py-3 px-4 text-right">Depósito Garantía</th>
                          <th className="py-3 px-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm">
                        {reservations.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                              {r.id}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-900">
                              {r.amenityName}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-semibold text-slate-900">
                                {r.unitNumber}
                              </span>
                              <span className="mx-1.5 text-slate-300">·</span>
                              <span className="text-xs text-slate-600">{r.residentName}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                              {r.date} · {r.timeSlot}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700">
                              {r.guestsCount} personas
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-xs font-medium text-slate-900 whitespace-nowrap">
                              RD$ {r.depositAmount.toLocaleString('es-DO')}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-medium text-emerald-700 whitespace-nowrap">
                              {r.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {accessSubTab === 'respaldo' && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-base font-semibold text-slate-900">
                      Centro de Respaldo y Sincronización · Tecnomajestic/Condolink-App
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Exporta o restaura la base de datos completa de tu condominio en formato JSON, o descarga el estado para subirlo a tu repositorio de GitHub.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Download className="w-4 h-4 text-slate-700" />
                          <span>Descargar Respaldo JSON</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          Guarda en tu computadora todas las unidades, pagos, gastos, tickets y reservas registradas hasta el momento.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportJSONBackup}
                        className="w-full px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Descargar Archivo .JSON
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <Upload className="w-4 h-4 text-slate-700" />
                          <span>Importar Datos Previos</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          Carga un archivo JSON de respaldo de Condolink-App para restaurar tus unidades y registros al instante.
                        </p>
                      </div>
                      <label className="w-full px-3.5 py-2 text-xs font-medium text-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
                        Seleccionar Archivo .JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSONBackup}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <RefreshCw className="w-4 h-4 text-slate-700" />
                          <span>Restablecer Datos Demo</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          Vuelve a cargar el padrón inicial de demostración de Residencial Torres del Mirador si deseas reiniciar las pruebas.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetDemoData}
                        className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Restablecer Padrón Inicial
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer — Policy-safe institutional context */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Condolink-App · Sistema de Administración de Condominios</span>
            <span className="mx-2">·</span>
            <span>Entorno de Demostración y Gestión Operativa</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleExportJSONBackup}
              className="hover:text-slate-900 underline underline-offset-2"
            >
              Descargar Respaldo JSON
            </button>
            <span>Tecnomajestic / Condolink-App</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: REGISTRAR PAGO DE CUOTA */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Registrar Pago de Cuota Condominial
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Seleccionar Unidad
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    const found = units.find((u) => u.id === e.target.value);
                    if (found) {
                      setPaymentAmount(
                        String(found.balanceDue > 0 ? found.balanceDue : found.monthlyFee)
                      );
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unitNumber} — {u.ownerName} (Pendiente: RD${' '}
                      {u.balanceDue.toLocaleString('es-DO')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Monto Recibido (RD$)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Referencia Bancaria / Recibo (Opcional)
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Ej. ACH-901823 / Depósito Popular"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Confirmar Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRAR GASTO OPERATIVO */}
      {activeModal === 'expense' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Registrar Gasto / Pago a Proveedor
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Categoría del Gasto
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                >
                  <option value="Seguridad y Vigilancia">Seguridad y Vigilancia</option>
                  <option value="Mantenimiento de Ascensores">Mantenimiento de Ascensores</option>
                  <option value="Energía y Combustible Planta">Energía y Combustible Planta</option>
                  <option value="Limpieza y Áreas Comunes">Limpieza y Áreas Comunes</option>
                  <option value="Suministro de Agua / Cisterna">Suministro de Agua / Cisterna</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre del Suplidor o Empresa
                </label>
                <input
                  type="text"
                  required
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  placeholder="Ej. Elevadores del Caribe SRL"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Descripción del Servicio
                </label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="Ej. Mantenimiento preventivo mensual"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Monto Total (RD$)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="15000"
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Registrar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NUEVA UNIDAD */}
      {activeModal === 'unit' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Registrar Nueva Unidad en el Condominio
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Torre</label>
                  <select
                    value={newUnitTower}
                    onChange={(e) => setNewUnitTower(e.target.value as 'Torre A' | 'Torre B')}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Torre A">Torre A</option>
                    <option value="Torre B">Torre B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Número de Unidad
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    placeholder="Ej. B-202"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre del Propietario o Residente
                </label>
                <input
                  type="text"
                  required
                  value={newUnitOwner}
                  onChange={(e) => setNewUnitOwner(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Condición
                  </label>
                  <select
                    value={newUnitType}
                    onChange={(e) =>
                      setNewUnitType(e.target.value as 'Propietario' | 'Inquilino')
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Propietario">Propietario</option>
                    <option value="Inquilino">Inquilino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cuota Mensual (RD$)
                  </label>
                  <input
                    type="number"
                    required
                    value={newUnitFee}
                    onChange={(e) => setNewUnitFee(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newUnitPhone}
                    onChange={(e) => setNewUnitPhone(e.target.value)}
                    placeholder="809-555-0000"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Parqueos</label>
                  <input
                    type="text"
                    value={newUnitParking}
                    onChange={(e) => setNewUnitParking(e.target.value)}
                    placeholder="P-14, P-15"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Guardar Unidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: NUEVO TICKET DE MANTENIMIENTO */}
      {activeModal === 'ticket' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Crear Orden de Mantenimiento
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Descripción de la Avería o Trabajo
                </label>
                <input
                  type="text"
                  required
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  placeholder="Ej. Revisión de intercomunicador en lobby"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Área o Nivel
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicketArea}
                    onChange={(e) => setNewTicketArea(e.target.value)}
                    placeholder="Ej. Lobby Torre B"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) =>
                      setNewTicketPriority(e.target.value as 'Alta' | 'Media' | 'Baja')
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Técnico / Suplidor
                  </label>
                  <input
                    type="text"
                    value={newTicketVendor}
                    onChange={(e) => setNewTicketVendor(e.target.value)}
                    placeholder="Personal Interno"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Costo Estimado (RD$)
                  </label>
                  <input
                    type="number"
                    value={newTicketCost}
                    onChange={(e) => setNewTicketCost(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Registrar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: AUTORIZAR VISITANTE */}
      {activeModal === 'visitor' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Autorizar Pase de Visita en Garita
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre del Visitante o Empresa
                </label>
                <input
                  type="text"
                  required
                  value={newVisitorName}
                  onChange={(e) => setNewVisitorName(e.target.value)}
                  placeholder="Nombre y Apellido"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Unidad que Autoriza
                  </label>
                  <select
                    value={newVisitorUnit}
                    onChange={(e) => setNewVisitorUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.unitNumber}>
                        {u.unitNumber} ({u.ownerName.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tipo de Acceso
                  </label>
                  <select
                    value={newVisitorType}
                    onChange={(e) =>
                      setNewVisitorType(
                        e.target.value as
                          | 'Visita Familiar'
                          | 'Proveedor / Técnico'
                          | 'Delivery / Paquetería'
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Visita Familiar">Visita Familiar</option>
                    <option value="Proveedor / Técnico">Proveedor / Técnico</option>
                    <option value="Delivery / Paquetería">Delivery / Paquetería</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Documento / Cédula
                  </label>
                  <input
                    type="text"
                    value={newVisitorDoc}
                    onChange={(e) => setNewVisitorDoc(e.target.value)}
                    placeholder="001-0000000-0"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Placa Vehículo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newVisitorPlate}
                    onChange={(e) => setNewVisitorPlate(e.target.value)}
                    placeholder="A-123456"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Generar PIN de Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: NUEVA RESERVA DE ÁREA COMÚN */}
      {activeModal === 'reservation' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Reservar Área Social del Condominio
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Área Común Solicitada
                </label>
                <select
                  value={newResAmenity}
                  onChange={(e) => setNewResAmenity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Terraza Lounge & Área BBQ">Terraza Lounge & Área BBQ</option>
                  <option value="Salón Climatizado de Eventos">Salón Climatizado de Eventos</option>
                  <option value="Sala de Co-Working y Reuniones">
                    Sala de Co-Working y Reuniones
                  </option>
                  <option value="Gazebo Familiar & Piscina">Gazebo Familiar & Piscina</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unidad</label>
                  <select
                    value={newResUnit}
                    onChange={(e) => setNewResUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.unitNumber}>
                        {u.unitNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cantidad Invitados
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newResGuests}
                    onChange={(e) => setNewResGuests(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newResDate}
                    onChange={(e) => setNewResDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Horario</label>
                  <input
                    type="text"
                    value={newResSlot}
                    onChange={(e) => setNewResSlot(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
