import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { mapMessage } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

type Ctx = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const sets: string[] = []
    const vals: any[] = []
    if (body.read !== undefined) {
      sets.push("`read` = ?")
      vals.push(body.read ? 1 : 0)
    }
    if (body.archived !== undefined) {
      sets.push("archived = ?")
      vals.push(body.archived ? 1 : 0)
    }
    if (body.replied !== undefined) {
      sets.push("replied = ?")
      vals.push(body.replied ? 1 : 0)
    }
    if (!sets.length) return NextResponse.json({ error: "Aucune modification" }, { status: 400 })

    await query(`UPDATE contact_messages SET ${sets.join(", ")} WHERE id = ?`, [...vals, params.id])
    const rows = (await query("SELECT * FROM contact_messages WHERE id = ? LIMIT 1", [params.id])) as any[]
    if (!rows.length) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
    return NextResponse.json({ data: mapMessage(rows[0]) })
  } catch (error) {
    console.error("[api/messages/[id]] PATCH", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    await query("DELETE FROM contact_messages WHERE id = ?", [params.id])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[api/messages/[id]] DELETE", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
