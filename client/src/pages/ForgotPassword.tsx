import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function ForgotPassword() {
  const { t, direction } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestResetMutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    requestResetMutation.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              {t.forgotPassword.emailSent}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t.forgotPassword.checkEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t.forgotPassword.emailInstructions}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className={`w-4 h-4 ${direction === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
                  {t.forgotPassword.backToLogin}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t.forgotPassword.title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {t.forgotPassword.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.forgotPassword.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.forgotPassword.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
                dir="ltr"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={requestResetMutation.isPending}
            >
              {requestResetMutation.isPending ? (
                <>
                  <Loader2 className={`w-4 h-4 animate-spin ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t.forgotPassword.sending}
                </>
              ) : (
                t.forgotPassword.submit
              )}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                {t.forgotPassword.backToLogin}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
