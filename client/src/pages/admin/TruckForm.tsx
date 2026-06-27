import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { trpc } from "@/lib/trpc";
import { Truck, LayoutDashboard, LogOut, Home, ArrowRight, Save, Sparkles, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TruckForm() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const isEditing = params.id && params.id !== "new";
  const { t, language, dir } = useLanguage();
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    location: "",
    status: "available" as "available" | "sold" | "reserved",
    description: "",
    imageUrl: "",
    engineType: "",
    transmission: "",
    transmissionType: undefined as "manual" | "automatic" | "semi-automatic" | undefined,
    horsepower: 0,
    featured: false,
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const generateDescriptionMutation = trpc.ai.generateDescription.useMutation();

  // For multiple images
  const [truckImages, setTruckImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState<string[]>([]);


  // Fetch existing images for editing
  const { data: existingImages } = trpc.truckImages.getByTruckId.useQuery(
    { truckId: Number(params.id) },
    { enabled: !!isEditing }
  );

  // Add image mutation for new trucks
  const addImageMutation = trpc.truckImages.add.useMutation();

  const { data: truck, isLoading: truckLoading } = trpc.trucks.getById.useQuery(
    { id: Number(params.id) },
    { enabled: !!isEditing }
  );

  const createMutation = trpc.trucks.create.useMutation({
    onSuccess: async (newTruck) => {
      // Save pending images for the new truck
      if (pendingImages.length > 0 && newTruck) {
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            truckId: newTruck.id,
            imageUrl: pendingImages[i],
            isPrimary: i === 0,
            sortOrder: i,
          });
        }
      }
      toast.success(t.admin.forms.success_add);
      setLocation("/admin/trucks");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  const updateMutation = trpc.trucks.update.useMutation({
    onSuccess: async () => {
      // Save pending images for the existing truck
      if (pendingImages.length > 0 && params.id) {
        const truckId = Number(params.id);
        const startOrder = truckImages.length;
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            truckId,
            imageUrl: pendingImages[i],
            isPrimary: false,
            sortOrder: startOrder + i,
          });
        }
      }
      toast.success(t.admin.forms.success_update);
      setLocation("/admin/trucks");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  useEffect(() => {
    if (truck) {
      setFormData({
        brand: truck.brand,
        model: truck.model,
        year: truck.year,
        mileage: truck.mileage || "",
        location: truck.location || "",
        status: truck.status,
        description: truck.description || "",
        imageUrl: truck.imageUrl || "",
        engineType: truck.engineType || "",
        transmission: truck.transmission || "",
        transmissionType: truck.transmissionType || undefined,
        horsepower: truck.horsepower || 0,
        featured: truck.featured || false,
      });
    }
  }, [truck]);

  useEffect(() => {
    if (existingImages) {
      setTruckImages(existingImages);
    }
  }, [existingImages]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model) {
      toast.error(t.admin.forms.error);
      return;
    }

    const data = {
      ...formData,
      transmissionType: formData.transmissionType || undefined,
      horsepower: formData.horsepower || undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ id: Number(params.id), ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (loading || truckLoading) {
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

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">{t.admin.unauthorized}</h2>
            <p className="text-muted-foreground mb-6">
              {t.admin.unauthorized_desc}
            </p>
            <Link href="/">
              <Button>{t.admin.back_home}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
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
            <Button variant="default" className="bg-primary">
              <Truck className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.admin.trucks_management}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/trucks">
              <Button variant="ghost" size="icon">
                <ArrowRight className={`h-5 w-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {isEditing ? t.admin.forms.edit_truck : t.admin.forms.add_truck}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? t.admin.forms.edit_truck : t.admin.forms.enter_data}
              </p>
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
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.admin.forms.select_brand} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Volvo">Volvo</SelectItem>
                        <SelectItem value="Scania">Scania</SelectItem>
                        <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                        <SelectItem value="MAN">MAN</SelectItem>
                        <SelectItem value="DAF">DAF</SelectItem>
                        <SelectItem value="Iveco">Iveco</SelectItem>
                        <SelectItem value="Renault">Renault</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">{t.admin.forms.model} *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="FH16 750"
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
                    <Label htmlFor="mileage">{t.admin.forms.mileage}</Label>
                    <Input
                      id="mileage"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      placeholder="450,000 km"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t.admin.forms.location}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Milano, Italy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t.admin.forms.status}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "available" | "sold" | "reserved") =>
                        setFormData({ ...formData, status: value })
                      }
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

              {/* Technical Specs */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.admin.forms.technical_specs}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="engineType">{t.admin.forms.engine_type}</Label>
                    <Input
                      id="engineType"
                      value={formData.engineType}
                      onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                      placeholder="D16K 750hp Euro 6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horsepower">{t.admin.forms.horsepower}</Label>
                    <Input
                      id="horsepower"
                      type="number"
                      value={formData.horsepower || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, horsepower: parseInt(e.target.value) || 0 })
                      }
                      placeholder="750"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmission">{t.admin.forms.transmission}</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.admin.forms.select_transmission} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmissionType">Transmission Type</Label>
                    <Select
                      value={formData.transmissionType || ""}
                      onValueChange={(value: "manual" | "automatic" | "semi-automatic") => setFormData({ ...formData, transmissionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </CardContent>
              </Card>

              {/* Media & Description */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.admin.forms.description} & {t.admin.forms.images}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {/* Primary Image (Legacy) */}
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label={t.admin.forms.images}
                  />

                  {/* Multiple Images Gallery */}
                  <MultiImageUpload
                    truckId={isEditing ? Number(params.id) : undefined}
                    images={truckImages}
                    onImagesChange={setTruckImages}
                    pendingImages={pendingImages}
                    onPendingImagesChange={(urlsOrFn) => {
                      if (typeof urlsOrFn === 'function') {
                        setPendingImages(urlsOrFn);
                      } else {
                        setPendingImages(urlsOrFn);
                      }
                    }}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">{t.admin.forms.description}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setIsGeneratingDescription(true);
                          try {
                            const result = await generateDescriptionMutation.mutateAsync({
                              type: "truck",
                              data: {
                                brand: formData.brand,
                                model: formData.model,
                                year: formData.year,
                                mileage: formData.mileage,
                                location: formData.location,
                                engineType: formData.engineType,
                                transmission: formData.transmission,
                                horsepower: formData.horsepower,
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
                            {t.admin.forms.generating || "Generating..."}
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            {t.admin.forms.generate_ai || "Generate with AI"}
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured">{t.admin.forms.featured}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t.admin.forms.featured_desc}
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link href="/admin/trucks">
                  <Button variant="outline" type="button">
                    {t.admin.forms.cancel}
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {createMutation.isPending || updateMutation.isPending
                    ? t.admin.forms.saving
                    : isEditing
                    ? t.admin.forms.save
                    : t.admin.forms.add_truck}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
