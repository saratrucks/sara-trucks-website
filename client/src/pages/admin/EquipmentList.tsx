import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Wrench, Plus, Edit, Trash2, LayoutDashboard, LogOut, Home, Search, Truck, Container } from "lucide-react";
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

export default function EquipmentList() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { t, dir } = useLanguage();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: equipment, isLoading, refetch } = trpc.equipment.listAll.useQuery();
  const deleteMutation = trpc.equipment.delete.useMutation({
    onSuccess: () => {
      toast.success(t.admin.forms.success_delete);
      refetch();
    },
    onError: (error) => {
      toast.error(t.admin.forms.error + ": " + error.message);
    },
  });

  const filteredEquipment = equipment?.filter((item) => {
    const matchesSearch =
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">{t.admin.forms.available}</Badge>;
      case "sold":
        return <Badge className="bg-red-500 hover:bg-red-600">{t.admin.forms.sold}</Badge>;
      case "reserved":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{t.admin.forms.reserved}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
            <Button 
              variant={location === "/admin" ? "default" : "ghost"} 
              className={location === "/admin" ? "bg-primary" : ""}
            >
              <LayoutDashboard className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.admin.dashboard}
            </Button>
          </Link>
          <Link href="/admin/equipment">
            <Button 
              variant={location === "/admin/equipment" ? "default" : "ghost"}
              className={location === "/admin/equipment" ? "bg-primary" : ""}
            >
              <Wrench className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t.admin.equipment_management}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{t.admin.equipment_management}</h1>
              <p className="text-muted-foreground">{t.admin.view_edit_delete}</p>
            </div>
            <Link href="/admin/equipment/new">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">
                <Plus className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t.admin.forms.add_equipment}
              </Button>
            </Link>
          </div>

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
                    <SelectItem value="available">{t.admin.forms.available}</SelectItem>
                    <SelectItem value="sold">{t.admin.forms.sold}</SelectItem>
                    <SelectItem value="reserved">{t.admin.forms.reserved}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">{t.admin.loading}</div>
              ) : filteredEquipment && filteredEquipment.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-right py-4 px-4 font-medium">{t.admin.forms.brand}</th>
                        <th className="text-right py-4 px-4 font-medium">{t.admin.forms.model}</th>
                        <th className="text-right py-4 px-4 font-medium">{t.admin.forms.year}</th>
                        <th className="text-right py-4 px-4 font-medium">{t.admin.forms.location}</th>
                        <th className="text-right py-4 px-4 font-medium">{t.admin.forms.status}</th>
                        <th className="text-right py-4 px-4 font-medium">{t.admin.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEquipment.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-4 font-medium">{item.brand}</td>
                          <td className="py-4 px-4">{item.model}</td>
                          <td className="py-4 px-4">{item.year}</td>
                          <td className="py-4 px-4">{item.location || "-"}</td>
                          <td className="py-4 px-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Link href={`/admin/equipment/${item.id}`}>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t.admin.confirm_delete}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t.admin.delete_warning} {item.brand} {item.model}. {t.admin.cannot_undo}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t.admin.cancel}</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive hover:bg-destructive/90"
                                      onClick={() => deleteMutation.mutate({ id: item.id })}
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
                <div className="text-center py-12 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No equipment found</p>
                  <Link href="/admin/equipment/new" className="text-primary hover:underline">
                    {t.admin.forms.add_equipment}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
