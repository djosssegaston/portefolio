import { NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { buildContext, buildSystemPrompt } from "@/lib/rag"
import { clientIp, isRateLimited } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_MESSAGES = 10
const MAX_MESSAGE_LENGTH = 4000
const MODEL = "openai/gpt-oss-120b"

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (isRateLimited(`chat:${ip}`, 20, 60 * 1000)) {
    return new Response(JSON.stringify({ error: "Trop de messages. Patientez un instant." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { searchParams } = new URL(req.url)
    const sessionId = (searchParams.get("sessionId") || "anonymous").slice(0, 100)

    const body = await req.json()
    const rawMessages = Array.isArray(body?.messages) ? body.messages : []
    const messages = rawMessages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_MESSAGES)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "messages requis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const context = await buildContext()
    const systemPrompt = buildSystemPrompt(context)

    const result = streamText({
      model: groq(MODEL),
      system: systemPrompt,
      messages,
      maxRetries: 2,
      onError: ({ error }) => {
        console.error("[api/chatbot] stream error:", error)
      },
      onFinish: async ({ text }) => {
        try {
          const { getPool } = await import("@/lib/db")
          const pool = await getPool()
          const userContent = messages[messages.length - 1].content
          const ts = new Date()
          await pool.execute(
            "INSERT INTO chatbot_conversations (id, session_id, role, content) VALUES (?, ?, ?, ?)",
            [randomUUID(), sessionId, "user", userContent]
          )
          await pool.execute(
            "INSERT INTO chatbot_conversations (id, session_id, role, content) VALUES (?, ?, ?, ?)",
            [randomUUID(), sessionId, "assistant", text]
          )
          void ts
        } catch {
          /* DB indisponible — le chat fonctionne quand même */
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error("[api/chatbot]", error?.message || error)
    return new Response(
      JSON.stringify({ error: "L'assistant est momentanément indisponible." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    )
  }
}
