"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Users } from "lucide-react";

import { brandAssets, navItems } from "@/lib/brand";
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

export function SiteHeader({ onOpenSellerDialog }: { onOpenSellerDialog?: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-16 w-48 shrink-0" aria-label="Ir al inicio">
          <Image
            src={brandAssets.logo}
            alt="BARAKA"
            fill
            priority
            sizes="192px"
            className="object-contain object-left"
          />
        </Link>

        <NavigationMenu className="hidden lg:flex">
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

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            type="button"
            className="bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90"
          >
            <ShoppingBag className="size-4" />
            Comprar ahora
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
            onClick={onOpenSellerDialog}
          >
            <Users className="size-4" />
            Quiero vender
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menú</span>
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
            <div className="mt-4 grid gap-2">
              <Button type="button" className="bg-brand-orange text-white hover:bg-brand-orange/90">
                Comprar ahora
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenSellerDialog}
              >
                Quiero vender
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
