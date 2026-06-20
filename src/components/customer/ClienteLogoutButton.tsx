"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClienteLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/login/cliente");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="size-4" />
      Cerrar sesion
    </Button>
  );
}
