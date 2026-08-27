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

export const trucks: Truck[] = [];

export const truckImages: TruckImage[] = [];
