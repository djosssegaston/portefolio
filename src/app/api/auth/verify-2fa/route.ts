import { NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorToken, generateToken, verifyToken, findAdminById } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { tempToken, code } = await req.json()
    if (!tempToken || !code) {
      return NextResponse.json({ error: "Token et code requis" }, { status: 400 })
    }

    const decoded = verifyToken(tempToken)
    if (!decoded) {
      return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 })
    }

    const admin = await findAdminById(decoded.id)
    if (!admin || !admin.two_factor_enabled) {
      return NextResponse.json({ error: "2FA non activé" }, { status: 400 })
    }

    const pool = (await import("@/lib/db")).getPool
    const [rows]: any = await (await pool()).execute(
      "SELECT two_factor_secret FROM admin_users WHERE id = ?",
      [decoded.id]
    )
    const secret = rows[0]?.two_factor_secret
    if (!secret) {
      return NextResponse.json({ error: "2FA non configuré" }, { status: 400 })
    }

    const valid = verifyTwoFactorToken(secret, code)
    if (!valid) {
      return NextResponse.json({ error: "Code invalide" }, { status: 401 })
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
