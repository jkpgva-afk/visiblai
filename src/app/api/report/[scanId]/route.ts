import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { scanId: string } }
) {
  const token = req.headers.get("authorization");

  const res = await fetch(
    `http://localhost:3001/api/report/${params.scanId}`,
    {
      headers: {
        Authorization: token ?? "",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: res.status }
    );
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
