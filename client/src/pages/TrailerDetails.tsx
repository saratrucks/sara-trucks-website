import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Euro, 
  MapPin, 
  Phone, 
  Loader2,
  Ruler,
  Weight,
  Share2,
  Copy,
  Check,
  Container
} from "lucide-react";
import { trailers as trailersData, trailerImages as trailerImagesData } from "@/data/trailers";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { ImageGallery } from "@/components/ImageGallery";
import { useTranslation } from "@/lib/translate";
import { SEO } from "@/components/SEO";
import { ProductSchema } from "@/components/ProductSchema";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Component for translated description
function TranslatedDescription({ description, language, title }: { description: string; language: string; title: string }) {
  // Display full description without shortening (AI already generates concise 100-word descriptions)
  const shortDescription = description;
  const { translatedText, isLoading } = useTranslation(shortDescription, language);
  
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-primary mb-4">
          {title}
        </h2>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{language === 'ar' ? 'جاري الترجمة...' : 'Translating...'}</span>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {translatedText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function TrailerDetails() {
  const { t, dir, language } = useLanguage();
  const params = useParams<{ id: string }>();
  const trailerId = parseInt(params.id || "0");
  const [copied, setCopied] = useState(false);

  // Use static data
  const trailer = trailersData.find(t => t.id === trailerId) || null;
  const isLoading = false;
  const error = !trailer && trailerId > 0 ? new Error("Not found") : null;
  const images = trailerImagesData.filter(img => img.trailerId === trailerId);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      available: { ar: "متاح", en: "Available", it: "Disponibile", de: "Verfügbar" },
      sold: { ar: "مباع", en: "Sold", it: "Venduto", de: "Verkauft" },
      reserved: { ar: "محجوز", en: "Reserved", it: "Riservato", de: "Reserviert" }
    };
    return labels[status]?.[language] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "sold": return "bg-red-500";
      case "reserved": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!trailer) return;
    const message = encodeURIComponent(
      `Hello, I'm interested in the ${trailer.brand} ${trailer.model} (${trailer.year}) trailer listed at €${Number(trailer.price).toLocaleString()}. Reference ID: ${trailer.id}`
    );
    window.open(`https://wa.me/393337198678?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+393337198678", "_self");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(language === 'ar' ? 'فشل نسخ الرابط' : 'Failed to copy link');
    }
  };

  const pageLabels: Record<string, Record<string, string>> = {
    backToTrailers: { ar: "العودة للمقطورات", en: "Back to Trailers", it: "Torna ai Rimorchi", de: "Zurück zu Anhängern" },
    price: { ar: "السعر", en: "Price", it: "Prezzo", de: "Preis" },
    inquireWhatsApp: { ar: "استفسر عبر واتساب", en: "Inquire via WhatsApp", it: "Richiedi via WhatsApp", de: "Anfrage per WhatsApp" },
    callNow: { ar: "اتصل الآن", en: "Call Now", it: "Chiama Ora", de: "Jetzt Anrufen" },
    specifications: { ar: "المواصفات", en: "Specifications", it: "Specifiche", de: "Spezifikationen" },
    description: { ar: "الوصف", en: "Description", it: "Descrizione", de: "Beschreibung" },
    year: { ar: "سنة الصنع", en: "Year", it: "Anno", de: "Jahr" },
    type: { ar: "النوع", en: "Type", it: "Tipo", de: "Typ" },
    axles: { ar: "عدد المحاور", en: "Axles", it: "Assi", de: "Achsen" },
    length: { ar: "الطول", en: "Length", it: "Lunghezza", de: "Länge" },
    capacity: { ar: "السعة", en: "Capacity", it: "Capacità", de: "Kapazität" },
    location: { ar: "الموقع", en: "Location", it: "Posizione", de: "Standort" },
    share: { ar: "مشاركة", en: "Share", it: "Condividi", de: "Teilen" },
    copyLink: { ar: "نسخ الرابط", en: "Copy Link", it: "Copia Link", de: "Link Kopieren" },
    callForPrice: { ar: "اتصل للسعر", en: "Call for Price", it: "Chiama per il prezzo", de: "Preis auf Anfrage" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trailer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Container className="h-16 w-16 text-muted-foreground opacity-50" />
        <p className="text-xl text-muted-foreground">
          {language === 'ar' ? 'المقطورة غير موجودة' : 'Trailer not found'}
        </p>
        <Link href="/trailers">
          <Button variant="outline">
            {pageLabels.backToTrailers[language]}
          </Button>
        </Link>
      </div>
    );
  }

  const allImages = images && images.length > 0 
    ? images.map((img: any) => img.imageUrl)
    : trailer.imageUrl 
      ? [trailer.imageUrl]
      : [];

  return (
    <>
      <SEO 
        title={`${trailer.brand} ${trailer.model} ${trailer.year}`}
        description={`${trailer.brand} ${trailer.model} ${trailer.year} - €${Number(trailer.price).toLocaleString()}`}
        keywords={`${trailer.brand}, ${trailer.model}, trailer, semi trailer`}
        image={allImages[0]}
        type="product"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `${trailer.brand} ${trailer.model}`,
          "description": trailer.description || `${trailer.brand} ${trailer.model} ${trailer.year}`,
          "image": allImages[0],
          "brand": { "@type": "Brand", "name": trailer.brand },
          "offers": {
            "@type": "Offer",
            "price": trailer.price,
            "priceCurrency": "EUR",
            "availability": trailer.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }}
      />
      <ProductSchema
        type="trailer"
        product={{
          id: trailer.id,
          brand: trailer.brand,
          model: trailer.model,
          year: trailer.year,
          description: trailer.description || undefined,
          imageUrl: trailer.imageUrl || undefined,
          status: trailer.status,
          location: trailer.location || undefined,
          axles: trailer.axles || undefined,
          length: trailer.length || undefined,
          capacity: trailer.capacity || undefined,
          trailerType: trailer.type || undefined,
        }}
        images={images || []}
      />
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white py-8">
          <div className="container">
            <Link href="/trailers">
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-4 gap-2">
                {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                {pageLabels.backToTrailers[language]}
              </Button>
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold font-cairo">
                {trailer.brand} {trailer.model}
              </h1>
              <Badge className={`${getStatusColor(trailer.status)} text-white border-none text-sm px-3 py-1`}>
                {getStatusLabel(trailer.status)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <Card className="overflow-hidden border-none shadow-xl">
                <ImageGallery images={allImages} alt={`${trailer.brand} ${trailer.model}`} />
              </Card>

              {/* Specifications */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-6">
                    {pageLabels.specifications[language]}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{pageLabels.year[language]}</p>
                        <p className="font-semibold">{trailer.year}</p>
                      </div>
                    </div>

                    {trailer.type && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Container className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{pageLabels.type[language]}</p>
                          <p className="font-semibold">{trailer.type}</p>
                        </div>
                      </div>
                    )}

                    {trailer.axles && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Weight className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{pageLabels.axles[language]}</p>
                          <p className="font-semibold">{trailer.axles}</p>
                        </div>
                      </div>
                    )}

                    {trailer.length && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Ruler className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{pageLabels.length[language]}</p>
                          <p className="font-semibold">{trailer.length}</p>
                        </div>
                      </div>
                    )}

                    {trailer.capacity && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Weight className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{pageLabels.capacity[language]}</p>
                          <p className="font-semibold">{trailer.capacity}</p>
                        </div>
                      </div>
                    )}

                    {trailer.location && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{pageLabels.location[language]}</p>
                          <p className="font-semibold">{trailer.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {trailer.description && (
                <TranslatedDescription 
                  description={trailer.description} 
                  language={language}
                  title={pageLabels.description[language]}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="border-none shadow-xl sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{pageLabels.price[language]}</p>
                    <p className="text-3xl font-bold text-primary flex items-center justify-center">
                      {pageLabels.callForPrice[language]}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 text-white gap-2"
                      onClick={handleWhatsAppInquiry}
                    >
                      <WhatsAppIcon className="h-6 w-6" />
                      {pageLabels.inquireWhatsApp[language]}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full h-12 gap-2"
                      onClick={handleCall}
                    >
                      <Phone className="h-5 w-5" />
                      {pageLabels.callNow[language]}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+39 333 719 8678</span>
                  </div>

                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 className="h-4 w-4" />
                          {pageLabels.share[language]}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {pageLabels.copyLink[language]}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
