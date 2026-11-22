import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createDbClient } from "@/data/db";
import { createLibsqlContactRepository } from "@/data/contact-repository";

describe("ContactRepository (libsql)", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("crée un contact puis le retrouve dans la liste", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    const created = await repo.create({
      name: "Camille Martin",
      company: "Boulangerie Martin",
    });

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(await repo.list()).toEqual([created]);
    client.close();
  });

  it("garde une entreprise absente à null", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    await repo.create({ name: "Camille Martin", company: null });

    const [contact] = await repo.list();
    expect(contact.company).toBeNull();
    client.close();
  });

  it("liste les contacts du plus récent au plus ancien", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    await repo.create({ name: "Premier", company: null });
    await repo.create({ name: "Deuxième", company: null });

    const names = (await repo.list()).map((contact) => contact.name);
    expect(names).toEqual(["Deuxième", "Premier"]);
    client.close();
  });

  it("retrouve le contact après redémarrage (nouveau client sur le même fichier)", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "test.db")}`;

    const first = await createDbClient(url);
    await createLibsqlContactRepository(first).create({
      name: "Camille Martin",
      company: "Boulangerie Martin",
    });
    first.close();

    const second = await createDbClient(url);
    const contacts = await createLibsqlContactRepository(second).list();
    second.close();

    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toMatchObject({
      name: "Camille Martin",
      company: "Boulangerie Martin",
    });
  });
});
