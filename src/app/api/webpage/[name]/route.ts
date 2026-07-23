import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/errors/handleApiError";
import { getWebpageSection } from "@/services/webpage.service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = url.pathname.split("/").at(-1) || "";
    const { data } = await getWebpageSection(name);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
