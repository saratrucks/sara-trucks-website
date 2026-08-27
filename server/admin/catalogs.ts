import { getRepositoryFile, putRepositoryFile } from "./github.js";

export type Catalog = "trucks" | "trailers" | "equipment";

const catalogConfig = {
  trucks: {
    path: "client/src/data/trucks.ts",
    itemType: "Truck",
    collection: "trucks",
    imageType: "TruckImage",
    imageCollection: "truckImages",
    foreignKey: "truckId",
  },
  trailers: {
    path: "client/src/data/trailers.ts",
    itemType: "Trailer",
    collection: "trailers",
    imageType: "TrailerImage",
    imageCollection: "trailerImages",
    foreignKey: "trailerId",
  },
  equipment: {
    path: "client/src/data/equipment.ts",
    itemType: "Equipment",
    collection: "equipment",
    imageType: "EquipmentImage",
    imageCollection: "equipmentImages",
    foreignKey: "equipmentId",
  },
} as const;

const statusValues = new Set(["available", "sold", "reserved"]);

function cleanText(value: unknown, maxLength: number, required = false) {
  if (value === undefined || value === null) {
    if (required) throw new Error("INVALID_INPUT");
    return undefined;
  }
  if (typeof value !== "string") throw new Error("INVALID_INPUT");
  const clean = value.trim();
  if ((required && clean.length === 0) || clean.length > maxLength) throw new Error("INVALID_INPUT");
  return clean || undefined;
}

function cleanNumber(value: unknown, min: number, max: number, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error("INVALID_INPUT");
    return undefined;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error("INVALID_INPUT");
  return number;
}

function cleanImageUrl(value: unknown) {
  const url = cleanText(value, 1_000_000);
  if (!url) return undefined;
  if (url.startsWith("/uploads/") || url.startsWith("data:image/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error("INVALID_INPUT");
  } catch {
    throw new Error("INVALID_INPUT");
  }
  return url;
}

function cleanBase(item: Record<string, unknown>) {
  const status = cleanText(item.status, 20, true);
  if (!statusValues.has(status!)) throw new Error("INVALID_INPUT");

  return {
    id: cleanNumber(item.id, 1, Number.MAX_SAFE_INTEGER, true)!,
    brand: cleanText(item.brand, 80, true)!,
    model: cleanText(item.model, 100, true)!,
    year: cleanNumber(item.year, 1980, new Date().getFullYear() + 2, true)!,
    status,
    location: cleanText(item.location, 160),
    description: cleanText(item.description, 5_000),
    imageUrl: cleanImageUrl(item.imageUrl),
  };
}

export function sanitizeCatalog(catalog: Catalog, rawItems: unknown) {
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 250) {
    throw new Error("INVALID_INPUT");
  }

  const seenIds = new Set<number>();
  const items = rawItems.map((raw) => {
    if (!raw || typeof raw !== "object") throw new Error("INVALID_INPUT");
    const item = raw as Record<string, unknown>;
    const base = cleanBase(item);
    if (seenIds.has(base.id)) throw new Error("INVALID_INPUT");
    seenIds.add(base.id);

    if (catalog === "trucks") {
      const transmissionType = cleanText(item.transmissionType, 30);
      if (transmissionType && !["manual", "automatic", "semi-automatic"].includes(transmissionType)) {
        throw new Error("INVALID_INPUT");
      }
      return {
        ...base,
        mileage: cleanText(item.mileage, 80),
        engineType: cleanText(item.engineType, 100),
        transmission: cleanText(item.transmission, 100),
        transmissionType,
        horsepower: cleanNumber(item.horsepower, 0, 2_000),
        featured: Boolean(item.featured),
      };
    }

    if (catalog === "trailers") {
      return {
        ...base,
        type: cleanText(item.type, 100, true)!,
        price: cleanText(item.price, 80),
        axles: cleanNumber(item.axles, 1, 12),
        length: cleanText(item.length, 80),
        capacity: cleanText(item.capacity, 80),
      };
    }

    return {
      ...base,
      category: cleanText(item.category, 100, true)!,
      price: cleanText(item.price, 80),
      operatingHours: cleanText(item.operatingHours, 80),
      weight: cleanText(item.weight, 80),
      enginePower: cleanText(item.enginePower, 80),
    };
  });

  return items.sort((a, b) => a.id - b.id);
}

function generateDataBlock(catalog: Catalog, items: ReturnType<typeof sanitizeCatalog>) {
  const config = catalogConfig[catalog];
  const images = items
    .filter((item) => item.imageUrl)
    .map((item, index) => ({
      id: index + 1,
      [config.foreignKey]: item.id,
      imageUrl: item.imageUrl,
      isPrimary: true,
      sortOrder: 0,
    }));

  return `export const ${config.collection}: ${config.itemType}[] = ${JSON.stringify(items, null, 2)};\n\nexport const ${config.imageCollection}: ${config.imageType}[] = ${JSON.stringify(images, null, 2)};`;
}

export async function saveCatalog(catalog: Catalog, rawItems: unknown) {
  if (!(catalog in catalogConfig)) throw new Error("INVALID_INPUT");
  const items = sanitizeCatalog(catalog, rawItems);
  const config = catalogConfig[catalog];
  const current = await getRepositoryFile(config.path);
  const dataPattern = new RegExp(
    `export const ${config.collection}: ${config.itemType}\\[\\] = \\[([\\s\\S]*?)\\];\\s*export const ${config.imageCollection}: ${config.imageType}\\[\\] = \\[([\\s\\S]*?)\\];`,
  );
  if (!dataPattern.test(current.content)) throw new Error("GITHUB_INVALID_FILE");

  const nextContent = current.content.replace(dataPattern, generateDataBlock(catalog, items));
  await putRepositoryFile(
    config.path,
    nextContent,
    `Admin: update ${catalog} catalog`,
    current.sha,
  );
  return items;
}

export function uploadPath(catalog: Catalog, itemId: number, mimeType: string) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const extension = extensions[mimeType];
  if (!extension || !Number.isSafeInteger(itemId) || itemId < 1) throw new Error("INVALID_INPUT");
  return `client/public/uploads/${catalog}-${itemId}-${Date.now()}.${extension}`;
}
