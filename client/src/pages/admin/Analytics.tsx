import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  LayoutDashboard, 
  LogOut, 
  Home, 
  Users, 
  History, 
  Truck, 
  Container, 
  Wrench,
  BarChart3,
  Eye,
  MousePointerClick,
  Globe,
  Clock,
  TrendingUp,
  Activity,
  FileText,
  Download
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { generateAnalyticsReport } from "@/lib/generatePdfReport";

// Types for analytics data
interface AnalyticsData {
  pageviews: { value: number; change: number };
  visitors: { value: number; change: number };
  bounceRate: { value: number; change: number };
  avgTime: { value: string; change: number };
}

interface PageView {
  page: string;
  views: number;
  percentage: number;
}

interface DailyStats {
  date: string;
  pageviews: number;
  visitors: number;
}

interface CountryStats {
  country: string;
  countryAr: string;
  flag: string;
  visitors: number;
  percentage: number;
}

export default function Analytics() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [location] = useLocation();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [topPages, setTopPages] = useState<PageView[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  // Get activity logs for recent activity
  const { data: activityLogs } = trpc.activityLogs.list.useQuery({ limit: 10 });
  const { data: users } = trpc.users.list.useQuery();

  useEffect(() => {
    // Simulate analytics data (in production, this would come from Umami API)
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      
      // Simulated data - in production, integrate with Umami API
      setTimeout(() => {
        setAnalyticsData({
          pageviews: { value: 1247, change: 12.5 },
          visitors: { value: 423, change: 8.3 },
          bounceRate: { value: 42, change: -5.2 },
          avgTime: { value: "2:34", change: 15.1 },
        });

        setTopPages([
          { page: "/", views: 456, percentage: 36.6 },
          { page: "/trucks", views: 234, percentage: 18.8 },
          { page: "/trailers", views: 189, percentage: 15.2 },
          { page: "/equipment", views: 156, percentage: 12.5 },
          { page: "/services", views: 98, percentage: 7.9 },
          { page: "/contact", views: 67, percentage: 5.4 },
          { page: "/team", views: 47, percentage: 3.8 },
        ]);

        // Generate last 7 days stats
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push({
            date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            pageviews: Math.floor(Math.random() * 200) + 100,
            visitors: Math.floor(Math.random() * 80) + 40,
          });
        }
        setDailyStats(days);

        // Country statistics - simulated data based on target markets
        setCountryStats([
          { country: "Syria", countryAr: "سوريا", flag: "🇸🇾", visitors: 156, percentage: 36.9 },
          { country: "Italy", countryAr: "إيطاليا", flag: "🇮🇹", visitors: 98, percentage: 23.2 },
          { country: "Iraq", countryAr: "العراق", flag: "🇮🇶", visitors: 67, percentage: 15.8 },
          { country: "Lebanon", countryAr: "لبنان", flag: "🇱🇧", visitors: 45, percentage: 10.6 },
          { country: "Jordan", countryAr: "الأردن", flag: "🇯🇴", visitors: 28, percentage: 6.6 },
          { country: "Germany", countryAr: "ألمانيا", flag: "🇩🇪", visitors: 18, percentage: 4.3 },
          { country: "Other", countryAr: "دول أخرى", flag: "🌍", visitors: 11, percentage: 2.6 },
        ]);
        
        setIsLoadingAnalytics(false);
      }, 1000);
    };

    fetchAnalytics();
  }, []);

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
            <h2 className="text-2xl font-bold text-primary mb-4">تسجيل الدخول مطلوب</h2>
            <p className="text-muted-foreground mb-6">
              يجب تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              تسجيل الدخول
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
            <h2 className="text-2xl font-bold text-destructive mb-4">غير مصرح</h2>
            <p className="text-muted-foreground mb-6">
              يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة
            </p>
            <Link href="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxPageviews = Math.max(...(dailyStats.map(d => d.pageviews) || [1]));

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
            <h1 className="text-xl font-bold">لوحة تحكم سارا تراكس</h1>
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
              <LayoutDashboard className="mr-2 h-4 w-4" />
              لوحة التحكم
            </Button>
          </Link>
          <Link href="/admin/trucks">
            <Button 
              variant={location === "/admin/trucks" ? "default" : "ghost"}
              className={location === "/admin/trucks" ? "bg-primary" : ""}
            >
              <Truck className="mr-2 h-4 w-4" />
              إدارة الشاحنات
            </Button>
          </Link>
          <Link href="/admin/trailers">
            <Button 
              variant={location === "/admin/trailers" ? "default" : "ghost"}
              className={location === "/admin/trailers" ? "bg-primary" : ""}
            >
              <Container className="mr-2 h-4 w-4" />
              إدارة المقطورات
            </Button>
          </Link>
          <Link href="/admin/equipment">
            <Button 
              variant={location === "/admin/equipment" ? "default" : "ghost"}
              className={location === "/admin/equipment" ? "bg-primary" : ""}
            >
              <Wrench className="mr-2 h-4 w-4" />
              إدارة المعدات
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button 
              variant={location === "/admin/users" ? "default" : "ghost"}
              className={location === "/admin/users" ? "bg-primary" : ""}
            >
              <Users className="mr-2 h-4 w-4" />
              إدارة المستخدمين
            </Button>
          </Link>
          <Link href="/admin/activity">
            <Button 
              variant={location === "/admin/activity" ? "default" : "ghost"}
              className={location === "/admin/activity" ? "bg-primary" : ""}
            >
              <History className="mr-2 h-4 w-4" />
              سجل الأنشطة
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button 
              variant={location === "/admin/analytics" ? "default" : "ghost"}
              className={location === "/admin/analytics" ? "bg-primary" : ""}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              تحليلات الموقع
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                تحليلات الموقع
              </h1>
              <p className="text-muted-foreground mt-2">
                إحصائيات وتحليلات نشاط الزوار على الموقع
              </p>
            </div>
            <Button
              onClick={() => {
                if (analyticsData) {
                  generateAnalyticsReport(analyticsData, topPages, countryStats, dailyStats);
                }
              }}
              disabled={isLoadingAnalytics || !analyticsData}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" />
              تصدير تقرير PDF
            </Button>
          </div>

          {/* Stats Cards */}
          {isLoadingAnalytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    مشاهدات الصفحات
                  </CardTitle>
                  <Eye className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.pageviews.value.toLocaleString()}</div>
                  <p className={`text-xs mt-1 ${analyticsData?.pageviews.change && analyticsData.pageviews.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData?.pageviews.change && analyticsData.pageviews.change > 0 ? '+' : ''}{analyticsData?.pageviews.change}% من الأسبوع الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    الزوار الفريدون
                  </CardTitle>
                  <Users className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.visitors.value.toLocaleString()}</div>
                  <p className={`text-xs mt-1 ${analyticsData?.visitors.change && analyticsData.visitors.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData?.visitors.change && analyticsData.visitors.change > 0 ? '+' : ''}{analyticsData?.visitors.change}% من الأسبوع الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    معدل الارتداد
                  </CardTitle>
                  <MousePointerClick className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.bounceRate.value}%</div>
                  <p className={`text-xs mt-1 ${analyticsData?.bounceRate.change && analyticsData.bounceRate.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData?.bounceRate.change && analyticsData.bounceRate.change > 0 ? '+' : ''}{analyticsData?.bounceRate.change}% من الأسبوع الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    متوسط وقت الجلسة
                  </CardTitle>
                  <Clock className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analyticsData?.avgTime.value}</div>
                  <p className={`text-xs mt-1 ${analyticsData?.avgTime.change && analyticsData.avgTime.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData?.avgTime.change && analyticsData.avgTime.change > 0 ? '+' : ''}{analyticsData?.avgTime.change}% من الأسبوع الماضي
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  الزيارات اليومية (آخر 7 أيام)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dailyStats.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-muted-foreground">{day.date}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-6 bg-primary/80 rounded-sm transition-all duration-500"
                              style={{ width: `${(day.pageviews / maxPageviews) * 100}%` }}
                            ></div>
                            <span className="text-sm font-medium">{day.pageviews}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  أكثر الصفحات زيارة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{page.page}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${page.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-16 text-left">
                            {page.views} زيارة
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Country Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                توزيع الزوار حسب البلد
              </CardTitle>
              <CardDescription>
                الدول التي يأتي منها زوار الموقع
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {countryStats.map((country, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-medium">{country.countryAr}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-primary">{country.visitors}</span>
                        <span className="text-sm text-muted-foreground">{country.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registered Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  المستخدمون المسجلون
                </CardTitle>
                <CardDescription>
                  إجمالي المستخدمين المسجلين في الموقع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {users?.length || 0}
                  </div>
                  <p className="text-muted-foreground">مستخدم مسجل</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {users?.filter(u => u.role === "admin").length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">مسؤولين</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {users?.filter(u => u.role === "user").length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">مستخدمين عاديين</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  آخر الأنشطة
                </CardTitle>
                <CardDescription>
                  آخر 5 إجراءات في لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs?.logs?.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                        log.action === 'create' ? 'bg-green-500' :
                        log.action === 'update' ? 'bg-blue-500' :
                        log.action === 'delete' ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {log.action === 'create' ? '+' :
                         log.action === 'update' ? '✎' :
                         log.action === 'delete' ? '×' : '•'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {log.userName || 'مستخدم'} - {log.action === 'create' ? 'أضاف' : log.action === 'update' ? 'عدّل' : log.action === 'delete' ? 'حذف' : log.action} {log.entityType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString('ar-SA', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-4">لا توجد أنشطة حديثة</p>
                  )}
                </div>
                <Link href="/admin/activity">
                  <Button variant="outline" className="w-full mt-4">
                    عرض جميع الأنشطة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Info Note */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">ملاحظة حول التحليلات</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    البيانات المعروضة حالياً هي بيانات تجريبية. للحصول على تحليلات حقيقية، يمكنك الوصول إلى لوحة تحليلات Umami من خلال لوحة الإدارة (Dashboard) في واجهة المستخدم.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
