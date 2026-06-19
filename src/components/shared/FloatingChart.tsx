"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export default function FloatingChart() {
  return (
    <Link
      href="/statistiques"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-300"
      aria-label="Chatbot"
    >
      <MessageCircle className="h-5 w-5" />
    </Link>
  )
}
