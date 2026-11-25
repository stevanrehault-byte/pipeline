// Couche données : seul endroit du projet qui ouvre la base.
// Le même client libsql lit un fichier SQLite local (file:pipeline.db)
// et Turso en production (libsql://…) : seule l'URL change.

import { createClient, type Client } from "@libsql/client";

// Versions du schéma, appliquées une seule fois chacune, dans l'ordre.
// La version courante est stockée dans PRAGMA user_version.
// Ne jamais modifier une version existante : en ajouter une nouvelle.
const MIGRATIONS = [
  // v1 (lot 1) : les contacts. IF NOT EXISTS couvre les bases créées avant
  // l'arrivée des versions (user_version 0, table déjà présente).
  `CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    created_at TEXT NOT NULL
  )`,
  // v2 (lot 2) : l'étape du pipeline. Les contacts existants passent à « À contacter ».
  `ALTER TABLE contacts ADD COLUMN stage TEXT NOT NULL DEFAULT 'a_contacter'`,
  // v3 (lot 3) : la prochaine relance, en heure de Paris (« 2026-11-25T09:30 »).
  // Vide tant qu'aucune relance n'est programmée.
  `ALTER TABLE contacts ADD COLUMN follow_up_at TEXT`,
];

async function migrate(client: Client) {
  const result = await client.execute("PRAGMA user_version");
  const current = Number(result.rows[0]?.user_version ?? 0);

  for (let version = current; version < MIGRATIONS.length; version++) {
    // PRAGMA n'accepte pas de paramètre ; la valeur vient du code, jamais d'une saisie.
    await client.batch(
      [MIGRATIONS[version], `PRAGMA user_version = ${version + 1}`],
      "write",
    );
  }
}

export async function createDbClient(
  url: string,
  authToken?: string,
): Promise<Client> {
  const client = createClient({ url, authToken });
  await migrate(client);
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
