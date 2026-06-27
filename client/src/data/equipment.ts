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
    id: 1,
    brand: "Caterpillar",
    model: "320",
    category: "Excavator",
    year: 2019,
    price: "85000",
    operatingHours: "4500 h",
    weight: "20000 kg",
    enginePower: "121 kW",
    status: "available",
    location: "Catania, Italy",
    description: "Escavatore cingolato Caterpillar 320 in eccellenti condizioni. Benna da 1.2 m³ inclusa.",
    imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
  },
  {
    id: 2,
    brand: "Komatsu",
    model: "WA320",
    category: "Wheel Loader",
    year: 2020,
    price: "72000",
    operatingHours: "3200 h",
    weight: "12500 kg",
    enginePower: "135 kW",
    status: "available",
    location: "Milano, Italy",
    description: "Pala gommata Komatsu WA320. Benna da 2.5 m³, aria condizionata, telecamera posteriore.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
  },
  {
    id: 3,
    brand: "JCB",
    model: "3CX",
    category: "Backhoe Loader",
    year: 2021,
    price: "55000",
    operatingHours: "2100 h",
    weight: "8000 kg",
    enginePower: "74 kW",
    status: "available",
    location: "Roma, Italy",
    description: "Terna JCB 3CX con stabilizzatori idraulici. Perfetta per lavori di scavo e carico.",
    imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800",
  },
  {
    id: 4,
    brand: "Liebherr",
    model: "LTM 1030",
    category: "Mobile Crane",
    year: 2017,
    price: "120000",
    operatingHours: "5800 h",
    weight: "24000 kg",
    enginePower: "270 kW",
    status: "reserved",
    location: "Napoli, Italy",
    description: "Autogru Liebherr LTM 1030 con portata massima 30 tonnellate. Braccio telescopico 30m.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
  },
  {
    id: 5,
    brand: "Bobcat",
    model: "S650",
    category: "Skid Steer",
    year: 2022,
    price: "38000",
    operatingHours: "1200 h",
    weight: "3500 kg",
    enginePower: "55 kW",
    status: "available",
    location: "Catania, Italy",
    description: "Minipala Bobcat S650 con cabina chiusa e aria condizionata. Vari accessori disponibili.",
    imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800",
  },
];

export const equipmentImages: EquipmentImage[] = [
  { id: 1, equipmentId: 1, imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800", isPrimary: true, sortOrder: 0 },
  { id: 2, equipmentId: 2, imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", isPrimary: true, sortOrder: 0 },
  { id: 3, equipmentId: 3, imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800", isPrimary: true, sortOrder: 0 },
  { id: 4, equipmentId: 4, imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", isPrimary: true, sortOrder: 0 },
  { id: 5, equipmentId: 5, imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800", isPrimary: true, sortOrder: 0 },
];
