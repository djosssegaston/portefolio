"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, User, Square, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = { id: string; role: "user" | "assistant"; content: string }

export default function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).slice(2))
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return
    setIsStreaming(true)

    const userMsg: Message = { id: "u_" + Date.now(), role: "user", content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    abortRef.current = new AbortController()

    try {
      const res = await fetch(`/api/chatbot?sessionId=${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur inconnue" }))
        setMessages((prev) => [...prev, { id: "e_" + Date.now(), role: "assistant", content: "❌ " + err.error }])
        setIsStreaming(false)
        return
      }

      const assistantId = "a_" + Date.now()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) { setIsStreaming(false); return }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        )
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => [...prev, { id: "e_" + Date.now(), role: "assistant", content: "❌ Erreur de connexion" }])
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [messages, sessionId, isStreaming])

  const stopStreaming = () => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const hasMessages = messages.length > 0

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false) }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Assistant IA"
      >
        <svg className="h-6 w-6 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10a7 7 0 0 1-14 0" />
          <line x1="12" y1="17" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="chatbot-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="chatbot-modal"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={
                isMinimized
                  ? { opacity: 1, y: 0, scale: 0.85, width: 320, height: 60 }
                  : { opacity: 1, y: 0, scale: 1, width: 400, height: 600 }
              }
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl origin-bottom-right sm:bottom-24 sm:right-6"
              style={{ maxHeight: "calc(100vh - 48px)" }}
            >
              <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3 shrink-0">
                <Bot className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Ade IA</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-600">
                  <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-yellow-500 animate-pulse" : "bg-emerald-500"}`} />
                  {isStreaming ? "Réflexion..." : "En ligne"}
                </span>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="ml-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted-foreground/10 transition-colors"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted-foreground/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {!hasMessages && (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <Bot className="mb-3 h-10 w-10 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground mb-3">
                          Posez-moi une question sur mon travail
                        </p>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {[
                            "Quels sont tes projets ?",
                            "Quelles sont tes compétences ?",
                            "Parle-moi de ton parcours",
                          ].map((q) => (
                            <button
                              key={q}
                              onClick={() => sendMessage(q)}
                              className="rounded-full bg-muted px-3 py-1 text-[11px] text-secondary hover:bg-muted/80 hover:text-foreground transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {hasMessages && messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
                            msg.role === "user"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  <div className="border-t border-border p-3 shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                      <Input
                        placeholder="Votre message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-muted border-0 h-9 text-sm"
                      />
                      <a
                        href="https://wa.me/0168552584"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#25D366]/90 hover:scale-110 transition-all duration-300 shrink-0"
                        aria-label="WhatsApp"
                        title="Contactez-moi directement sur WhatsApp"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                        </svg>
                      </a>
                      {isStreaming ? (
                        <Button type="button" size="icon" variant="outline" onClick={stopStreaming} className="h-9 w-9">
                          <Square className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button type="submit" size="icon" disabled={!input.trim()} className="h-9 w-9">
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
