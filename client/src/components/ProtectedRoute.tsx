import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Link } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const { t, dir } = useLanguage();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {t.protected?.title || "تسجيل الدخول مطلوب"}
            </CardTitle>
            <CardDescription className="text-lg">
              {t.protected?.description || "يجب عليك تسجيل الدخول لعرض هذه الصفحة"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg">
                <LogIn className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t.protected?.login || "تسجيل الدخول"}
              </Button>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t.protected?.or || "أو"}
                </span>
              </div>
            </div>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full py-6 text-lg rounded-xl border-2">
                <UserPlus className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                {t.protected?.register || "إنشاء حساب جديد"}
              </Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {t.protected?.benefits || "سجل الآن للوصول إلى جميع منتجاتنا ومميزاتنا الحصرية"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}
