// Couche données : lecture et écriture des contacts. Aucune règle métier.

import type { Client } from "@libsql/client";
import { getDb } from "@/data/db";

export type Contact = {
  id: string;
  name: string;
  company: string | null;
  createdAt: string;
};

export type NewContact = { name: string; company: string | null };

export interface ContactRepository {
  list(): Promise<Contact[]>;
  create(input: NewContact): Promise<Contact>;
}

function toContact(row: Record<string, unknown>): Contact {
  return {
    id: String(row.id),
    name: String(row.name),
    company: row.company == null ? null : String(row.company),
    createdAt: String(row.created_at),
  };
}

export function createLibsqlContactRepository(
  client: Client,
): ContactRepository {
  return {
    async list() {
      const result = await client.execute(
        "SELECT id, name, company, created_at FROM contacts ORDER BY created_at DESC, rowid DESC",
      );
      return result.rows.map((row) => toContact(row));
    },

    async create({ name, company }) {
      const contact: Contact = {
        id: crypto.randomUUID(),
        name,
        company,
        createdAt: new Date().toISOString(),
      };
      await client.execute({
        sql: "INSERT INTO contacts (id, name, company, created_at) VALUES (?, ?, ?, ?)",
        args: [contact.id, contact.name, contact.company, contact.createdAt],
      });
      return contact;
    },
  };
}

// Instance de l'app, branchée sur la base définie par DATABASE_URL.
export const contactRepository: ContactRepository = {
  async list() {
    return createLibsqlContactRepository(await getDb()).list();
  },
  async create(input) {
    return createLibsqlContactRepository(await getDb()).create(input);
  },
};
