import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, generateToken, generateChallengeToken, findAdminByEmail } from "@/lib/auth"
import { clientIp, isRateLimited } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (isRateLimited(`login:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 })
  }

  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const admin = await findAdminByEmail(String(email).trim().toLowerCase())
    if (!admin || !admin.password) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    if (!admin.active) {
      return NextResponse.json({ error: "Ce compte est désactivé." }, { status: 403 })
    }

    const valid = await verifyPassword(password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    if (admin.two_factor_enabled) {
      // Challenge only: cannot be used as an access token by the API.
      const challengeToken = generateChallengeToken({ id: admin.id, email: admin.email, role: admin.role })
      return NextResponse.json({ requiresTwoFactor: true, challengeToken, email: admin.email })
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role })
    return NextResponse.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, avatar: admin.avatar, role: admin.role },
    })
  } catch (error) {
    console.error("[api/auth/login]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
