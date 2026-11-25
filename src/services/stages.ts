// Couche service : règles métier des étapes du pipeline.
// À contacter → Contacté → Proposition envoyée → Gagné, et Perdu à part.
// Gagné et Perdu sont finaux : un contact n'en sort plus.

import type { Stage } from "@/data/contact-repository";

export const INITIAL_STAGE: Stage = "a_contacter";

const NEXT: Record<Stage, Stage | null> = {
  a_contacter: "contacte",
  contacte: "proposition_envoyee",
  proposition_envoyee: "gagne",
  gagne: null,
  perdu: null,
};

export function nextStage(stage: Stage): Stage | null {
  return NEXT[stage];
}

export function canAdvance(stage: Stage): boolean {
  return nextStage(stage) !== null;
}
