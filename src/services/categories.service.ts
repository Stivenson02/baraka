import { lukranFetch } from "@/lib/lukranClient";
import type { ApiSuccess } from "@/types/api.type";
import type { Category, HomeCategory } from "@/types/category.type";

const HOME_CATEGORY_LIMIT = 6;

function clampHomeLimit(limit: number) {
  if (!Number.isFinite(limit)) return HOME_CATEGORY_LIMIT;
  return Math.min(Math.max(Math.floor(limit), 1), 8);
}

export async function getCategories() {
  return lukranFetch<ApiSuccess<Category[]>>({
    endpoint: "/api/connect/v1/categories",
    method: "GET",
  });
}

export async function getHomeCategories(limit = HOME_CATEGORY_LIMIT) {
  const safeLimit = clampHomeLimit(limit);

  return lukranFetch<ApiSuccess<HomeCategory[]>>({
    endpoint: `/api/connect/v1/categories?sort=home&limit=${safeLimit}`,
    method: "GET",
  });
}
