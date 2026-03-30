import cities from "@/public/city.list.json";
import { NextResponse } from "next/server";
import { City } from "@/app/types/types";

// normalize query same way as your dataset
const normalize = (str: string) => {
  str = toEnglish(str);
  return str.toLowerCase().replace(/\s/g, "");
};

function toEnglish(text: string): string {
  return text
    .normalize("NFD") // split letters + accents
    .replace(/[\u0300-\u036f]/g, ""); // remove accents
}

const indexedCities: City[] = cities as City[];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";

  if (!rawQuery) return NextResponse.json([]);

  const query = normalize(rawQuery);

  const results = indexedCities
    .filter((c) => c.search.startsWith(query)) // 🔥 use search field
    .slice(0, 13);

  return NextResponse.json(results);
}
