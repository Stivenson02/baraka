"use client";

import Image from "next/image";
import { Filter, ShoppingCart, Star } from "lucide-react";

import { brandAssets, featuredProducts } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FeaturedProductsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge className="bg-brand-orange text-white hover:bg-brand-orange">
              Ofertas y destacados
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold text-brand-text sm:text-4xl">
              Productos mockup para presentar el potencial del marketplace
            </h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="w-fit">
                <Filter className="size-4" />
                Filtrar mockup
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Más vendidos</DropdownMenuItem>
              <DropdownMenuItem>Precio especial</DropdownMenuItem>
              <DropdownMenuItem>Nuevos productos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.title} className="border-black/5 shadow-sm">
              <CardContent className="p-5">
                <div className="flex h-56 items-center justify-center rounded-lg bg-brand-soft">
                  <div className="relative size-44 sm:size-48">
                    <Image
                      src={brandAssets.isotipo}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 176px, 192px"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Badge className="bg-brand-orange text-white hover:bg-brand-orange">
                    {product.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-brand-orange">
                    <Star className="size-4 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-brand-text">{product.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{product.description}</p>
                <p className="mt-4 text-2xl font-semibold text-brand-purple-dark">{product.price}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button
                  type="button"
                  className="w-full bg-brand-purple text-white hover:bg-brand-purple-hover"
                >
                  <ShoppingCart className="size-4" />
                  Comprar ahora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
