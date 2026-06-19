import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(uploadDir).catch(() => []);

    const images = await Promise.all(
      files
        .filter((f) => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
        .map(async (filename) => {
          const filepath = path.join(uploadDir, filename);
          const stats = await stat(filepath);
          return {
            url: `/uploads/${filename}`,
            name: filename,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
          };
        })
    );

    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [] });
  }
}
