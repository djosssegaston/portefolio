"use client"

import { motion } from "framer-motion"

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "48px 24px", "0px 0px"],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
          rotate: 45,
        }}
        animate={{
          backgroundPosition: ["0px 0px", "-48px -24px", "0px 0px"],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(37,99,235,0.4) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 80% 20%, rgba(37,99,235,0.4) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(6,182,212,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 50% 90%, rgba(37,99,235,0.35) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 10%, rgba(6,182,212,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(37,99,235,0.4) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}
