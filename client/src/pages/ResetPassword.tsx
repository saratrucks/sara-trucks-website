import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { trpc } from "../lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle, Loader2, XCircle, Eye, EyeOff } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ResetPassword() {
  const { t, direction } = useLanguage();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  // Verify token
  const { data: tokenValid, isLoading: verifyingToken, error: tokenError } = trpc.auth.verifyResetToken.useQuery(
    { token: token || "" },
    { enabled: !!token, retry: false }
  );

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t.resetPassword.passwordMismatch);
      return;
    }

    if (newPassword.length < 8) {
      setError(t.resetPassword.passwordTooShort);
      return;
    }

    if (token) {
      resetPasswordMutation.mutate({ token, newPassword });
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              {t.resetPassword.invalidLink}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t.resetPassword.noToken}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password">
              <Button className="w-full">
                {t.resetPassword.requestNewLink}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verifying token
  if (verifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">{t.resetPassword.verifying}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid or expired token
  if (tokenError || !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              {t.resetPassword.expiredLink}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t.resetPassword.expiredDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password">
              <Button className="w-full">
                {t.resetPassword.requestNewLink}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              {t.resetPassword.success}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t.resetPassword.successDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">
                {t.resetPassword.goToLogin}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4" dir={direction}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t.resetPassword.title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {t.resetPassword.description}
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
              <Label htmlFor="newPassword">{t.resetPassword.newPassword}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.resetPassword.newPasswordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="text-base pr-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.resetPassword.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder={t.resetPassword.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="text-base"
                dir="ltr"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {t.resetPassword.passwordRequirements}
            </p>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className={`w-4 h-4 animate-spin ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t.resetPassword.resetting}
                </>
              ) : (
                t.resetPassword.submit
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
