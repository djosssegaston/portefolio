import { NextRequest, NextResponse } from "next/server"
import { generateTwoFactorSecret, generateTwoFactorOtpUrl, verifyTwoFactorToken } from "@/lib/auth"
import { getPool } from "@/lib/db"
import { requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)

  try {
    const { action, code } = await req.json()
    const pool = await getPool()

    if (action === "generate") {
      const secret = generateTwoFactorSecret()
      const otpauthUrl = generateTwoFactorOtpUrl(secret.base32, auth.user.email)

      // Persist immediately so the next request (enable) can verify the code.
      await pool.execute(
        "UPDATE admin_users SET two_factor_secret = ?, two_factor_enabled = 0 WHERE id = ?",
        [secret.base32, auth.user.id]
      )

      return NextResponse.json({ secret: secret.base32, otpauthUrl })
    }

    if (action === "enable") {
      const [rows]: any = await pool.execute(
        "SELECT two_factor_secret FROM admin_users WHERE id = ?",
        [auth.user.id]
      )
      const secret = rows[0]?.two_factor_secret
      if (!secret) {
        return NextResponse.json({ error: "Générez d'abord le secret" }, { status: 400 })
      }
      if (!verifyTwoFactorToken(secret, String(code ?? "").trim())) {
        return NextResponse.json({ error: "Code invalide" }, { status: 400 })
      }

      await pool.execute("UPDATE admin_users SET two_factor_enabled = 1 WHERE id = ?", [auth.user.id])
      return NextResponse.json({ success: true })
    }

    if (action === "disable") {
      const [rows]: any = await pool.execute(
        "SELECT two_factor_secret, two_factor_enabled FROM admin_users WHERE id = ?",
        [auth.user.id]
      )
      const row = rows[0]
      if (!row?.two_factor_enabled) {
        return NextResponse.json({ error: "2FA non configuré" }, { status: 400 })
      }
      if (!verifyTwoFactorToken(row.two_factor_secret, String(code ?? "").trim())) {
        return NextResponse.json({ error: "Code invalide" }, { status: 400 })
      }

      await pool.execute(
        "UPDATE admin_users SET two_factor_enabled = 0, two_factor_secret = '' WHERE id = ?",
        [auth.user.id]
      )
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 })
  } catch (error) {
    console.error("[api/auth/setup-2fa]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
