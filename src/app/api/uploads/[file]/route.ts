import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
}

/**
 * Uploads added after `next build` are not served from /public by Next, so we
 * stream them from disk through this route instead.
 */
export async function GET(_req: NextRequest, { params }: { params: { file: string } }) {
  const name = path.basename(params.file)
  if (name !== params.file || !/^[a-zA-Z0-9._-]+$/.test(name)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const ext = path.extname(name).toLowerCase()
  const contentType = CONTENT_TYPES[ext]
  if (!contentType) return new NextResponse("Not found", { status: 404 })

  try {
    const buffer = await readFile(path.join(process.cwd(), "public", "uploads", name))
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
