export interface FuelLog {
  id: string;
  userId?: string;
  date: string;
  travelKm: number;
  perLiterCost: number; // in BDT (৳)
  totalCost: number; // in BDT (৳)
  liters: number; // totalCost / perLiterCost
  efficiency: number; // travelKm / liters (KM/L)
  fuelGrade: string; // Default: "91 Grade"
  odometerKm?: number;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  userId?: string;
  serviceTitle: string;
  date: string;
  odometerKm: number;
  totalCost: number; // in BDT (৳)
  notes?: string;
  category?: 'Master Service' | 'Engine Oil' | 'Brake Service' | 'Tires' | 'Transmission' | 'General Service' | 'Other';
}

export interface User {
  email: string;
  name?: string;
  isGuest: boolean;
  uid?: string;
}

export type TabType = 'dashboard' | 'fuel' | 'maintenance';

export interface TripCalculation {
  fuelPricePerLiter: number;
  distanceKm: number;
  totalFuelPrice: number;
  fuelUsedLiters: number;
  mileageKmL: number;
  costPerKm: number;
}
