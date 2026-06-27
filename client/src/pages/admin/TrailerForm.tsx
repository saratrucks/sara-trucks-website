import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { TrailerMultiImageUpload } from "@/components/TrailerMultiImageUpload";
import { trpc } from "@/lib/trpc";
import { Container, LayoutDashboard, LogOut, Home, ArrowRight, Save, Truck, Sparkles, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrailerForm() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const isEditing = params.id && params.id !== "new";
  const { t, language, dir } = useLanguage();
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    type: "",
    axles: 0,
    length: "",
    capacity: "",
    status: "available" as "available" | "sold" | "reserved",
    description: "",
    imageUrl: "",
    location: "",
    // Flatbed specific fields
    suspensionType: "",
    hasAluminumSides: false,
    // Refrigerated specific fields
    coolingBrand: "",
  });

  // For multiple images
  const [trailerImages, setTrailerImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const generateDescriptionMutation = trpc.ai.generateDescription.useMutation();

  // Fetch existing images for editing
  const { data: existingImages } = trpc.trailerImages.getByTrailerId.useQuery(
    { trailerId: Number(params.id) },
    { enabled: !!isEditing }
  );

  const { data: trailer, isLoading: trailerLoading } = trpc.trailers.getById.useQuery(
    { id: Number(params.id) },
    { enabled: !!isEditing }
  );

  // Add image mutation for new trailers
  const addImageMutation = trpc.trailerImages.add.useMutation();

  const createMutation = trpc.trailers.create.useMutation({
    onSuccess: async (newTrailer) => {
      // Save pending images for the new trailer
      if (pendingImages.length > 0 && newTrailer) {
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            trailerId: newTrailer.id,
            imageUrl: pendingImages[i],
            isPrimary: i === 0,
            sortOrder: i,
          });
        }
      }
      toast.success(t.admin.forms.success_add);
      setLocation("/admin/trailers");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  const updateMutation = trpc.trailers.update.useMutation({
    onSuccess: async () => {
      // Save pending images for the existing trailer
      if (pendingImages.length > 0 && params.id) {
        const trailerId = Number(params.id);
        const startOrder = trailerImages.length;
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            trailerId,
            imageUrl: pendingImages[i],
            isPrimary: false,
            sortOrder: startOrder + i,
          });
        }
      }
      toast.success(t.admin.forms.success_update);
      setLocation("/admin/trailers");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  useEffect(() => {
    if (trailer) {
      setFormData({
        brand: trailer.brand,
        model: trailer.model,
        year: trailer.year,
        price: trailer.price,
        type: trailer.type || "",
        axles: trailer.axles || 0,
        length: trailer.length || "",
        capacity: trailer.capacity || "",
        status: trailer.status,
        description: trailer.description || "",
        imageUrl: trailer.imageUrl || "",
        location: trailer.location || "",
        // Flatbed specific fields
        suspensionType: trailer.suspensionType || "",
        hasAluminumSides: trailer.hasAluminumSides || false,
        // Refrigerated specific fields
        coolingBrand: trailer.coolingBrand || "",
      });
    }
  }, [trailer]);

  useEffect(() => {
    if (existingImages) {
      setTrailerImages(existingImages);
    }
  }, [existingImages]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model || !formData.price) {
      toast.error(t.admin.forms.error);
      return;
    }

    if (isEditing) {
      updateMutation.mutate({ id: Number(params.id), ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (loading || trailerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.admin.login_required}</h2>
            <p className="text-muted-foreground mb-6">
              {t.admin.login_required_desc}
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              {t.admin.login}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
      <SEO 
        title={isEditing ? t.admin.forms.edit_trailer : t.admin.forms.add_trailer}
        description={isEditing ? t.admin.forms.edit_trailer : t.admin.forms.add_trailer}
        keywords="trailers, semiremorchi, admin"
      />
      {/* Admin Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{t.admin.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user?.name}</span>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container flex gap-1 py-2">
          <Link href="/admin">
            <Button variant="ghost">
              <LayoutDashboard className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.admin.dashboard}
            </Button>
          </Link>
          <Link href="/admin/trucks">
            <Button variant="ghost">
              <Truck className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.nav.trucks}
            </Button>
          </Link>
          <Link href="/admin/trailers">
            <Button variant="default" className="bg-primary">
              <Container className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.nav.trailers}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/trailers">
              <Button variant="ghost" size="icon">
                <ArrowRight className={`h-5 w-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {isEditing ? t.admin.forms.edit_trailer : t.admin.forms.add_trailer}
              </h1>
              <h2 className="text-muted-foreground">
                {isEditing ? t.admin.forms.edit_trailer : t.admin.forms.enter_data}
              </h2>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.admin.forms.basic_info}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand">{t.admin.forms.brand} *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Schmitz, Krone, Kögel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">{t.admin.forms.model} *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="S.CS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">{t.admin.forms.year} *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1980"
                      max="2030"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t.admin.forms.price} (€) *</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">{t.admin.forms.type}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value, suspensionType: "", hasAluminumSides: false, coolingBrand: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.admin.forms.select_type} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curtainsider">Curtainsider</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="flatbed">Flatbed</SelectItem>
                        <SelectItem value="tipper">Tipper</SelectItem>
                        <SelectItem value="tank">Tank</SelectItem>
                        <SelectItem value="container">Container</SelectItem>
                        <SelectItem value="lowbed">Lowbed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Flatbed specific fields */}
                  {formData.type === "flatbed" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="suspensionType">{t.admin.forms.suspension_type}</Label>
                        <Select
                          value={formData.suspensionType}
                          onValueChange={(value) => setFormData({ ...formData, suspensionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t.admin.forms.select_type} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="air">{t.admin.forms.air}</SelectItem>
                            <SelectItem value="leaf">{t.admin.forms.leaf}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hasAluminumSides">{t.admin.forms.aluminum_sides}</Label>
                        <Select
                          value={formData.hasAluminumSides ? "yes" : "no"}
                          onValueChange={(value) => setFormData({ ...formData, hasAluminumSides: value === "yes" })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">{t.admin.forms.yes}</SelectItem>
                            <SelectItem value="no">{t.admin.forms.no}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Refrigerated specific fields */}
                  {formData.type === "refrigerated" && (
                    <div className="space-y-2">
                      <Label htmlFor="coolingBrand">{t.admin.forms.cooling_brand}</Label>
                      <Select
                        value={formData.coolingBrand}
                        onValueChange={(value) => setFormData({ ...formData, coolingBrand: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.admin.forms.select_brand} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Thermoking">Thermoking</SelectItem>
                          <SelectItem value="Carrier">Carrier</SelectItem>
                          <SelectItem value="other">{t.admin.forms.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="axles">{t.admin.forms.axles}</Label>
                    <Input
                      id="axles"
                      type="number"
                      value={formData.axles}
                      onChange={(e) => setFormData({ ...formData, axles: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">{t.admin.forms.length}</Label>
                    <Input
                      id="length"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      placeholder="13.6m"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">{t.admin.forms.capacity}</Label>
                    <Input
                      id="capacity"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="33 ton"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t.admin.forms.location}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Italy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">{t.admin.forms.status}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "available" | "sold" | "reserved") => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">{t.admin.forms.available}</SelectItem>
                        <SelectItem value="sold">{t.admin.forms.sold}</SelectItem>
                        <SelectItem value="reserved">{t.admin.forms.reserved}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t.admin.forms.description}</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        setIsGeneratingDescription(true);
                        try {
                          const result = await generateDescriptionMutation.mutateAsync({
                            type: "trailer",
                            data: {
                              brand: formData.brand,
                              model: formData.model,
                              year: formData.year,
                              trailerType: formData.type,
                              length: formData.length,
                              capacity: formData.capacity,
                              axles: formData.axles,
                              location: formData.location,
                            },
                            language,
                          });
                          setFormData({ ...formData, description: result.description });
                          toast.success("Description generated successfully");
                        } catch (error) {
                          toast.error("Error generating description");
                        } finally {
                          setIsGeneratingDescription(false);
                        }
                      }}
                      disabled={isGeneratingDescription}
                      className="gap-2"
                    >
                      {isGeneratingDescription ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                  />
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.admin.forms.images}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Image */}
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label={t.admin.forms.images}
                  />

                  {/* Multiple Images Gallery */}
                  <TrailerMultiImageUpload
                    trailerId={isEditing ? Number(params.id) : undefined}
                    images={trailerImages}
                    onImagesChange={setTrailerImages}
                    pendingImages={pendingImages}
                    onPendingImagesChange={(urlsOrFn) => {
                      if (typeof urlsOrFn === 'function') {
                        setPendingImages(urlsOrFn);
                      } else {
                        setPendingImages(urlsOrFn);
                      }
                    }}
                  />

                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Link href="/admin/trailers">
                  <Button variant="outline">{t.admin.forms.cancel}</Button>
                </Link>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {createMutation.isPending || updateMutation.isPending
                    ? t.admin.forms.saving
                    : isEditing
                    ? t.admin.forms.save
                    : t.admin.forms.add_trailer}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
