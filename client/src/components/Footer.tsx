import { useLanguage } from "@/contexts/LanguageContext";
import { Truck, MapPin, Phone, Mail, Facebook } from "lucide-react";
import { Link } from "wouter";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo.webp" 
                alt="Sara Trucks" 
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex gap-4 pt-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61583334585705" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@sara.trucks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">
              {t.nav.services}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/trucks" className="hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                  {t.nav.trucks}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                  {t.nav.team}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">
              {t.nav.contact}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-1 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a href="tel:+393337198678" className="hover:text-secondary transition-colors" dir="ltr">
                  +39 333 719 8678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href="mailto:international@sara-trucks.com" className="hover:text-secondary transition-colors">
                  international@sara-trucks.com
                </a>
              </li>
            </ul>
          </div>

          {/* Map/Location */}
          <div className="rounded-lg overflow-hidden h-48 bg-white/5 border border-white/10 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3145.5!2d15.0685556!3d37.4301389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDI1JzQ4LjUiTiAxNcKwMDQnMDYuOCJF!5e0!3m2!1sen!2sit!4v1704974400000!5m2!1sen!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sara Trucks Location"
            ></iframe>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
