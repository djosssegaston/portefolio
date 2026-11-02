import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { newId } from "@/lib/content"
import { hashPassword } from "@/lib/auth"
import { requireSuperAdmin, unauthorized } from "@/lib/crud"
import { USER_ROLES, SELECT_USER, mapUser, validEmail, countSuperAdmins } from "@/lib/users"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const rows = (await query(`${SELECT_USER} ORDER BY created_at ASC`)) as any[]
    return NextResponse.json({ data: rows.map(mapUser) })
  } catch (error) {
    console.error("[api/users] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const name = String(body?.name ?? "").trim()
    const email = String(body?.email ?? "").trim().toLowerCase()
    const password = String(body?.password ?? "")
    const role = USER_ROLES.includes(body?.role) ? body.role : "editor"
    const permissions = Array.isArray(body?.permissions) ? body.permissions : []
    const active = body?.active === false ? 0 : 1

    if (!name || !email) {
      return NextResponse.json({ error: "Le nom et l'e-mail sont obligatoires" }, { status: 400 })
    }
    if (!validEmail(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 })
    }

    const existing = (await query("SELECT id FROM admin_users WHERE email = ? LIMIT 1", [email])) as any[]
    if (existing.length) {
      return NextResponse.json({ error: "Un compte utilise déjà cette adresse e-mail" }, { status: 409 })
    }

    const id = newId()
    await query(
      `INSERT INTO admin_users (id, name, email, password, avatar, role, permissions, two_factor_enabled, two_factor_secret, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, '', ?)`,
      [id, name, email, await hashPassword(password), String(body?.avatar ?? ""), role, JSON.stringify(permissions), active]
    )

    const rows = (await query(`${SELECT_USER} WHERE id = ?`, [id])) as any[]
    return NextResponse.json({ data: mapUser(rows[0]) }, { status: 201 })
  } catch (error) {
    console.error("[api/users] POST", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSuperAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const { ids, active } = await req.json()
    if (!Array.isArray(ids) || !ids.length || typeof active !== "boolean") {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
    }
    if (!active && ids.includes(auth.user.id)) {
      return NextResponse.json({ error: "Vous ne pouvez pas désactiver votre propre compte" }, { status: 400 })
    }
    if (!active) {
      const rows = (await query(
        `SELECT id FROM admin_users WHERE role = 'super_admin' AND active = 1 AND id IN (${ids.map(() => "?").join(",")})`,
        ids
      )) as any[]
      const remaining = await countSuperAdmins()
      if (rows.length >= remaining) {
        return NextResponse.json(
          { error: "Impossible : il doit rester au moins un super administrateur actif" },
          { status: 400 }
        )
      }
    }
    await query(`UPDATE admin_users SET active = ? WHERE id IN (${ids.map(() => "?").join(",")})`, [
      active ? 1 : 0,
      ...ids,
    ])
    const rows = (await query(`${SELECT_USER} WHERE id IN (${ids.map(() => "?").join(",")})`, ids)) as any[]
    return NextResponse.json({ ok: true, data: rows.map(mapUser) })
  } catch (error) {
    console.error("[api/users] PATCH", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
