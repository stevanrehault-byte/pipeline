// Couche présentation : puce d'étape. Le libellé est toujours écrit en toutes
// lettres ; la couleur ne porte jamais seule le sens. Pas d'ambre : il est
// réservé à l'action et au retard.

import { cn } from "@/lib/utils";
import type { Stage } from "@/data/contact-repository";

export const STAGE_LABELS: Record<Stage, string> = {
  a_contacter: "À contacter",
  contacte: "Contacté",
  proposition_envoyee: "Proposition envoyée",
  gagne: "Gagné",
  perdu: "Perdu",
};

const STAGE_STYLES: Record<Stage, string> = {
  a_contacter: "bg-secondary text-secondary-foreground",
  contacte: "bg-secondary text-secondary-foreground",
  proposition_envoyee: "bg-secondary text-secondary-foreground",
  gagne: "bg-success/15 text-success",
  perdu: "bg-destructive/15 text-destructive",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn(
        "rounded-sm px-2 py-1 font-heading text-sm font-semibold uppercase tracking-wider whitespace-nowrap",
        STAGE_STYLES[stage],
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
