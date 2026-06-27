import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Ship, ShieldCheck, Truck, Star, Users, MessageCircle, Award, Languages, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t, dir } = useLanguage();

  return (
    <>
      <SEO />
      <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/hero-combined.webp" type="image/webp" />
            <img 
              src="/hero-combined.jpg" 
              alt="Sara Trucks Fleet" 
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container h-full flex flex-col justify-center text-white">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Badge className="bg-secondary hover:bg-secondary/90 text-white border-none px-4 py-1 text-lg mb-4 w-fit">
              Since 2000
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight font-cairo">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed">
              {t.hero.subtitle}
            </p>

          </div>
        </div>

        {/* Decorative Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-background" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover" loading="lazy" />
        </div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{t.features.quality}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.features.quality_desc}
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm transform md:-translate-y-8">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <Ship className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary">{t.features.shipping}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.features.shipping_desc}
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Users className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{t.features.support}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.features.support_desc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/pattern-bg.webp" alt="pattern" className="w-full h-full object-cover mix-blend-overlay" loading="lazy" />
        </div>
        <div className="container relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold font-cairo">
            {t.hero.cta}
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t.features.quality_desc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/trucks" className="inline-block">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-4 border-white/10">
                {t.nav.trucks}
              </Button>
            </Link>
            <Link href="/trailers" className="inline-block">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-4 border-white/10">
                {t.nav.trailers}
              </Button>
            </Link>
            <Link href="/equipment" className="inline-block">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-4 border-white/10">
                {t.nav.equipment}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
