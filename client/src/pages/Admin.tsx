import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Container, Wrench, LogOut, Plus, Pencil, Trash2, Save, Upload, Loader2, Eye } from "lucide-react";
import { trucks as initialTrucks, type Truck as TruckType } from "@/data/trucks";
import { trailers as initialTrailers, type Trailer } from "@/data/trailers";
import { equipment as initialEquipment, type Equipment } from "@/data/equipment";

const ADMIN_PASSWORD = "sara2024";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";
const GITHUB_REPO = "saratrucks/sara-trucks-website";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "";

type Tab = "trucks" | "trailers" | "equipment";

// Helper to generate TypeScript file content
function generateTrucksFile(trucks: TruckType[]): string {
  let content = `export interface Truck {\n  id: number;\n  brand: string;\n  model: string;\n  year: number;\n  mileage?: string;\n  location?: string;\n  status: "available" | "sold" | "reserved";\n  description?: string;\n  imageUrl?: string;\n  engineType?: string;\n  transmission?: string;\n  transmissionType?: "manual" | "automatic" | "semi-automatic";\n  horsepower?: number;\n  featured?: boolean;\n}\n\nexport interface TruckImage {\n  id: number;\n  truckId: number;\n  imageUrl: string;\n  isPrimary: boolean;\n  sortOrder: number;\n}\n\nexport const trucks: Truck[] = [\n`;
  trucks.forEach((t, i) => {
    content += `  {\n`;
    content += `    id: ${t.id},\n`;
    content += `    brand: "${t.brand}",\n`;
    content += `    model: "${t.model}",\n`;
    content += `    year: ${t.year},\n`;
    if (t.mileage) content += `    mileage: "${t.mileage}",\n`;
    if (t.location) content += `    location: "${t.location}",\n`;
    content += `    status: "${t.status}",\n`;
    if (t.description) content += `    description: "${t.description.replace(/"/g, '\\"')}",\n`;
    if (t.imageUrl) content += `    imageUrl: "${t.imageUrl}",\n`;
    if (t.engineType) content += `    engineType: "${t.engineType}",\n`;
    if (t.transmission) content += `    transmission: "${t.transmission}",\n`;
    if (t.transmissionType) content += `    transmissionType: "${t.transmissionType}",\n`;
    if (t.horsepower) content += `    horsepower: ${t.horsepower},\n`;
    if (t.featured) content += `    featured: ${t.featured},\n`;
    content += `  }${i < trucks.length - 1 ? "," : ""}\n`;
  });
  content += `];\n\nexport const truckImages: TruckImage[] = [];\n`;
  return content;
}

function generateTrailersFile(trailers: Trailer[]): string {
  let content = `export interface Trailer {\n  id: number;\n  brand: string;\n  model: string;\n  type: string;\n  year: number;\n  price?: string;\n  axles?: number;\n  length?: string;\n  capacity?: string;\n  status: "available" | "sold" | "reserved";\n  location?: string;\n  description?: string;\n  imageUrl?: string;\n}\n\nexport interface TrailerImage {\n  id: number;\n  trailerId: number;\n  imageUrl: string;\n  isPrimary: boolean;\n  sortOrder: number;\n}\n\nexport const trailers: Trailer[] = [\n`;
  trailers.forEach((t, i) => {
    content += `  {\n`;
    content += `    id: ${t.id},\n`;
    content += `    brand: "${t.brand}",\n`;
    content += `    model: "${t.model}",\n`;
    content += `    type: "${t.type}",\n`;
    content += `    year: ${t.year},\n`;
    if (t.price) content += `    price: "${t.price}",\n`;
    if (t.axles) content += `    axles: ${t.axles},\n`;
    if (t.length) content += `    length: "${t.length}",\n`;
    if (t.capacity) content += `    capacity: "${t.capacity}",\n`;
    content += `    status: "${t.status}",\n`;
    if (t.location) content += `    location: "${t.location}",\n`;
    if (t.description) content += `    description: "${t.description.replace(/"/g, '\\"')}",\n`;
    if (t.imageUrl) content += `    imageUrl: "${t.imageUrl}",\n`;
    content += `  }${i < trailers.length - 1 ? "," : ""}\n`;
  });
  content += `];\n\nexport const trailerImages: TrailerImage[] = [];\n`;
  return content;
}

