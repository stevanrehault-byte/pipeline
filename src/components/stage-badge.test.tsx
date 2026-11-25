import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StageBadge } from "@/components/stage-badge";

describe("StageBadge", () => {
  it.each([
    ["a_contacter", "À contacter"],
    ["contacte", "Contacté"],
    ["proposition_envoyee", "Proposition envoyée"],
    ["gagne", "Gagné"],
    ["perdu", "Perdu"],
  ] as const)("écrit l'étape « %s » en toutes lettres : %s", (stage, label) => {
    expect(renderToStaticMarkup(<StageBadge stage={stage} />)).toContain(`>${label}<`);
  });

  it("affiche Perdu en rouge atténué (texte destructive sur fond teinté)", () => {
    const html = renderToStaticMarkup(<StageBadge stage="perdu" />);
    expect(html).toMatch(/class="[^"]*text-destructive[^"]*"/);
    expect(html).toMatch(/class="[^"]*bg-destructive\/15[^"]*"/);
  });

  it("affiche Gagné en vert success", () => {
    const html = renderToStaticMarkup(<StageBadge stage="gagne" />);
    expect(html).toMatch(/class="[^"]*text-success[^"]*"/);
  });

  it("n'utilise jamais l'ambre pour une étape", () => {
    for (const stage of ["a_contacter", "contacte", "proposition_envoyee", "gagne", "perdu"] as const) {
      expect(renderToStaticMarkup(<StageBadge stage={stage} />)).not.toMatch(/primary/);
    }
  });
});
