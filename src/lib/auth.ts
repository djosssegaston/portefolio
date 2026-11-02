import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import { getPool } from "@/lib/db"

function jwtSecret() {
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET est obligatoire en production")
  }
  return "dev-only-insecure-jwt-secret"
}

export type TokenPurpose = "access" | "2fa"

export type AuthPayload = {
  id: string
  email: string
  role: string
  purpose: TokenPurpose
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateToken(
  payload: { id: string; email: string; role: string },
  purpose: TokenPurpose = "access"
) {
  const expiresIn = purpose === "2fa" ? "5m" : "24h"
  return jwt.sign({ ...payload, purpose }, jwtSecret(), { expiresIn })
}

/** Short-lived token that only proves the password step; it cannot access the API. */
export function generateChallengeToken(payload: { id: string; email: string; role: string }) {
  return generateToken(payload, "2fa")
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret()) as AuthPayload
    if (decoded?.purpose !== "access" && decoded?.purpose !== "2fa") return null
    return decoded
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
    "SELECT id, name, email, avatar, role, active, two_factor_enabled FROM admin_users WHERE id = ?",
    [id]
  )
  return rows[0] || null
}
