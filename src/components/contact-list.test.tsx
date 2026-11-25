import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactList } from "@/components/contact-list";
import type { Contact, Stage } from "@/data/contact-repository";

const noop = async () => {};

function contact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: "1",
    name: "Camille Martin",
    company: "Boulangerie Martin",
    stage: "a_contacter",
    createdAt: "2026-11-22T10:00:00.000Z",
    ...overrides,
  };
}

function render(contacts: Contact[]) {
  return renderToStaticMarkup(
    <ContactList contacts={contacts} advanceAction={noop} markLostAction={noop} />,
  );
}

function renderAt(stage: Stage) {
  return render([contact({ stage })]);
}

describe("ContactList", () => {
  it("affiche chaque contact avec son entreprise", () => {
    const html = render([contact()]);

    expect(html).toContain("<li");
    expect(html).toContain("Camille Martin");
    expect(html).toContain("Boulangerie Martin");
  });

  it("n'affiche rien pour l'entreprise quand elle est absente", () => {
    const html = render([contact({ company: null })]);

    expect(html).toContain("Camille Martin");
    expect(html).not.toContain(">null<");
  });

  it("affiche un message d'état vide quand il n'y a aucun contact", () => {
    const html = render([]);

    expect(html).toContain("Aucun contact pour l&#x27;instant.");
    expect(html).not.toContain("<li");
  });

  it("montre l'étape de chaque contact", () => {
    expect(renderAt("a_contacter")).toContain(">À contacter<");
    expect(renderAt("contacte")).toContain(">Contacté<");
  });

  it("propose de passer à l'étape suivante et de marquer perdu", () => {
    const html = renderAt("contacte");

    expect(html).toContain("Passer à « Proposition envoyée »");
    expect(html).toMatch(/<button[^>]*>Perdu<\/button>/);
  });

  it.each(["gagne", "perdu"] as const)(
    "ne propose plus aucune action pour un contact « %s »",
    (stage) => {
      const html = renderAt(stage);

      expect(html).not.toContain("<button");
      expect(html).not.toContain("Passer à");
    },
  );
});
