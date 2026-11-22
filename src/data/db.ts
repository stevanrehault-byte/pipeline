// Couche données : seul endroit du projet qui ouvre la base.
// Le même client libsql lit un fichier SQLite local (file:pipeline.db)
// et Turso en production (libsql://…) : seule l'URL change.

import { createClient, type Client } from "@libsql/client";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    created_at TEXT NOT NULL
  )
`;

export async function createDbClient(
  url: string,
  authToken?: string,
): Promise<Client> {
  const client = createClient({ url, authToken });
  await client.execute(SCHEMA);
  return client;
}

let db: Promise<Client> | undefined;

export function getDb(): Promise<Client> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return Promise.reject(
      new Error(
        "DATABASE_URL manquante : ajoute DATABASE_URL=file:pipeline.db dans .env.local.",
      ),
    );
  }
  db ??= createDbClient(url, process.env.DATABASE_AUTH_TOKEN || undefined);
  return db;
}
