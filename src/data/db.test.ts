import { afterEach, describe, expect, it, vi } from "vitest";
import { getDb } from "@/data/db";

describe("getDb", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuse de démarrer sans DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await expect(getDb()).rejects.toThrow(/DATABASE_URL/);
  });
});
