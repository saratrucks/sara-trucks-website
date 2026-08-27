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
    "id": 2,
    "brand": "Schmitz Cargobull",
    "model": "S.CS",
    "year": 2019,
    "status": "available",
    "location": "Milano, Italy",
    "description": "Semirimorchio centinato Schmitz Cargobull con tetto scorrevole. Perfetto per carichi versatili.",
    "imageUrl": "https://images.unsplash.com/photo-1562674319-2a1d7e3c4e47?w=800",
    "type": "Curtainsider",
    "price": "28000",
    "axles": 3,
    "length": "13.6 m",
    "capacity": "25000 kg"
  },
  {
    "id": 3,
    "brand": "Wielton",
    "model": "NW-3",
    "year": 2021,
    "status": "available",
    "location": "Roma, Italy",
    "description": "Semirimorchio ribaltabile Wielton per trasporto materiali sfusi. Cassone in acciaio Hardox.",
    "imageUrl": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
    "type": "Tipper",
    "price": "42000",
    "axles": 3,
    "length": "10.5 m",
    "capacity": "28000 kg"
  },
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
    "trailerId": 2,
    "imageUrl": "https://images.unsplash.com/photo-1562674319-2a1d7e3c4e47?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 2,
    "trailerId": 3,
    "imageUrl": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 3,
    "trailerId": 4,
    "imageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 4,
    "trailerId": 5,
    "imageUrl": "https://images.unsplash.com/photo-1586191582056-3e4fbb27e2c3?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
