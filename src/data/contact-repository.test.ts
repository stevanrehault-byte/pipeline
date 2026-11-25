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
      stage: "a_contacter",
    });

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(await repo.list()).toEqual([created]);
    client.close();
  });

  it("garde une entreprise absente à null", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    await repo.create({ name: "Camille Martin", company: null, stage: "a_contacter" });

    const [contact] = await repo.list();
    expect(contact.company).toBeNull();
    client.close();
  });

  it("liste les contacts du plus récent au plus ancien", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    await repo.create({ name: "Premier", company: null, stage: "a_contacter" });
    await repo.create({ name: "Deuxième", company: null, stage: "a_contacter" });

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
      stage: "a_contacter",
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

  it("enregistre et relit l'étape du contact", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    const created = await repo.create({ name: "Camille Martin", company: null, stage: "contacte" });

    expect(created.stage).toBe("contacte");
    expect((await repo.list())[0].stage).toBe("contacte");
    client.close();
  });

  it("retrouve un contact par son id, ou null s'il n'existe pas", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);
    const created = await repo.create({ name: "Camille Martin", company: null, stage: "a_contacter" });

    expect(await repo.findById(created.id)).toEqual(created);
    expect(await repo.findById("inconnu")).toBeNull();
    client.close();
  });

  it("change l'étape et la retrouve après redémarrage", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "test.db")}`;

    const first = await createDbClient(url);
    const repo = createLibsqlContactRepository(first);
    const created = await repo.create({ name: "Camille Martin", company: null, stage: "contacte" });
    await repo.updateStage(created.id, "proposition_envoyee");
    first.close();

    const second = await createDbClient(url);
    const reloaded = await createLibsqlContactRepository(second).findById(created.id);
    second.close();

    expect(reloaded?.stage).toBe("proposition_envoyee");
  });

  it("crée un contact sans relance", async () => {
    const client = await createDbClient(":memory:");
    const repo = createLibsqlContactRepository(client);

    const created = await repo.create({ name: "Camille Martin", company: null, stage: "a_contacter" });

    expect(created.followUpAt).toBeNull();
    expect((await repo.list())[0].followUpAt).toBeNull();
    client.close();
  });

  it("enregistre la relance, la retrouve après redémarrage, puis l'efface", async () => {
    const dir = mkdtempSync(join(tmpdir(), "pipeline-test-"));
    tempDirs.push(dir);
    const url = `file:${join(dir, "test.db")}`;

    const first = await createDbClient(url);
    const repo = createLibsqlContactRepository(first);
    const created = await repo.create({ name: "Camille Martin", company: null, stage: "contacte" });
    await repo.updateFollowUp(created.id, "2026-11-25T09:30");
    first.close();

    const second = await createDbClient(url);
    const reopened = createLibsqlContactRepository(second);
    expect((await reopened.findById(created.id))?.followUpAt).toBe("2026-11-25T09:30");

    await reopened.updateFollowUp(created.id, null);
    second.close();

    const third = await createDbClient(url);
    const cleared = await createLibsqlContactRepository(third).findById(created.id);
    third.close();
    expect(cleared?.followUpAt).toBeNull();
  });
});
