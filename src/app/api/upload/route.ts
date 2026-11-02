import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_SIZE = 5 * 1024 * 1024

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
}

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"])

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)

  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Fichier vide" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (5 Mo max)" }, { status: 413 })
    }

    const namedExt = path.extname(file.name || "").toLowerCase()
    const ext = MIME_EXT[file.type] ?? (ALLOWED_EXT.has(namedExt) ? namedExt : null)
    if (!ext) {
      return NextResponse.json(
        { error: "Format non supporté (JPG, PNG, GIF ou WebP uniquement)" },
        { status: 415 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // Extension comes from an allowlist and the random name prevents traversal.
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({
      url: `/api/uploads/${filename}`,
      name: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error("[api/upload]", error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
