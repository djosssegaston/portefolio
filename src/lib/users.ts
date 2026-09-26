import { query } from "@/lib/db"

export const USER_ROLES = ["super_admin", "admin", "editor"] as const

export const SELECT_USER =
  "SELECT id, name, email, avatar, role, permissions, two_factor_enabled, active, created_at FROM admin_users"

/** Never leak the password hash or the 2FA secret to the client. */
export function mapUser(row: any) {
  let permissions: string[] = []
  try {
    const parsed = JSON.parse(row.permissions)
    if (Array.isArray(parsed)) permissions = parsed
  } catch {}
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar ?? "",
    role: row.role,
    permissions,
    twoFactorEnabled: Boolean(row.two_factor_enabled),
    active: Boolean(row.active ?? 1),
    createdAt: row.created_at,
  }
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export function countSuperAdmins() {
  return query(
    "SELECT COUNT(*) AS n FROM admin_users WHERE role = 'super_admin' AND active = 1"
  ).then((rows) => Number((rows as any)[0]?.n ?? 0))
}
