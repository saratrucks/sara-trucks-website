import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Wrench, Calendar, Euro, MapPin, Loader2, X, SlidersHorizontal } from "lucide-react";
import { equipment as equipmentData } from "@/data/equipment";
import { Link } from "wouter";

export default function Equipment() {
  const { t, dir, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("available");
  const [showFilters, setShowFilters] = useState(false);

  // Use static data
  const equipment = equipmentData;
  const isLoading = false;
  const error = null;

  // Get unique brands, years, and categories from equipment data
  const { uniqueBrands, uniqueYears, uniqueCategories } = useMemo(() => {
    if (!equipment) return { uniqueBrands: [], uniqueYears: [], uniqueCategories: [] };
    
    const brands = Array.from(new Set(equipment.map((e: any) => e.brand))).sort() as string[];
    const years = Array.from(new Set(equipment.map((e: any) => e.year))).sort((a: any, b: any) => b - a) as number[];
    const categories = Array.from(new Set(equipment.filter((e: any) => e.category).map((e: any) => e.category!))).sort() as string[];
    
    return { uniqueBrands: brands, uniqueYears: years, uniqueCategories: categories };
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    if (!equipment) return [];
    
    return equipment.filter((item: any) => {
      const matchesSearch = searchTerm === "" || 
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = brandFilter === "all" || item.brand === brandFilter;
      const matchesYear = yearFilter === "all" || item.year.toString() === yearFilter;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesBrand && matchesYear && matchesCategory && matchesStatus;
    });
  }, [equipment, searchTerm, brandFilter, yearFilter, categoryFilter, statusFilter]);

  const activeFiltersCount = [brandFilter, yearFilter, categoryFilter, statusFilter].filter(f => f !== "all" && f !== "available").length + (searchTerm ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm("");
    setBrandFilter("all");
    setYearFilter("all");
    setCategoryFilter("all");
    setStatusFilter("available");
  };

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

  const pageTitle: Record<string, string> = {
    ar: "معدات البناء",
    en: "Construction Equipment",
    it: "Attrezzature Edili",
    de: "Baumaschinen"
  };

  const pageSubtitle: Record<string, string> = {
    ar: "تصفح مجموعتنا من معدات البناء المستعملة عالية الجودة",
    en: "Browse our collection of high-quality used construction equipment",
    it: "Sfoglia la nostra collezione di attrezzature edili usate di alta qualità",
    de: "Durchsuchen Sie unsere Sammlung hochwertiger gebrauchter Baumaschinen"
  };

  const seoContent = {
    ar: {
      title: "معدات بناء مستعملة للبيع",
      description: "تصفح مجموعتنا الواسعة من معدات البناء المستعملة عالية الجودة من إيطاليا. حفارات، لوادر، رافعات بأسعار تنافسية.",
      keywords: "معدات بناء مستعملة, معدات للبيع, حفارات, لوادر, رافعات"
    },
    en: {
      title: "Used Construction Equipment for Sale",
      description: "Browse our wide collection of high-quality used construction equipment from Italy. Excavators, loaders, cranes at competitive prices.",
      keywords: "used construction equipment, equipment for sale, excavators, loaders, cranes"
    },
    it: {
      title: "Attrezzature Edili Usate in Vendita",
      description: "Sfoglia la nostra vasta collezione di attrezzature edili usate di alta qualità dall'Italia. Escavatori, pale, gru a prezzi competitivi.",
      keywords: "attrezzature edili usate, attrezzature in vendita, escavatori, pale, gru"
    },
    de: {
      title: "Gebrauchte Baumaschinen zum Verkauf",
      description: "Stöbern Sie in unserer großen Auswahl an hochwertigen gebrauchten Baumaschinen aus Italien. Bagger, Lader, Kräne zu wettbewerbsfähigen Preisen.",
      keywords: "gebrauchte Baumaschinen, Baumaschinen zum Verkauf, Bagger, Lader, Kräne"
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
            <h1 className="text-4xl font-bold font-cairo mb-4">{pageTitle[language] || pageTitle.en}</h1>
            <p className="text-xl text-primary-foreground/80">{pageSubtitle[language] || pageSubtitle.en}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="container -mt-8 relative z-20 mb-12">
          <Card className="shadow-xl border-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute top-3 text-muted-foreground h-5 w-5 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                  <Input 
                    placeholder={language === 'ar' ? 'ابحث عن معدة...' : language === 'it' ? 'Cerca attrezzatura...' : language === 'de' ? 'Baumaschine suchen...' : 'Search equipment...'}
                    className={`h-12 text-lg ${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  className="md:hidden h-12 gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {language === 'ar' ? 'الفلاتر' : 'Filters'}
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-primary text-white">{activeFiltersCount}</Badge>
                  )}
                </Button>

                <div className="hidden md:flex gap-4">
                  <div className="w-40">
                    <Select value={brandFilter} onValueChange={setBrandFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={language === 'ar' ? 'العلامة التجارية' : 'Brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'جميع العلامات' : 'All Brands'}</SelectItem>
                        {uniqueBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={language === 'ar' ? 'السنة' : 'Year'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'جميع السنوات' : 'All Years'}</SelectItem>
                        {uniqueYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-40">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={language === 'ar' ? 'الفئة' : 'Category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                        {uniqueCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-36">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All'}</SelectItem>
                        <SelectItem value="available">{getStatusLabel('available')}</SelectItem>
                        <SelectItem value="sold">{getStatusLabel('sold')}</SelectItem>
                        <SelectItem value="reserved">{getStatusLabel('reserved')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {showFilters && (
                <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'ar' ? 'العلامة التجارية' : 'Brand'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع العلامات' : 'All Brands'}</SelectItem>
                      {uniqueBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'ar' ? 'السنة' : 'Year'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع السنوات' : 'All Years'}</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'ar' ? 'الفئة' : 'Category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All'}</SelectItem>
                      <SelectItem value="available">{getStatusLabel('available')}</SelectItem>
                      <SelectItem value="sold">{getStatusLabel('sold')}</SelectItem>
                      <SelectItem value="reserved">{getStatusLabel('reserved')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الفلاتر النشطة:' : 'Active filters:'}
                  </span>
                  
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

                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 px-3 py-1">
                      {categoryFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                    </Badge>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive hover:text-destructive">
                    {language === 'ar' ? 'مسح الكل' : 'Clear all'}
                  </Button>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground">
                {isLoading ? (
                  <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                ) : (
                  <span>
                    {language === 'ar' 
                      ? `${filteredEquipment.length} معدة من أصل ${equipment?.length || 0}`
                      : `${filteredEquipment.length} of ${equipment?.length || 0} equipment`
                    }
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Grid */}
        <div className="container pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">{language === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-20">
              <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-xl text-muted-foreground">
                {language === 'ar' ? 'لا توجد معدات متاحة حالياً' : 'No equipment available'}
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                  {language === 'ar' ? 'مسح جميع الفلاتر' : 'Clear all filters'}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEquipment.map((item: any) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                  <Link href={`/equipment/${item.id}`} className="block">
                    <div className="relative h-64 overflow-hidden bg-muted cursor-pointer">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={`${item.brand} ${item.model}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Wrench className="h-20 w-20 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getStatusColor(item.status)} text-white border-none`}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-2xl font-bold text-white">{item.brand} {item.model}</h3>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-6 space-y-4 flex-grow">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{item.year}</span>
                      </div>
                      {item.category && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Wrench className="h-4 w-4 text-primary" />
                          <span>{item.category}</span>
                        </div>
                      )}
                      {item.operatingHours && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-xs">{language === 'ar' ? 'ساعات العمل:' : 'Hours:'}</span>
                          <span>{item.operatingHours}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-muted-foreground">{language === 'ar' ? 'السعر' : 'Price'}</span>
                      <span className="text-xl font-bold text-primary flex items-center">
                        {t.trucks_page.truck_details.call_for_price}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Link href={`/equipment/${item.id}`} className="w-full">
                      <Button className="w-full font-bold h-12 bg-primary hover:bg-primary/90 text-white">
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
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
