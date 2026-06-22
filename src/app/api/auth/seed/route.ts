import { NextResponse } from "next/server"
import { hashPassword, findAdminByEmail } from "@/lib/auth"
import { getPool } from "@/lib/db"

export async function POST() {
  try {
    const existing = await findAdminByEmail("djossegaston7@gmail.com")
    if (existing) {
      return NextResponse.json({ message: "Admin déjà existant" })
    }

    const pool = await getPool()
    const password = await hashPassword("Adechina7@")
    const id = "admin_" + Date.now()

    await pool.execute(
      `INSERT INTO admin_users (id, name, email, password, avatar, role, permissions, two_factor_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        "DJOSSE Adechina",
        "djossegaston7@gmail.com",
        password,
        "",
        "super_admin",
        JSON.stringify(["all"]),
        0,
      ]
    )

    return NextResponse.json({ success: true, message: "Admin créé" })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
}
