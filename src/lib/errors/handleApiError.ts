import { NextResponse } from "next/server";
import { AppError } from "./AppError";
import type { ApiError } from "@/types/api.type";

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    const response: ApiError = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details ?? null,
      },
    };

    return NextResponse.json<ApiError>(response, {
      status: error.statusCode,
    });
  }

  console.error("❌ Unhandled API error:", error);

  const response: ApiError = {
    success: false,
    error: {
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
      details: null,
    },
  };

  return NextResponse.json<ApiError>(response, { status: 500 });
}
