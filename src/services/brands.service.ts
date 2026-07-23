import { lukranFetch } from "@/lib/lukranClient";
import type { ApiSuccess } from "@/types/api.type";
import type { Brand } from "@/types/brand.type";

export async function getBrands() {
  return lukranFetch<ApiSuccess<Brand[]>>({
    endpoint: "/api/connect/v1/brands",
    method: "GET",
  });
}
