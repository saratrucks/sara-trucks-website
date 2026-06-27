import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageCircle, CheckCircle2, Ship, ShieldCheck, Star, Users, Building2, MapPin } from "lucide-react";

export default function Team() {
  const { t, dir, language } = useLanguage();

  const teamMembers = [
    {
      nameAr: "خالد الحلاق",
      nameEn: "Khalid Hallak",
      nameIt: "Khalid Hallak",
      nameDe: "Khalid Hallak",
      role: t.team_page.roles.ceo,
      location: "Sicily",
      locationAr: "صقلية",
      branch: "Catania",
      branchAr: "كاتانيا",
      initialsAr: "خ",
      initialsEn: "K",
      contact: "+39 333 719 8678",
      whatsapp: "393337198678",
      color: "from-primary to-primary/80",
      imageUrl: "/IMG_9953.webp"
    },
    {
      nameAr: "مصطفى الحلاق",
      nameEn: "Mustafa Hallak",
      nameIt: "Mustafa Hallak",
      nameDe: "Mustafa Hallak",
      role: t.team_page.roles.manager_sardinia,
      location: "Sardinia",
      locationAr: "سردينيا",
      branch: "Cagliari",
      branchAr: "كالياري",
      initialsAr: "م",
      initialsEn: "M",
      contact: "+39 331 477 5984",
      whatsapp: "393314775984",
      color: "from-green-600 to-green-500",
      imageUrl: "/IMG_9901.webp"
    },
    {
      nameAr: "ألكسندرا مونتيان",
      nameEn: "Alexandra Muntean",
      nameIt: "Alexandra Muntean",
      nameDe: "Alexandra Muntean",
      role: t.team_page.roles.office_manager,
      location: "Sicily",
      locationAr: "صقلية",
      branch: "Catania",
      branchAr: "كاتانيا",
      initialsAr: "أ",
      initialsEn: "A",
      contact: "+39 331 797 7776",
      whatsapp: "393317977776",
      color: "from-purple-600 to-purple-500",
      imageUrl: "/IMG_9969.webp"
    },
    {
      nameAr: "هديل مليكي",
      nameEn: "Hadil Mliki",
      nameIt: "Hadil Mliki",
      nameDe: "Hadil Mliki",
      role: t.team_page.roles.logistics,
      location: "Sicily",
      locationAr: "صقلية",
      branch: "Catania",
      branchAr: "كاتانيا",
      initialsAr: "هـ",
      initialsEn: "H",
      contact: "+39 379 325 0870",
      whatsapp: "393793250870",
      color: "from-amber-600 to-amber-500",
      imageUrl: "/IMG_9978.webp"
    },
    {
      nameAr: "آدم",
      nameEn: "Adam",
      nameIt: "Adam",
      nameDe: "Adam",
      role: t.team_page.roles.mechanic,
      location: "Sicily",
      locationAr: "صقلية",
      branch: "Catania",
      branchAr: "كاتانيا",
      initialsAr: "آ",
      initialsEn: "A",
      contact: null,
      whatsapp: null,
      color: "from-slate-600 to-slate-500",
      imageUrl: "/IMG_9986.webp"
    }
  ];

  // Get name based on current language
  const getName = (member: typeof teamMembers[0]) => {
    switch (language) {
      case 'ar':
        return member.nameAr;
      case 'it':
        return member.nameIt;
      case 'de':
        return member.nameDe;
      default:
        return member.nameEn;
    }
  };

  // Get initials based on current language
  const getInitials = (member: typeof teamMembers[0]) => {
    return language === 'ar' ? member.initialsAr : member.initialsEn;
  };

  // Get secondary name (show Arabic name for non-Arabic, show English for Arabic)
  const getSecondaryName = (member: typeof teamMembers[0]) => {
    return language === 'ar' ? member.nameEn : member.nameAr;
  };

  // About section content
  const aboutContent = {
    ar: {
      title: "من نحن",
      subtitle: "شركة سارا تراكس الدولية",
      desc: "على مدى أكثر من عشرين عاماً، تميزت شركة سارا تراكس في مجال بيع الشاحنات المستعملة في إيطاليا. تأسسنا على أسس من الثقة والجودة والاحترافية، ونلتزم بفحص كل شاحنة بدقة قبل عرضها للبيع.",
      features: [
        "Volvo, Scania, Mercedes",
        "تصدير عالمي",
        "خدمة احترافية",
        "منذ عام 2000"
      ]
    },
    en: {
      title: "About Us",
      subtitle: "International Sara Trucks SRL",
      desc: "For over twenty years, Sara Trucks has excelled in selling used trucks in Italy. We were founded on the principles of trust, quality, and professionalism, and we are committed to thoroughly inspecting every truck before offering it for sale.",
      features: [
        "Volvo, Scania, Mercedes",
        "Export Worldwide",
        "Professional Service",
        "Since 2000"
      ]
    },
    it: {
      title: "Chi Siamo",
      subtitle: "International Sara Trucks SRL",
      desc: "Da oltre vent'anni, Sara Trucks eccelle nella vendita di camion usati in Italia. Siamo stati fondati sui principi di fiducia, qualità e professionalità, e ci impegniamo a ispezionare accuratamente ogni camion prima di metterlo in vendita.",
      features: [
        "Volvo, Scania, Mercedes",
        "Esportazione Mondiale",
        "Servizio Professionale",
        "Dal 2000"
      ]
    },
    de: {
      title: "Über Uns",
      subtitle: "International Sara Trucks SRL",
      desc: "Seit über zwanzig Jahren zeichnet sich Sara Trucks im Verkauf von Gebraucht-LKWs in Italien aus. Wir wurden auf den Prinzipien von Vertrauen, Qualität und Professionalität gegründet und verpflichten uns, jeden LKW vor dem Verkauf gründlich zu inspizieren.",
      features: [
        "Volvo, Scania, Mercedes",
        "Weltweiter Export",
        "Professioneller Service",
        "Seit 2000"
      ]
    },
    ro: {
      title: "Despre Noi",
      subtitle: "International Sara Trucks SRL",
      desc: "De peste douăzeci de ani, Sara Trucks excelează în vânzarea de camioane second-hand în Italia. Am fost fondați pe principiile încrederii, calității și profesionalismului, și ne angajăm să inspectăm temeinic fiecare camion înainte de a-l oferi spre vânzare.",
      features: [
        "Volvo, Scania, Mercedes",
        "Export Mondial",
        "Serviciu Profesional",
        "Din 2000"
      ]
    }
  };

  const currentAbout = aboutContent[language as keyof typeof aboutContent] || aboutContent.en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="container relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-cairo">{t.team_page.title}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t.team_page.subtitle}
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="/team-office-hq.webp" 
                  alt="Sara Trucks Team" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary rounded-full opacity-20 blur-2xl"></div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-wider">
                <span className="w-12 h-1 bg-secondary rounded-full"></span>
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary font-cairo leading-tight">
                {currentAbout.title}
              </h2>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {currentAbout.subtitle}
              </p>
              <p className="text-lg text-muted-foreground leading-loose">
                {currentAbout.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-medium">{currentAbout.features[0]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ship className="h-6 w-6 text-secondary flex-shrink-0" />
                  <span className="font-medium">{currentAbout.features[1]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="font-medium">{currentAbout.features[2]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-secondary flex-shrink-0" />
                  <span className="font-medium">{currentAbout.features[3]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-secondary font-bold uppercase tracking-wider mb-4">
            <span className="w-12 h-1 bg-secondary rounded-full"></span>
            <Users className="h-5 w-5" />
            <span className="w-12 h-1 bg-secondary rounded-full"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-cairo mb-4">
            {language === 'ar' ? 'فريق العمل' : language === 'it' ? 'Il Nostro Team' : language === 'de' ? 'Unser Team' : 'Our Team'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' ? 'فريق متخصص بخبرة تتجاوز 25 عاماً في مجال الشاحنات والمعدات الثقيلة' : language === 'it' ? 'Un team specializzato con oltre 25 anni di esperienza in camion e attrezzature pesanti' : language === 'de' ? 'Ein spezialisiertes Team mit über 25 Jahren Erfahrung in Lastkraftwagen und Baumaschinen' : 'A specialized team with over 25 years of experience in trucks and heavy equipment'}
          </p>
        </div>

        <div className="space-y-8">
          {/* First Row: Khalid and Mustafa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.slice(0, 2).map((member, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-80 overflow-hidden bg-white flex items-center justify-center">
                {/* Avatar with image */}
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={getName(member)}
                    className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {getInitials(member)}
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {language === 'ar' ? member.branchAr : member.branch}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-2xl font-bold text-primary">{getName(member)}</h3>
                <p className="text-sm text-muted-foreground/70" dir={language === 'ar' ? 'ltr' : 'rtl'}>
                  {getSecondaryName(member)}
                </p>
                <p className="text-muted-foreground font-medium">{member.role}</p>
                
                {member.contact && (
                  <div className="pt-4 border-t border-border mt-4 space-y-3">
                    <a 
                      href={`tel:${member.contact.replace(/\s/g, '')}`} 
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      <Phone className="h-4 w-4" />
                      {member.contact}
                    </a>
                    {member.whatsapp && (
                      <a 
                        href={`https://wa.me/${member.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                )}
                
                {!member.contact && (
                  <div className="pt-4 border-t border-border mt-4">
                    <a 
                      href="mailto:international@sara-trucks.com" 
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      international@sara-trucks.com
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
          
          {/* Second Row: Alexandra, Hadil, Adam */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.slice(2).map((member, index) => (
            <Card key={index + 2} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-80 overflow-hidden bg-white flex items-center justify-center">
                {/* Avatar with image */}
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={getName(member)}
                    className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {getInitials(member)}
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {language === 'ar' ? member.branchAr : member.branch}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-2xl font-bold text-primary">{getName(member)}</h3>
                <p className="text-sm text-muted-foreground/70" dir={language === 'ar' ? 'ltr' : 'rtl'}>
                  {getSecondaryName(member)}
                </p>
                <p className="text-muted-foreground font-medium">{member.role}</p>
                
                {member.contact && (
                  <div className="pt-4 border-t border-border mt-4 space-y-3">
                    <a 
                      href={`tel:${member.contact.replace(/\s/g, '')}`} 
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      <Phone className="h-4 w-4" />
                      {member.contact}
                    </a>
                    {member.whatsapp && (
                      <a 
                        href={`https://wa.me/${member.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                )}
                
                {!member.contact && (
                  <div className="pt-4 border-t border-border mt-4">
                    <a 
                      href="mailto:international@sara-trucks.com" 
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      international@sara-trucks.com
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-cairo">
            {dir === 'rtl' ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {dir === 'rtl' ? 'فريقنا جاهز لمساعدتك في اختيار الشاحنة المناسبة' : 'Our team is ready to help you choose the right truck'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:international@sara-trucks.com"
              className="flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              <Mail className="h-5 w-5" />
              international@sara-trucks.com
            </a>
            <a 
              href="https://wa.me/393337198678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