function generateEquipmentFile(equipment: Equipment[]): string {
  let content = `export interface Equipment {\n  id: number;\n  brand: string;\n  model: string;\n  category: string;\n  year: number;\n  price?: string;\n  operatingHours?: string;\n  weight?: string;\n  enginePower?: string;\n  status: "available" | "sold" | "reserved";\n  location?: string;\n  description?: string;\n  imageUrl?: string;\n}\n\nexport interface EquipmentImage {\n  id: number;\n  equipmentId: number;\n  imageUrl: string;\n  isPrimary: boolean;\n  sortOrder: number;\n}\n\nexport const equipment: Equipment[] = [\n`;
  equipment.forEach((e, i) => {
    content += `  {\n`;
    content += `    id: ${e.id},\n`;
    content += `    brand: "${e.brand}",\n`;
    content += `    model: "${e.model}",\n`;
    content += `    category: "${e.category}",\n`;
    content += `    year: ${e.year},\n`;
    if (e.price) content += `    price: "${e.price}",\n`;
    if (e.operatingHours) content += `    operatingHours: "${e.operatingHours}",\n`;
    if (e.weight) content += `    weight: "${e.weight}",\n`;
    if (e.enginePower) content += `    enginePower: "${e.enginePower}",\n`;
    content += `    status: "${e.status}",\n`;
    if (e.location) content += `    location: "${e.location}",\n`;
    if (e.description) content += `    description: "${e.description.replace(/"/g, '\\"')}",\n`;
    if (e.imageUrl) content += `    imageUrl: "${e.imageUrl}",\n`;
    content += `  }${i < equipment.length - 1 ? "," : ""}\n`;
  });
  content += `];\n\nexport const equipmentImages: EquipmentImage[] = [];\n`;
  return content;
}

// GitHub API helper
async function saveToGitHub(filePath: string, content: string, message: string) {
  const token = sessionStorage.getItem("github-token") || GITHUB_TOKEN;
  if (!token) throw new Error("GitHub Token غير متوفر. أدخله في صفحة تسجيل الدخول.");
  // Get current file SHA
  const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" }
  });
  const getData = await getRes.json();
  const sha = getData.sha;

  // Update file
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      sha
    })
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

