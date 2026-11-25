import { describe, expect, it } from "vitest";
import type { Contact } from "@/data/contact-repository";
import {
  dueFollowUps,
  formatFollowUp,
  parisToday,
  toFollowUp,
} from "@/services/follow-ups";

function contact(overrides: Partial<Contact>): Contact {
  return {
    id: "1",
    name: "Camille Martin",
    company: "Boulangerie Martin",
    stage: "contacte",
    followUpAt: null,
    createdAt: "2026-11-20T10:00:00.000Z",
    ...overrides,
  };
}

// 16:00 UTC = 23:00 en Thaïlande = 17:00 à Paris (heure d'hiver).
const NOW = new Date("2026-11-25T16:00:00Z");

describe("relances : heure de Paris", () => {
  it("calcule « aujourd'hui » au jour de Paris (23:00 en Thaïlande, 17:00 à Paris)", () => {
    expect(parisToday(NOW)).toBe("2026-11-25");
  });

  it("reste sur le jour de Paris quand la Thaïlande est déjà le lendemain", () => {
    // 18:30 UTC = 01:30 le 26 en Thaïlande, mais 19:30 le 25 à Paris.
    expect(parisToday(new Date("2026-11-25T18:30:00Z"))).toBe("2026-11-25");
  });

  it("enregistre l'heure saisie telle quelle, en heure de Paris", () => {
    expect(toFollowUp("2026-11-25", "09:30")).toBe("2026-11-25T09:30");
  });

  it("refuse une date ou une heure invalide", () => {
    expect(toFollowUp("", "09:30")).toBeNull();
    expect(toFollowUp("2026-11-25", "")).toBeNull();
    expect(toFollowUp("2026-13-40", "09:30")).toBeNull();
    expect(toFollowUp("2026-11-25", "25:99")).toBeNull();
  });

  it("affiche « 25/11 · 09:30 (heure de Paris) »", () => {
    expect(formatFollowUp("2026-11-25T09:30")).toBe("25/11 · 09:30 (heure de Paris)");
  });
});

describe("relances du jour", () => {
  const yesterday = contact({ id: "hier", followUpAt: "2026-11-24T10:00" });
  const today = contact({ id: "aujourdhui", followUpAt: "2026-11-25T09:30" });
  const tomorrow = contact({ id: "demain", followUpAt: "2026-11-26T08:00" });

  it("garde celles d'hier et d'aujourd'hui, pas celle de demain", () => {
    const ids = dueFollowUps([tomorrow, today, yesterday], NOW).map((d) => d.contact.id);
    expect(ids).toEqual(["hier", "aujourdhui"]);
  });

  it("compte les jours de retard (1 J pour hier, 0 pour aujourd'hui)", () => {
    const due = dueFollowUps([yesterday, today], NOW);
    expect(due.map((d) => d.lateDays)).toEqual([1, 0]);
  });

  it("trie par date puis par heure de Paris", () => {
    const early = contact({ id: "tot", followUpAt: "2026-11-25T08:00" });
    const ids = dueFollowUps([today, early], NOW).map((d) => d.contact.id);
    expect(ids).toEqual(["tot", "aujourdhui"]);
  });

  it.each(["gagne", "perdu"] as const)(
    "exclut un contact « %s » même s'il a encore une relance",
    (stage) => {
      expect(dueFollowUps([contact({ stage, followUpAt: "2026-11-25T09:30" })], NOW)).toEqual([]);
    },
  );

  it("ignore les contacts sans relance", () => {
    expect(dueFollowUps([contact({ followUpAt: null })], NOW)).toEqual([]);
  });
});
