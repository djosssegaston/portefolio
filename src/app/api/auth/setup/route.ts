import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { getPool } from "@/lib/db"

export async function GET() {
  try {
    const pool = await getPool()

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL DEFAULT '',
        avatar VARCHAR(500) NOT NULL DEFAULT '',
        role VARCHAR(50) NOT NULL DEFAULT 'editor',
        permissions TEXT NOT NULL,
        two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
        two_factor_secret VARCHAR(255) NOT NULL DEFAULT '',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [existing]: any = await pool.execute(
      "SELECT id FROM admin_users WHERE email = ?",
      ["djossegaston7@gmail.com"]
    )

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ success: true, message: "Admin déjà existant" })
    }

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

    return NextResponse.json({
      success: true,
      message: "Table admin_users créée et super admin ajouté",
      email: "djossegaston7@gmail.com",
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
}
