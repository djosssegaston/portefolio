import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export async function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/potefolio"
    const isTiDB = url.includes("tidbcloud.com") || url.includes("ssl=true")
    pool = mysql.createPool({
      uri: url,
      ssl: isTiDB ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export async function query(sql: string, params?: any[]) {
  const p = await getPool()
  const [rows] = await p.execute(sql, params || [])
  return rows
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
