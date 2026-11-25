// Couche service : règles métier des contacts. Reçoit la couche données en
// paramètre et ne connaît jamais la base qui est derrière.

import {
  contactRepository,
  type Contact,
  type ContactRepository,
} from "@/data/contact-repository";
import { INITIAL_STAGE, canAdvance, nextStage } from "@/services/stages";

export type AddContactInput = { name: string; company: string };

export type AddContactResult =
  | { ok: true; contact: Contact }
  | { ok: false; error: string };

export type StageChangeResult = { ok: true } | { ok: false; error: string };

const NOT_FOUND = "Contact introuvable.";
const FINAL = "Ce contact ne peut plus avancer.";

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
      const contact = await repository.create({ name, company, stage: INITIAL_STAGE });
      return { ok: true, contact };
    },

    async advanceContact(id: string): Promise<StageChangeResult> {
      const contact = await repository.findById(id);
      if (!contact) return { ok: false, error: NOT_FOUND };
      const next = nextStage(contact.stage);
      if (!next) return { ok: false, error: FINAL };
      await repository.updateStage(id, next);
      return { ok: true };
    },

    async markContactLost(id: string): Promise<StageChangeResult> {
      const contact = await repository.findById(id);
      if (!contact) return { ok: false, error: NOT_FOUND };
      if (!canAdvance(contact.stage)) return { ok: false, error: FINAL };
      await repository.updateStage(id, "perdu");
      return { ok: true };
    },
  };
}

export const contactService = createContactService(contactRepository);
