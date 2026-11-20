// Couche données : seul endroit du projet autorisé à parler à la base
// (SQLite en local, Turso en production).

export type Example = { id: string };

export interface ExampleRepository {
  list(): Promise<Example[]>;
}

export const exampleRepository: ExampleRepository = {
  async list() {
    return [];
  },
};
