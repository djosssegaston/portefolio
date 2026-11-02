import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { newId, toDbDate, invalidateContent } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"
import { SELECT_COMMENT, mapComment } from "@/lib/comments"

export const dynamic = "force-dynamic"

const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

function throttled(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

/** Public: a visitor submits a comment. It is queued for moderation. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (throttled(ip)) {
    return NextResponse.json({ error: "Trop de commentaires. Réessayez plus tard." }, { status: 429 })
  }

  try {
    const body = await req.json()
    const postId = String(body?.postId ?? "").trim()
    const name = String(body?.name ?? "").trim()
    const email = String(body?.email ?? "").trim()
    const content = String(body?.content ?? "").trim()

    if (!postId || !name || !email || !content) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 })
    }
    if (content.length > 3000) {
      return NextResponse.json({ error: "Commentaire trop long (3000 caractères max)." }, { status: 400 })
    }

    const post = (await query("SELECT id FROM blog_posts WHERE id = ? LIMIT 1", [postId])) as any[]
    if (!post.length) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 })
    }

    const id = newId()
    // Comments are queued for moderation (validated = 0) before appearing publicly.
    await query(
      `INSERT INTO blog_comments (id, name, email, content, date, validated, post_id)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
      [id, name, email, content, toDbDate(new Date()), postId]
    )

    invalidateContent()
    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error("[api/comments] POST", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

/** Admin: the moderation queue. */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const filter = req.nextUrl.searchParams.get("filter")
    const where =
      filter === "pending" ? "WHERE c.validated = 0" : filter === "validated" ? "WHERE c.validated = 1" : ""
    const rows = (await query(`${SELECT_COMMENT} ${where} ORDER BY c.date DESC`)) as any[]

    const counts = (await query(
      "SELECT COUNT(*) AS total, SUM(validated = 1) AS validated, SUM(validated = 0) AS pending FROM blog_comments"
    )) as any[]

    return NextResponse.json({
      data: rows.map(mapComment),
      meta: {
        total: Number(counts[0]?.total ?? 0),
        validated: Number(counts[0]?.validated ?? 0),
        pending: Number(counts[0]?.pending ?? 0),
      },
    })
  } catch (error) {
    console.error("[api/comments] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

/** Admin bulk moderation: { ids, action: "validate" | "unvalidate" | "delete" } */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const { ids, action } = await req.json()
    if (!Array.isArray(ids) || !ids.length || typeof action !== "string") {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
    }
    const placeholders = ids.map(() => "?").join(",")

    if (action === "delete") {
      await query(`DELETE FROM blog_comments WHERE id IN (${placeholders})`, ids)
    } else if (action === "validate" || action === "unvalidate") {
      await query(`UPDATE blog_comments SET validated = ? WHERE id IN (${placeholders})`, [
        action === "validate" ? 1 : 0,
        ...ids,
      ])
    } else {
      return NextResponse.json({ error: "Action inconnue" }, { status: 400 })
    }

    invalidateContent()
    const rows = (await query(`${SELECT_COMMENT} WHERE c.id IN (${placeholders})`, ids)) as any[]
    return NextResponse.json({ ok: true, data: rows.map(mapComment) })
  } catch (error) {
    console.error("[api/comments] PATCH", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
