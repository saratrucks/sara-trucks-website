import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Register() {
  const { language, dir } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      setSuccess(true);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ar: "إنشاء حساب جديد",
        it: "Crea un nuovo account",
        de: "Neues Konto erstellen",
        en: "Create new account",
      },
      subtitle: {
        ar: "أدخل بياناتك لإنشاء حساب جديد",
        it: "Inserisci i tuoi dati per creare un nuovo account",
        de: "Geben Sie Ihre Daten ein, um ein neues Konto zu erstellen",
        en: "Enter your details to create a new account",
      },
      name: {
        ar: "الاسم الكامل",
        it: "Nome completo",
        de: "Vollständiger Name",
        en: "Full Name",
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
      confirmPassword: {
        ar: "تأكيد كلمة المرور",
        it: "Conferma password",
        de: "Passwort bestätigen",
        en: "Confirm Password",
      },
      registerButton: {
        ar: "إنشاء الحساب",
        it: "Crea account",
        de: "Konto erstellen",
        en: "Create Account",
      },
      hasAccount: {
        ar: "لديك حساب بالفعل؟",
        it: "Hai già un account?",
        de: "Haben Sie bereits ein Konto?",
        en: "Already have an account?",
      },
      login: {
        ar: "تسجيل الدخول",
        it: "Accedi",
        de: "Anmelden",
        en: "Login",
      },
      loading: {
        ar: "جاري إنشاء الحساب...",
        it: "Creazione account in corso...",
        de: "Konto wird erstellt...",
        en: "Creating account...",
      },
      passwordMismatch: {
        ar: "كلمتا المرور غير متطابقتين",
        it: "Le password non corrispondono",
        de: "Passwörter stimmen nicht überein",
        en: "Passwords do not match",
      },
      successMessage: {
        ar: "تم إنشاء الحساب بنجاح! جاري التحويل...",
        it: "Account creato con successo! Reindirizzamento...",
        de: "Konto erfolgreich erstellt! Weiterleitung...",
        en: "Account created successfully! Redirecting...",
      },
      passwordHint: {
        ar: "8 أحرف على الأقل",
        it: "Almeno 8 caratteri",
        de: "Mindestens 8 Zeichen",
        en: "At least 8 characters",
      },
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(getText("passwordMismatch"));
      return;
    }

    registerMutation.mutate({ email, password, name });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4" dir={dir}>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">{getText("successMessage")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
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
              <Label htmlFor="name">{getText("name")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="password">{getText("password")}</Label>
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
                  minLength={8}
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">{getText("passwordHint")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{getText("confirmPassword")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {getText("loading")}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {getText("registerButton")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {getText("hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {getText("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
