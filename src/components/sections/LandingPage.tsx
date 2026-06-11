import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AlliesBusinessSection } from "@/components/sections/AlliesBusinessSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { HeroSection } from "@/components/sections/HeroSection";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <CategoriesSection />
        <AlliesBusinessSection />
        <FeaturedProductsSection />
      </main>
      <SiteFooter />
    </>
  );
}
