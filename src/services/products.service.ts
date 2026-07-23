import { lukranFetch } from "@/lib/lukranClient";
import type { ApiSuccess } from "@/types/api.type";
import type { Product } from "@/types/product.type";

function normalizeIds(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

function normalizeSearch(search?: string) {
  return search?.trim().replace(/\s+/g, " ").slice(0, 80);
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  brandIds?: string[];
  categoryIds?: string[];
  search?: string;
}) {
  const query = new URLSearchParams();
  const page = Math.max(Math.floor(params?.page ?? 1), 1);
  const limit = Math.min(Math.max(Math.floor(params?.limit ?? 20), 1), 48);
  const brandIds = normalizeIds(params?.brandIds ?? []);
  const categoryIds = normalizeIds(params?.categoryIds ?? []);
  const search = normalizeSearch(params?.search);

  query.set("page", String(page));
  query.set("limit", String(limit));
  brandIds.forEach((brandId) => query.append("brandId", brandId));
  categoryIds.forEach((categoryId) => query.append("categoryId", categoryId));
  if (search && search.length >= 3) query.set("search", search);

  return lukranFetch<ApiSuccess<Product[]>>({
    endpoint: `/api/connect/v1/products?${query.toString()}`,
    method: "GET",
  });
}
