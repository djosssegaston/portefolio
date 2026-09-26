import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getContactMessages, mapMessage } from "@/lib/content"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const view = req.nextUrl.searchParams.get("view") ?? "inbox"
    const data = await getContactMessages({ archived: view === "archived" })
    return NextResponse.json({ data })
  } catch (error) {
    console.error("[api/messages] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

/** Bulk actions: mark read/unread, archive, unarchive, delete. */
export async function PATCH(req: NextRequest) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const { ids, action } = await req.json()
    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json({ error: "Aucun message sélectionné" }, { status: 400 })
    }
    const placeholders = ids.map(() => "?").join(",")

    switch (action) {
      case "read":
        await query(`UPDATE contact_messages SET \`read\` = 1 WHERE id IN (${placeholders})`, ids)
        break
      case "unread":
        await query(`UPDATE contact_messages SET \`read\` = 0 WHERE id IN (${placeholders})`, ids)
        break
      case "archive":
        await query(`UPDATE contact_messages SET archived = 1 WHERE id IN (${placeholders})`, ids)
        break
      case "unarchive":
        await query(`UPDATE contact_messages SET archived = 0, \`read\` = 1 WHERE id IN (${placeholders})`, ids)
        break
      case "replied":
        await query(`UPDATE contact_messages SET replied = 1, \`read\` = 1 WHERE id IN (${placeholders})`, ids)
        break
      case "delete":
        await query(`DELETE FROM contact_messages WHERE id IN (${placeholders})`, ids)
        break
      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 })
    }

    const rows = (await query(
      `SELECT * FROM contact_messages WHERE id IN (${placeholders})`,
      ids
    )) as any[]
    return NextResponse.json({ ok: true, data: rows.map(mapMessage) })
  } catch (error) {
    console.error("[api/messages] PATCH", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
