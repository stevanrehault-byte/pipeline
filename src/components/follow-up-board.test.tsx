import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FollowUpBoard } from "@/components/follow-up-board";
import type { Contact } from "@/data/contact-repository";
import type { DueFollowUp } from "@/services/follow-ups";

const noop = async () => {};

function due(lateDays: number, overrides: Partial<Contact> = {}): DueFollowUp {
  return {
    lateDays,
    contact: {
      id: "c1",
      name: "Camille Martin",
      company: "Boulangerie Martin",
      stage: "contacte",
      followUpAt: "2026-11-24T09:30",
      createdAt: "2026-11-20T10:00:00.000Z",
      ...overrides,
    },
  };
}

function render(items: DueFollowUp[]) {
  return renderToStaticMarkup(<FollowUpBoard items={items} completeAction={noop} />);
}

describe("FollowUpBoard", () => {
  it("est un tableau sémantique avec l'heure, le contact et son entreprise", () => {
    const html = render([due(0)]);

    expect(html).toContain("<table");
    expect(html).toContain("<th");
    expect(html).toContain("09:30");
    expect(html).toContain("Camille Martin");
    expect(html).toContain("Boulangerie Martin");
  });

  it("marque une relance d'hier « RETARD 1 J » en ambre", () => {
    const html = render([due(1)]);

    expect(html).toMatch(/<span[^>]*text-primary[^>]*>RETARD 1 J<\/span>/);
  });

  it("marque une relance du jour « À L'HEURE »", () => {
    const html = render([due(0, { followUpAt: "2026-11-25T09:30" })]);

    expect(html).toContain("À L&#x27;HEURE");
    expect(html).not.toContain("RETARD");
  });

  it("dit qu'il n'y a personne à relancer quand rien n'est dû", () => {
    const html = render([]);

    expect(html).toContain("Personne à relancer aujourd&#x27;hui.");
    expect(html).not.toContain("<table");
  });

  it("propose de marquer chaque relance comme faite", () => {
    const html = render([due(0)]);

    expect(html).toMatch(/<button[^>]*>Fait<\/button>/);
  });
});
