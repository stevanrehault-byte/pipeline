// Couche données : seul endroit du projet qui ouvre la base.
// Le même client libsql lit un fichier SQLite local (file:pipeline.db)
// et Turso en production (libsql://…) : seule l'URL change.

import { createClient, type Client } from "@libsql/client";

// Versions du schéma, appliquées une seule fois chacune, dans l'ordre.
// La version courante est stockée dans la table schema_version : Turso
// interdit d'écrire PRAGMA user_version, une table marche partout.
// Ne jamais modifier une version existante : en ajouter une nouvelle.
const MIGRATIONS = [
  // v1 (lot 1) : les contacts. IF NOT EXISTS couvre les bases créées avant
  // l'arrivée des versions.
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

async function currentVersion(client: Client): Promise<number> {
  await client.execute(
    "CREATE TABLE IF NOT EXISTS schema_version (id INTEGER PRIMARY KEY CHECK (id = 1), version INTEGER NOT NULL)",
  );
  const result = await client.execute("SELECT version FROM schema_version WHERE id = 1");
  if (result.rows.length > 0) return Number(result.rows[0].version);

  // Bases locales créées avant la table : leur version est dans PRAGMA
  // user_version, qu'on ne fait que lire. Ailleurs, on part de 0.
  let legacy = 0;
  try {
    const pragma = await client.execute("PRAGMA user_version");
    legacy = Number(pragma.rows[0]?.user_version ?? 0);
  } catch {
    legacy = 0;
  }
  await client.execute({
    sql: "INSERT OR IGNORE INTO schema_version (id, version) VALUES (1, ?)",
    args: [legacy],
  });
  return legacy;
}

export async function migrate(client: Client) {
  const current = await currentVersion(client);
  for (let version = current; version < MIGRATIONS.length; version++) {
    await client.batch(
      [
        MIGRATIONS[version],
        { sql: "UPDATE schema_version SET version = ? WHERE id = 1", args: [version + 1] },
      ],
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
  // Une connexion ratée n'est pas gardée : la requête suivante réessaie.
  db ??= createDbClient(url, process.env.DATABASE_AUTH_TOKEN || undefined).catch((error) => {
    db = undefined;
    throw error;
  });
  return db;
}
