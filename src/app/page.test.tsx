import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "@/app/page";

describe("page d'accueil (démo du thème)", () => {
  const html = renderToStaticMarkup(<Home />);

  it("affiche le titre Pipeline", () => {
    expect(html).toMatch(/<h1[^>]*>Pipeline<\/h1>/);
  });

  it("affiche une carte de contact d'exemple avec son action", () => {
    expect(html).toContain("Camille Martin");
    expect(html).toContain("Relancer");
  });

  it("n'utilise plus les couleurs codées en dur du modèle Next", () => {
    expect(html).not.toMatch(/zinc-|bg-white|bg-black/);
  });
});
