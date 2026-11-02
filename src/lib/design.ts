/**
 * Single source of truth for the visual identity.
 *
 * The whole site uses one blue/cyan "signal" palette. Media covers are dark
 * navy gradients so that projects, articles and events cannot drift into
 * different colour families.
 */
export const brandGradients = [
  "from-[#05070F] via-[#122A4D] to-[#0E7490]",
  "from-[#05070F] via-[#1E3A8A] to-[#0891B2]",
  "from-[#05070F] via-[#172554] to-[#06B6D4]",
  "from-[#07101F] via-[#1D4ED8] to-[#155E75]",
  "from-[#05070F] via-[#0F2A5C] to-[#22D3EE]",
] as const;

export function brandGradient(index: number) {
  return brandGradients[index % brandGradients.length];
}

export const brandIconTones = [
  "bg-primary/[0.08] text-primary",
  "bg-accent/[0.08] text-accent-700",
  "bg-slate-900/[0.06] text-slate-700",
] as const;

export function brandIconTone(index: number) {
  return brandIconTones[index % brandIconTones.length];
}
