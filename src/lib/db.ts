import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function connectionConfig() {
  const url = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/potefolio"
  const isTiDB = url.includes("tidbcloud.com") || url.includes("ssl=true")
  return {
    uri: url,
    // mysql2 cannot parse `ssl=true` from the URI into a valid profile, so it is always passed explicitly.
    ssl: isTiDB ? { rejectUnauthorized: true } : (undefined as any),
    charset: "utf8mb4_unicode_ci" as any,
    dateStrings: true as const,
  }
}

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...connectionConfig(),
      waitForConnections: true,
      // TiDB Serverless throttles rapid new connections, so the pool stays small
      // and is reused for the whole process lifetime.
      connectionLimit: 3,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      // The TLS handshake to the Singapore region takes ~8s, above the 10s default.
      connectTimeout: 30000,
    } as any)
  }
  return pool
}

export async function query(sql: string, params?: any[]) {
  const p = await getPool()
  const [rows] = await p.execute(sql, params || [])
  return rows
}

export async function queryRaw(sql: string, params?: any[]) {
  const p = await getPool()
  const [rows] = await p.query(sql, params || [])
  return rows
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
