export interface Trailer {
  id: number;
  brand: string;
  model: string;
  type: string;
  year: number;
  price?: string;
  axles?: number;
  length?: string;
  capacity?: string;
  status: "available" | "sold" | "reserved";
  location?: string;
  description?: string;
  imageUrl?: string;
}

export interface TrailerImage {
  id: number;
  trailerId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export const trailers: Trailer[] = [
  {
    "id": 4,
    "brand": "Schwarzmüller",
    "model": "Tank",
    "year": 2018,
    "status": "reserved",
    "location": "Napoli, Italy",
    "description": "Cisterna Schwarzmüller per trasporto liquidi alimentari. Capacità 32.000 litri.",
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    "type": "Tanker",
    "price": "38000",
    "axles": 3,
    "length": "12.0 m",
    "capacity": "32000 L"
  },
  {
    "id": 5,
    "brand": "Kögel",
    "model": "Cargo",
    "year": 2022,
    "status": "available",
    "location": "Catania, Italy",
    "description": "Semirimorchio furgonato Kögel Cargo. Pareti in alluminio, pavimento in legno marino.",
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "type": "Box",
    "price": "45000",
    "axles": 3,
    "length": "13.6 m",
    "capacity": "24000 kg"
  }
];

export const trailerImages: TrailerImage[] = [
  {
    "id": 1,
    "trailerId": 4,
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 2,
    "trailerId": 5,
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
