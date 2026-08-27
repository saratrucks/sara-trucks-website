export interface Equipment {
  id: number;
  brand: string;
  model: string;
  category: string;
  year: number;
  price?: string;
  operatingHours?: string;
  weight?: string;
  enginePower?: string;
  status: "available" | "sold" | "reserved";
  location?: string;
  description?: string;
  imageUrl?: string;
}

export interface EquipmentImage {
  id: number;
  equipmentId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export const equipment: Equipment[] = [
  {
    "id": 4,
    "brand": "Liebherr",
    "model": "LTM 1030",
    "year": 2017,
    "status": "reserved",
    "location": "Napoli, Italy",
    "description": "Autogru Liebherr LTM 1030 con portata massima 30 tonnellate. Braccio telescopico 30m.",
    "imageUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    "category": "Mobile Crane",
    "price": "120000",
    "operatingHours": "5800 h",
    "weight": "24000 kg",
    "enginePower": "270 kW"
  },
  {
    "id": 5,
    "brand": "Bobcat",
    "model": "S650",
    "year": 2022,
    "status": "available",
    "location": "Catania, Italy",
    "description": "Minipala Bobcat S650 con cabina chiusa e aria condizionata. Vari accessori disponibili.",
    "imageUrl": "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
    "category": "Skid Steer",
    "price": "38000",
    "operatingHours": "1200 h",
    "weight": "3500 kg",
    "enginePower": "55 kW"
  }
];

export const equipmentImages: EquipmentImage[] = [
  {
    "id": 1,
    "equipmentId": 4,
    "imageUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 2,
    "equipmentId": 5,
    "imageUrl": "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
