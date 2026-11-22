import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AddContactForm } from "@/components/add-contact-form";

const noopAction = async () => ({ error: null });

describe("AddContactForm", () => {
  it("propose un champ nom, un champ entreprise et un bouton Ajouter", () => {
    const html = renderToStaticMarkup(<AddContactForm action={noopAction} />);

    expect(html).toMatch(/<input[^>]*name="name"/);
    expect(html).toMatch(/<input[^>]*name="company"/);
    expect(html).toContain("Nom");
    expect(html).toContain("Entreprise");
    expect(html).toContain("Ajouter");
    expect(html).not.toContain('aria-invalid="true"');
  });

  it("affiche le message « nom obligatoire » sous le champ nom", () => {
    const html = renderToStaticMarkup(
      <AddContactForm
        action={noopAction}
        initialState={{ error: "Le nom est obligatoire." }}
      />,
    );

    expect(html).toContain("Le nom est obligatoire.");
    expect(html).toMatch(/<input[^>]*name="name"[^>]*aria-invalid="true"|<input[^>]*aria-invalid="true"[^>]*name="name"/);
    expect(html).toMatch(/aria-describedby="name-error"/);
    expect(html).toMatch(/id="name-error"/);
  });
});
