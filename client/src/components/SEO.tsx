import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  structuredData?: Record<string, any>;
  // For product (truck) pages
  product?: {
    name: string;
    currency: string;
    availability: "InStock" | "OutOfStock" | "PreOrder";
    brand: string;
    model: string;
    year: number;
    mileage?: string;
    images?: string[];
  };
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = "website",
  product 
}: SEOProps) {
  const { language } = useLanguage();
  
  // Default values based on language
  const defaults = {
    ar: {
      siteName: "سارا تراكس الدولية",
      defaultTitle: "سارا تراكس - شاحنات ومقطورات ومعدات بناء مستعملة للبيع من إيطاليا",
      defaultDescription: "سارا تراكس الدولية - أكثر من 20 عاماً من الخبرة في تجارة الشاحنات والمقطورات ومعدات البناء المستعملة. نقدم أفضل المنتجات الأوروبية بأسعار تنافسية مع ضمان الجودة والتصدير العالمي.",
      defaultKeywords: "شاحنات مستعملة, مقطورات, معدات بناء, شاحنات إيطاليا, شاحنات أوروبية, Sara Trucks",
    },
    en: {
      siteName: "Sara Trucks International",
      defaultTitle: "Sara Trucks - Used Trucks, Trailers & Construction Equipment from Italy",
      defaultDescription: "Sara Trucks International - Over 20 years of experience in used trucks, semi-trailers, and construction equipment trading. We offer the best European products at competitive prices with quality guarantee and worldwide export.",
      defaultKeywords: "used trucks, semi-trailers, construction equipment, Italy trucks, European trucks, Sara Trucks",
    },
    it: {
      siteName: "Sara Trucks International",
      defaultTitle: "Sara Trucks - Camion, Semirimorchi e Macchine Edili Usati dall'Italia",
      defaultDescription: "Sara Trucks International - Oltre 20 anni di esperienza nel commercio di camion, semirimorchi e macchine edili usati. Offriamo i migliori prodotti europei a prezzi competitivi con garanzia di qualità ed esportazione mondiale.",
      defaultKeywords: "camion usati, semirimorchi, macchine edili, camion Italia, camion europei, Sara Trucks",
    },
    de: {
      siteName: "Sara Trucks International",
      defaultTitle: "Sara Trucks - Gebrauchte LKW, Anhänger & Baumaschinen aus Italien",
      defaultDescription: "Sara Trucks International - Über 20 Jahre Erfahrung im Handel mit gebrauchten LKW, Anhängern und Baumaschinen. Wir bieten die besten europäischen Produkte zu wettbewerbsfähigen Preisen mit Qualitätsgarantie und weltweitem Export.",
      defaultKeywords: "gebrauchte LKW, Anhänger, Baumaschinen, Italien LKW, europäische LKW, Sara Trucks",
    },
  };
  
  const langDefaults = defaults[language as keyof typeof defaults] || defaults.en;
  
  const finalTitle = title ? `${title} | ${langDefaults.siteName}` : langDefaults.defaultTitle;
  const finalDescription = description || langDefaults.defaultDescription;
  const finalKeywords = keywords || langDefaults.defaultKeywords;
  const finalImage = image || "/og-image.webp";
  const finalUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  
  // Generate JSON-LD structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": langDefaults.siteName,
      "url": "https://sara-trucks.com",
      "logo": "https://sara-trucks.com/images/logo.webp",
      "description": langDefaults.defaultDescription,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via Etnea",
        "addressLocality": "Catania",
        "addressRegion": "Sicily",
        "postalCode": "95100",
        "addressCountry": "IT"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+39-333-719-8678",
        "contactType": "sales",
        "email": "international@sara-trucks.com",
        "availableLanguage": ["Arabic", "English", "Italian", "German"]
      },
      "sameAs": [
        "https://www.facebook.com/saratrucks",
        "https://www.instagram.com/saratrucks"
      ]
    };
    
    if (product) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": finalDescription,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "model": product.model,
        "vehicleModelDate": product.year.toString(),
        "mileageFromOdometer": product.mileage ? {
          "@type": "QuantitativeValue",
          "value": product.mileage,
          "unitCode": "KMT"
        } : undefined,
        "image": product.images || [finalImage],
        "offers": {
          "@type": "Offer",
          "priceCurrency": product.currency,
          "availability": `https://schema.org/${product.availability}`,
          "seller": {
            "@type": "Organization",
            "name": langDefaults.siteName
          }
        },
        "category": "Trucks",
        "manufacturer": {
          "@type": "Organization",
          "name": product.brand
        }
      };
    }
    
    return baseData;
  };
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} dir={language === "ar" ? "rtl" : "ltr"} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Sara Trucks International" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "product" ? "product" : type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={langDefaults.siteName} />
      <meta property="og:locale" content={language === "ar" ? "ar_SA" : language === "it" ? "it_IT" : language === "de" ? "de_DE" : "en_US"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      
      {/* Product specific meta tags */}
      {product && (
        <>
          <meta property="product:price:currency" content={product.currency} />
          <meta property="product:availability" content={product.availability === "InStock" ? "in stock" : "out of stock"} />
          <meta property="product:brand" content={product.brand} />
        </>
      )}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
}
