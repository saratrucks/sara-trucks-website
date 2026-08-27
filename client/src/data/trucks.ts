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
    "id": 3,
    "brand": "Mercedes-Benz",
    "model": "Actros 1845",
    "year": 2021,
    "status": "available",
    "location": "Roma, Italy",
    "description": "Mercedes-Benz Actros 1845 LS con MirrorCam e sistema Predictive Powertrain Control. Cabina StreamSpace, Euro 6.",
    "imageUrl": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    "mileage": "290,000 km",
    "engineType": "OM 471 Euro 6",
    "transmission": "PowerShift",
    "transmissionType": "automatic",
    "horsepower": 449,
    "featured": true
  },
  {
    "id": 5,
    "brand": "MAN",
    "model": "TGX 18.500",
    "year": 2020,
    "status": "reserved",
    "location": "Catania, Italy",
    "description": "MAN TGX 18.500 con cabina XXL. Motore D26 Euro 6, cambio TipMatic. Intarder integrato. Condizioni eccellenti.",
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    "mileage": "350,000 km",
    "engineType": "D2676 Euro 6",
    "transmission": "TipMatic",
    "transmissionType": "automatic",
    "horsepower": 500,
    "featured": false
  },
  {
    "id": 7,
    "brand": "Volvo",
    "model": "FH16 750",
    "year": 2017,
    "status": "sold",
    "location": "Roma, Italy",
    "description": "Volvo FH16 750 - il più potente della gamma. Cabina Globetrotter XL, motore D16K Euro 6. Per trasporti pesanti.",
    "imageUrl": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    "mileage": "600,000 km",
    "engineType": "D16K Euro 6",
    "transmission": "I-Shift",
    "transmissionType": "automatic",
    "horsepower": 750,
    "featured": false
  },
  {
    "id": 8,
    "brand": "Scania",
    "model": "S 530",
    "year": 2021,
    "status": "available",
    "location": "Catania, Italy",
    "description": "Scania S 530 con cabina S-cab (tetto piatto). Motore V8 Euro 6, cambio Opticruise con retarder. Top di gamma.",
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "mileage": "250,000 km",
    "engineType": "DC16 V8 Euro 6",
    "transmission": "Opticruise",
    "transmissionType": "automatic",
    "horsepower": 530,
    "featured": true
  },
  {
    "id": 9,
    "brand": "sss",
    "model": "sss",
    "year": 2026,
    "status": "available",
    "location": "sss",
    "description": "ssss",
    "mileage": "sss",
    "engineType": "s",
    "transmission": "sss",
    "transmissionType": "automatic",
    "horsepower": 0,
    "featured": false
  }
];

export const truckImages: TruckImage[] = [
  {
    "id": 1,
    "truckId": 3,
    "imageUrl": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 2,
    "truckId": 5,
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 3,
    "truckId": 7,
    "imageUrl": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 4,
    "truckId": 8,
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
