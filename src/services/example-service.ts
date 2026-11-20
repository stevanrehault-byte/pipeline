// Couche service : règles métier. Reçoit la couche données en paramètre
// et ne connaît jamais la base qui est derrière.

import type { ExampleRepository } from "@/data/example-repository";

export function createExampleService(repository: ExampleRepository) {
  return {
    listExamples() {
      return repository.list();
    },
  };
}
