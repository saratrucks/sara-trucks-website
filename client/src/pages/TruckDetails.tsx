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
  Truck, 
  Phone, 
  Loader2,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Zap,
  Share2,
  Copy,
  Check,
  FileDown
} from "lucide-react";
import { trucks as trucksData, truckImages as truckImagesData } from "@/data/trucks";
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

// Facebook Icon Component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Twitter/X Icon Component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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

export default function TruckDetails() {
  const { t, dir, language } = useLanguage();
  const params = useParams<{ id: string }>();
  const truckId = parseInt(params.id || "0");
  const [copied, setCopied] = useState(false);

  // Use static data
  const truck = trucksData.find(t => t.id === truckId) || null;
  const isLoading = false;
  const error = !truck && truckId > 0 ? new Error("Not found") : null;
  const truckImages = truckImagesData.filter(img => img.truckId === truckId);
  const similarTrucks = trucksData.filter(
    t => t.brand === truck?.brand && t.id !== truck?.id && t.status === "available"
  ).slice(0, 3);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return t.trucks_page.filters.available_only;
      case "sold":
        return t.trucks_page.filters.sold;
      case "reserved":
        return t.trucks_page.filters.reserved;
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "sold":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const phoneNumber = "+393337198678";
  const whatsappMessage = encodeURIComponent(
    language === 'ar' 
      ? `مرحباً، أنا مهتم بالشاحنة: ${truck?.brand} ${truck?.model} (${truck?.year})`
      : language === 'it'
      ? `Ciao, sono interessato al camion: ${truck?.brand} ${truck?.model} (${truck?.year})`
      : language === 'de'
      ? `Hallo, ich interessiere mich für den LKW: ${truck?.brand} ${truck?.model} (${truck?.year})`
      : `Hello, I'm interested in the truck: ${truck?.brand} ${truck?.model} (${truck?.year})`
  );

  // Share functionality
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const getShareText = () => {
    if (!truck) return '';
    return language === 'ar'
      ? `شاحنة ${truck.brand} ${truck.model} (${truck.year}) | Sara Trucks`
      : language === 'it'
      ? `Camion ${truck.brand} ${truck.model} (${truck.year}) | Sara Trucks`
      : language === 'de'
      ? `LKW ${truck.brand} ${truck.model} (${truck.year}) | Sara Trucks`
      : `Truck ${truck.brand} ${truck.model} (${truck.year}) | Sara Trucks`;
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText() + ' ' + getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast.success(
        language === 'ar' ? 'تم نسخ الرابط!' : 
        language === 'it' ? 'Link copiato!' : 
        language === 'de' ? 'Link kopiert!' : 
        'Link copied!'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(
        language === 'ar' ? 'فشل نسخ الرابط' : 
        language === 'it' ? 'Impossibile copiare il link' : 
        language === 'de' ? 'Link konnte nicht kopiert werden' : 
        'Failed to copy link'
      );
    }
  };

  const getShareLabel = () => {
    return language === 'ar' ? 'مشاركة' : 
           language === 'it' ? 'Condividi' : 
           language === 'de' ? 'Teilen' : 
           'Share';
  };

  const getCopyLabel = () => {
    return language === 'ar' ? 'نسخ الرابط' : 
           language === 'it' ? 'Copia link' : 
           language === 'de' ? 'Link kopieren' : 
           'Copy link';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Truck className="h-20 w-20 text-muted-foreground opacity-50" />
        <p className="text-xl text-muted-foreground">
          {language === 'ar' ? 'الشاحنة غير موجودة' : language === 'it' ? 'Camion non trovato' : language === 'de' ? 'LKW nicht gefunden' : 'Truck not found'}
        </p>
        <Link href="/trucks">
          <Button variant="outline" className="gap-2">
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t.trucks_page.truck_details.back_to_trucks}
          </Button>
        </Link>
      </div>
    );
  }

  // Prepare SEO data
  const seoTitle = `${truck.brand} ${truck.model} ${truck.year}`;
  const seoDescription = language === 'ar'
    ? `شاحنة ${truck.brand} ${truck.model} موديل ${truck.year} للبيع. ${truck.mileage ? `المسافة: ${truck.mileage}.` : ''} ${truck.location ? `الموقع: ${truck.location}.` : ''}`
    : language === 'it'
    ? `Camion ${truck.brand} ${truck.model} anno ${truck.year} in vendita. ${truck.mileage ? `Chilometraggio: ${truck.mileage}.` : ''} ${truck.location ? `Posizione: ${truck.location}.` : ''}`
    : language === 'de'
    ? `LKW ${truck.brand} ${truck.model} Baujahr ${truck.year} zu verkaufen. ${truck.mileage ? `Kilometerstand: ${truck.mileage}.` : ''} ${truck.location ? `Standort: ${truck.location}.` : ''}`
    : `${truck.brand} ${truck.model} ${truck.year} truck for sale. ${truck.mileage ? `Mileage: ${truck.mileage}.` : ''} ${truck.location ? `Location: ${truck.location}.` : ''}`;

  const productData = {
    name: `${truck.brand} ${truck.model} ${truck.year}`,
    currency: "EUR",
    availability: truck.status === "available" ? "InStock" as const : "OutOfStock" as const,
    brand: truck.brand,
    model: truck.model,
    year: truck.year,
    mileage: truck.mileage || undefined,
    images: truckImages?.map(img => img.imageUrl) || (truck.imageUrl ? [truck.imageUrl] : [])
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={truck.imageUrl || undefined}
        type="product"
        product={productData}
      />
      <ProductSchema
        type="truck"
        product={{
          id: truck.id,
          brand: truck.brand,
          model: truck.model,
          year: truck.year,
          description: truck.description || undefined,
          imageUrl: truck.imageUrl || undefined,
          status: truck.status,
          location: truck.location || undefined,
          mileage: truck.mileage || undefined,
          enginePower: truck.horsepower ? `${truck.horsepower} HP` : undefined,
          transmission: truck.transmission || undefined,
        }}
        images={truckImages || []}
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container">
          <Link href="/trucks" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4">
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t.trucks_page.truck_details.back_to_trucks}
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold font-cairo">
                {truck.brand} {truck.model}
              </h1>
              <Badge className={`${getStatusColor(truck.status)} text-white border-none`}>
                {getStatusLabel(truck.status)}
              </Badge>
            </div>
            
            {/* Share Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-none">
                  <Share2 className="h-4 w-4" />
                  {getShareLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer gap-3">
                  <FacebookIcon className="h-4 w-4 text-blue-600" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer gap-3">
                  <TwitterIcon className="h-4 w-4" />
                  X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToWhatsApp} className="cursor-pointer gap-3">
                  <WhatsAppIcon className="h-4 w-4 text-green-500" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToTelegram} className="cursor-pointer gap-3">
                  <TelegramIcon className="h-4 w-4 text-blue-500" />
                  Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer gap-3">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {getCopyLabel()}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-none shadow-xl">
              <CardContent className="p-4">
                {(truck.imageUrl || (truckImages && truckImages.length > 0)) ? (
                  <ImageGallery
                    images={truckImages || []}
                    primaryImage={truck.imageUrl}
                    truckName={`${truck.brand} ${truck.model}`}
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                    <Truck className="h-32 w-32 text-primary/40" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description with Auto Translation */}
            {truck.description && (
              <TranslatedDescription 
                description={truck.description} 
                language={language}
                title={t.trucks_page.truck_details.description}
              />
            )}

            {/* Technical Specifications */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                  {t.trucks_page.truck_details.specifications}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Year */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.year}</p>
                      <p className="font-bold text-lg">{truck.year}</p>
                    </div>
                  </div>

                  {/* Mileage */}
                  {truck.mileage && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Gauge className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.mileage}</p>
                        <p className="font-bold text-lg">{truck.mileage}</p>
                      </div>
                    </div>
                  )}

                  {/* Engine Type */}
                  {truck.engineType && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.engine}</p>
                        <p className="font-bold text-lg">{truck.engineType}</p>
                      </div>
                    </div>
                  )}

                  {/* Transmission */}
                  {truck.transmission && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.transmission}</p>
                        <p className="font-bold text-lg">{truck.transmission}</p>
                      </div>
                    </div>
                  )}

                  {/* Transmission Type */}
                  {truck.transmissionType && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transmission Type</p>
                        <p className="font-bold text-lg capitalize">{truck.transmissionType}</p>
                      </div>
                    </div>
                  )}

                  {/* Horsepower */}
                  {truck.horsepower && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.horsepower}</p>
                        <p className="font-bold text-lg">{truck.horsepower} HP</p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {truck.location && (
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.trucks_page.truck_details.location}</p>
                        <p className="font-bold text-lg">{truck.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-none shadow-xl sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t.trucks_page.truck_details.price}</p>
                  <p className="text-3xl font-bold text-primary flex items-center justify-center">
                    {t.trucks_page.truck_details.call_for_price}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  {truck.status === "available" ? (
                    <>
                      <a 
                        href={`https://wa.me/${phoneNumber.replace('+', '')}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg gap-3">
                          <WhatsAppIcon className="h-6 w-6" />
                          {t.trucks_page.truck_details.whatsapp_inquiry}
                        </Button>
                      </a>
                      
                      <a href={`tel:${phoneNumber}`} className="block">
                        <Button variant="outline" className="w-full h-14 text-lg gap-3 border-primary text-primary hover:bg-primary hover:text-white">
                          <Phone className="h-5 w-5" />
                          {t.trucks_page.truck_details.call_now}
                        </Button>
                      </a>
                    </>
                  ) : (
                    <Button disabled className="w-full h-14 text-lg">
                      {getStatusLabel(truck.status)}
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Download PDF Button */}
                <a 
                  href={`/api/trucks/${truck.id}/pdf?lang=${language}`}
                  download
                  className="block"
                >
                  <Button variant="outline" className="w-full h-12 gap-3 border-secondary text-secondary hover:bg-secondary hover:text-white">
                    <FileDown className="h-5 w-5" />
                    {t.trucks_page.truck_details.download_pdf}
                  </Button>
                </a>

                <Separator />

                <div className="text-center text-sm text-muted-foreground">
                  <p>📞 +39 333 719 8678</p>
                  <p>📧 international@sara-trucks.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Trucks */}
        {similarTrucks && similarTrucks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-primary mb-8">
              {t.trucks_page.truck_details.similar_trucks}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarTrucks.map((similarTruck) => (
                <Link key={similarTruck.id} href={`/trucks/${similarTruck.id}`}>
                  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {similarTruck.imageUrl ? (
                        <img 
                          src={similarTruck.imageUrl} 
                          alt={`${similarTruck.brand} ${similarTruck.model}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Truck className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{similarTruck.brand} {similarTruck.model}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">{similarTruck.year}</span>
                        <span className="font-bold text-primary text-sm">
                          {t.trucks_page.truck_details.call_for_price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
