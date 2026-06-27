import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Menu, X, Truck, Phone, Users, Info, Home as HomeIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { t, dir, language } = useLanguage();
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home, icon: HomeIcon },
    { href: "/trucks", label: t.nav.trucks, icon: Truck },
    { href: "/trailers", label: t.nav.trailers, icon: Truck },
    { href: "/equipment", label: t.nav.equipment, icon: Truck },
    { href: "/services", label: t.nav.services, icon: Info },
    { href: "/team", label: t.nav.team, icon: Users },
  ];

  const handleContactClick = () => {
    setLocation("/contact");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <picture>
            <source srcSet="https://files.manuscdn.com/user_upload_by_module/session_file/310519663290157842/ZvRmwEzhldLcRbZc.webp" type="image/webp" />
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663290157842/kRxyEhaWdTZBYlwA.png" 
              alt="Sara Trucks" 
              className="h-14 w-auto object-contain"
            />
          </picture>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2
                ${location === item.href ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <Button 
            onClick={handleContactClick}
            className="hidden md:flex bg-secondary hover:bg-primary text-white font-bold shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Phone className="mr-2 h-4 w-4" />
            {t.nav.contact}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-8 mt-8">
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary flex items-center gap-3 p-2 rounded-md hover:bg-muted
                        ${location === item.href ? "text-primary bg-primary/10" : "text-foreground"}`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    handleContactClick();
                  }}
                  className="w-full bg-secondary hover:bg-primary text-white font-bold"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {t.nav.contact}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
