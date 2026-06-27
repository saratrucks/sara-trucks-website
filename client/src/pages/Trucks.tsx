import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Truck, Calendar, Euro, MapPin, Loader2, X, SlidersHorizontal } from "lucide-react";
import { trucks as trucksData } from "@/data/trucks";
import { Link } from "wouter";

export default function Trucks() {
  const { t, dir, language } = useLanguage();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("available");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Use static data
  const trucks = trucksData;
  const isLoading = false;
  const error = null;

  // Get unique brands and years from trucks data
  const { uniqueBrands, uniqueYears } = useMemo(() => {
    if (!trucks) return { uniqueBrands: [], uniqueYears: [] };
    
    const brands = Array.from(new Set(trucks.map(truck => truck.brand))).sort();
    const years = Array.from(new Set(trucks.map(truck => truck.year))).sort((a, b) => b - a);
    
    return { uniqueBrands: brands, uniqueYears: years };
  }, [trucks]);

  const filteredTrucks = useMemo(() => {
    if (!trucks) return [];
    
    return trucks.filter(truck => {
      const matchesSearch = searchTerm === "" || 
        truck.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
        truck.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = brandFilter === "all" || truck.brand === brandFilter;
      const matchesYear = yearFilter === "all" || truck.year.toString() === yearFilter;
      const matchesStatus = statusFilter === "all" || truck.status === statusFilter;
      return matchesSearch && matchesBrand && matchesYear && matchesStatus;
    });
  }, [trucks, searchTerm, brandFilter, yearFilter, statusFilter]);

  // Count active filters
  const activeFiltersCount = [brandFilter, yearFilter, statusFilter].filter(f => f !== "all" && f !== "available").length + (searchInput ? 1 : 0);

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setBrandFilter("all");
    setYearFilter("all");
    setStatusFilter("available");
  };

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

  // SEO titles and descriptions by language
  const seoContent = {
    ar: {
      title: "شاحنات مستعملة للبيع",
      description: "تصفح مجموعتنا الواسعة من الشاحنات المستعملة عالية الجودة من إيطاليا. فولفو، مرسيدس، سكانيا، إيفيكو، مان، داف بأسعار تنافسية.",
      keywords: "شاحنات مستعملة, شاحنات للبيع, شاحنات إيطاليا, فولفو, مرسيدس, سكانيا, إيفيكو"
    },
    en: {
      title: "Used Trucks for Sale",
      description: "Browse our wide collection of high-quality used trucks from Italy. Volvo, Mercedes, Scania, Iveco, MAN, DAF at competitive prices.",
      keywords: "used trucks, trucks for sale, Italy trucks, Volvo, Mercedes, Scania, Iveco"
    },
    it: {
      title: "Camion Usati in Vendita",
      description: "Sfoglia la nostra vasta collezione di camion usati di alta qualità dall'Italia. Volvo, Mercedes, Scania, Iveco, MAN, DAF a prezzi competitivi.",
      keywords: "camion usati, camion in vendita, camion Italia, Volvo, Mercedes, Scania, Iveco"
    },
    de: {
      title: "Gebrauchte LKW zum Verkauf",
      description: "Stöbern Sie in unserer großen Auswahl an hochwertigen gebrauchten LKW aus Italien. Volvo, Mercedes, Scania, Iveco, MAN, DAF zu wettbewerbsfähigen Preisen.",
      keywords: "gebrauchte LKW, LKW zum Verkauf, Italien LKW, Volvo, Mercedes, Scania, Iveco"
    }
  };
  
  const currentSeo = seoContent[language as keyof typeof seoContent] || seoContent.en;

  return (
    <>
      <SEO 
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="container relative z-10">
          <h1 className="text-4xl font-bold font-cairo mb-4">{t.trucks_page.title}</h1>
          <p className="text-xl text-primary-foreground/80">{t.trucks_page.subtitle}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="container -mt-8 relative z-20 mb-12">
        <Card className="shadow-xl border-none">
          <CardContent className="p-6">
            {/* Main Search Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute top-3 text-muted-foreground h-5 w-5 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                <Input 
                  placeholder={t.trucks_page.search} 
                  className={`h-12 text-lg ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              
              {/* Toggle Filters Button (Mobile) */}
              <Button
                variant="outline"
                className="md:hidden h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {t.trucks_page.filters.status}
                {activeFiltersCount > 0 && (
                  <Badge className="bg-primary text-white">{activeFiltersCount}</Badge>
                )}
              </Button>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-4">
                {/* Brand Filter */}
                <div className="w-48">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.brand} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_brands}</SelectItem>
                      {uniqueBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="w-48">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.year} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_years}</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_statuses}</SelectItem>
                      <SelectItem value="available">{t.trucks_page.filters.available_only}</SelectItem>
                      <SelectItem value="sold">{t.trucks_page.filters.sold}</SelectItem>
                      <SelectItem value="reserved">{t.trucks_page.filters.reserved}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Mobile Filters (Collapsible) */}
            {showFilters && (
              <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t.trucks_page.filters.brand}
                  </label>
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.brand} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_brands}</SelectItem>
                      {uniqueBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t.trucks_page.filters.year}
                  </label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.year} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_years}</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t.trucks_page.filters.status}
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t.trucks_page.filters.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.trucks_page.filters.all_statuses}</SelectItem>
                      <SelectItem value="available">{t.trucks_page.filters.available_only}</SelectItem>
                      <SelectItem value="sold">{t.trucks_page.filters.sold}</SelectItem>
                      <SelectItem value="reserved">{t.trucks_page.filters.reserved}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Active Filters Tags */}
            {(activeFiltersCount > 0 || searchTerm) && (
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">{language === 'ar' ? 'الفلاتر النشطة:' : language === 'it' ? 'Filtri attivi:' : language === 'de' ? 'Aktive Filter:' : 'Active filters:'}</span>
                
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                
                {brandFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {brandFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setBrandFilter("all")} />
                  </Badge>
                )}
                
                {yearFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {yearFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setYearFilter("all")} />
                  </Badge>
                )}
                
                {statusFilter !== "all" && statusFilter !== "available" && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {getStatusLabel(statusFilter)}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("available")} />
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive hover:text-destructive">
                  {language === 'ar' ? 'مسح الكل' : language === 'it' ? 'Cancella tutto' : language === 'de' ? 'Alle löschen' : 'Clear all'}
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              {isLoading ? (
                <span>{language === 'ar' ? 'جاري التحميل...' : language === 'it' ? 'Caricamento...' : language === 'de' ? 'Laden...' : 'Loading...'}</span>
              ) : (
                <span>
                  {language === 'ar' 
                    ? `${filteredTrucks.length} شاحنة من أصل ${trucks?.length || 0}`
                    : language === 'it'
                    ? `${filteredTrucks.length} camion su ${trucks?.length || 0}`
                    : language === 'de'
                    ? `${filteredTrucks.length} LKWs von ${trucks?.length || 0}`
                    : `${filteredTrucks.length} of ${trucks?.length || 0} trucks`
                  }
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trucks Grid */}
      <div className="container pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive text-lg">{language === 'ar' ? 'حدث خطأ في تحميل البيانات' : language === 'it' ? 'Errore nel caricamento dei dati' : language === 'de' ? 'Fehler beim Laden der Daten' : 'Error loading data'}</p>
          </div>
        ) : filteredTrucks.length === 0 ? (
          <div className="text-center py-20">
            <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl text-muted-foreground">
              {language === 'ar' ? 'لا توجد شاحنات متاحة حالياً' : language === 'it' ? 'Nessun camion disponibile' : language === 'de' ? 'Keine LKWs verfügbar' : 'No trucks available'}
            </p>
            <p className="text-muted-foreground mt-2">
              {language === 'ar' ? 'جرب تغيير معايير البحث أو الفلترة' : language === 'it' ? 'Prova a modificare i criteri di ricerca' : language === 'de' ? 'Versuchen Sie, die Suchkriterien zu ändern' : 'Try changing the search criteria'}
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                {language === 'ar' ? 'مسح جميع الفلاتر' : language === 'it' ? 'Cancella tutti i filtri' : language === 'de' ? 'Alle Filter löschen' : 'Clear all filters'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrucks.map((truck) => (
              <Card key={truck.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <Link href={`/trucks/${truck.id}`} className="block">
                  <div className="relative h-64 overflow-hidden bg-muted cursor-pointer">
                    {truck.imageUrl ? (
                      <img 
                        src={truck.imageUrl} 
                        alt={`${truck.brand} ${truck.model}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Truck className="h-20 w-20 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getStatusColor(truck.status)} text-white border-none`}>
                        {getStatusLabel(truck.status)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-2xl font-bold text-white">{truck.brand} {truck.model}</h3>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-6 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{truck.year}</span>
                    </div>
                    {truck.mileage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>{truck.mileage}</span>
                      </div>
                    )}
                    {truck.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{truck.location}</span>
                      </div>
                    )}
                    {truck.transmissionType && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="capitalize">{truck.transmissionType}</span>
                      </div>
                    )}
                  </div>
                  {truck.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{truck.description}</p>
                  )}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-muted-foreground">{t.trucks_page.filters.price}</span>
                    <span className="text-xl font-bold text-primary flex items-center">
                      {t.trucks_page.truck_details.call_for_price}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/trucks/${truck.id}`} className="w-full">
                    <Button 
                      className="w-full font-bold h-12 bg-primary hover:bg-primary/90 text-white"
                    >
                      {t.trucks_page.details}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
