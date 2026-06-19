"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, Bot, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatPage() {
  const [messages, setMessages] = useState<{ id: string; name: string; message: string; timestamp: number; from: string }[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("chat_name")
    if (stored) setName(stored)
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadMessages = async () => {
    try {
      const res = await fetch("/api/chat/messages")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {}
  }

  const handleSend = async () => {
    if (!text.trim() || sending) return
    const displayName = name.trim() || "Visiteur"
    if (!name.trim()) {
      sessionStorage.setItem("chat_name", displayName)
      setName(displayName)
    }
    setSending(true)
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, message: text.trim() }),
      })
      setText("")
      await loadMessages()
    } catch {}
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Messagerie <span className="gradient-text">Instantanée</span>
          </h1>
          <p className="mt-2 text-secondary">
            Posez votre question, je vous réponds en temps réel
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3">
            <Bot className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Assistant DJOSSE Adechina</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              En ligne
            </span>
          </div>

          <div className="h-[400px] space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucun message pour le moment</p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Laissez un message, je vous répondrai rapidement
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.from === "client"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.from !== "client" && (
                    <p className="mb-0.5 text-xs font-medium text-primary">Assistant</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="mt-1 text-right text-[10px] opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Votre nom..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-32 text-sm bg-muted border-0"
              />
              <Input
                placeholder="Écrivez votre message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-muted border-0"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!text.trim() || sending}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground text-center">
              Les messages sont envoyés directement à mon WhatsApp. Je vous réponds depuis l&apos;application.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
