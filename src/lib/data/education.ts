import { Education } from "@/types";
import { education as realEducation } from "@/app/(public)/a-propos/about-data";

const fields = [
  "Systèmes Informatiques et Logiciels",
  "Analyse de données",
  "Série D",
];

export const education: Education[] = realEducation.map((item, index) => ({
  id: `edu-${String(index + 1).padStart(2, "0")}`,
  institution: item.institution,
  degree: item.degree,
  field: fields[index] ?? item.degree,
  startDate: `${item.year}-01-01`,
  endDate: `${item.year}-12-31`,
  current: false,
  description: item.description,
  highlights: [],
}));
