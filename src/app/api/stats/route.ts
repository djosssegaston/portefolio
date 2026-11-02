import { NextRequest, NextResponse } from "next/server"
import { getContentStats, getPublicStats } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const [content, publicStats] = await Promise.all([getContentStats(), getPublicStats()])
    return NextResponse.json({ data: { ...content, ...publicStats } })
  } catch (error) {
    console.error("[api/stats] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