// Image upload to ImgBB (free, no API key needed for anonymous)
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  // Use free imgbb upload (anonymous, no key needed for basic usage)
  const res = await fetch("https://api.imgbb.com/1/upload?key=7a1d2b3c4e5f6a7b8c9d0e1f2a3b4c5d", {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    // Fallback: convert to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
  const data = await res.json();
  return data.data.url;
}

// Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      if (token) sessionStorage.setItem("github-token", token);
      localStorage.setItem("admin-auth", "true");
      onLogin();
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sara Trucks Admin</CardTitle>
          <p className="text-muted-foreground">أدخل كلمة المرور للدخول</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {!GITHUB_TOKEN && (
            <div>
              <label className="text-xs text-muted-foreground">GitHub Token (للحفظ)</label>
              <Input
                type="password"
                placeholder="github_pat_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button className="w-full" onClick={handleLogin}>دخول</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Truck Form
function TruckForm({ truck, onSave, onCancel }: { truck?: TruckType; onSave: (t: TruckType) => void; onCancel: () => void }) {
  const [form, setForm] = useState<TruckType>(truck || {
    id: Date.now(), brand: "", model: "", year: 2024, status: "available",
    mileage: "", location: "", description: "", imageUrl: "", engineType: "",
    transmission: "", transmissionType: "automatic", horsepower: 0
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, imageUrl: url });
    } catch (err) {
      alert("خطأ في رفع الصورة");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-bold">{truck ? "تعديل شاحنة" : "إضافة شاحنة جديدة"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">الماركة *</label>
          <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="مثال: Volvo" />
        </div>
        <div>
          <label className="text-sm font-medium">الموديل *</label>
          <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="مثال: FH 500" />
        </div>
        <div>
          <label className="text-sm font-medium">السنة *</label>
          <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} />
        </div>
        <div>
          <label className="text-sm font-medium">المسافة</label>
          <Input value={form.mileage || ""} onChange={(e) => setForm({ ...form, mileage: e.target.value })} placeholder="مثال: 420,000 km" />
        </div>
        <div>
          <label className="text-sm font-medium">الموقع</label>
          <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="مثال: Catania, Italy" />
        </div>
        <div>
          <label className="text-sm font-medium">الحالة</label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TruckType["status"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">متاح</SelectItem>
              <SelectItem value="sold">مباع</SelectItem>
              <SelectItem value="reserved">محجوز</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">نوع المحرك</label>
          <Input value={form.engineType || ""} onChange={(e) => setForm({ ...form, engineType: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">ناقل الحركة</label>
          <Input value={form.transmission || ""} onChange={(e) => setForm({ ...form, transmission: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">نوع ناقل الحركة</label>
          <Select value={form.transmissionType || "automatic"} onValueChange={(v) => setForm({ ...form, transmissionType: v as TruckType["transmissionType"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">أوتوماتيك</SelectItem>
              <SelectItem value="manual">يدوي</SelectItem>
              <SelectItem value="semi-automatic">نصف أوتوماتيك</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">القوة (حصان)</label>
          <Input type="number" value={form.horsepower || ""} onChange={(e) => setForm({ ...form, horsepower: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">الوصف</label>
        <textarea className="w-full border rounded-md p-2 min-h-[80px]" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">الصورة</label>
        <div className="flex gap-2 items-center">
          <Input value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="رابط الصورة أو ارفع صورة" className="flex-1" />
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button variant="outline" size="sm" disabled={uploading} asChild>
              <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
            </Button>
          </label>
        </div>
        {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-32 object-cover rounded" />}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(form)} disabled={!form.brand || !form.model}>
          <Save className="h-4 w-4 mr-2" /> حفظ
        </Button>
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
      </div>
    </div>
  );
}

// Main Admin Panel
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("trucks");
  const [trucks, setTrucks] = useState<TruckType[]>(initialTrucks);
  const [trailersList, setTrailersList] = useState<Trailer[]>(initialTrailers);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(initialEquipment);
  const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setIsAuthenticated(false);
  };

  const saveTrucks = async (updatedTrucks: TruckType[]) => {
    setSaving(true);
    setSaveStatus("جاري الحفظ...");
    try {
      const content = generateTrucksFile(updatedTrucks);
      await saveToGitHub("client/src/data/trucks.ts", content, "Update trucks data from admin panel");
      setTrucks(updatedTrucks);
      setSaveStatus("✅ تم الحفظ! سيظهر التحديث خلال ~60 ثانية");
      setShowTruckForm(false);
      setEditingTruck(null);
    } catch (err: any) {
      setSaveStatus(`❌ خطأ: ${err.message}`);
    }
    setSaving(false);
    setTimeout(() => setSaveStatus(""), 5000);
  };

  const handleSaveTruck = (truck: TruckType) => {
    const existing = trucks.find(t => t.id === truck.id);
    if (existing) {
      saveTrucks(trucks.map(t => t.id === truck.id ? truck : t));
    } else {
      saveTrucks([...trucks, truck]);
    }
  };

  const handleDeleteTruck = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الشاحنة؟")) {
      saveTrucks(trucks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Sara Trucks - لوحة التحكم</h1>
          <div className="flex items-center gap-4">
            {saveStatus && <span className="text-sm bg-white/10 px-3 py-1 rounded">{saveStatus}</span>}
            <a href="/" target="_blank" className="text-sm hover:text-primary flex items-center gap-1">
              <Eye className="h-4 w-4" /> عرض الموقع
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-red-300">
              <LogOut className="h-4 w-4 mr-1" /> خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === "trucks" ? "default" : "outline"} onClick={() => setActiveTab("trucks")}>
            <Truck className="h-4 w-4 mr-2" /> شاحنات ({trucks.length})
          </Button>
          <Button variant={activeTab === "trailers" ? "default" : "outline"} onClick={() => setActiveTab("trailers")}>
            <Container className="h-4 w-4 mr-2" /> مقطورات ({trailersList.length})
          </Button>
          <Button variant={activeTab === "equipment" ? "default" : "outline"} onClick={() => setActiveTab("equipment")}>
            <Wrench className="h-4 w-4 mr-2" /> معدات ({equipmentList.length})
          </Button>
        </div>

        {/* Trucks Tab */}
        {activeTab === "trucks" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الشاحنات</h2>
              <Button onClick={() => { setEditingTruck(null); setShowTruckForm(true); }}>
                <Plus className="h-4 w-4 mr-2" /> إضافة شاحنة
              </Button>
            </div>

            {showTruckForm && (
              <TruckForm
                truck={editingTruck || undefined}
                onSave={handleSaveTruck}
                onCancel={() => { setShowTruckForm(false); setEditingTruck(null); }}
              />
            )}

            <div className="grid gap-3">
              {trucks.map(truck => (
                <Card key={truck.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    {truck.imageUrl && (
                      <img src={truck.imageUrl} alt={truck.model} className="w-20 h-14 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold">{truck.brand} {truck.model}</h3>
                      <p className="text-sm text-muted-foreground">{truck.year} • {truck.mileage} • {truck.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      truck.status === "available" ? "bg-green-100 text-green-800" :
                      truck.status === "sold" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {truck.status === "available" ? "متاح" : truck.status === "sold" ? "مباع" : "محجوز"}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingTruck(truck); setShowTruckForm(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTruck(truck.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trailers Tab - Simplified */}
        {activeTab === "trailers" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المقطورات</h2>
              <p className="text-sm text-muted-foreground">لتعديل المقطورات، استخدم زر "Edit Data" في صفحة المقطورات</p>
            </div>
            <div className="grid gap-3">
              {trailersList.map(trailer => (
                <Card key={trailer.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {trailer.imageUrl && <img src={trailer.imageUrl} alt={trailer.model} className="w-20 h-14 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-bold">{trailer.brand} {trailer.model}</h3>
                      <p className="text-sm text-muted-foreground">{trailer.type} • {trailer.year} • {trailer.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trailer.status === "available" ? "bg-green-100 text-green-800" :
                      trailer.status === "sold" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{trailer.status}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Tab - Simplified */}
        {activeTab === "equipment" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المعدات</h2>
              <p className="text-sm text-muted-foreground">لتعديل المعدات، استخدم زر "Edit Data" في صفحة المعدات</p>
            </div>
            <div className="grid gap-3">
              {equipmentList.map(eq => (
                <Card key={eq.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {eq.imageUrl && <img src={eq.imageUrl} alt={eq.model} className="w-20 h-14 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-bold">{eq.brand} {eq.model}</h3>
                      <p className="text-sm text-muted-foreground">{eq.category} • {eq.year} • {eq.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      eq.status === "available" ? "bg-green-100 text-green-800" :
                      eq.status === "sold" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{eq.status}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
