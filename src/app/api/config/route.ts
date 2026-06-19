import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "lib", "data", "config.json");

export async function GET() {
  try {
    const data = await readFile(configPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readFile(configPath, "utf-8")
      .then((d) => JSON.parse(d))
      .catch(() => ({}));

    const merged = { ...current, ...body };
    await writeFile(configPath, JSON.stringify(merged, null, 2), "utf-8");

    return NextResponse.json({ success: true, config: merged });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}
