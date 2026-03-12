export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");

  const apiKey = process.env.API_KEY;

  const res = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`,
  );

  const data = await res.json();

  return Response.json(data);
}
