import { describe, expect, it } from "vitest";
import { exampleRepository } from "@/data/example-repository";

describe("exampleRepository", () => {
  it("renvoie une liste vide", async () => {
    expect(await exampleRepository.list()).toEqual([]);
  });
});
