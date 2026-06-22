import "dotenv/config"
import { createPool } from "mysql2/promise"
import bcrypt from "bcryptjs"

async function main() {
  const pool = createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  const [existing] = await pool.execute(
    "SELECT id FROM admin_users WHERE email = ?",
    ["djossegaston7@gmail.com"]
  )
  if ((existing as any[]).length > 0) {
    console.log("Admin already exists")
    await pool.end()
    return
  }

  const password = await bcrypt.hash("Adechina7@", 12)
  const id = "admin_" + Date.now()

  await pool.execute(
    `INSERT INTO admin_users (id, name, email, password, avatar, role, permissions, two_factor_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, "DJOSSE Adechina", "djossegaston7@gmail.com", password, "", "super_admin", JSON.stringify(["all"]), 0]
  )

  console.log("Admin user created:", id)
  await pool.end()
}

main().catch(console.error)
