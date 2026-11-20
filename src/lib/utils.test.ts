import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("garde la dernière classe Tailwind en cas de conflit", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
