import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

const chatsPath = path.join(process.cwd(), "src", "lib", "data", "chats.json")
const WA_NUMBER = "22901234567"

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 })
    }

    const timestamp = Date.now()
    const chatMessage = {
      id: `msg_${timestamp}`,
      name: name?.trim() || "Visiteur",
      message: message.trim(),
      timestamp,
      from: "client",
    }

    const current = await readFile(chatsPath, "utf-8")
      .then((d) => JSON.parse(d))
      .catch(() => [])

    current.push(chatMessage)
    await writeFile(chatsPath, JSON.stringify(current, null, 2), "utf-8")

    const text = `📩 *Nouveau message du site web*\n\n*De:* ${chatMessage.name}\n*Message:* ${chatMessage.message}`
    const waUrl = `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encodeURIComponent(text)}`

    return NextResponse.json({ success: true, message: chatMessage, waUrl })
  } catch (error) {
    console.error("Chat send error:", error)
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 })
  }
}
