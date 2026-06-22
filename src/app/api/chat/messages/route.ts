import { NextRequest, NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export async function GET(_req: NextRequest) {
  try {
    const pool = await getPool()
    const [rows]: any = await pool.execute(
      "SELECT id, name, message, UNIX_TIMESTAMP(timestamp) * 1000 as timestamp, src as `from` FROM chat_messages ORDER BY timestamp ASC"
    )

    const messages = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      timestamp: Number(row.timestamp),
      from: row.from,
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Chat messages error:", error)
    return NextResponse.json({ messages: [] })
  }
}
