import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDbClient, getDb } from "@/data/db";

describe("getDb", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuse de démarrer sans DATABASE_URL", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await expect(getDb()).rejects.toThrow(/DATABASE_URL/);
  });
});

describe("createDbClient : migration du schéma", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("ajoute l'étape « a_contacter » aux contacts d'une base créée par le lot 1", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "lot1.db")}`;

    // Base telle que le lot 1 l'a créée : table sans colonne stage, user_version 0.
    const old = createClient({ url });
    await old.execute(
      "CREATE TABLE contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT, created_at TEXT NOT NULL)",
    );
    await old.execute(
      "INSERT INTO contacts (id, name, company, created_at) VALUES ('1', 'stev', 'digi', '2026-11-22T13:08:20.430Z')",
    );
    old.close();

    const client = await createDbClient(url);
    const result = await client.execute("SELECT name, stage FROM contacts");
    client.close();

    expect(result.rows.map((row) => ({ name: row.name, stage: row.stage }))).toEqual([
      { name: "stev", stage: "a_contacter" },
    ]);
  });

  it("peut rouvrir une base déjà migrée sans erreur", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "test.db")}`;

    (await createDbClient(url)).close();
    const again = await createDbClient(url);
    const columns = await again.execute("PRAGMA table_info(contacts)");
    again.close();

    expect(columns.rows.map((row) => row.name)).toContain("stage");
  });
});
