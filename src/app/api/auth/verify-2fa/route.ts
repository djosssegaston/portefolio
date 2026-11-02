import { NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorToken, generateToken, verifyToken, findAdminById } from "@/lib/auth"
import { getPool } from "@/lib/db"
import { clientIp, isRateLimited } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (isRateLimited(`2fa:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 })
  }

  try {
    const { challengeToken, tempToken, code } = await req.json()
    const token = challengeToken || tempToken
    if (!token || !code) {
      return NextResponse.json({ error: "Token et code requis" }, { status: 400 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.purpose !== "2fa") {
      return NextResponse.json({ error: "Session expirée. Reconnectez-vous." }, { status: 401 })
    }

    const admin = await findAdminById(decoded.id)
    if (!admin || !admin.active) {
      return NextResponse.json({ error: "Compte désactivé ou introuvable" }, { status: 401 })
    }
    if (!admin.two_factor_enabled) {
      return NextResponse.json({ error: "2FA non activé" }, { status: 400 })
    }

    const pool = await getPool()
    const [rows]: any = await pool.execute(
      "SELECT two_factor_secret FROM admin_users WHERE id = ?",
      [decoded.id]
    )
    const secret = rows[0]?.two_factor_secret
    if (!secret) {
      return NextResponse.json({ error: "2FA non configuré" }, { status: 400 })
    }

    const valid = verifyTwoFactorToken(secret, String(code).trim())
    if (!valid) {
      return NextResponse.json({ error: "Code invalide" }, { status: 401 })
    }

    const accessToken = generateToken({ id: admin.id, email: admin.email, role: admin.role })
    return NextResponse.json({
      token: accessToken,
      admin: { id: admin.id, name: admin.name, email: admin.email, avatar: admin.avatar, role: admin.role },
    })
  } catch (error) {
    console.error("[api/auth/verify-2fa]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
