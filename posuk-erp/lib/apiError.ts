import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { HttpError } from "./auth";

function friendlyPrismaMessage(e: Prisma.PrismaClientKnownRequestError): string {
  switch (e.code) {
    case "P2002": {
      const fields = (e.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return `A record with this ${fields} already exists.`;
    }
    case "P2003":
      return "Cannot delete: this record is linked to other data. Remove the linked records first or deactivate it instead.";
    case "P2025":
      return "Record not found.";
    case "P2000":
      return "One of the provided values is too long for the field.";
    case "P2011":
      return "A required field is missing.";
    default:
      return "A database error occurred. Please try again.";
  }
}

export function apiError(e: unknown): NextResponse {
  if (e instanceof HttpError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const status = e.code === "P2025" ? 404 : e.code === "P2003" ? 409 : 400;
    return NextResponse.json({ error: friendlyPrismaMessage(e) }, { status });
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
  }
  if (e instanceof Error && e.message.includes("violates")) {
    return NextResponse.json(
      { error: "Cannot delete: this record is linked to other data." },
      { status: 409 }
    );
  }
  if (e instanceof Error) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
  console.error(e);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
