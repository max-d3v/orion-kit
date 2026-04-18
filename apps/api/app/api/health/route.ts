import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = (): NextResponse => {
  const response = {
    success: true,
    data: { status: "OK" },
    message: "API is healthy",
  };

  return NextResponse.json(response, { status: 200 });
};
