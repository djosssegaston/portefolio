"use client";

import { motion } from "framer-motion";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import { siteConfig } from "@/lib/data/site-config";

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold text-center">
            À Propos de Moi
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-secondary-500 mt-4 max-w-2xl mx-auto text-lg">
            Découvrez mon parcours, ma vision et ma passion pour la technologie
          </motion.p>
        </div>
      </div>
      <About />
      <div className="container py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Ma Philosophie</h2>
          <div className="space-y-6 text-secondary-600 leading-relaxed">
            <p>Je crois fermement que la technologie est un puissant levier de transformation, capable de résoudre des problèmes complexes et d&apos;améliorer des vies. Chaque ligne de code que j&apos;écris est guidée par cette conviction profonde.</p>
            <p>Mon approche du développement va au-delà de la technique : je m&apos;efforce de comprendre les véritables besoins de mes clients, leurs défis et leurs aspirations, pour concevoir des solutions qui ont un impact réel et durable.</p>
            <p>Dans un monde numérique en constante évolution, je reste passionnément curieux, toujours à l&apos;affût des nouvelles technologies et des meilleures pratiques, pour offrir à mes clients des solutions à la pointe de l&apos;innovation.</p>
          </div>
        </motion.div>
      </div>
      <Skills />
    </div>
  );
}
