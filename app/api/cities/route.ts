import cities from "@/public/city.list.json";
import { NextResponse } from "next/server";
import { City } from "@/app/types/types";

const indexedCities: (City & { searchName: string })[] = (cities as City[]).map(
  (c) => ({
    ...c,
    searchName: c.name.toLowerCase(),
  }),
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) return NextResponse.json([]);

  const results = indexedCities
    .filter((c) => c.searchName.startsWith(query))
    .slice(0, 10);

  return NextResponse.json(results);
}
