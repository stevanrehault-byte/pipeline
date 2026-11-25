import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDbClient, getDb, migrate } from "@/data/db";

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
    const result = await client.execute("SELECT name, stage, follow_up_at FROM contacts");
    client.close();

    expect(
      result.rows.map((row) => ({ name: row.name, stage: row.stage, followUp: row.follow_up_at })),
    ).toEqual([{ name: "stev", stage: "a_contacter", followUp: null }]);
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
    expect(columns.rows.map((row) => row.name)).toContain("follow_up_at");
  });

  it("migre sans écrire PRAGMA user_version, interdit par Turso", async () => {
    const real = createClient({ url: ":memory:" });
    const forbidden = /^\s*PRAGMA\s+user_version\s*=/i;
    const check = (statement: unknown) => {
      const sql = typeof statement === "string" ? statement : (statement as { sql: string }).sql;
      if (forbidden.test(sql)) throw new Error(`SQL not allowed statement: ${sql}`);
    };
    // Client qui se comporte comme Turso : il refuse d'écrire user_version.
    const tursoLike = new Proxy(real, {
      get(target, prop, receiver) {
        if (prop === "execute") {
          return (statement: unknown) => {
            check(statement);
            return target.execute(statement as never);
          };
        }
        if (prop === "batch") {
          return (statements: unknown[], mode: never) => {
            statements.forEach(check);
            return target.batch(statements as never, mode);
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });

    await migrate(tursoLike);
    const columns = await real.execute("PRAGMA table_info(contacts)");
    real.close();

    expect(columns.rows.map((row) => row.name)).toEqual(
      expect.arrayContaining(["id", "name", "stage", "follow_up_at"]),
    );
  });

  it("reprend une base locale déjà en version 2 sans rejouer les anciennes versions", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "lot2.db")}`;

    // Base telle que le lot 2 l'a laissée : colonne stage, user_version 2.
    const old = createClient({ url });
    await old.execute(
      "CREATE TABLE contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT, created_at TEXT NOT NULL, stage TEXT NOT NULL DEFAULT 'a_contacter')",
    );
    await old.execute("PRAGMA user_version = 2");
    old.close();

    const client = await createDbClient(url);
    const columns = await client.execute("PRAGMA table_info(contacts)");
    client.close();

    expect(columns.rows.map((row) => row.name)).toContain("follow_up_at");
  });
});
