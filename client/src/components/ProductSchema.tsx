import { Helmet } from "react-helmet-async";

interface ProductSchemaProps {
  type: "truck" | "trailer" | "equipment";
  product: {
    id: number;
    brand: string;
    model: string;
    year: number;
    description?: string;
    imageUrl?: string;
    status: string;
    location?: string;
    // Truck specific
    mileage?: string;
    enginePower?: string;
    transmission?: string;
    // Trailer specific
    axles?: number;
    length?: string;
    capacity?: string;
    trailerType?: string;
    // Equipment specific
    operatingHours?: string;
    category?: string;
  };
  images?: { imageUrl: string }[];
}

export function ProductSchema({ type, product, images = [] }: ProductSchemaProps) {
  const baseUrl = "https://www.sara-trucks.com";
  
  // Collect all images
  const allImages = [
    product.imageUrl,
    ...images.map(img => img.imageUrl)
  ].filter(Boolean);

  // Determine product category and type
  const getProductType = () => {
    switch (type) {
      case "truck":
        return "Vehicle";
      case "trailer":
        return "Vehicle";
      case "equipment":
        return "Product";
      default:
        return "Product";
    }
  };

  const getProductCategory = () => {
    switch (type) {
      case "truck":
        return "Trucks";
      case "trailer":
        return "Trailers";
      case "equipment":
        return "Construction Equipment";
      default:
        return "Vehicles";
    }
  };

  const getProductUrl = () => {
    switch (type) {
      case "truck":
        return `${baseUrl}/trucks/${product.id}`;
      case "trailer":
        return `${baseUrl}/trailers/${product.id}`;
      case "equipment":
        return `${baseUrl}/equipment/${product.id}`;
      default:
        return baseUrl;
    }
  };

  // Build product name
  const productName = `${product.brand} ${product.model} ${product.year}`;

  // Build description
  const buildDescription = () => {
    const parts = [productName];
    
    if (type === "truck") {
      if (product.mileage) parts.push(`Mileage: ${product.mileage}`);
      if (product.enginePower) parts.push(`Power: ${product.enginePower}`);
      if (product.transmission) parts.push(`Transmission: ${product.transmission}`);
    } else if (type === "trailer") {
      if (product.trailerType) parts.push(`Type: ${product.trailerType}`);
      if (product.axles) parts.push(`Axles: ${product.axles}`);
      if (product.length) parts.push(`Length: ${product.length}`);
      if (product.capacity) parts.push(`Capacity: ${product.capacity}`);
    } else if (type === "equipment") {
      if (product.category) parts.push(`Category: ${product.category}`);
      if (product.operatingHours) parts.push(`Hours: ${product.operatingHours}`);
    }
    
    if (product.location) parts.push(`Location: ${product.location}`);
    
    return product.description || parts.join(" | ");
  };

  // Availability based on status
  const getAvailability = () => {
    switch (product.status) {
      case "available":
        return "https://schema.org/InStock";
      case "sold":
        return "https://schema.org/SoldOut";
      case "reserved":
        return "https://schema.org/LimitedAvailability";
      default:
        return "https://schema.org/InStock";
    }
  };

  // Build the schema object
  const schema: any = {
    "@context": "https://schema.org",
    "@type": getProductType(),
    "name": productName,
    "description": buildDescription(),
    "url": getProductUrl(),
    "image": allImages.length > 0 ? allImages : undefined,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "manufacturer": {
      "@type": "Organization",
      "name": product.brand
    },
    "model": product.model,
    "productionDate": product.year.toString(),
    "category": getProductCategory(),
    "offers": {
      "@type": "Offer",
      "availability": getAvailability(),
      "priceCurrency": "EUR",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": "Sara Trucks International SRL",
        "url": baseUrl,
        "telephone": "+393761aboralistaitaliano",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Via Catania 41",
          "addressLocality": "Misterbianco",
          "addressRegion": "CT",
          "postalCode": "95045",
          "addressCountry": "IT"
        }
      }
    },
    "itemCondition": "https://schema.org/UsedCondition"
  };

  // Add vehicle-specific properties
  if (type === "truck") {
    schema["@type"] = "Vehicle";
    schema.vehicleConfiguration = "Truck";
    if (product.mileage) {
      schema.mileageFromOdometer = {
        "@type": "QuantitativeValue",
        "value": product.mileage.replace(/[^0-9]/g, ''),
        "unitCode": "KMT"
      };
    }
    if (product.transmission) schema.vehicleTransmission = product.transmission;
    if (product.enginePower) {
      schema.vehicleEngine = {
        "@type": "EngineSpecification",
        "enginePower": {
          "@type": "QuantitativeValue",
          "value": product.enginePower.replace(/[^0-9]/g, ''),
          "unitCode": "BHP"
        }
      };
    }
  } else if (type === "trailer") {
    schema["@type"] = "Vehicle";
    schema.vehicleConfiguration = "Trailer";
    if (product.axles) {
      schema.numberOfAxles = product.axles;
    }
  }

  // Organization schema for the seller
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Sara Trucks International SRL",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "telephone": ["+393761614221", "+393517aboralistaitaliano"],
    "email": "international@sara-trucks.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via Catania 41",
      "addressLocality": "Misterbianco",
      "addressRegion": "CT",
      "postalCode": "95045",
      "addressCountry": "IT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.430618,
      "longitude": 15.065564
    },
    "sameAs": [
      "https://www.facebook.com/saratrucks",
      "https://www.instagram.com/saratrucks"
    ]
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": getProductCategory(),
        "item": `${baseUrl}/${type}s`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": productName,
        "item": getProductUrl()
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}

// Schema for product listing pages
interface ProductListSchemaProps {
  type: "trucks" | "trailers" | "equipment";
  products: Array<{
    id: number;
    brand: string;
    model: string;
    year: number;
    price?: string;
    imageUrl?: string;
  }>;
}

export function ProductListSchema({ type, products }: ProductListSchemaProps) {
  const baseUrl = "https://www.sara-trucks.com";
  
  const getTypeName = () => {
    switch (type) {
      case "trucks":
        return "Trucks";
      case "trailers":
        return "Trailers";
      case "equipment":
        return "Construction Equipment";
      default:
        return "Products";
    }
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${getTypeName()} for Sale - Sara Trucks International`,
    "description": `Browse our selection of quality used ${type} for sale. Sara Trucks International offers a wide range of ${type} from top brands.`,
    "url": `${baseUrl}/${type}`,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${baseUrl}/${type}/${product.id}`,
      "name": `${product.brand} ${product.model} ${product.year}`,
      "image": product.imageUrl
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
    </Helmet>
  );
}
