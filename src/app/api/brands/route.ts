import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/errors/handleApiError";
import { getBrands } from "@/services/brands.service";

export async function GET() {
  try {
    const { data } = await getBrands();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
