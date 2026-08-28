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
  },
  {
    "id": 10,
    "brand": "teast",
    "model": "teast",
    "year": 2026,
    "status": "reserved",
    "location": "sss",
    "description": "aadsd",
    "imageUrl": "/uploads/trucks-10-1787907725212.jpg",
    "mileage": "0444",
    "engineType": "d13",
    "transmissionType": "manual",
    "horsepower": 500,
    "featured": false
  }
];

export const truckImages: TruckImage[] = [
  {
    "id": 1,
    "truckId": 10,
    "imageUrl": "/uploads/trucks-10-1787907725212.jpg",
    "isPrimary": true,
    "sortOrder": 0
  }
];
