import { describe, expect, it, vi } from "vitest";
import type { Contact, ContactRepository } from "@/data/contact-repository";
import { createContactService } from "@/services/contact-service";

function createFakeRepository() {
  const contacts: Contact[] = [];
  const repository = {
    list: vi.fn(async () => [...contacts].reverse()),
    create: vi.fn(async (input: { name: string; company: string | null }) => {
      const contact: Contact = {
        id: String(contacts.length + 1),
        ...input,
        createdAt: "2026-11-22T10:00:00.000Z",
      };
      contacts.push(contact);
      return contact;
    }),
  } satisfies ContactRepository;
  return repository;
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
    });
  });

  it("enregistre une entreprise vide comme absente (null)", async () => {
    const repository = createFakeRepository();
    const service = createContactService(repository);

    await service.addContact({ name: "Camille Martin", company: "   " });

    expect(repository.create).toHaveBeenCalledWith({
      name: "Camille Martin",
      company: null,
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
});
