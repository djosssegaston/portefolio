import { NextRequest, NextResponse } from "next/server"
import { query, getPool } from "@/lib/db"

const WA_NUMBER = "22901234567"

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 })
    }

    const timestamp = Date.now()
    const id = `msg_${timestamp}`
    const displayName = name?.trim() || "Visiteur"

    const pool = await getPool()
    await pool.execute(
      `INSERT INTO chat_messages (id, name, message, timestamp, src) VALUES (?, ?, ?, FROM_UNIXTIME(?/1000), 'client')`,
      [id, displayName, message.trim(), timestamp]
    )

    const text = `📩 *Nouveau message du site web*\n\n*De:* ${displayName}\n*Message:* ${message.trim()}`
    const waUrl = `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(text)}`

    return NextResponse.json({
      success: true,
      message: { id, name: displayName, message: message.trim(), timestamp, from: "client" },
      waUrl,
    })
  } catch (error) {
    console.error("Chat send error:", error)
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 })
  }
}
