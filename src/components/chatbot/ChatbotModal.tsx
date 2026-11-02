"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Minimize2, Send, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

type Message = { id: string; role: "user" | "assistant"; content: string };

export default function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).slice(2));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const teaser = teaserRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!teaser || !backdrop || !panel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isOpen) {
      if (reduced) {
        gsap.set(teaser, { autoAlpha: 0 });
        gsap.set([backdrop, panel], { autoAlpha: 1, y: 0, scale: 1 });
      } else {
        gsap.to(teaser, { autoAlpha: 0, x: 14, scale: 0.9, duration: 0.22 });
        gsap.to(backdrop, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 42, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
        );
      }
    } else {
      if (reduced) {
        gsap.set([backdrop, panel], { autoAlpha: 0 });
        gsap.set(teaser, { autoAlpha: 1, x: 0, scale: 1 });
      } else {
        gsap.to(panel, {
          autoAlpha: 0,
          y: 30,
          scale: 0.97,
          duration: 0.24,
          ease: "power2.in",
        });
        gsap.to(backdrop, { autoAlpha: 0, duration: 0.2 });
        gsap.fromTo(
          teaser,
          { autoAlpha: 0, x: 18, scale: 0.86 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
        );
      }
    }

  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [isOpen]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !isOpen) return;
    const bubbles = panel.querySelectorAll<HTMLElement>("[data-chat-message]");
    if (bubbles.length === messageCountRef.current) return;

    const fresh = Array.from(bubbles).slice(messageCountRef.current);
    messageCountRef.current = bubbles.length;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.fromTo(
      fresh,
      { autoAlpha: 0, y: 12, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, [messages.length, isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;
      setIsStreaming(true);

      const userMsg: Message = {
        id: "u_" + Date.now(),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch(`/api/chatbot?sessionId=${sessionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Erreur inconnue" }));
          setMessages((prev) => [
            ...prev,
            { id: "e_" + Date.now(), role: "assistant", content: "❌ " + err.error },
          ]);
          setIsStreaming(false);
          return;
        }

        const assistantId = "a_" + Date.now();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          setIsStreaming(false);
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        }
      } catch (error) {
        const err = error as Error;
        if (err.name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            { id: "e_" + Date.now(), role: "assistant", content: "❌ Erreur de connexion" },
          ]);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, sessionId, isStreaming],
  );

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div
          ref={teaserRef}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 shadow-lg shadow-primary/10",
            isOpen && "pointer-events-none",
          )}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-hidden={isOpen}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-xs font-semibold text-transparent">
            Nous sommes en ligne
          </span>
        </div>
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/50 active:scale-95"
          aria-label="Assistant IA"
        >
          <svg
            className="relative z-10 h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10a7 7 0 0 1-14 0" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
          </svg>
          <span className="absolute inset-0 scale-0 rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-100" />
        </button>
      </div>

      <div
        ref={backdropRef}
        className={cn(
          "invisible fixed inset-0 z-50 bg-black/40 opacity-0 backdrop-blur-sm",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Assistant IA"
        aria-hidden={!isOpen}
        className={cn(
          "invisible fixed bottom-6 right-6 z-50 flex origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-card opacity-0 shadow-2xl transition-[width,height,max-height] duration-300 sm:bottom-24 sm:right-6",
          isMinimized
            ? "h-14 w-[160px] sm:w-[320px]"
            : "h-[70vh] w-[calc(100%-32px)] sm:h-[600px] sm:w-[400px] md:w-[450px] lg:w-[500px]",
        )}
        style={{ maxHeight: isMinimized ? "60px" : "calc(100vh - 48px)" }}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Ade IA</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-600">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isStreaming ? "animate-pulse bg-yellow-500" : "bg-emerald-500",
              )}
            />
            {isStreaming ? "Réflexion..." : "En ligne"}
          </span>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="ml-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted-foreground/10"
            aria-label={isMinimized ? "Agrandir" : "Réduire"}
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted-foreground/10"
            aria-label="Fermer"
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
                  <p className="mb-3 text-xs text-muted-foreground">
                    Posez-moi une question sur mon travail
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {[
                      "Quels sont tes projets ?",
                      "Quelles sont tes compétences ?",
                      "Parle-moi de ton parcours",
                    ].map((question) => (
                      <button
                        key={question}
                        onClick={() => sendMessage(question)}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] text-secondary transition-colors hover:bg-muted/80 hover:text-foreground"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {hasMessages &&
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    data-chat-message
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2",
                        msg.role === "user"
                          ? "rounded-br-md bg-primary text-white"
                          : "rounded-bl-md bg-muted text-foreground",
                      )}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={bottomRef} />
            </div>

            <div className="shrink-0 border-t border-border p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  placeholder="Votre message..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="h-9 flex-1 border-0 bg-muted text-sm"
                />
                <a
                  href="https://wa.me/0168552584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white transition-all duration-300 hover:scale-110 hover:bg-[#25D366]/90"
                  aria-label="WhatsApp"
                  title="Contactez-moi directement sur WhatsApp"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </a>
                {isStreaming ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={stopStreaming}
                    className="h-9 w-9"
                  >
                    <Square className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-9 w-9"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
