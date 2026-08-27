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
    "truckId": 8,
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
