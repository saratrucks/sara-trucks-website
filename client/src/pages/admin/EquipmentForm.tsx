import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { EquipmentMultiImageUpload } from "@/components/EquipmentMultiImageUpload";
import { trpc } from "@/lib/trpc";
import { Wrench, LayoutDashboard, LogOut, Home, ArrowRight, Save, Truck, Container, Sparkles, Loader2 } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EquipmentForm() {
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
    category: "",
    operatingHours: "",
    status: "available" as "available" | "sold" | "reserved",
    description: "",
    imageUrl: "",
    location: "",
  });

  // For multiple images
  const [equipmentImages, setEquipmentImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const generateDescriptionMutation = trpc.ai.generateDescription.useMutation();

  // Fetch existing images for editing
  const { data: existingImages } = trpc.equipmentImages.getByEquipmentId.useQuery(
    { equipmentId: Number(params.id) },
    { enabled: !!isEditing }
  );

  const { data: equipment, isLoading: equipmentLoading } = trpc.equipment.getById.useQuery(
    { id: Number(params.id) },
    { enabled: !!isEditing }
  );

  // Add image mutation for new equipment
  const addImageMutation = trpc.equipmentImages.add.useMutation();

  const createMutation = trpc.equipment.create.useMutation({
    onSuccess: async (newEquipment) => {
      // Save pending images for the new equipment
      if (pendingImages.length > 0 && newEquipment) {
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            equipmentId: newEquipment.id,
            imageUrl: pendingImages[i],
            isPrimary: i === 0,
            sortOrder: i,
          });
        }
      }
      toast.success(t.admin.forms.success_add);
      setLocation("/admin/equipment");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  const updateMutation = trpc.equipment.update.useMutation({
    onSuccess: async () => {
      // Save pending images for the existing equipment
      if (pendingImages.length > 0 && params.id) {
        const equipmentId = Number(params.id);
        const startOrder = equipmentImages.length;
        for (let i = 0; i < pendingImages.length; i++) {
          await addImageMutation.mutateAsync({
            equipmentId,
            imageUrl: pendingImages[i],
            isPrimary: false,
            sortOrder: startOrder + i,
          });
        }
      }
      toast.success(t.admin.forms.success_update);
      setLocation("/admin/equipment");
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        brand: equipment.brand,
        model: equipment.model,
        year: equipment.year,
        price: equipment.price,
        category: equipment.category || "",
        operatingHours: equipment.operatingHours || "",
        status: equipment.status,
        description: equipment.description || "",
        imageUrl: equipment.imageUrl || "",
        location: equipment.location || "",
      });
    }
  }, [equipment]);

  useEffect(() => {
    if (existingImages) {
      setEquipmentImages(existingImages);
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

  if (loading || equipmentLoading) {
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
            <Button variant="ghost">
              <Container className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.nav.trailers}
            </Button>
          </Link>
          <Link href="/admin/equipment">
            <Button variant="default" className="bg-primary">
              <Wrench className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.nav.equipment}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/equipment">
              <Button variant="ghost" size="icon">
                <ArrowRight className={`h-5 w-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {isEditing ? t.admin.forms.edit_equipment : t.admin.forms.add_equipment}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? t.admin.forms.edit_equipment : t.admin.forms.enter_data}
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
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Caterpillar, Komatsu, Volvo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">{t.admin.forms.model} *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="320D"
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
                      placeholder="45000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t.admin.forms.type}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.admin.forms.select_type} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excavator">Excavator</SelectItem>
                        <SelectItem value="loader">Loader</SelectItem>
                        <SelectItem value="bulldozer">Bulldozer</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="roller">Roller</SelectItem>
                        <SelectItem value="grader">Grader</SelectItem>
                        <SelectItem value="forklift">Forklift</SelectItem>
                        <SelectItem value="concrete">Concrete Mixer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operatingHours">{t.admin.forms.hours}</Label>
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      placeholder="5000"
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
                            type: "equipment",
                            data: {
                              brand: formData.brand,
                              model: formData.model,
                              year: formData.year,
                              equipmentType: formData.category,
                              operatingHours: formData.operatingHours,
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
                  <EquipmentMultiImageUpload
                    equipmentId={isEditing ? Number(params.id) : undefined}
                    images={equipmentImages}
                    onImagesChange={setEquipmentImages}
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
                <Link href="/admin/equipment">
                  <Button variant="outline">{t.admin.forms.cancel}</Button>
                </Link>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {createMutation.isPending || updateMutation.isPending
                    ? t.admin.forms.saving
                    : isEditing
                    ? t.admin.forms.save
                    : t.admin.forms.add_equipment}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
