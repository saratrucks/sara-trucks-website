import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, MapPin, Briefcase, Phone, Mail, CheckCircle, Loader2 } from "lucide-react";


interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  age: string;
  workField: string;
  hasClientBase: string;
  clientBaseDetails: string;
  hasExperience: string;
  experienceYears: string;
  experienceDetails: string;
  hasVehicle: string;
  vehicleType: string;
  availableHours: string;
  languages: string[];
  motivation: string;
  expectedSalary: string;
  canTravel: string;
  hasNetwork: string;
  networkDetails: string;
}

export default function ApplyRepresentative() {
  const { t, dir } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    city: "",
    age: "",
    workField: "",
    hasClientBase: "",
    clientBaseDetails: "",
    hasExperience: "",
    experienceYears: "",
    experienceDetails: "",
    hasVehicle: "",
    vehicleType: "",
    availableHours: "",
    languages: [],
    motivation: "",
    expectedSalary: "",
    canTravel: "",
    hasNetwork: "",
    networkDetails: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In static mode, just show success after a brief delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleChange = (field: keyof ApplicationForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const countries = [
    { value: "uae", label: "🇦🇪 الإمارات العربية المتحدة", labelEn: "🇦🇪 UAE" },
    { value: "saudi", label: "🇸🇦 المملكة العربية السعودية", labelEn: "🇸🇦 Saudi Arabia" },
    { value: "syria", label: "🇸🇾 سوريا", labelEn: "🇸🇾 Syria" },
    { value: "iraq", label: "🇮🇶 العراق", labelEn: "🇮🇶 Iraq" },
  ];

  const workFields = [
    { value: "trucks_trade", label: "تجارة سيارات/شاحنات", labelEn: "Cars/Trucks Trade" },
    { value: "transport", label: "نقل وشحن", labelEn: "Transport & Shipping" },
    { value: "general_sales", label: "مبيعات عامة", labelEn: "General Sales" },
    { value: "freelance", label: "أعمال حرة", labelEn: "Freelance" },
    { value: "employee", label: "موظف", labelEn: "Employee" },
    { value: "other", label: "أخرى", labelEn: "Other" },
  ];

  const availableLanguages = [
    { value: "arabic", label: "العربية" },
    { value: "english", label: "English" },
    { value: "italian", label: "Italiano" },
    { value: "german", label: "Deutsch" },
    { value: "romanian", label: "Română" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4" dir={dir}>
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">
              {dir === "rtl" ? "تم إرسال طلبك بنجاح!" : "Application Submitted!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {dir === "rtl" 
                ? "شكراً لاهتمامك بالانضمام لفريقنا. سنتواصل معك قريباً."
                : "Thank you for your interest in joining our team. We will contact you soon."}
            </p>
            <Button onClick={() => window.location.href = "/"}>
              {dir === "rtl" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 px-4" dir={dir}>
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {dir === "rtl" ? "التقديم لوظيفة مندوب مبيعات" : "Sales Representative Application"}
          </h1>
          <p className="text-muted-foreground">
            {dir === "rtl" 
              ? "انضم لفريق سارا تراكس الدولية في منطقتك"
              : "Join International Sara Trucks team in your region"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {dir === "rtl" ? "المعلومات الشخصية" : "Personal Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{dir === "rtl" ? "الاسم الكامل *" : "Full Name *"}</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{dir === "rtl" ? "العمر *" : "Age *"}</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={form.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{dir === "rtl" ? "البريد الإلكتروني *" : "Email *"}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{dir === "rtl" ? "رقم الهاتف *" : "Phone Number *"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">{dir === "rtl" ? "رقم الواتساب *" : "WhatsApp Number *"}</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {dir === "rtl" ? "الموقع" : "Location"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{dir === "rtl" ? "الدولة *" : "Country *"}</Label>
                  <Select value={form.country} onValueChange={(v) => handleChange("country", v)} required>
                    <SelectTrigger>
                      <SelectValue placeholder={dir === "rtl" ? "اختر الدولة" : "Select Country"} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {dir === "rtl" ? c.label : c.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{dir === "rtl" ? "المدينة *" : "City *"}</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {dir === "rtl" ? "العمل والخبرة" : "Work & Experience"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{dir === "rtl" ? "مجال عملك الحالي *" : "Current Work Field *"}</Label>
                <Select value={form.workField} onValueChange={(v) => handleChange("workField", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder={dir === "rtl" ? "اختر المجال" : "Select Field"} />
                  </SelectTrigger>
                  <SelectContent>
                    {workFields.map((w) => (
                      <SelectItem key={w.value} value={w.value}>
                        {dir === "rtl" ? w.label : w.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>{dir === "rtl" ? "هل لديك قاعدة عملاء حالية؟ *" : "Do you have an existing client base? *"}</Label>
                <RadioGroup value={form.hasClientBase} onValueChange={(v) => handleChange("hasClientBase", v)} required>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="client-yes" />
                      <Label htmlFor="client-yes">{dir === "rtl" ? "نعم" : "Yes"}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="client-no" />
                      <Label htmlFor="client-no">{dir === "rtl" ? "لا" : "No"}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {form.hasClientBase === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="clientBaseDetails">
                    {dir === "rtl" ? "صف قاعدة عملائك (العدد التقريبي، النوع، المنطقة)" : "Describe your client base (approximate number, type, region)"}
                  </Label>
                  <Textarea
                    id="clientBaseDetails"
                    value={form.clientBaseDetails}
                    onChange={(e) => handleChange("clientBaseDetails", e.target.value)}
                    rows={3}
                    placeholder={dir === "rtl" ? "مثال: 50 عميل في مجال النقل في منطقة الخليج" : "Example: 50 clients in transport sector in Gulf region"}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>{dir === "rtl" ? "هل لديك خبرة في المبيعات؟ *" : "Do you have sales experience? *"}</Label>
                <RadioGroup value={form.hasExperience} onValueChange={(v) => handleChange("hasExperience", v)} required>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="exp-yes" />
                      <Label htmlFor="exp-yes">{dir === "rtl" ? "نعم" : "Yes"}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="exp-no" />
                      <Label htmlFor="exp-no">{dir === "rtl" ? "لا" : "No"}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {form.hasExperience === "yes" && (
                <>
                  <div className="space-y-2">
                    <Label>{dir === "rtl" ? "سنوات الخبرة" : "Years of Experience"}</Label>
                    <Select value={form.experienceYears} onValueChange={(v) => handleChange("experienceYears", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={dir === "rtl" ? "اختر" : "Select"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">{dir === "rtl" ? "1-2 سنة" : "1-2 years"}</SelectItem>
                        <SelectItem value="3-5">{dir === "rtl" ? "3-5 سنوات" : "3-5 years"}</SelectItem>
                        <SelectItem value="5-10">{dir === "rtl" ? "5-10 سنوات" : "5-10 years"}</SelectItem>
                        <SelectItem value="10+">{dir === "rtl" ? "أكثر من 10 سنوات" : "10+ years"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceDetails">
                      {dir === "rtl" ? "صف خبرتك السابقة في المبيعات" : "Describe your previous sales experience"}
                    </Label>
                    <Textarea
                      id="experienceDetails"
                      value={form.experienceDetails}
                      onChange={(e) => handleChange("experienceDetails", e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Label>{dir === "rtl" ? "هل لديك سيارة؟ *" : "Do you have a car? *"}</Label>
                <RadioGroup value={form.hasVehicle} onValueChange={(v) => handleChange("hasVehicle", v)} required>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="car-yes" />
                      <Label htmlFor="car-yes">{dir === "rtl" ? "نعم" : "Yes"}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="car-no" />
                      <Label htmlFor="car-no">{dir === "rtl" ? "لا" : "No"}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{dir === "rtl" ? "هل لديك شبكة علاقات في مجال الشاحنات والمعدات؟ *" : "Do you have a network in trucks/equipment industry? *"}</Label>
                <RadioGroup value={form.hasNetwork} onValueChange={(v) => handleChange("hasNetwork", v)} required>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="net-yes" />
                      <Label htmlFor="net-yes">{dir === "rtl" ? "نعم" : "Yes"}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="net-no" />
                      <Label htmlFor="net-no">{dir === "rtl" ? "لا" : "No"}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {form.hasNetwork === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="networkDetails">
                    {dir === "rtl" ? "صف شبكة علاقاتك" : "Describe your network"}
                  </Label>
                  <Textarea
                    id="networkDetails"
                    value={form.networkDetails}
                    onChange={(e) => handleChange("networkDetails", e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>{dir === "rtl" ? "اللغات والتوفر" : "Languages & Availability"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{dir === "rtl" ? "اللغات التي تتحدثها *" : "Languages you speak *"}</Label>
                <div className="flex flex-wrap gap-4">
                  {availableLanguages.map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={lang.value}
                        checked={form.languages.includes(lang.value)}
                        onCheckedChange={() => toggleLanguage(lang.value)}
                      />
                      <Label htmlFor={lang.value}>{lang.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{dir === "rtl" ? "ساعات العمل المتاحة أسبوعياً *" : "Available hours per week *"}</Label>
                <Select value={form.availableHours} onValueChange={(v) => handleChange("availableHours", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder={dir === "rtl" ? "اختر" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part-time">{dir === "rtl" ? "دوام جزئي (10-20 ساعة)" : "Part-time (10-20 hours)"}</SelectItem>
                    <SelectItem value="half-time">{dir === "rtl" ? "نصف دوام (20-30 ساعة)" : "Half-time (20-30 hours)"}</SelectItem>
                    <SelectItem value="full-time">{dir === "rtl" ? "دوام كامل (40+ ساعة)" : "Full-time (40+ hours)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>{dir === "rtl" ? "هل يمكنك السفر للقاء العملاء؟ *" : "Can you travel to meet clients? *"}</Label>
                <RadioGroup value={form.canTravel} onValueChange={(v) => handleChange("canTravel", v)} required>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="yes" id="travel-yes" />
                      <Label htmlFor="travel-yes">{dir === "rtl" ? "نعم" : "Yes"}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="no" id="travel-no" />
                      <Label htmlFor="travel-no">{dir === "rtl" ? "لا" : "No"}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card>
            <CardHeader>
              <CardTitle>{dir === "rtl" ? "الدافع والتوقعات" : "Motivation & Expectations"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">
                  {dir === "rtl" ? "لماذا تريد العمل معنا؟ *" : "Why do you want to work with us? *"}
                </Label>
                <Textarea
                  id="motivation"
                  value={form.motivation}
                  onChange={(e) => handleChange("motivation", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{dir === "rtl" ? "توقعات الراتب/العمولة الشهرية *" : "Expected monthly salary/commission *"}</Label>
                <Select value={form.expectedSalary} onValueChange={(v) => handleChange("expectedSalary", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder={dir === "rtl" ? "اختر" : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commission-only">{dir === "rtl" ? "عمولة فقط" : "Commission only"}</SelectItem>
                    <SelectItem value="500-1000">{dir === "rtl" ? "500-1000 دولار + عمولة" : "$500-1000 + commission"}</SelectItem>
                    <SelectItem value="1000-2000">{dir === "rtl" ? "1000-2000 دولار + عمولة" : "$1000-2000 + commission"}</SelectItem>
                    <SelectItem value="2000+">{dir === "rtl" ? "أكثر من 2000 دولار + عمولة" : "$2000+ + commission"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {dir === "rtl" ? "جاري الإرسال..." : "Submitting..."}
              </>
            ) : (
              dir === "rtl" ? "إرسال الطلب" : "Submit Application"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
