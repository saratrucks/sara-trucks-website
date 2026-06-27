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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Truck,
  Image,
  Settings,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function ActivityLogs() {
  const { language, dir } = useLanguage();
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, refetch } = trpc.activityLogs.list.useQuery({
    limit,
    offset,
  });

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ar: "سجل الأنشطة",
        it: "Registro Attività",
        de: "Aktivitätsprotokoll",
        en: "Activity Log",
      },
      subtitle: {
        ar: "تتبع جميع الإجراءات التي يقوم بها المسؤولون",
        it: "Traccia tutte le azioni degli amministratori",
        de: "Verfolgen Sie alle Administratoraktionen",
        en: "Track all administrator actions",
      },
      user: {
        ar: "المستخدم",
        it: "Utente",
        de: "Benutzer",
        en: "User",
      },
      action: {
        ar: "الإجراء",
        it: "Azione",
        de: "Aktion",
        en: "Action",
      },
      entity: {
        ar: "العنصر",
        it: "Elemento",
        de: "Element",
        en: "Entity",
      },
      details: {
        ar: "التفاصيل",
        it: "Dettagli",
        de: "Details",
        en: "Details",
      },
      date: {
        ar: "التاريخ",
        it: "Data",
        de: "Datum",
        en: "Date",
      },
      backToDashboard: {
        ar: "العودة للوحة التحكم",
        it: "Torna alla Dashboard",
        de: "Zurück zum Dashboard",
        en: "Back to Dashboard",
      },
      noLogs: {
        ar: "لا توجد أنشطة مسجلة بعد",
        it: "Nessuna attività registrata ancora",
        de: "Noch keine Aktivitäten aufgezeichnet",
        en: "No activities recorded yet",
      },
      refresh: {
        ar: "تحديث",
        it: "Aggiorna",
        de: "Aktualisieren",
        en: "Refresh",
      },
      showing: {
        ar: "عرض",
        it: "Mostrando",
        de: "Zeige",
        en: "Showing",
      },
      of: {
        ar: "من",
        it: "di",
        de: "von",
        en: "of",
      },
      previous: {
        ar: "السابق",
        it: "Precedente",
        de: "Vorherige",
        en: "Previous",
      },
      next: {
        ar: "التالي",
        it: "Successivo",
        de: "Nächste",
        en: "Next",
      },
      perPage: {
        ar: "لكل صفحة",
        it: "per pagina",
        de: "pro Seite",
        en: "per page",
      },
      totalActivities: {
        ar: "إجمالي الأنشطة",
        it: "Attività Totali",
        de: "Gesamtaktivitäten",
        en: "Total Activities",
      },
      // Actions
      create: {
        ar: "إنشاء",
        it: "Creazione",
        de: "Erstellen",
        en: "Create",
      },
      update: {
        ar: "تحديث",
        it: "Aggiornamento",
        de: "Aktualisieren",
        en: "Update",
      },
      delete: {
        ar: "حذف",
        it: "Eliminazione",
        de: "Löschen",
        en: "Delete",
      },
      role_change: {
        ar: "تغيير صلاحية",
        it: "Cambio Ruolo",
        de: "Rollenänderung",
        en: "Role Change",
      },
      status_change: {
        ar: "تغيير حالة",
        it: "Cambio Stato",
        de: "Statusänderung",
        en: "Status Change",
      },
      login: {
        ar: "تسجيل دخول",
        it: "Accesso",
        de: "Anmeldung",
        en: "Login",
      },
      logout: {
        ar: "تسجيل خروج",
        it: "Disconnessione",
        de: "Abmeldung",
        en: "Logout",
      },
      // Entity types
      truck: {
        ar: "شاحنة",
        it: "Camion",
        de: "LKW",
        en: "Truck",
      },
      userEntity: {
        ar: "مستخدم",
        it: "Utente",
        de: "Benutzer",
        en: "User",
      },
      image: {
        ar: "صورة",
        it: "Immagine",
        de: "Bild",
        en: "Image",
      },
      system: {
        ar: "النظام",
        it: "Sistema",
        de: "System",
        en: "System",
      },
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-4 w-4" />;
      case "update":
        return <Pencil className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
      case "role_change":
        return <Shield className="h-4 w-4" />;
      case "status_change":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      case "delete":
        return "bg-red-500";
      case "role_change":
        return "bg-purple-500";
      case "status_change":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "truck":
        return <Truck className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString(
      language === "ar" ? "ar-SA" : language === "it" ? "it-IT" : language === "de" ? "de-DE" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  const formatDetails = (details: string | null) => {
    if (!details) return "-";
    try {
      const parsed = JSON.parse(details);
      if (parsed.oldStatus && parsed.newStatus) {
        return `${parsed.oldStatus} → ${parsed.newStatus}`;
      }
      if (parsed.oldRole && parsed.newRole) {
        return `${parsed.oldRole} → ${parsed.newRole}`;
      }
      if (parsed.brand && parsed.model) {
        return `${parsed.brand} ${parsed.model}`;
      }
      return JSON.stringify(parsed).slice(0, 50) + "...";
    } catch {
      return details.slice(0, 50);
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const currentPage = Math.floor(offset / limit) + 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={dir}>
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container">
          <Link href="/admin" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4">
            {dir === "rtl" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {getText("backToDashboard")}
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{getText("title")}</h1>
                <p className="text-white/80">{getText("subtitle")}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {getText("refresh")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{getText("totalActivities")}</p>
              <p className="text-2xl font-bold">{data?.total || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {getText("title")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{getText("perPage")}:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(parseInt(value));
                    setOffset(0);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data?.logs && data.logs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{getText("date")}</TableHead>
                        <TableHead>{getText("user")}</TableHead>
                        <TableHead>{getText("action")}</TableHead>
                        <TableHead>{getText("entity")}</TableHead>
                        <TableHead>{getText("details")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{log.userName || `User #${log.userId}`}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getActionColor(log.action)} gap-1`}>
                              {getActionIcon(log.action)}
                              {getText(log.action)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEntityIcon(log.entityType)}
                              <span>{log.entityName || getText(log.entityType === "user" ? "userEntity" : log.entityType)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {formatDetails(log.details)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {getText("showing")} {offset + 1}-{Math.min(offset + limit, data.total)} {getText("of")} {data.total}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOffset(Math.max(0, offset - limit))}
                        disabled={offset === 0}
                      >
                        {dir === "rtl" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        {getText("previous")}
                      </Button>
                      <span className="text-sm">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOffset(offset + limit)}
                        disabled={offset + limit >= data.total}
                      >
                        {getText("next")}
                        {dir === "rtl" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{getText("noLogs")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
