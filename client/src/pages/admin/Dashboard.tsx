import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Truck, Package, DollarSign, TrendingUp, Plus, Edit, LayoutDashboard, LogOut, Home, Users, History, Container, Wrench, BarChart3, UserPlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { t, dir } = useLanguage();
  const { data: trucks, isLoading: trucksLoading } = trpc.trucks.listAll.useQuery();
  const { data: trailers, isLoading: trailersLoading } = trpc.trailers.listAll.useQuery();
  const { data: equipment, isLoading: equipmentLoading } = trpc.equipment.listAll.useQuery();

  const truckStats = {
    total: trucks?.length || 0,
    available: trucks?.filter((t) => t.status === "available").length || 0,
    sold: trucks?.filter((t) => t.status === "sold").length || 0,
    reserved: trucks?.filter((t) => t.status === "reserved").length || 0,
  };

  const trailerStats = {
    total: trailers?.length || 0,
    available: trailers?.filter((t) => t.status === "available").length || 0,
    sold: trailers?.filter((t) => t.status === "sold").length || 0,
    reserved: trailers?.filter((t) => t.status === "reserved").length || 0,
  };

  const equipmentStats = {
    total: equipment?.length || 0,
    available: equipment?.filter((e) => e.status === "available").length || 0,
    sold: equipment?.filter((e) => e.status === "sold").length || 0,
    reserved: equipment?.filter((e) => e.status === "reserved").length || 0,
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
    <div className="min-h-screen bg-muted/30">
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
        <div className="container flex flex-wrap gap-1 py-2">
          <Link href="/admin">
            <Button 
              variant={location === "/admin" ? "default" : "ghost"} 
              className={location === "/admin" ? "bg-primary" : ""}
            >
              <LayoutDashboard className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.dashboard}
            </Button>
          </Link>
          <Link href="/admin/trucks">
            <Button 
              variant={location === "/admin/trucks" ? "default" : "ghost"}
              className={location === "/admin/trucks" ? "bg-primary" : ""}
            >
              <Truck className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.trucks_management}
            </Button>
          </Link>
          <Link href="/admin/trailers">
            <Button 
              variant={location === "/admin/trailers" ? "default" : "ghost"}
              className={location === "/admin/trailers" ? "bg-primary" : ""}
            >
              <Container className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.trailers_management}
            </Button>
          </Link>
          <Link href="/admin/equipment">
            <Button 
              variant={location === "/admin/equipment" ? "default" : "ghost"}
              className={location === "/admin/equipment" ? "bg-primary" : ""}
            >
              <Wrench className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.equipment_management}
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button 
              variant={location === "/admin/users" ? "default" : "ghost"}
              className={location === "/admin/users" ? "bg-primary" : ""}
            >
              <Users className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.users_management}
            </Button>
          </Link>
          <Link href="/admin/activity">
            <Button 
              variant={location === "/admin/activity" ? "default" : "ghost"}
              className={location === "/admin/activity" ? "bg-primary" : ""}
            >
              <History className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.activity_log}
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button 
              variant={location === "/admin/analytics" ? "default" : "ghost"}
              className={location === "/admin/analytics" ? "bg-primary" : ""}
            >
              <BarChart3 className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.analytics}
            </Button>
          </Link>
          <Link href="/admin/applications">
            <Button 
              variant={location === "/admin/applications" ? "default" : "ghost"}
              className={location === "/admin/applications" ? "bg-primary" : ""}
            >
              <UserPlus className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {t.admin.applications}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{t.admin.welcome}، {user?.name || "Admin"}</h1>
              <p className="text-muted-foreground">{t.admin.manage_products}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/trucks/new">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                  {t.admin.new_truck}
                </Button>
              </Link>
              <Link href="/admin/trailers/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                  {t.admin.new_trailer}
                </Button>
              </Link>
              <Link href="/admin/equipment/new">
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  <Plus className={dir === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                  {t.admin.new_equipment}
                </Button>
              </Link>
            </div>
          </div>

          {/* Trucks Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {t.admin.trucks_stats}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.total}
                  </CardTitle>
                  <Truck className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{truckStats.total}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.available}
                  </CardTitle>
                  <Package className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{truckStats.available}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.sold}
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{truckStats.sold}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.reserved}
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{truckStats.reserved}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trailers Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Container className="h-5 w-5" />
              {t.admin.trailers_stats}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.total}
                  </CardTitle>
                  <Container className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{trailerStats.total}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.available}
                  </CardTitle>
                  <Package className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{trailerStats.available}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.sold}
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{trailerStats.sold}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.reserved}
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{trailerStats.reserved}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Equipment Stats */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {t.admin.equipment_stats}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-secondary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.total}
                  </CardTitle>
                  <Wrench className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{equipmentStats.total}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.available}
                  </CardTitle>
                  <Package className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{equipmentStats.available}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.sold}
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{equipmentStats.sold}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.admin.reserved}
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{equipmentStats.reserved}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Products Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Trucks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    آخر الشاحنات
                  </span>
                  <Link href="/admin/trucks">
                    <Button variant="outline" size="sm">
                      عرض الكل
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trucksLoading ? (
                  <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
                ) : trucks && trucks.length > 0 ? (
                  <div className="space-y-3">
                    {trucks.slice(0, 3).map((truck) => (
                      <div key={truck.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">{truck.brand} {truck.model}</p>
                          <p className="text-sm text-muted-foreground">{truck.year}</p>
                        </div>
                        <Badge
                          className={
                            truck.status === "available"
                              ? "bg-green-500"
                              : truck.status === "sold"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }
                        >
                          {truck.status === "available" ? "متاحة" : truck.status === "sold" ? "مباعة" : "محجوزة"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    لا توجد شاحنات بعد
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Trailers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Container className="h-4 w-4" />
                    آخر المقطورات
                  </span>
                  <Link href="/admin/trailers">
                    <Button variant="outline" size="sm">
                      عرض الكل
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trailersLoading ? (
                  <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
                ) : trailers && trailers.length > 0 ? (
                  <div className="space-y-3">
                    {trailers.slice(0, 3).map((trailer) => (
                      <div key={trailer.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">{trailer.brand} {trailer.model}</p>
                          <p className="text-sm text-muted-foreground">{trailer.type}</p>
                        </div>
                        <Badge
                          className={
                            trailer.status === "available"
                              ? "bg-green-500"
                              : trailer.status === "sold"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }
                        >
                          {trailer.status === "available" ? "متاحة" : trailer.status === "sold" ? "مباعة" : "محجوزة"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    لا توجد مقطورات بعد
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    آخر المعدات
                  </span>
                  <Link href="/admin/equipment">
                    <Button variant="outline" size="sm">
                      عرض الكل
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {equipmentLoading ? (
                  <div className="text-center py-4 text-muted-foreground">جاري التحميل...</div>
                ) : equipment && equipment.length > 0 ? (
                  <div className="space-y-3">
                    {equipment.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium">{item.brand} {item.model}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Badge
                          className={
                            item.status === "available"
                              ? "bg-green-500"
                              : item.status === "sold"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }
                        >
                          {item.status === "available" ? "متاحة" : item.status === "sold" ? "مباعة" : "محجوزة"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    لا توجد معدات بعد
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
