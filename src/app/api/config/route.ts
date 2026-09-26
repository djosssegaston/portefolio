import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { query, queryRaw } from "@/lib/db"
import { newId, invalidateContent } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

const legacyConfigPath = path.join(process.cwd(), "src", "lib", "data", "config.json")

/** Media/site settings live in `site_configs` (keys stored without prefix). */
async function readConfig(): Promise<Record<string, any>> {
  const rows = (await queryRaw(
    "SELECT cle, valeur FROM site_configs WHERE cle NOT LIKE 'seo.%'"
  )) as any[]
  const out: Record<string, any> = {}
  for (const r of rows) {
    try {
      out[r.cle] = JSON.parse(r.valeur)
    } catch {
      out[r.cle] = r.valeur
    }
  }
  return out
}

/** One-time import of the legacy src/lib/data/config.json into the database. */
async function migrateLegacyConfig() {
  try {
    const raw = await readFile(legacyConfigPath, "utf-8")
    const legacy = JSON.parse(raw)
    const entries = Object.entries(legacy)
    if (!entries.length) return
    for (const [key, value] of entries) {
      await queryRaw(
        `INSERT INTO site_configs (id, cle, valeur) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE valeur = VALUES(valeur)`,
        [newId(), key, JSON.stringify(value)]
      )
    }
    console.log(`[api/config] migrated ${entries.length} keys from legacy config.json`)
  } catch {
    // No legacy file — nothing to migrate.
  }
}

let migrated = false

export async function GET() {
  try {
    if (!migrated) {
      migrated = true
      await migrateLegacyConfig()
    }
    return NextResponse.json(await readConfig())
  } catch (error) {
    console.error("[api/config] GET", error)
    // Degrade to the legacy file rather than breaking the header/hero.
    try {
      const raw = await readFile(legacyConfigPath, "utf-8")
      return NextResponse.json(JSON.parse(raw))
    } catch {
      return NextResponse.json({})
    }
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const current = await readConfig()
    const merged = { ...current, ...body }

    for (const [key, value] of Object.entries(merged)) {
      await queryRaw(
        `INSERT INTO site_configs (id, cle, valeur) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE valeur = VALUES(valeur), updated_at = CURRENT_TIMESTAMP`,
        [newId(), key, JSON.stringify(value)]
      )
    }

    invalidateContent()
    return NextResponse.json({ success: true, config: merged })
  } catch (error) {
    console.error("[api/config] PUT", error)
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 })
  }
}
