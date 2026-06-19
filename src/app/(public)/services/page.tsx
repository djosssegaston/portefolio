"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Contact from "@/components/sections/Contact";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Globe: Icons.Globe,
  Smartphone: Icons.Smartphone,
  Cloud: Icons.Cloud,
  Wrench: Icons.Wrench,
  Lightbulb: Icons.Lightbulb,
  TrendingUp: Icons.TrendingUp,
  SearchCheck: Icons.SearchCheck,
  GraduationCap: Icons.GraduationCap,
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-b from-primary-50/50 to-background py-20">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold text-center">
            Mes Services
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-secondary-500 mt-4 max-w-2xl mx-auto text-lg">
            Des solutions digitales complètes pour propulser votre activité
          </motion.p>
        </div>
      </div>
      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] || Icons.Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
                    <p className="text-secondary-500 mb-4">{service.longDescription}</p>
                    {service.price && (
                      <Badge variant="secondary" className="mb-4">{service.price}</Badge>
                    )}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="group/btn">
                      <Link href="/contact">
                        Demander un devis
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Contact />
    </div>
  );
}
