import { describe, expect, it } from "vitest";
import { INITIAL_STAGE, canAdvance, nextStage } from "@/services/stages";

describe("étapes du pipeline", () => {
  it("commence à « à contacter »", () => {
    expect(INITIAL_STAGE).toBe("a_contacter");
  });

  it("avance dans l'ordre À contacter → Contacté → Proposition envoyée → Gagné", () => {
    expect(nextStage("a_contacter")).toBe("contacte");
    expect(nextStage("contacte")).toBe("proposition_envoyee");
    expect(nextStage("proposition_envoyee")).toBe("gagne");
  });

  it("n'a pas d'étape après Gagné ni après Perdu", () => {
    expect(nextStage("gagne")).toBeNull();
    expect(nextStage("perdu")).toBeNull();
  });

  it("ne permet plus d'avancer un contact Gagné ou Perdu", () => {
    expect(canAdvance("a_contacter")).toBe(true);
    expect(canAdvance("contacte")).toBe(true);
    expect(canAdvance("proposition_envoyee")).toBe(true);
    expect(canAdvance("gagne")).toBe(false);
    expect(canAdvance("perdu")).toBe(false);
  });
});
