"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Star,
  Target,
  User,
  Users,
  X,
} from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { SellerUser } from "@/services/seller-auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  soon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", href: "/vendedor", icon: LayoutDashboard },
  { label: "Mis ventas", href: "/vendedor/ventas", icon: ShoppingCart, soon: true },
  { label: "Comisiones", href: "/vendedor/comisiones", icon: BarChart3, soon: true },
  { label: "Catálogo", href: "/vendedor/catalogo", icon: BookOpen, soon: true },
  { label: "Clientes", href: "/vendedor/clientes", icon: Users, soon: true },
  { label: "Metas", href: "/vendedor/metas", icon: Target, soon: true },
  { label: "Material de venta", href: "/vendedor/material", icon: Star, soon: true },
  { label: "Perfil", href: "/vendedor/perfil", icon: User, soon: true },
  { label: "Soporte", href: "/vendedor/soporte", icon: Headphones, soon: true },
];

function SidebarNav({
  user,
  pathname,
  onLogout,
  onClose,
}: {
  user: SellerUser;
  pathname: string;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const displayName = user.profile
    ? `${user.profile.firstName ?? ""} ${user.profile.lastName ?? ""}`.trim() || user.username
    : user.username;

  return (
    <div className="flex flex-col h-full bg-[#4B1677] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
        <Link href="/vendedor" onClick={onClose} className="relative block h-8 w-24">
          <Image
            src={brandAssets.logoFull}
            alt="BARAKA"
            fill
            className="object-contain object-left brightness-0 invert"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-sm font-semibold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            {user.sellerCode && (
              <p className="text-xs text-white/50">Código {user.sellerCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/vendedor" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              onClick={!item.soon ? onClose : undefined}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
                item.soon ? "cursor-default" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.soon ? (
                <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">
                  Pronto
                </span>
              ) : (
                isActive && <ChevronRight className="size-3 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut className="size-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function VendedorShell({
  user,
  children,
}: {
  user: SellerUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/seller/logout", { method: "POST" });
    } finally {
      router.push("/login/vendedor?logout=1");
      router.refresh();
    }
  }

  return (
    <div className="flex h-screen bg-brand-soft overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full">
        <SidebarNav
          user={user}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0" aria-label="Menú de navegación">
          <SidebarNav
            user={user}
            pathname={pathname}
            onLogout={handleLogout}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-black/5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="text-brand-text"
          >
            <Menu className="size-5" />
          </Button>
          <div className="relative h-8 w-24">
            <Image src={brandAssets.logo} alt="BARAKA" fill className="object-contain" />
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" id="vendedor-main">
          {loggingOut ? (
            <div className="flex items-center justify-center h-full text-brand-muted text-sm">
              Cerrando sesión...
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
