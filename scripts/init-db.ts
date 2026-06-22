import mysql from "mysql2/promise"
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"

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
    uri: process.env.DATABASE_URL,
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

  await connection.end()
  console.log("\nDatabase initialized!")
}

main().catch(console.error)
