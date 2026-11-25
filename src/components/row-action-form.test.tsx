import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RowActionForm } from "@/components/row-action-form";

const idle = { error: null };
const noopAction = async () => idle;

describe("RowActionForm", () => {
  it("affiche le bouton sans message quand tout va bien", () => {
    const html = renderToStaticMarkup(
      <RowActionForm action={noopAction}>
        <button type="submit">Fait</button>
      </RowActionForm>,
    );

    expect(html).toContain("<form");
    expect(html).toContain("Fait");
    expect(html).not.toContain('role="alert"');
  });

  it("affiche l'erreur renvoyée par l'action, en rouge et annoncée", () => {
    const html = renderToStaticMarkup(
      <RowActionForm action={noopAction} initialState={{ error: "Contact introuvable." }}>
        <button type="submit">Fait</button>
      </RowActionForm>,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("text-destructive");
    expect(html).toContain("Contact introuvable.");
  });
});
