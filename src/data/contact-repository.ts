// Couche données : lecture et écriture des contacts. Aucune règle métier.

import type { Client } from "@libsql/client";
import { getDb } from "@/data/db";

// Valeurs stockées en base pour l'étape. L'ordre et les règles de passage
// vivent dans la couche service (src/services/stages.ts).
export type Stage =
  | "a_contacter"
  | "contacte"
  | "proposition_envoyee"
  | "gagne"
  | "perdu";

export type Contact = {
  id: string;
  name: string;
  company: string | null;
  stage: Stage;
  createdAt: string;
};

export type NewContact = { name: string; company: string | null; stage: Stage };

export interface ContactRepository {
  list(): Promise<Contact[]>;
  create(input: NewContact): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  updateStage(id: string, stage: Stage): Promise<void>;
}

const COLUMNS = "id, name, company, stage, created_at";

function toContact(row: Record<string, unknown>): Contact {
  return {
    id: String(row.id),
    name: String(row.name),
    company: row.company == null ? null : String(row.company),
    stage: String(row.stage) as Stage,
    createdAt: String(row.created_at),
  };
}

export function createLibsqlContactRepository(
  client: Client,
): ContactRepository {
  return {
    async list() {
      const result = await client.execute(
        `SELECT ${COLUMNS} FROM contacts ORDER BY created_at DESC, rowid DESC`,
      );
      return result.rows.map((row) => toContact(row));
    },

    async create({ name, company, stage }) {
      const contact: Contact = {
        id: crypto.randomUUID(),
        name,
        company,
        stage,
        createdAt: new Date().toISOString(),
      };
      await client.execute({
        sql: "INSERT INTO contacts (id, name, company, stage, created_at) VALUES (?, ?, ?, ?, ?)",
        args: [contact.id, contact.name, contact.company, contact.stage, contact.createdAt],
      });
      return contact;
    },

    async findById(id) {
      const result = await client.execute({
        sql: `SELECT ${COLUMNS} FROM contacts WHERE id = ?`,
        args: [id],
      });
      const row = result.rows[0];
      return row ? toContact(row) : null;
    },

    async updateStage(id, stage) {
      await client.execute({
        sql: "UPDATE contacts SET stage = ? WHERE id = ?",
        args: [stage, id],
      });
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
  async findById(id) {
    return createLibsqlContactRepository(await getDb()).findById(id);
  },
  async updateStage(id, stage) {
    return createLibsqlContactRepository(await getDb()).updateStage(id, stage);
  },
};
