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
    "equipmentId": 5,
    "imageUrl": "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
    "isPrimary": true,
    "sortOrder": 0
  }
];
