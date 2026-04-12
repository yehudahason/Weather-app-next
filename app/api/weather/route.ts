import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const apiKey = process.env.API_KEY;

  const res = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${apiKey}`,
  );

  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(data);
  } else return NextResponse.json({});
}
