"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Store,
  UserRound,
  Users,
} from "lucide-react";

import { brandAssets, commerceCategories, navItems } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { StorefrontCategory } from "@/types/category.type";

type HeaderSession =
  | { type: "customer"; name?: string; email?: string }
  | { type: "seller"; name?: string; email?: string }
  | null;

export function SiteHeader({
  onOpenSellerDialog,
  session = null,
  variant = "landing",
  categories = [],
}: {
  onOpenSellerDialog?: () => void;
  session?: HeaderSession;
  variant?: "landing" | "store";
  categories?: StorefrontCategory[];
}) {
  const isStore = variant === "store";
  const displayName = session?.name?.split(" ")[0] || session?.email?.split("@")[0];
  const accountHref = session?.type === "seller" ? "/vendedor" : "/cliente";
  const router = useRouter();
  const storeCategories = getHeaderCategories(categories);

  async function handleCustomerLogout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-14 w-40 shrink-0 lg:w-44" aria-label="Ir al inicio">
          <Image
            src={brandAssets.logo}
            alt="BARAKA"
            fill
            priority
            sizes="176px"
            className="object-contain object-left"
          />
        </Link>

        {isStore && (
          <form className="hidden flex-1 items-center lg:flex" role="search">
            <label className="relative w-full">
              <span className="sr-only">Buscar productos</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
              <input
                type="search"
                placeholder="Buscar productos, marcas o categorias"
                className="h-10 w-full rounded-lg border border-black/10 bg-brand-soft pl-10 pr-3 text-sm text-brand-text outline-none transition focus:border-brand-purple/40 focus:bg-white focus:ring-3 focus:ring-brand-purple/10"
              />
            </label>
          </form>
        )}

        <NavigationMenu className={isStore ? "hidden xl:flex" : "hidden lg:flex"}>
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-brand-muted transition hover:bg-brand-soft hover:text-brand-purple-dark"
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {isStore && (
            <>
              <Button type="button" variant="outline" size="icon-lg" aria-label="Favoritos">
                <Heart className="size-4" />
              </Button>
              <Button type="button" variant="outline" size="icon-lg" aria-label="Carrito">
                <ShoppingCart className="size-4" />
              </Button>
            </>
          )}

          {session ? (
            <Button
              type="button"
              variant="outline"
              className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
              asChild
            >
              <Link href={accountHref}>
                <UserRound className="size-4" />
                {displayName || "Mi cuenta"}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-brand-purple text-white shadow-sm hover:bg-brand-purple-hover"
              asChild
            >
              <Link href="/login">
                <LogIn className="size-4" />
                Iniciar sesion
              </Link>
            </Button>
          )}

          {session?.type === "customer" && isStore ? (
            <Button
              type="button"
              variant="outline"
              className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
              onClick={handleCustomerLogout}
            >
              <LogOut className="size-4" />
              Cerrar sesion
            </Button>
          ) : (
            !isStore && (
              <Button
                type="button"
                variant="outline"
                className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
                onClick={onOpenSellerDialog}
              >
                <Users className="size-4" />
                Quiero vender
              </Button>
            )
          )}

          {isStore && !session && (
            <Button type="button" variant="ghost" asChild>
              <Link href="/login/cliente">
                <Store className="size-4" />
                Registrarme
              </Link>
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[310px] px-5">
            <SheetHeader className="px-0 text-left">
              <SheetTitle className="relative h-16 w-48">
                <Image
                  src={brandAssets.logo}
                  alt="BARAKA"
                  fill
                  sizes="192px"
                  className="object-contain object-left"
                />
              </SheetTitle>
            </SheetHeader>
            <Separator />

            {isStore && (
              <form role="search">
                <label className="relative block">
                  <span className="sr-only">Buscar productos</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
                  <input
                    type="search"
                    placeholder="Buscar productos"
                    className="h-10 w-full rounded-lg border border-black/10 bg-brand-soft pl-10 pr-3 text-sm outline-none focus:border-brand-purple/40"
                  />
                </label>
              </form>
            )}

            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-left text-sm font-medium text-brand-text hover:bg-brand-soft"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {isStore && (
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {storeCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="rounded-lg bg-brand-soft px-3 py-2 text-xs font-medium text-brand-text"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-2">
              {session ? (
                <Button
                  type="button"
                  className="bg-brand-purple text-white hover:bg-brand-purple-hover"
                  asChild
                >
                  <Link href={accountHref}>
                    <UserRound className="size-4" />
                    {displayName || "Mi cuenta"}
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-brand-purple text-white hover:bg-brand-purple-hover"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Iniciar sesion
                  </Link>
                </Button>
              )}
              {session?.type === "customer" && isStore ? (
                <Button type="button" variant="outline" onClick={handleCustomerLogout}>
                  <LogOut className="size-4" />
                  Cerrar sesion
                </Button>
              ) : (
                !isStore && (
                  <Button type="button" variant="outline" onClick={onOpenSellerDialog}>
                    Quiero vender
                  </Button>
                )
              )}
              {!session && (
                <Button type="button" variant="ghost" asChild>
                  <Link href="/login/cliente">Registrarme como cliente</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isStore && (
        <div className="hidden border-t border-black/5 bg-white lg:block">
          <nav className="mx-auto flex h-10 max-w-7xl items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:px-8">
            {storeCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-brand-muted transition hover:bg-brand-soft hover:text-brand-purple-dark"
                >
                  <Icon className="size-3.5" />
                  {category.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

function getHeaderCategories(categories: StorefrontCategory[]) {
  if (categories.length) {
    return categories.map((category, index) => ({
      id: category.id,
      name: category.name,
      href: "/#productos",
      icon: commerceCategories[index % commerceCategories.length].icon,
    }));
  }

  return commerceCategories.map((category, index) => ({
    id: `fallback-${index}-${category.name}`,
    name: category.name,
    href: "/#productos",
    icon: category.icon as LucideIcon,
  }));
}
