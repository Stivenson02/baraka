"use client";

import { useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AlliesBusinessSection } from "@/components/sections/AlliesBusinessSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { SellerApplicationDialog } from "@/components/seller/SellerApplicationDialog";

export function LandingPage() {
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [sellerDialogKey, setSellerDialogKey] = useState(0);

  function openSellerDialog() {
    setSellerDialogKey((k) => k + 1);
    setSellerDialogOpen(true);
  }

  return (
    <>
      <SiteHeader onOpenSellerDialog={openSellerDialog} />
      <main>
        <HeroSection onOpenSellerDialog={openSellerDialog} />
        <BenefitsSection />
        <CategoriesSection />
        <AlliesBusinessSection onOpenSellerDialog={openSellerDialog} />
        <FeaturedProductsSection />
      </main>
      <SiteFooter />
      <SellerApplicationDialog
        key={sellerDialogKey}
        open={sellerDialogOpen}
        onOpenChange={setSellerDialogOpen}
      />
    </>
  );
}
