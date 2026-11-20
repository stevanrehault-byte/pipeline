import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ExampleList } from "@/components/example-list";

describe("ExampleList", () => {
  it("affiche chaque élément reçu", () => {
    const html = renderToStaticMarkup(<ExampleList items={[{ id: "a" }]} />);

    expect(html).toBe("<ul><li>a</li></ul>");
  });
});
