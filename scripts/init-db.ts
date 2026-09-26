import mysql from "mysql2/promise"
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"
import { connectionConfig } from "../src/lib/db"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const schemaPath = path.resolve(__dirname, "../database/schema.sql")
  let schema = readFileSync(schemaPath, "utf-8")

  // Remove comments
  schema = schema.replace(/--.*$/gm, "").trim()

  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const connection = await mysql.createConnection({
    ...(connectionConfig() as any),
    multipleStatements: true,
  })

  console.log(`Connected — ${statements.length} statements to execute\n`)

  for (const stmt of statements) {
    try {
      await connection.execute(stmt)
      console.log(`✓ ${stmt.slice(0, 70)}...`)
    } catch (err: any) {
      if (err.code === "ER_TABLE_EXISTS_ERROR") {
        console.log(`~ Table exists, skipped`)
      } else {
        console.error(`✗ ${err.message}`)
      }
    }
  }

  await migrate(connection)
  await connection.end()
  console.log("\nDatabase initialized!")
}

/* Columns added after the first release. Kept separate from schema.sql because
   CREATE TABLE IF NOT EXISTS never touches tables that already exist. */
const ADDED_COLUMNS: { table: string; column: string; ddl: string }[] = [
  {
    table: "admin_users",
    column: "active",
    ddl: "ALTER TABLE admin_users ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1",
  },
]

async function migrate(connection: mysql.Connection) {
  console.log("\nRunning column migrations:")
  for (const { table, column, ddl } of ADDED_COLUMNS) {
    const [rows] = await connection.execute(
      `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column]
    )
    const exists = Number((rows as any)[0]?.n ?? 0) > 0
    if (exists) {
      console.log(`~ ${table}.${column} already present`)
      continue
    }
    try {
      await connection.execute(ddl)
      console.log(`✓ added ${table}.${column}`)
    } catch (err: any) {
      console.error(`✗ ${table}.${column}: ${err.message}`)
    }
  }
}

main().catch(console.error)
