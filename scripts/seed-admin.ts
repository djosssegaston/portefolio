import "dotenv/config"
import { createPool } from "mysql2/promise"
import bcrypt from "bcryptjs"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || "Administrateur"

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required (no default credentials)")
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters")
  }

  const pool = createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  const [existing] = await pool.execute(
    "SELECT id FROM admin_users WHERE email = ?",
    [email]
  )
  if ((existing as any[]).length > 0) {
    console.log("Admin already exists")
    await pool.end()
    return
  }

  const hash = await bcrypt.hash(password, 12)
  const id = "admin_" + Date.now()

  await pool.execute(
    `INSERT INTO admin_users (id, name, email, password, avatar, role, permissions, two_factor_enabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, hash, "", "super_admin", JSON.stringify(["all"]), 0]
  )

  console.log("Admin user created:", id)
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
