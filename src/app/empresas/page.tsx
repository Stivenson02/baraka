import type { Metadata } from "next";

import { EnterpriseLandingPage } from "@/components/sections/EnterpriseLandingPage";

export const metadata: Metadata = {
  title: "Para empresas | BARAKA",
  description:
    "Soluciones BARAKA para abastecimiento empresarial, programas de puntos y redencion de productos.",
};

export default function EmpresasPage() {
  return <EnterpriseLandingPage />;
}
