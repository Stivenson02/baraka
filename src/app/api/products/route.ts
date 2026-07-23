import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/errors/handleApiError";
import { getProducts } from "@/services/products.service";

const MAX_LIMIT = 48;

function getPositiveInt(value: string | null, fallback: number, max: number) {
  const parsed = Number(value ?? fallback);

  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), 1), max);
}

function normalizeIds(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))].sort();
}

function normalizeSearch(value: string | null) {
  const normalized = value?.trim().replace(/\s+/g, " ").slice(0, 80);

  return normalized && normalized.length >= 3 ? normalized : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = getPositiveInt(url.searchParams.get("page"), 1, 10_000);
    const limit = getPositiveInt(url.searchParams.get("limit"), 20, MAX_LIMIT);
    const brandIds = normalizeIds(url.searchParams.getAll("brandId"));
    const categoryIds = normalizeIds(url.searchParams.getAll("categoryId"));
    const search = normalizeSearch(url.searchParams.get("search"));
    const { data, pagination } = await getProducts({
      page,
      limit,
      brandIds,
      categoryIds,
      search,
    });

    return NextResponse.json({ success: true, data, pagination });
  } catch (error) {
    return handleApiError(error);
  }
}
