import { describe, expect, it, vi } from "vitest";
import type { Contact, ContactRepository, NewContact, Stage } from "@/data/contact-repository";
import { createContactService } from "@/services/contact-service";

function createFakeRepository(initial: Contact[] = []) {
  const contacts: Contact[] = [...initial];
  const repository = {
    list: vi.fn(async () => [...contacts].reverse()),
    create: vi.fn(async (input: NewContact) => {
      const contact: Contact = {
        id: String(contacts.length + 1),
        ...input,
        createdAt: "2026-11-22T10:00:00.000Z",
      };
      contacts.push(contact);
      return contact;
    }),
    findById: vi.fn(async (id: string) => contacts.find((c) => c.id === id) ?? null),
    updateStage: vi.fn(async (id: string, stage: Stage) => {
      const contact = contacts.find((c) => c.id === id);
      if (contact) contact.stage = stage;
    }),
  } satisfies ContactRepository;
  return repository;
}

function contactAt(stage: Stage): Contact {
  return {
    id: "c1",
    name: "Camille Martin",
    company: null,
    stage,
    createdAt: "2026-11-22T10:00:00.000Z",
  };
}

describe("contact service", () => {
  it("ajoute un contact qui apparaît ensuite dans la liste", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    const result = await service.addContact({
      name: "Camille Martin",
      company: "Boulangerie Martin",
    });

    expect(result.ok).toBe(true);
    expect(await service.listContacts()).toEqual([
      expect.objectContaining({
        name: "Camille Martin",
        company: "Boulangerie Martin",
      }),
    ]);
  });

  it("retire les espaces autour du nom et de l'entreprise", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    await service.addContact({ name: "  Camille Martin ", company: " Boulangerie Martin  " });

    expect(repository.create).toHaveBeenCalledWith({
      name: "Camille Martin",
      company: "Boulangerie Martin",
      stage: "a_contacter",
    });
  });

  it("enregistre une entreprise vide comme absente (null)", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    await service.addContact({ name: "Camille Martin", company: "   " });

    expect(repository.create).toHaveBeenCalledWith({
      name: "Camille Martin",
      company: null,
      stage: "a_contacter",
    });
  });

  it.each(["", "   "])(
    "refuse un nom vide (%j) sans rien créer",
    async (name) => {
      const repository = createFakeRepository();
      const service = createContactService(repository);

      const result = await service.addContact({ name, company: "Boulangerie Martin" });

      expect(result).toEqual({ ok: false, error: "Le nom est obligatoire." });
      expect(repository.create).not.toHaveBeenCalled();
      expect(await service.listContacts()).toEqual([]);
    },
  );

  it("crée un nouveau contact à l'étape « À contacter »", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    const result = await service.addContact({ name: "Camille Martin", company: "" });

    expect(result.ok && result.contact.stage).toBe("a_contacter");
  });

  it("fait passer un contact « Contacté » à « Proposition envoyée »", async () => {
    const repository = createFakeRepository([contactAt("contacte")]);
    const service = createContactService(repository);

    const result = await service.advanceContact("c1");

    expect(result).toEqual({ ok: true });
    expect(repository.updateStage).toHaveBeenCalledWith("c1", "proposition_envoyee");
  });

  it.each(["gagne", "perdu"] as const)(
    "refuse de faire avancer un contact « %s »",
    async (stage) => {
      const repository = createFakeRepository([contactAt(stage)]);
      const service = createContactService(repository);

      const result = await service.advanceContact("c1");

      expect(result).toEqual({ ok: false, error: "Ce contact ne peut plus avancer." });
      expect(repository.updateStage).not.toHaveBeenCalled();
    },
  );

  it("marque perdu un contact en cours", async () => {
    const repository = createFakeRepository([contactAt("proposition_envoyee")]);
    const service = createContactService(repository);

    const result = await service.markContactLost("c1");

    expect(result).toEqual({ ok: true });
    expect(repository.updateStage).toHaveBeenCalledWith("c1", "perdu");
  });

  it.each(["gagne", "perdu"] as const)(
    "refuse de marquer perdu un contact déjà « %s »",
    async (stage) => {
      const repository = createFakeRepository([contactAt(stage)]);
      const service = createContactService(repository);

      const result = await service.markContactLost("c1");

      expect(result).toEqual({ ok: false, error: "Ce contact ne peut plus avancer." });
      expect(repository.updateStage).not.toHaveBeenCalled();
    },
  );

  it("refuse un contact introuvable", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    expect(await service.advanceContact("inconnu")).toEqual({
      ok: false,
      error: "Contact introuvable.",
    });
    expect(await service.markContactLost("inconnu")).toEqual({
      ok: false,
      error: "Contact introuvable.",
    });
    expect(repository.updateStage).not.toHaveBeenCalled();
  });
});
