import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, Shield, ShieldOff, Loader2, Crown, ArrowLeft, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

export default function UsersList() {
  const { language, dir } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; currentRole: string } | null>(null);
  const [actionType, setActionType] = useState<"promote" | "demote" | null>(null);

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();
  const updateRoleMutation = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success(
        language === "ar" ? "تم تحديث صلاحيات المستخدم بنجاح" :
        language === "it" ? "Ruolo utente aggiornato con successo" :
        language === "de" ? "Benutzerrolle erfolgreich aktualisiert" :
        "User role updated successfully"
      );
      refetch();
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRoleChange = (userId: number, name: string, currentRole: string, newRole: "admin" | "user") => {
    setSelectedUser({ id: userId, name, currentRole });
    setActionType(newRole === "admin" ? "promote" : "demote");
  };

  const confirmRoleChange = () => {
    if (selectedUser && actionType) {
      updateRoleMutation.mutate({
        userId: selectedUser.id,
        role: actionType === "promote" ? "admin" : "user",
      });
    }
  };

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ar: "إدارة المستخدمين",
        it: "Gestione Utenti",
        de: "Benutzerverwaltung",
        en: "User Management",
      },
      subtitle: {
        ar: "إدارة صلاحيات المستخدمين المسجلين",
        it: "Gestisci i permessi degli utenti registrati",
        de: "Verwalten Sie die Berechtigungen registrierter Benutzer",
        en: "Manage registered users permissions",
      },
      name: {
        ar: "الاسم",
        it: "Nome",
        de: "Name",
        en: "Name",
      },
      email: {
        ar: "البريد الإلكتروني",
        it: "Email",
        de: "E-Mail",
        en: "Email",
      },
      role: {
        ar: "الصلاحية",
        it: "Ruolo",
        de: "Rolle",
        en: "Role",
      },
      lastLogin: {
        ar: "آخر تسجيل دخول",
        it: "Ultimo accesso",
        de: "Letzte Anmeldung",
        en: "Last Login",
      },
      actions: {
        ar: "الإجراءات",
        it: "Azioni",
        de: "Aktionen",
        en: "Actions",
      },
      admin: {
        ar: "مسؤول",
        it: "Admin",
        de: "Admin",
        en: "Admin",
      },
      user: {
        ar: "مستخدم",
        it: "Utente",
        de: "Benutzer",
        en: "User",
      },
      owner: {
        ar: "المالك",
        it: "Proprietario",
        de: "Eigentümer",
        en: "Owner",
      },
      promote: {
        ar: "ترقية لمسؤول",
        it: "Promuovi ad Admin",
        de: "Zum Admin befördern",
        en: "Promote to Admin",
      },
      demote: {
        ar: "تخفيض لمستخدم",
        it: "Retrocedi a Utente",
        de: "Zum Benutzer herabstufen",
        en: "Demote to User",
      },
      confirmPromote: {
        ar: "هل أنت متأكد من ترقية هذا المستخدم إلى مسؤول؟",
        it: "Sei sicuro di voler promuovere questo utente ad admin?",
        de: "Sind Sie sicher, dass Sie diesen Benutzer zum Admin befördern möchten?",
        en: "Are you sure you want to promote this user to admin?",
      },
      confirmDemote: {
        ar: "هل أنت متأكد من تخفيض صلاحيات هذا المستخدم؟",
        it: "Sei sicuro di voler retrocedere questo utente?",
        de: "Sind Sie sicher, dass Sie diesen Benutzer herabstufen möchten?",
        en: "Are you sure you want to demote this user?",
      },
      cancel: {
        ar: "إلغاء",
        it: "Annulla",
        de: "Abbrechen",
        en: "Cancel",
      },
      confirm: {
        ar: "تأكيد",
        it: "Conferma",
        de: "Bestätigen",
        en: "Confirm",
      },
      noUsers: {
        ar: "لا يوجد مستخدمين مسجلين بعد",
        it: "Nessun utente registrato ancora",
        de: "Noch keine registrierten Benutzer",
        en: "No registered users yet",
      },
      backToDashboard: {
        ar: "العودة للوحة التحكم",
        it: "Torna alla Dashboard",
        de: "Zurück zum Dashboard",
        en: "Back to Dashboard",
      },
      totalUsers: {
        ar: "إجمالي المستخدمين",
        it: "Utenti Totali",
        de: "Gesamtbenutzer",
        en: "Total Users",
      },
      admins: {
        ar: "المسؤولين",
        it: "Admin",
        de: "Admins",
        en: "Admins",
      },
      regularUsers: {
        ar: "المستخدمين العاديين",
        it: "Utenti Regolari",
        de: "Normale Benutzer",
        en: "Regular Users",
      },
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(
      language === "ar" ? "ar-SA" : language === "it" ? "it-IT" : language === "de" ? "de-DE" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const adminCount = users?.filter((u) => u.role === "admin").length || 0;
  const userCount = users?.filter((u) => u.role === "user").length || 0;

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container">
          <Link href="/admin" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4">
            {dir === "rtl" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {getText("backToDashboard")}
          </Link>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">{getText("title")}</h1>
              <p className="text-white/80">{getText("subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{getText("totalUsers")}</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{getText("admins")}</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{getText("regularUsers")}</p>
                <p className="text-2xl font-bold">{userCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {getText("title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{getText("name")}</TableHead>
                      <TableHead>{getText("email")}</TableHead>
                      <TableHead>{getText("role")}</TableHead>
                      <TableHead>{getText("lastLogin")}</TableHead>
                      <TableHead className="text-center">{getText("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const isOwner = user.openId === import.meta.env.VITE_OWNER_OPEN_ID;
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {user.name || "-"}
                              {isOwner && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{user.email || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.role === "admin" ? "default" : "secondary"}
                              className={user.role === "admin" ? "bg-green-600" : ""}
                            >
                              {user.role === "admin" ? getText("admin") : getText("user")}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.lastSignedIn)}</TableCell>
                          <TableCell className="text-center">
                            {isOwner ? (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                {getText("owner")}
                              </Badge>
                            ) : user.role === "admin" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRoleChange(user.id, user.name || user.email || "", user.role || "user", "user")}
                              >
                                <ShieldOff className="h-4 w-4 mr-1" />
                                {getText("demote")}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleRoleChange(user.id, user.name || user.email || "", user.role || "user", "admin")}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                {getText("promote")}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{getText("noUsers")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "promote" ? getText("promote") : getText("demote")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "promote" ? getText("confirmPromote") : getText("confirmDemote")}
              <br />
              <strong>{selectedUser?.name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{getText("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className={actionType === "demote" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {updateRoleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getText("confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
