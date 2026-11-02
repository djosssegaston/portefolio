import { NextRequest, NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import path from "path"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const files = await readdir(uploadDir).catch(() => [])

    const images = await Promise.all(
      files
        .filter((f) => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
        .map(async (filename) => {
          const stats = await stat(path.join(uploadDir, filename))
          return {
            url: `/api/uploads/${filename}`,
            name: filename,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
          }
        })
    )

    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json({ images })
  } catch (error) {
    console.error("[api/images]", error)
    return NextResponse.json({ images: [] })
  }
}
