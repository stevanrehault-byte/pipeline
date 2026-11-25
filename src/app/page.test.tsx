import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/services/contact-service", () => ({
  contactService: { listContacts: vi.fn(async () => []) },
}));
vi.mock("@/app/actions", () => ({
  addContactAction: vi.fn(),
  advanceContactAction: vi.fn(),
  markContactLostAction: vi.fn(),
}));

import Home from "@/app/page";

describe("page d'accueil", () => {
  const html = renderToStaticMarkup(<Home />);

  it("affiche le titre Pipeline", () => {
    expect(html).toMatch(/<h1[^>]*>Pipeline<\/h1>/);
  });

  it("affiche le formulaire d'ajout de contact", () => {
    expect(html).toMatch(/<input[^>]*name="name"/);
    expect(html).toContain("Ajouter");
  });

  it("ne montre plus le contact fictif de la démo", () => {
    expect(html).not.toContain("Camille Martin");
  });
});
