"use client"

import Link from "next/link"

export default function FloatingChart() {
  return (
    <Link
      href="/statistiques"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
      aria-label="Statistiques"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12 L12 3 A9 9 0 0 1 19.79 16.5 Z" fill="currentColor" fillOpacity="0.35" stroke="none" />
        <path d="M12 12 L19.79 16.5 A9 9 0 0 1 4.21 16.5 Z" fill="currentColor" fillOpacity="0.15" stroke="none" />
        <path d="M12 12 L4.21 16.5 A9 9 0 0 1 12 3 Z" fill="currentColor" fillOpacity="0.5" stroke="none" />
      </svg>
    </Link>
  )
}
