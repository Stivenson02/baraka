import { lukranFetch } from "@/lib/lukranClient";
import type { ApiSuccess } from "@/types/api.type";
import type { WebPageSection } from "@/types/webpage.type";

export async function getWebpageSection(name: string) {
  return lukranFetch<ApiSuccess<WebPageSection>>({
    endpoint: `/api/connect/v1/webpage/section/${encodeURIComponent(name)}`,
    method: "GET",
  });
}
