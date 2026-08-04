import { FuelLog, MaintenanceLog } from '../types';

export const INITIAL_FUEL_LOGS: FuelLog[] = [
  {
    id: 'fuel-1',
    date: '2026-08-01',
    travelKm: 420,
    perLiterCost: 130,
    totalCost: 4265,
    liters: 32.8,
    efficiency: 12.8,
    fuelGrade: '91 Grade',
    odometerKm: 42500,
    notes: 'Highway & City drive mixture'
  },
  {
    id: 'fuel-2',
    date: '2026-07-24',
    travelKm: 380,
    perLiterCost: 130,
    totalCost: 3952,
    liters: 30.4,
    efficiency: 12.5,
    fuelGrade: '91 Grade',
    odometerKm: 42080,
    notes: 'Full tank fill up'
  },
  {
    id: 'fuel-3',
    date: '2026-07-16',
    travelKm: 450,
    perLiterCost: 130,
    totalCost: 4420,
    liters: 34.0,
    efficiency: 13.2,
    fuelGrade: '91 Grade',
    odometerKm: 41700,
    notes: 'Long weekend highway trip'
  },
  {
    id: 'fuel-4',
    date: '2026-07-08',
    travelKm: 360,
    perLiterCost: 128,
    totalCost: 3840,
    liters: 30.0,
    efficiency: 12.0,
    fuelGrade: '91 Grade',
    odometerKm: 41250,
    notes: 'Heavy city traffic week'
  }
];

export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 'maint-1',
    serviceTitle: 'Synthetic Oil & Filter Change',
    date: '2026-07-28',
    odometerKm: 42200,
    totalCost: 5500,
    category: 'Engine Oil',
    notes: 'Used Mobil 1 5W-30 Full Synthetic Oil. Changed OEM Oil Filter.'
  },
  {
    id: 'maint-2',
    serviceTitle: 'Brake Pad Replacement & Inspection',
    date: '2026-06-15',
    odometerKm: 40500,
    totalCost: 8200,
    category: 'Brake Service',
    notes: 'Replaced front ceramic brake pads. Rotor thickness inspected & ok.'
  },
  {
    id: 'maint-3',
    serviceTitle: 'Engine & Cabin Air Filters',
    date: '2026-05-10',
    odometerKm: 38800,
    totalCost: 2400,
    category: 'General Service',
    notes: 'Replaced both high-flow engine air filter and activated carbon cabin filter.'
  }
];
