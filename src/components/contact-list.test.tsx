import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactList } from "@/components/contact-list";

describe("ContactList", () => {
  it("affiche chaque contact avec son entreprise", () => {
    const html = renderToStaticMarkup(
      <ContactList
        contacts={[
          {
            id: "1",
            name: "Camille Martin",
            company: "Boulangerie Martin",
            createdAt: "2026-11-22T10:00:00.000Z",
          },
        ]}
      />,
    );

    expect(html).toContain("<li");
    expect(html).toContain("Camille Martin");
    expect(html).toContain("Boulangerie Martin");
  });

  it("n'affiche rien pour l'entreprise quand elle est absente", () => {
    const html = renderToStaticMarkup(
      <ContactList
        contacts={[
          { id: "1", name: "Camille Martin", company: null, createdAt: "2026-11-22T10:00:00.000Z" },
        ]}
      />,
    );

    expect(html).toContain("Camille Martin");
    expect(html).not.toContain("null");
  });

  it("affiche un message d'état vide quand il n'y a aucun contact", () => {
    const html = renderToStaticMarkup(<ContactList contacts={[]} />);

    expect(html).toContain("Aucun contact pour l&#x27;instant.");
    expect(html).not.toContain("<li");
  });
});
