import { Link } from "wouter";
import { Pencil, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/contexts/AdminSessionContext";
import { useLanguage } from "@/contexts/LanguageContext";

export type EditableCatalog = "trucks" | "trailers" | "equipment";

function labels(language: string) {
  if (language === "ar") return { edit: "تعديل", add: "إضافة منتج", manage: "إدارة المحتوى" };
  if (language === "it") return { edit: "Modifica", add: "Aggiungi", manage: "Gestisci contenuti" };
  if (language === "de") return { edit: "Bearbeiten", add: "Hinzufügen", manage: "Inhalte verwalten" };
  if (language === "ro") return { edit: "Editează", add: "Adaugă", manage: "Administrare" };
  return { edit: "Edit", add: "Add item", manage: "Manage content" };
}

export function AdminCatalogActions({ catalog }: { catalog: EditableCatalog }) {
  const { isAdmin } = useAdminSession();
  const { language } = useLanguage();
  if (!isAdmin) return null;
  const text = labels(language);

  return (
    <div className="mt-5 flex flex-wrap gap-3" data-admin-only="true">
      <Button asChild className="rounded-full bg-secondary text-white hover:bg-secondary/90">
        <Link href={`/admin?catalog=${catalog}&new=1`}>
          <Plus className="h-4 w-4" />
          {text.add}
        </Link>
      </Button>
      <Button asChild variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary">
        <Link href={`/admin?catalog=${catalog}`}>
          <ShieldCheck className="h-4 w-4" />
          {text.manage}
        </Link>
      </Button>
    </div>
  );
}

export function AdminItemEditButton({ catalog, id }: { catalog: EditableCatalog; id: number }) {
  const { isAdmin } = useAdminSession();
  const { language } = useLanguage();
  if (!isAdmin) return null;

  return (
    <Button
      asChild
      size="sm"
      className="rounded-full bg-secondary text-white shadow-lg hover:bg-secondary/90"
      data-admin-only="true"
    >
      <Link href={`/admin?catalog=${catalog}&id=${id}`}>
        <Pencil className="h-4 w-4" />
        {labels(language).edit}
      </Link>
    </Button>
  );
}
