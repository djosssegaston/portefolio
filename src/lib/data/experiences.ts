import { Experience } from "@/types";
import { experience } from "@/app/(public)/a-propos/about-data";

const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function parseFrenchDate(value: string, fallback: string) {
  const normalized = value.toLowerCase();
  const year = normalized.match(/\d{4}/)?.[0];
  if (!year) return fallback;
  const monthIndex = months.findIndex((month) => normalized.includes(month));
  const month = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, "0") : "01";
  return `${year}-${month}-01`;
}

export const experiences: Experience[] = experience.map((item, index) => {
  const [start, end] = item.period.split("—").map((part) => part.trim());
  return {
    id: `exp-${String(index + 1).padStart(2, "0")}`,
    company: item.company,
    position: item.role,
    location: item.location || "Bénin",
    startDate: parseFrenchDate(start, "2025-01-01"),
    endDate: item.status === "En poste" ? undefined : parseFrenchDate(end ?? start, "2026-06-30"),
    current: item.status === "En poste",
    description: item.summary,
    achievements: item.missions,
  };
});
