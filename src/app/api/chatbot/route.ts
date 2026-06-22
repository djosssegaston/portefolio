import { NextRequest } from "next/server"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { buildContext, buildSystemPrompt } from "@/lib/rag"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId") || "anonymous"

    const { messages } = await req.json()
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages requis" }), { status: 400 })
    }

    const context = buildContext()
    const systemPrompt = buildSystemPrompt(context)

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages.slice(-10),
      onFinish: async ({ text }) => {
        try {
          const { getPool } = await import("@/lib/db")
          const pool = await getPool()
          const userMsg = messages[messages.length - 1]
          const userContent = userMsg.content || userMsg.parts?.map((p: any) => p.text).filter(Boolean).join("") || ""
          const ts = new Date().toISOString()
          pool.execute(
            "INSERT INTO chatbot_conversations (id, session_id, role, content) VALUES (?, ?, ?, ?)",
            [`chatbot_${Date.now()}`, sessionId, "user", userContent]
          )
          pool.execute(
            "INSERT INTO chatbot_conversations (id, session_id, role, content) VALUES (?, ?, ?, ?)",
            [`chatbot_${Date.now() + 1}`, sessionId, "assistant", text]
          )
        } catch { /* DB indisponible — chat fonctionne quand même */ }
      },
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error("Chatbot API error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne du serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
