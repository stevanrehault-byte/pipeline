import { describe, expect, it } from "vitest";
import type { ExampleRepository } from "@/data/example-repository";
import { createExampleService } from "@/services/example-service";

describe("createExampleService", () => {
  it("renvoie ce que fournit la couche données", async () => {
    const fakeRepository: ExampleRepository = {
      list: async () => [{ id: "1" }],
    };
    const service = createExampleService(fakeRepository);

    expect(await service.listExamples()).toEqual([{ id: "1" }]);
  });
});
