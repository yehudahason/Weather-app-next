import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  // 1. Validation: Ensure params exist before fetching
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.API_KEY;
  const now = new Date();

  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 9);

  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];
  try {
    const res = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${startDate}/${endDate}?key=${apiKey}&contentType=json`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json(
        { error: "Weather API responded with an error", details: errorData },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
