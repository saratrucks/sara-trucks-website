import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Car,
  Clock,
  Globe,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MessageCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  age: number;
  workField: string;
  hasClientBase: boolean | null;
  clientBaseDetails: string | null;
  hasExperience: boolean | null;
  experienceYears: string | null;
  experienceDetails: string | null;
  hasVehicle: boolean | null;
  vehicleType: string | null;
  availableHours: string;
  languages: string | null;
  motivation: string;
  expectedSalary: string;
  canTravel: boolean | null;
  hasNetwork: boolean | null;
  networkDetails: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  reviewed: "تمت المراجعة",
  contacted: "تم التواصل",
  accepted: "مقبول",
  rejected: "مرفوض",
};

const countryLabels: Record<string, string> = {
  uae: "🇦🇪 الإمارات",
  saudi: "🇸🇦 السعودية",
  syria: "🇸🇾 سوريا",
  iraq: "🇮🇶 العراق",
};

const workFieldLabels: Record<string, string> = {
  trucks_trade: "تجارة سيارات/شاحنات",
  transport: "نقل وشحن",
  general_sales: "مبيعات عامة",
  freelance: "أعمال حرة",
  employee: "موظف",
  other: "أخرى",
};

const hoursLabels: Record<string, string> = {
  "part-time": "دوام جزئي (10-20 ساعة)",
  "half-time": "نصف دوام (20-30 ساعة)",
  "full-time": "دوام كامل (40+ ساعة)",
};

const salaryLabels: Record<string, string> = {
  "commission-only": "عمولة فقط",
  "500-1000": "$500-1000 + عمولة",
  "1000-2000": "$1000-2000 + عمولة",
  "2000+": "$2000+ + عمولة",
};

export default function Applications() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: applications = [], isLoading } = trpc.representativeApplications.getAll.useQuery();

  const updateStatusMutation = trpc.representativeApplications.updateStatus.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["representativeApplications", "getAll"]] });
    },
  });

  const deleteMutation = trpc.representativeApplications.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["representativeApplications", "getAll"]] });
      setSelectedApplication(null);
    },
  });

  const filteredApplications = applications.filter((app: Application) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: number, status: "pending" | "reviewed" | "contacted" | "accepted" | "rejected") => {
    updateStatusMutation.mutate({ id, status, notes: adminNotes || undefined });
  };

  const parseLanguages = (languages: string): string[] => {
    try {
      return JSON.parse(languages);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">طلبات المندوبين</h1>
              <p className="text-muted-foreground">إدارة طلبات التوظيف للمندوبين</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {applications.length} طلب
          </Badge>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو البريد أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                  <SelectItem value="contacted">تم التواصل</SelectItem>
                  <SelectItem value="accepted">مقبول</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {["pending", "reviewed", "contacted", "accepted", "rejected"].map((status) => (
            <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
              <CardContent className="pt-4 pb-4 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
                  {statusLabels[status]}
                </div>
                <div className="text-2xl font-bold mt-2">
                  {applications.filter((a: Application) => a.status === status).length}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الدولة</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">الخبرة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app: Application) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.fullName}</div>
                        <div className="text-sm text-muted-foreground">{app.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{countryLabels[app.country] || app.country}</TableCell>
                    <TableCell dir="ltr" className="text-right">{app.phone}</TableCell>
                    <TableCell>
                      {app.hasExperience ? (
                        <Badge variant="secondary">{app.experienceYears || "نعم"}</Badge>
                      ) : (
                        <span className="text-muted-foreground">لا</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[app.status]}>
                        {statusLabels[app.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString("ar-SA")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedApplication(app);
                            setAdminNotes(app.notes || "");
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`https://wa.me/${app.whatsapp}`, "_blank")}
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {selectedApplication.fullName}
                  </DialogTitle>
                  <DialogDescription>
                    تقدم بتاريخ {new Date(selectedApplication.createdAt).toLocaleDateString("ar-SA")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span dir="ltr">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{countryLabels[selectedApplication.country]} - {selectedApplication.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedApplication.age} سنة</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">مجال العمل</div>
                      <div className="font-medium">{workFieldLabels[selectedApplication.workField]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">قاعدة عملاء</div>
                      <div className="font-medium">{selectedApplication.hasClientBase ? "نعم" : "لا"}</div>
                    </div>
                    {selectedApplication.clientBaseDetails && (
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">تفاصيل قاعدة العملاء</div>
                        <div className="font-medium">{selectedApplication.clientBaseDetails}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">ساعات العمل</div>
                      <div className="font-medium">{hoursLabels[selectedApplication.availableHours]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">توقعات الراتب</div>
                      <div className="font-medium">{salaryLabels[selectedApplication.expectedSalary]}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">اللغات</div>
                      <div className="font-medium">{parseLanguages(selectedApplication.languages || "").join(", ")}</div>
                    </div>
                  </div>

                  {/* Experience & Network */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>خبرة مبيعات:</span>
                        {selectedApplication.hasExperience ? (
                          <Badge variant="secondary">{selectedApplication.experienceYears}</Badge>
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        <span>سيارة:</span>
                        {selectedApplication.hasVehicle ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>شبكة علاقات:</span>
                        {selectedApplication.hasNetwork ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>يمكنه السفر:</span>
                        {selectedApplication.canTravel ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    {selectedApplication.experienceDetails && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium mb-1">تفاصيل الخبرة:</div>
                        <div className="text-sm">{selectedApplication.experienceDetails}</div>
                      </div>
                    )}

                    {selectedApplication.networkDetails && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm font-medium mb-1">تفاصيل شبكة العلاقات:</div>
                        <div className="text-sm">{selectedApplication.networkDetails}</div>
                      </div>
                    )}
                  </div>

                  {/* Motivation */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      لماذا يريد العمل معنا:
                    </div>
                    <div className="text-sm">{selectedApplication.motivation}</div>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ملاحظات الإدارة:</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="أضف ملاحظاتك هنا..."
                      rows={3}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Select
                      value={selectedApplication.status}
                      onValueChange={(status) => handleStatusChange(selectedApplication.id, status as "pending" | "reviewed" | "contacted" | "accepted" | "rejected")}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                        <SelectItem value="contacted">تم التواصل</SelectItem>
                        <SelectItem value="accepted">مقبول</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://wa.me/${selectedApplication.whatsapp}`, "_blank")}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      تواصل عبر واتساب
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => window.open(`mailto:${selectedApplication.email}`, "_blank")}
                    >
                      <Mail className="w-4 h-4 ml-2" />
                      إرسال بريد
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
                          deleteMutation.mutate({ id: selectedApplication.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
