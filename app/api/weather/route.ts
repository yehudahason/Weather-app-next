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

  try {
    const res = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${apiKey}&contentType=json`,
      { next: { revalidate: 3600 } }, // Optional: Cache for 1 hour
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
