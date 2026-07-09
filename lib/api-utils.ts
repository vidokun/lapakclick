import { NextResponse } from "next/server";
import { z } from "zod";

export function apiError(message: string, code: string, status: number) {
  return NextResponse.json(
    { error: { code, message } },
    { status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.ZodIssue) => e.message).join(", ");
    return apiError(message, "VALIDATION_ERROR", 400);
  }

  if (error instanceof Error) {
    console.error("API Error:", error.message);
    return apiError("Terjadi kesalahan pada server", "INTERNAL_SERVER_ERROR", 500);
  }

  console.error("Unknown API Error:", error);
  return apiError("Terjadi kesalahan pada server", "INTERNAL_SERVER_ERROR", 500);
}
