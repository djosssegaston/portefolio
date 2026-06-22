import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import { getPool } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "djosse-adechina-jwt-secret-2024"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export function generateTwoFactorSecret() {
  return speakeasy.generateSecret({ name: "Ade IA (DJOSSE Adechina)" })
}

export function verifyTwoFactorToken(secret: string, token: string) {
  return speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 })
}

export function generateTwoFactorOtpUrl(secret: string, email: string) {
  return speakeasy.otpauthURL({ secret, label: `Ade IA:${email}`, encoding: "base32" })
}

export async function findAdminByEmail(email: string) {
  const pool = await getPool()
  const [rows]: any = await pool.execute("SELECT * FROM admin_users WHERE email = ?", [email])
  return rows[0] || null
}

export async function findAdminById(id: string) {
  const pool = await getPool()
  const [rows]: any = await pool.execute(
    "SELECT id, name, email, avatar, role, two_factor_enabled FROM admin_users WHERE id = ?",
    [id]
  )
  return rows[0] || null
}
