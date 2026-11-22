// Couche service : règles métier des contacts. Reçoit la couche données en
// paramètre et ne connaît jamais la base qui est derrière.

import {
  contactRepository,
  type Contact,
  type ContactRepository,
} from "@/data/contact-repository";

export type AddContactInput = { name: string; company: string };

export type AddContactResult =
  | { ok: true; contact: Contact }
  | { ok: false; error: string };

export function createContactService(repository: ContactRepository) {
  return {
    listContacts() {
      return repository.list();
    },

    async addContact(input: AddContactInput): Promise<AddContactResult> {
      const name = input.name.trim();
      if (!name) {
        return { ok: false, error: "Le nom est obligatoire." };
      }
      const company = input.company.trim() || null;
      const contact = await repository.create({ name, company });
      return { ok: true, contact };
    },
  };
}

export const contactService = createContactService(contactRepository);
