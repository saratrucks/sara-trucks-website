import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Truck, Plus, Edit, Trash2, LayoutDashboard, LogOut, Home, Search, Sparkles, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TrucksList() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { t, dir } = useLanguage();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  
  const { data: trucks, isLoading, refetch } = trpc.trucks.listAll.useQuery();
  const generateDescriptionMutation = trpc.ai.generateDescription.useMutation();
  const updateMutation = trpc.trucks.update.useMutation();
  
  const updateStatusMutation = trpc.trucks.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(t.admin.forms.success_update);
      refetch();
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });
  const deleteMutation = trpc.trucks.delete.useMutation({
    onSuccess: () => {
      toast.success(t.admin.forms.success_delete);
      refetch();
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  const filteredTrucks = trucks?.filter((truck) => {
    const matchesSearch =
      truck.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateAllDescriptions = async () => {
    if (!trucks || trucks.length === 0) {
      toast.error("لا توجد شاحنات لتحديثها");
      return;
    }

    setIsGeneratingAll(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const truck of trucks) {
        try {
          const result = await generateDescriptionMutation.mutateAsync({
            type: "truck",
            data: {
              brand: truck.brand || '',
              model: truck.model || '',
              year: truck.year || new Date().getFullYear(),
              mileage: truck.mileage || '',
              location: truck.location || '',
              engineType: truck.engineType || '',
              transmission: truck.transmission || '',
              horsepower: truck.horsepower || 0,
            },
            language: "ar",
          });

          await updateMutation.mutateAsync({
            id: truck.id,
            description: result.description,
          });

          successCount++;
        } catch (error) {
          console.error(`Error generating description for truck ${truck.id}:`, error);
          errorCount++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (successCount > 0) {
        toast.success(`✅ تم تحديث ${successCount} وصف بنجاح`);
      }
      if (errorCount > 0) {
        toast.error(`❌ فشل تحديث ${errorCount} وصف`);
      }
      refetch();
    } catch (error) {
      toast.error("خطأ في توليد الأوصاف");
    } finally {
      setIsGeneratingAll(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">{t.admin.trucks_management}</h1>
              <p className="text-muted-foreground">{t.admin.view_edit_delete}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/trucks/new">
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  <Plus className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t.admin.forms.add_truck}
                </Button>
              </Link>
              <Button 
                onClick={handleGenerateAllDescriptions}
                disabled={isGeneratingAll || !trucks || trucks.length === 0}
                className="bg-primary hover:bg-primary/90 text-white gap-2"
              >
                {isGeneratingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    توليد أوصاف جديدة
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
                <Input
                  placeholder={t.admin.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={dir === 'rtl' ? 'pl-10' : 'pr-10'}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t.admin.all_statuses} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.admin.all_statuses}</SelectItem>
                  <SelectItem value="available">{t.trucks_page.filters.available_only}</SelectItem>
                  <SelectItem value="sold">{t.trucks_page.filters.sold}</SelectItem>
                  <SelectItem value="reserved">{t.trucks_page.filters.reserved}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trucks Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t.admin.trucks_management}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTrucks && filteredTrucks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                  <th className="text-left py-3 px-4">{t.admin.forms.brand}</th>
                    <th className="text-left py-3 px-4">{t.admin.forms.model}</th>
                    <th className="text-left py-3 px-4">{t.admin.forms.year}</th>
                    <th className="text-left py-3 px-4">{t.admin.forms.status}</th>
                      <th className="text-left py-3 px-4">{t.admin.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrucks.map((truck) => (
                      <tr key={truck.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{truck.brand}</td>
                        <td className="py-3 px-4">{truck.model}</td>
                        <td className="py-3 px-4">{truck.year}</td>
                        <td className="py-3 px-4">
                          <Select
                            value={truck.status}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({
                                id: truck.id,
                                status: value as "available" | "sold" | "reserved",
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">{t.trucks_page.filters.available_only}</SelectItem>
                              <SelectItem value="sold">{t.trucks_page.filters.sold}</SelectItem>
                              <SelectItem value="reserved">{t.trucks_page.filters.reserved}</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/trucks/${truck.id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t.admin.confirm_delete}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t.admin.delete_warning}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.admin.cancel}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate({ id: truck.id })}
                                  >
                                    {t.admin.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t.admin.no_trucks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
