import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { requireAdmin, unauthorized } from "@/lib/crud"
import { USER_ROLES, SELECT_USER, mapUser, validEmail, countSuperAdmins } from "@/lib/users"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  const rows = (await query(`${SELECT_USER} WHERE id = ?`, [params.id])) as any[]
  if (!rows.length) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  return NextResponse.json({ data: mapUser(rows[0]) })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const current = (await query("SELECT * FROM admin_users WHERE id = ?", [params.id])) as any[]
    if (!current.length) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    const user = current[0]

    const body = await req.json()
    const name = body?.name === undefined ? user.name : String(body.name).trim()
    const email = body?.email === undefined ? user.email : String(body.email).trim().toLowerCase()
    const role = body?.role === undefined ? user.role : USER_ROLES.includes(body.role) ? body.role : user.role
    const permissions = Array.isArray(body?.permissions) ? JSON.stringify(body.permissions) : user.permissions
    const avatar = body?.avatar === undefined ? user.avatar : String(body.avatar)
    const active = body?.active === undefined ? user.active : body.active ? 1 : 0

    if (!name || !email) {
      return NextResponse.json({ error: "Le nom et l'e-mail sont obligatoires" }, { status: 400 })
    }
    if (!validEmail(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 })
    }

    const duplicate = (await query("SELECT id FROM admin_users WHERE email = ? AND id <> ? LIMIT 1", [
      email,
      params.id,
    ])) as any[]
    if (duplicate.length) {
      return NextResponse.json({ error: "Un compte utilise déjà cette adresse e-mail" }, { status: 409 })
    }

    // Guard rails: never lock yourself out of your own account.
    const wasSuperAdmin = user.role === "super_admin" && Boolean(user.active);
    const staysSuperAdmin = role === "super_admin" && Boolean(active);
    if (params.id === auth.user.id) {
      if (!active) {
        return NextResponse.json({ error: "Vous ne pouvez pas désactiver votre propre compte" }, { status: 400 })
      }
      if (!staysSuperAdmin) {
        return NextResponse.json({ error: "Vous ne pouvez pas retirer votre propre rôle de super administrateur" }, { status: 400 })
      }
    } else if (wasSuperAdmin && !staysSuperAdmin) {
      const remaining = await countSuperAdmins()
      if (remaining <= 1) {
        return NextResponse.json(
          { error: "Impossible : il doit rester au moins un super administrateur actif" },
          { status: 400 }
        )
      }
    }

    const updates: string[] = ["name = ?", "email = ?", "role = ?", "permissions = ?", "avatar = ?", "active = ?"]
    const values: any[] = [name, email, role, permissions, avatar, active]

    const password = String(body?.password ?? "")
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 })
      }
      updates.push("password = ?")
      values.push(await hashPassword(password))
    }

    values.push(params.id)
    await query(`UPDATE admin_users SET ${updates.join(", ")} WHERE id = ?`, values)

    const rows = (await query(`${SELECT_USER} WHERE id = ?`, [params.id])) as any[]
    return NextResponse.json({ data: mapUser(rows[0]) })
  } catch (error) {
    console.error("[api/users] PUT", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    if (params.id === auth.user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 })
    }
    const current = (await query("SELECT id, role, active FROM admin_users WHERE id = ?", [params.id])) as any[]
    if (!current.length) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    if (current[0].role === "super_admin") {
      const remaining = await countSuperAdmins()
      if (remaining <= 1) {
        return NextResponse.json(
          { error: "Impossible : il doit rester au moins un super administrateur actif" },
          { status: 400 }
        )
      }
    }
    await query("DELETE FROM admin_users WHERE id = ?", [params.id])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[api/users] DELETE", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
