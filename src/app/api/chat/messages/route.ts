import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const chatsPath = path.join(process.cwd(), "src", "lib", "data", "chats.json")

export async function GET(_req: NextRequest) {
  try {
    const data = await readFile(chatsPath, "utf-8")
      .then((d) => JSON.parse(d))
      .catch(() => [])

    return NextResponse.json({ messages: data })
  } catch (error) {
    console.error("Chat messages error:", error)
    return NextResponse.json({ messages: [] })
  }
}
