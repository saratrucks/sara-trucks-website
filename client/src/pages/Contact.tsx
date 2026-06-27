import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, User, Building2 } from "lucide-react";

export default function Contact() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="container relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-cairo">{t.contact_page.title}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t.contact_page.subtitle}
          </p>
        </div>
      </div>

      <div className="container py-20">
        {/* Main Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Main Branch - Catania */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary font-cairo">
                  {dir === 'rtl' ? 'الفرع الرئيسي - كاتانيا' : 'Main Branch - Catania'}
                </h2>
                <p className="text-muted-foreground text-sm">Sara Trucks SRL</p>
              </div>
            </div>

            {/* Manager Info - Khaled Hallak */}
            <Card className="border-none shadow-lg bg-secondary/10 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">
                      {dir === 'rtl' ? 'خالد الحلاق' : 'Khaled Hallak'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dir === 'rtl' ? 'المسؤول' : 'Manager'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-lg bg-primary/5 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">{dir === 'rtl' ? 'الهاتف' : 'Phone'}</h3>
                  <a href="tel:+393337198678" className="text-muted-foreground hover:text-primary transition-colors font-medium" dir="ltr">
                    +39 333 719 8678
                  </a>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-primary/5 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">{dir === 'rtl' ? 'العنوان' : 'Location'}</h3>
                  <a 
                    href="https://maps.google.com/?q=37.430618,15.065564" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm underline decoration-dotted"
                  >
                    {t.footer.address}
                  </a>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Second Branch - Cagliari */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary font-cairo">
                  {dir === 'rtl' ? 'الفرع الثاني - كالياري' : 'Second Branch - Cagliari'}
                </h2>
                <p className="text-muted-foreground text-sm">Elmas, Sardinia</p>
              </div>
            </div>

            {/* Branch Manager - Mustafa Hallak */}
            <Card className="border-none shadow-lg bg-green-600/10 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary">
                      {dir === 'rtl' ? 'مصطفى الحلاق' : 'Mustafa Hallak'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {dir === 'rtl' ? 'مدير الفرع' : 'Branch Manager'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-lg bg-green-600/10 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">{dir === 'rtl' ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}</h3>
                  <a href="tel:+393314775984" className="text-muted-foreground hover:text-green-600 transition-colors font-medium" dir="ltr">
                    +39 331 477 5984
                  </a>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-600/10 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">{dir === 'rtl' ? 'العنوان' : 'Address'}</h3>
                  <a 
                    href="https://maps.google.com/?q=Via+Ottaviano+Augusto+102,+Elmas,+Cagliari,+Italy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-green-600 transition-colors text-sm underline decoration-dotted"
                  >
                    Via Ottaviano Augusto, 102<br />
                    Elmas, Cagliari<br />
                    Sardinia, Italy
                  </a>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

        {/* Unified Email Card */}
        <Card className="border-none shadow-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:shadow-2xl transition-shadow mb-8">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center">
              <Mail className="h-8 w-8" />
            </div>
            <div className="text-center md:text-start">
              <h3 className="font-bold text-xl text-primary mb-2">
                {dir === 'rtl' ? 'البريد الإلكتروني الموحد للفرعين' : 'Unified Email for Both Branches'}
              </h3>
              <a href="mailto:international@sara-trucks.com" className="text-lg text-muted-foreground hover:text-primary transition-colors font-medium">
                international@sara-trucks.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp CTA */}
        <div className="text-center bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 font-cairo">
            {dir === 'rtl' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'}
          </h3>
          <p className="mb-6 text-white/90">
            {dir === 'rtl' ? 'للحصول على رد سريع، تواصل معنا مباشرة عبر واتساب' : 'For a quick response, contact us directly via WhatsApp'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/393337198678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {dir === 'rtl' ? 'الفرع الرئيسي - خالد الحلاق' : 'Main Branch - Khaled Hallak'}
            </a>
            <a
              href="https://wa.me/393314775984"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {dir === 'rtl' ? 'فرع كالياري - مصطفى الحلاق' : 'Cagliari Branch - Mustafa Hallak'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
