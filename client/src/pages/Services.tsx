import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Globe2, Wrench, Truck, FileCheck, Clock, Ship, FileText, Scale, MapPin, Anchor, MessageCircle, Video, Settings, CreditCard, Headphones } from "lucide-react";

export default function Services() {
  const { t, dir } = useLanguage();

  const services = [
    {
      icon: ShieldCheck,
      title: t.services.technical_inspection,
      desc: t.services.technical_inspection_desc,
      image: "/images/service-inspection.webp"
    },
    {
      icon: Video,
      title: t.services.video_tour,
      desc: t.services.video_tour_desc,
      image: "/images/service-video-tour.webp"
    },
    {
      icon: FileText,
      title: t.services.export_docs,
      desc: t.services.export_docs_desc,
      image: "/images/service-export-docs.webp"
    },
    {
      icon: Settings,
      title: t.services.spare_parts,
      desc: t.services.spare_parts_desc,
      image: "/images/service-spare-parts.webp"
    },
    {
      icon: Headphones,
      title: t.services.remote_support,
      desc: t.services.remote_support_desc,
      image: "/images/service-remote-support.webp"
    },
    {
      icon: CreditCard,
      title: t.services.payment_plans,
      desc: t.services.payment_plans_desc,
      image: "/images/service-payment.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="container relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-cairo">{t.nav.services}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t.export_consultation.subtitle}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                  <service.icon className="h-16 w-16 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100" />
                </div>
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Consultation Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-secondary font-bold uppercase tracking-wider mb-4">
              <span className="w-12 h-1 bg-secondary rounded-full"></span>
              <Ship className="h-5 w-5" />
              <span className="w-12 h-1 bg-secondary rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary font-cairo mb-4">
              {t.export_consultation.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.export_consultation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Export Laws */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">{t.export_consultation.laws_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t.export_consultation.laws_desc}
                </p>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">{t.export_consultation.documents_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t.export_consultation.documents_desc}</p>
                <ul className="space-y-2">
                  {t.export_consultation.documents_list.map((doc: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <FileCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Italian Ports */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-wider mb-4">
                <Anchor className="h-5 w-5" />
              </div>
              <h3 className="text-3xl font-bold text-primary font-cairo mb-2">
                {t.export_consultation.ports_title}
              </h3>
              <p className="text-muted-foreground">{t.export_consultation.ports_desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.export_consultation.ports.map((port: { name: string; desc: string }, index: number) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary to-primary/90 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{port.name}</h4>
                        <p className="text-white/80 text-sm">{port.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shipping Destinations */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-primary font-cairo mb-2">
                {t.export_consultation.destinations_title}
              </h3>
              <p className="text-muted-foreground">{t.export_consultation.destinations_desc}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {t.export_consultation.destinations.map((dest: string, index: number) => (
                <span 
                  key={index} 
                  className="px-6 py-3 bg-secondary/10 text-secondary font-semibold rounded-full text-lg hover:bg-secondary hover:text-white transition-colors cursor-default"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-secondary to-secondary/90 text-white max-w-3xl mx-auto">
              <CardContent className="p-10 space-y-6">
                <Ship className="h-16 w-16 mx-auto opacity-80" />
                <h3 className="text-3xl font-bold">{t.export_consultation.title}</h3>
                <p className="text-white/80 text-lg">
                  {t.export_consultation.desc}
                </p>
                <div className="flex flex-col gap-6">
                  {/* Khalid Hallak */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <span className="text-white font-semibold text-lg">Khaled Hallak</span>
                    <div className="flex gap-3">
                      <a href="https://wa.me/393337198678" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-base py-4 px-6 h-auto rounded-full shadow-lg">
                          <MessageCircle className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                          WhatsApp
                        </Button>
                      </a>
                      <a href="tel:+393337198678">
                        <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-secondary text-base py-4 px-6 h-auto rounded-full">
                          +39 333 719 8678
                        </Button>
                      </a>
                    </div>
                  </div>
                  {/* Mustafa Hallak */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <span className="text-white font-semibold text-lg">Mustafa Hallak</span>
                    <div className="flex gap-3">
                      <a href="https://wa.me/393314775984" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-base py-4 px-6 h-auto rounded-full shadow-lg">
                          <MessageCircle className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                          WhatsApp
                        </Button>
                      </a>
                      <a href="tel:+393314775984">
                        <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-secondary text-base py-4 px-6 h-auto rounded-full">
                          +39 331 477 5984
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
