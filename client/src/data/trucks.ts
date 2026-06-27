export interface Truck {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage?: string;
  location?: string;
  status: "available" | "sold" | "reserved";
  description?: string;
  imageUrl?: string;
  engineType?: string;
  transmission?: string;
  transmissionType?: "manual" | "automatic" | "semi-automatic";
  horsepower?: number;
  featured?: boolean;
}

export interface TruckImage {
  id: number;
  truckId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export const trucks: Truck[] = [
  {
    id: 1,
    brand: "Volvo",
    model: "FH 500",
    year: 2019,
    mileage: "420,000 km",
    location: "Catania, Italy",
    status: "available",
    description: "Trattore stradale Volvo FH 500 in ottime condizioni. Motore Euro 6, cambio automatico I-Shift, cabina Globetrotter XL. Ideale per trasporti internazionali.",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    engineType: "D13K Euro 6",
    transmission: "I-Shift",
    transmissionType: "automatic",
    horsepower: 500,
    featured: true,
  },
  {
    id: 2,
    brand: "Scania",
    model: "R 450",
    year: 2020,
    mileage: "380,000 km",
    location: "Milano, Italy",
    status: "available",
    description: "Scania R 450 trattore stradale con cabina Highline. Motore Euro 6, cambio Opticruise. Manutenzione completa documentata.",
    imageUrl: "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    engineType: "DC13 Euro 6",
    transmission: "Opticruise",
    transmissionType: "automatic",
    horsepower: 450,
    featured: true,
  },
  {
    id: 3,
    brand: "Mercedes-Benz",
    model: "Actros 1845",
    year: 2021,
    mileage: "290,000 km",
    location: "Roma, Italy",
    status: "available",
    description: "Mercedes-Benz Actros 1845 LS con MirrorCam e sistema Predictive Powertrain Control. Cabina StreamSpace, Euro 6.",
    imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    engineType: "OM 471 Euro 6",
    transmission: "PowerShift",
    transmissionType: "automatic",
    horsepower: 449,
    featured: true,
  },
  {
    id: 4,
    brand: "DAF",
    model: "XF 480",
    year: 2018,
    mileage: "520,000 km",
    location: "Napoli, Italy",
    status: "available",
    description: "DAF XF 480 Super Space Cab. Motore PACCAR MX-13 Euro 6. Ottimo per lunghe percorrenze. Pneumatica integrale.",
    imageUrl: "https://images.unsplash.com/photo-1562674319-2a1d7e3c4e47?w=800",
    engineType: "PACCAR MX-13 Euro 6",
    transmission: "TraXon",
    transmissionType: "automatic",
    horsepower: 480,
    featured: false,
  },
  {
    id: 5,
    brand: "MAN",
    model: "TGX 18.500",
    year: 2020,
    mileage: "350,000 km",
    location: "Catania, Italy",
    status: "reserved",
    description: "MAN TGX 18.500 con cabina XXL. Motore D26 Euro 6, cambio TipMatic. Intarder integrato. Condizioni eccellenti.",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    engineType: "D2676 Euro 6",
    transmission: "TipMatic",
    transmissionType: "automatic",
    horsepower: 500,
    featured: false,
  },
  {
    id: 6,
    brand: "Iveco",
    model: "S-Way 490",
    year: 2022,
    mileage: "180,000 km",
    location: "Milano, Italy",
    status: "available",
    description: "Iveco S-Way 490 AS440. Nuovo design, cabina Hi-Way. Motore Cursor 11 Euro 6D. Connettività avanzata.",
    imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
    engineType: "Cursor 11 Euro 6D",
    transmission: "Hi-Tronix",
    transmissionType: "automatic",
    horsepower: 490,
    featured: true,
  },
  {
    id: 7,
    brand: "Volvo",
    model: "FH16 750",
    year: 2017,
    mileage: "600,000 km",
    location: "Roma, Italy",
    status: "sold",
    description: "Volvo FH16 750 - il più potente della gamma. Cabina Globetrotter XL, motore D16K Euro 6. Per trasporti pesanti.",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    engineType: "D16K Euro 6",
    transmission: "I-Shift",
    transmissionType: "automatic",
    horsepower: 750,
    featured: false,
  },
  {
    id: 8,
    brand: "Scania",
    model: "S 530",
    year: 2021,
    mileage: "250,000 km",
    location: "Catania, Italy",
    status: "available",
    description: "Scania S 530 con cabina S-cab (tetto piatto). Motore V8 Euro 6, cambio Opticruise con retarder. Top di gamma.",
    imageUrl: "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    engineType: "DC16 V8 Euro 6",
    transmission: "Opticruise",
    transmissionType: "automatic",
    horsepower: 530,
    featured: true,
  },
];

export const truckImages: TruckImage[] = [
  { id: 1, truckId: 1, imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800", isPrimary: true, sortOrder: 0 },
  { id: 2, truckId: 1, imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800", isPrimary: false, sortOrder: 1 },
  { id: 3, truckId: 2, imageUrl: "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800", isPrimary: true, sortOrder: 0 },
  { id: 4, truckId: 2, imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800", isPrimary: false, sortOrder: 1 },
  { id: 5, truckId: 3, imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800", isPrimary: true, sortOrder: 0 },
  { id: 6, truckId: 4, imageUrl: "https://images.unsplash.com/photo-1562674319-2a1d7e3c4e47?w=800", isPrimary: true, sortOrder: 0 },
  { id: 7, truckId: 5, imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800", isPrimary: true, sortOrder: 0 },
  { id: 8, truckId: 6, imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800", isPrimary: true, sortOrder: 0 },
  { id: 9, truckId: 7, imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800", isPrimary: true, sortOrder: 0 },
  { id: 10, truckId: 8, imageUrl: "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800", isPrimary: true, sortOrder: 0 },
];
