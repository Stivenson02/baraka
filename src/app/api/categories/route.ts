import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/errors/handleApiError";
import { getCategories, getHomeCategories } from "@/services/categories.service";

const DEFAULT_HOME_LIMIT = 6;
const MAX_HOME_LIMIT = 8;

function parseHomeLimit(value: string | null) {
  const parsed = Number(value ?? DEFAULT_HOME_LIMIT);

  if (!Number.isFinite(parsed)) return DEFAULT_HOME_LIMIT;
  return Math.min(Math.max(Math.floor(parsed), 1), MAX_HOME_LIMIT);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sort = url.searchParams.get("sort");

    if (sort === "home") {
      const limit = parseHomeLimit(url.searchParams.get("limit"));
      const { data } = await getHomeCategories(limit);

      return NextResponse.json({ success: true, data });
    }

    const { data } = await getCategories();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
