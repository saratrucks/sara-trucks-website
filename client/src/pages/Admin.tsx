import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  Container,
  Eye,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSession } from "@/contexts/AdminSessionContext";
import { trucks as initialTrucks, type Truck as TruckType } from "@/data/trucks";
import { trailers as initialTrailers, type Trailer } from "@/data/trailers";
import { equipment as initialEquipment, type Equipment } from "@/data/equipment";

type Catalog = "trucks" | "trailers" | "equipment";
type EditableProduct = TruckType | Trailer | Equipment;

const catalogMeta = {
  trucks: { label: "الشاحنات", singular: "شاحنة", icon: Truck, publicPath: "/trucks" },
  trailers: { label: "المقطورات", singular: "مقطورة", icon: Container, publicPath: "/trailers" },
  equipment: { label: "معدات البناء", singular: "معدة", icon: Wrench, publicPath: "/equipment" },
} as const;

function readInitialQuery() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("catalog");
  const catalog: Catalog = requested === "trailers" || requested === "equipment" ? requested : "trucks";
  return {
    catalog,
    itemId: Number(params.get("id")) || null,
    createNew: params.get("new") === "1",
  };
}

function AdminLogin() {
  const { login } = useAdminSession();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "تعذر تسجيل الدخول.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07192f] px-4 py-12 flex items-center justify-center" dir="rtl">
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">دخول مدير Sara Trucks</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">بعد تسجيل الدخول ستظهر أزرار التعديل داخل صفحات الموقع.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="admin-password">كلمة مرور المدير</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="أدخل كلمة المرور"
                minLength={12}
                required
              />
            </div>
            {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button className="w-full bg-primary text-white" type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              دخول آمن
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function nextId(items: EditableProduct[]) {
  return items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
}

function emptyProduct(catalog: Catalog, id: number): EditableProduct {
  const base = { id, brand: "", model: "", year: new Date().getFullYear(), status: "available" as const, location: "", description: "", imageUrl: "" };
  if (catalog === "trucks") return { ...base, mileage: "", engineType: "", transmission: "", transmissionType: "automatic", horsepower: 0, featured: false };
  if (catalog === "trailers") return { ...base, type: "", price: "", axles: 3, length: "", capacity: "" };
  return { ...base, category: "", price: "", operatingHours: "", weight: "", enginePower: "" };
}

function valueOf(product: EditableProduct, field: string) {
  return (product as unknown as Record<string, unknown>)[field] ?? "";
}

export default function Admin() {
  const { isAdmin, isChecking, logout } = useAdminSession();
  const initialQuery = useMemo(readInitialQuery, []);
  const [catalog, setCatalog] = useState<Catalog>(initialQuery.catalog);
  const [trucks, setTrucks] = useState<TruckType[]>(initialTrucks);
  const [trailers, setTrailers] = useState<Trailer[]>(initialTrailers);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<EditableProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const queryHandled = useRef(false);

  const items = catalog === "trucks" ? trucks : catalog === "trailers" ? trailers : equipment;

  const openEditor = (item?: EditableProduct) => {
    setDraft(item ? { ...item } : emptyProduct(catalog, nextId(items)));
    setEditorOpen(true);
    setMessage("");
  };

  useEffect(() => {
    if (!isAdmin || editorOpen || queryHandled.current) return;
    queryHandled.current = true;
    if (initialQuery.itemId) {
      const selected = items.find((item) => item.id === initialQuery.itemId);
      if (selected) openEditor(selected);
    } else if (initialQuery.createNew) {
      openEditor();
    }
  }, [isAdmin, initialQuery.createNew, initialQuery.itemId, items, editorOpen]);

  const replaceItems = (updated: EditableProduct[]) => {
    if (catalog === "trucks") setTrucks(updated as TruckType[]);
    else if (catalog === "trailers") setTrailers(updated as Trailer[]);
    else setEquipment(updated as Equipment[]);
  };

  const persist = async (updated: EditableProduct[]) => {
    setSaving(true);
    setMessage("جاري الحفظ والنشر...");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ catalog, items: updated }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "تعذر حفظ التغييرات.");
      replaceItems(updated);
      setEditorOpen(false);
      setDraft(null);
      setMessage("تم الحفظ. ستظهر النسخة الجديدة للعامة بعد اكتمال نشر Vercel خلال نحو دقيقة.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حفظ التغييرات.");
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!draft || !draft.brand.trim() || !draft.model.trim()) {
      setMessage("الماركة والموديل حقول مطلوبة.");
      return;
    }
    const exists = items.some((item) => item.id === draft.id);
    const updated = exists ? items.map((item) => (item.id === draft.id ? draft : item)) : [...items, draft];
    await persist(updated);
  };

  const deleteItem = async (item: EditableProduct) => {
    if (!window.confirm(`هل تريد حذف ${item.brand} ${item.model}؟`)) return;
    await persist(items.filter((candidate) => candidate.id !== item.id));
  };

  const uploadImage = async (file?: File) => {
    if (!file || !draft) return;
    if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) {
      setMessage("اختر صورة JPG أو PNG أو WebP أو GIF بحجم لا يتجاوز 4 MB.");
      return;
    }
    setUploading(true);
    setMessage("جاري رفع الصورة...");
    try {
      const body = new FormData();
      body.append("image", file);
      body.append("catalog", catalog);
      body.append("itemId", String(draft.id));
      const response = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "تعذر رفع الصورة.");
      setDraft({ ...draft, imageUrl: data.url });
      setMessage("تم رفع الصورة. اضغط حفظ لإكمال تحديث المنتج.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفع الصورة.");
    } finally {
      setUploading(false);
    }
  };

  const updateDraft = (field: string, value: string | number | boolean) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value } as EditableProduct);
  };

  if (isChecking) {
    return <div className="min-h-screen bg-[#07192f] text-white flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }
  if (!isAdmin) return <AdminLogin />;

  const meta = catalogMeta[catalog];

  return (
    <main className="min-h-screen bg-slate-100" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07192f] text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-secondary" />
            <div><h1 className="font-bold">إدارة Sara Trucks</h1><p className="text-xs text-white/60">التعديل والحفظ من داخل الموقع</p></div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-primary">
              <Link href={meta.publicPath}><Eye className="h-4 w-4" /> عرض الصفحة</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" /> خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(catalogMeta) as Catalog[]).map((key) => {
              const Icon = catalogMeta[key].icon;
              return (
                <Button
                  key={key}
                  variant={catalog === key ? "default" : "ghost"}
                  className={catalog === key ? "bg-primary text-white" : ""}
                  onClick={() => { setCatalog(key); setMessage(""); }}
                >
                  <Icon className="h-4 w-4" /> {catalogMeta[key].label}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-2xl font-bold text-primary">إدارة {meta.label}</h2><p className="text-sm text-muted-foreground">عدد العناصر: {items.length}</p></div>
          <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={() => openEditor()}>
            <Plus className="h-4 w-4" /> إضافة {meta.singular}
          </Button>
        </section>

        {message && <div className="rounded-xl border border-primary/10 bg-white p-4 text-sm text-primary shadow-sm">{message}</div>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-md">
              <div className="h-44 bg-slate-200">
                {item.imageUrl ? <img src={item.imageUrl} alt={`${item.brand} ${item.model}`} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-400"><ImagePlus className="h-10 w-10" /></div>}
              </div>
              <CardContent className="space-y-3 p-5">
                <div><h3 className="text-lg font-bold text-primary">{item.brand} {item.model}</h3><p className="text-sm text-muted-foreground">{item.year} · {item.location || "بدون موقع"}</p></div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{item.status}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEditor(item)}><Pencil className="h-4 w-4" /> تعديل</Button>
                    <Button size="icon" variant="ghost" className="text-destructive" disabled={saving} onClick={() => void deleteItem(item)} aria-label="حذف"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      <Dialog open={editorOpen} onOpenChange={(open) => { if (!saving) setEditorOpen(open); }}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{items.some((item) => item.id === draft?.id) ? `تعديل ${meta.singular}` : `إضافة ${meta.singular}`}</DialogTitle>
            <DialogDescription>عدّل المعلومات ثم اضغط حفظ. التغيير يصبح عامًا بعد اكتمال النشر التلقائي.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>الماركة *</Label><Input value={String(valueOf(draft, "brand"))} onChange={(event) => updateDraft("brand", event.target.value)} /></div>
                <div className="space-y-2"><Label>الموديل *</Label><Input value={String(valueOf(draft, "model"))} onChange={(event) => updateDraft("model", event.target.value)} /></div>
                <div className="space-y-2"><Label>سنة الصنع *</Label><Input type="number" min="1980" max={new Date().getFullYear() + 2} value={String(valueOf(draft, "year"))} onChange={(event) => updateDraft("year", Number(event.target.value))} /></div>
                <div className="space-y-2"><Label>الحالة</Label><Select value={String(valueOf(draft, "status"))} onValueChange={(value) => updateDraft("status", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="available">متاح</SelectItem><SelectItem value="reserved">محجوز</SelectItem><SelectItem value="sold">مباع</SelectItem></SelectContent></Select></div>
                <div className="space-y-2 sm:col-span-2"><Label>الموقع</Label><Input value={String(valueOf(draft, "location"))} onChange={(event) => updateDraft("location", event.target.value)} /></div>

                {catalog === "trucks" && <>
                  <div className="space-y-2"><Label>المسافة المقطوعة</Label><Input value={String(valueOf(draft, "mileage"))} onChange={(event) => updateDraft("mileage", event.target.value)} /></div>
                  <div className="space-y-2"><Label>نوع المحرك</Label><Input value={String(valueOf(draft, "engineType"))} onChange={(event) => updateDraft("engineType", event.target.value)} /></div>
                  <div className="space-y-2"><Label>ناقل الحركة</Label><Input value={String(valueOf(draft, "transmission"))} onChange={(event) => updateDraft("transmission", event.target.value)} /></div>
                  <div className="space-y-2"><Label>نوع الجير</Label><Select value={String(valueOf(draft, "transmissionType") || "automatic")} onValueChange={(value) => updateDraft("transmissionType", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="automatic">أوتوماتيك</SelectItem><SelectItem value="manual">يدوي</SelectItem><SelectItem value="semi-automatic">نصف أوتوماتيك</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>القوة بالحصان</Label><Input type="number" min="0" max="2000" value={String(valueOf(draft, "horsepower"))} onChange={(event) => updateDraft("horsepower", Number(event.target.value))} /></div>
                </>}

                {catalog === "trailers" && <>
                  <div className="space-y-2"><Label>نوع المقطورة *</Label><Input value={String(valueOf(draft, "type"))} onChange={(event) => updateDraft("type", event.target.value)} /></div>
                  <div className="space-y-2"><Label>عدد المحاور</Label><Input type="number" min="1" max="12" value={String(valueOf(draft, "axles"))} onChange={(event) => updateDraft("axles", Number(event.target.value))} /></div>
                  <div className="space-y-2"><Label>الطول</Label><Input value={String(valueOf(draft, "length"))} onChange={(event) => updateDraft("length", event.target.value)} /></div>
                  <div className="space-y-2"><Label>الحمولة</Label><Input value={String(valueOf(draft, "capacity"))} onChange={(event) => updateDraft("capacity", event.target.value)} /></div>
                </>}

                {catalog === "equipment" && <>
                  <div className="space-y-2"><Label>نوع المعدة *</Label><Input value={String(valueOf(draft, "category"))} onChange={(event) => updateDraft("category", event.target.value)} /></div>
                  <div className="space-y-2"><Label>ساعات التشغيل</Label><Input value={String(valueOf(draft, "operatingHours"))} onChange={(event) => updateDraft("operatingHours", event.target.value)} /></div>
                  <div className="space-y-2"><Label>الوزن</Label><Input value={String(valueOf(draft, "weight"))} onChange={(event) => updateDraft("weight", event.target.value)} /></div>
                  <div className="space-y-2"><Label>قدرة المحرك</Label><Input value={String(valueOf(draft, "enginePower"))} onChange={(event) => updateDraft("enginePower", event.target.value)} /></div>
                </>}
              </div>

              <div className="space-y-2"><Label>الوصف</Label><Textarea className="min-h-28" maxLength={5000} value={String(valueOf(draft, "description"))} onChange={(event) => updateDraft("description", event.target.value)} /></div>
              <div className="space-y-3">
                <Label>صورة المنتج</Label>
                <Input value={String(valueOf(draft, "imageUrl"))} onChange={(event) => updateDraft("imageUrl", event.target.value)} placeholder="رابط HTTPS أو ارفع صورة من جهازك" />
                <div className="flex flex-wrap items-center gap-3">
                  <Label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} رفع صورة
                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={(event) => void uploadImage(event.target.files?.[0])} />
                  </Label>
                  <span className="text-xs text-muted-foreground">الحد الأقصى 4 MB</span>
                </div>
                {draft.imageUrl && <img src={draft.imageUrl} alt="معاينة" className="h-44 w-full rounded-xl bg-muted object-contain" />}
              </div>

              {message && <p className="rounded-lg bg-muted p-3 text-sm">{message}</p>}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" disabled={saving} onClick={() => setEditorOpen(false)}>إلغاء</Button>
                <Button className="bg-primary text-white" disabled={saving || uploading} onClick={() => void saveDraft()}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} حفظ ونشر
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
