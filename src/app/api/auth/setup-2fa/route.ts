import { NextRequest, NextResponse } from "next/server"
import { verifyToken, findAdminById, generateTwoFactorSecret, generateTwoFactorOtpUrl, verifyTwoFactorToken } from "@/lib/auth"
import { getPool } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const decoded = verifyToken(authHeader.slice(7))
    if (!decoded) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 })
    }

    const { action, code } = await req.json()

    if (action === "generate") {
      const secret = generateTwoFactorSecret()
      const otpauthUrl = generateTwoFactorOtpUrl(secret.base32, decoded.email)

      return NextResponse.json({
        secret: secret.base32,
        otpauthUrl,
      })
    }

    if (action === "enable") {
      const pool = await getPool()
      const [rows]: any = await pool.execute(
        "SELECT two_factor_secret FROM admin_users WHERE id = ?",
        [decoded.id]
      )
      const secret = rows[0]?.two_factor_secret
      if (!secret) {
        return NextResponse.json({ error: "Générez d'abord le secret" }, { status: 400 })
      }

      const valid = verifyTwoFactorToken(secret, code)
      if (!valid) {
        return NextResponse.json({ error: "Code invalide" }, { status: 400 })
      }

      await pool.execute(
        "UPDATE admin_users SET two_factor_enabled = 1 WHERE id = ?",
        [decoded.id]
      )

      return NextResponse.json({ success: true })
    }

    if (action === "disable") {
      const pool = await getPool()
      const [rows]: any = await pool.execute(
        "SELECT two_factor_secret FROM admin_users WHERE id = ?",
        [decoded.id]
      )
      const secret = rows[0]?.two_factor_secret
      if (!secret) {
        return NextResponse.json({ error: "2FA non configuré" }, { status: 400 })
      }

      const valid = verifyTwoFactorToken(secret, code)
      if (!valid) {
        return NextResponse.json({ error: "Code invalide" }, { status: 400 })
      }

      await pool.execute(
        "UPDATE admin_users SET two_factor_enabled = 0, two_factor_secret = '' WHERE id = ?",
        [decoded.id]
      )

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
