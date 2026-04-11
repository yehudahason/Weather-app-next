import cities from "@/public/city.list.json";
import { NextResponse } from "next/server";
import { City } from "@/app/types/types";
import { normalize } from "@/app/utils/utilsFunc";

// ✅ normalize dataset too
const indexedCities: City[] = (cities as City[]).map((c) => ({
  ...c,
  search: normalize(c.name),
}));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";

  if (!rawQuery || rawQuery.length < 2) {
    return NextResponse.json([]);
  }

  const query = normalize(rawQuery);

  const pool: { city: City; score: number }[] = [];

  for (const c of indexedCities) {
    const index = c.search.indexOf(query);
    if (index === -1) continue;

    const score = index === 0 ? 0 : 1;

    pool.push({ city: c, score });

    if (pool.length >= 50) break;
  }

  pool.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;

    if (a.city.name.length !== b.city.name.length) {
      return a.city.name.length - b.city.name.length;
    }

    return a.city.name.localeCompare(b.city.name);
  });

  return NextResponse.json(pool.slice(0, 10).map((r) => r.city));
}
