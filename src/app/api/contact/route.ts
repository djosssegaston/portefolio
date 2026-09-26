import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { newId, toDbDate } from "@/lib/content"

export const dynamic = "force-dynamic"

/** Naive in-memory throttle: max 5 submissions per IP per 10 minutes. */
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

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const name = String(body?.name ?? "").trim()
    const email = String(body?.email ?? "").trim()
    const subject = String(body?.subject ?? "").trim()
    const message = String(body?.message ?? "").trim()
    const phone = String(body?.phone ?? "").trim() || null

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs obligatoires sont requis." }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 })
    }
    if (name.length > 150 || email.length > 190 || subject.length > 255 || message.length > 5000) {
      return NextResponse.json({ error: "Un des champs dépasse la longueur autorisée." }, { status: 400 })
    }

    const id = newId()
    await query(
      `INSERT INTO contact_messages (id, name, email, phone, subject, message, date, \`read\`, archived, replied)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
      [id, name, email, phone, subject, message, toDbDate(new Date())]
    )

    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error("[api/contact] POST", error)
    return NextResponse.json(
      { error: "Le message n'a pas pu être envoyé. Réessayez plus tard." },
      { status: 500 }
    )
  }
}
