import { NextRequest, NextResponse } from "next/server"
import { verifyToken, findAdminById } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const decoded = verifyToken(authHeader.slice(7))
  if (!decoded) {
    return NextResponse.json({ error: "Session expirée" }, { status: 401 })
  }

  const admin = await findAdminById(decoded.id)
  if (!admin) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 401 })
  }

  return NextResponse.json({ admin })
}
