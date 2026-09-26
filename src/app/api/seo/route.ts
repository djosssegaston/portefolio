import { NextRequest, NextResponse } from "next/server"
import { queryRaw } from "@/lib/db"
import { getSeoSettings, newId, invalidateContent } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

const EDITABLE = [
  "metaTitle",
  "metaDescription",
  "keywords",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "twitterCard",
  "canonicalUrl",
  "robotsTxt",
  "sitemapUrl",
] as const

export async function GET() {
  try {
    return NextResponse.json({ data: await getSeoSettings() })
  } catch (error) {
    console.error("[api/seo] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    for (const key of EDITABLE) {
      if (body[key] === undefined) continue
      const value = typeof body[key] === "string" ? body[key] : JSON.stringify(body[key])
      await queryRaw(
        `INSERT INTO site_configs (id, cle, valeur) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE valeur = VALUES(valeur), updated_at = CURRENT_TIMESTAMP`,
        [newId(), `seo.${key}`, value]
      )
    }
    invalidateContent()
    return NextResponse.json({ success: true, data: await getSeoSettings() })
  } catch (error) {
    console.error("[api/seo] PUT", error)
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 })
  }
}
