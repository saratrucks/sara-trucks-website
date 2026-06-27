import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Login() {
  const { language, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // Redirect to home or admin
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ar: "تسجيل الدخول",
        it: "Accedi",
        de: "Anmelden",
        en: "Login",
      },
      subtitle: {
        ar: "أدخل بياناتك للوصول إلى حسابك",
        it: "Inserisci i tuoi dati per accedere al tuo account",
        de: "Geben Sie Ihre Daten ein, um auf Ihr Konto zuzugreifen",
        en: "Enter your credentials to access your account",
      },
      email: {
        ar: "البريد الإلكتروني",
        it: "Email",
        de: "E-Mail",
        en: "Email",
      },
      password: {
        ar: "كلمة المرور",
        it: "Password",
        de: "Passwort",
        en: "Password",
      },
      loginButton: {
        ar: "تسجيل الدخول",
        it: "Accedi",
        de: "Anmelden",
        en: "Login",
      },
      noAccount: {
        ar: "ليس لديك حساب؟",
        it: "Non hai un account?",
        de: "Kein Konto?",
        en: "Don't have an account?",
      },
      register: {
        ar: "إنشاء حساب جديد",
        it: "Crea un nuovo account",
        de: "Neues Konto erstellen",
        en: "Create new account",
      },
      orLoginWith: {
        ar: "أو سجل الدخول باستخدام",
        it: "Oppure accedi con",
        de: "Oder anmelden mit",
        en: "Or login with",
      },
      forgotPassword: {
        ar: "نسيت كلمة المرور؟",
        it: "Password dimenticata?",
        de: "Passwort vergessen?",
        en: "Forgot password?",
      },
      manusLogin: {
        ar: "تسجيل الدخول عبر Manus",
        it: "Accedi con Manus",
        de: "Mit Manus anmelden",
        en: "Login with Manus",
      },
      loading: {
        ar: "جاري تسجيل الدخول...",
        it: "Accesso in corso...",
        de: "Anmeldung läuft...",
        en: "Logging in...",
      },
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{getText("title")}</CardTitle>
          <CardDescription>{getText("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{getText("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{getText("password")}</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  {getText("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {getText("loading")}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {getText("loginButton")}
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {getText("orLoginWith")}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = getLoginUrl()}
          >
            {getText("manusLogin")}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {getText("noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              {getText("register")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
