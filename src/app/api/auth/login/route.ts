import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, generateToken, findAdminByEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const admin = await findAdminByEmail(email)
    if (!admin) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    if (!admin.password) {
      return NextResponse.json({ error: "Compte non configuré. Contactez l'administrateur." }, { status: 401 })
    }

    const valid = await verifyPassword(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    if (admin.two_factor_enabled) {
      const tempToken = generateToken({ id: admin.id, email: admin.email, role: admin.role })
      return NextResponse.json({
        requiresTwoFactor: true,
        tempToken,
        email: admin.email,
      })
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role })
    return NextResponse.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, avatar: admin.avatar, role: admin.role },
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
