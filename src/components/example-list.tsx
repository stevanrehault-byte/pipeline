// Couche présentation : affiche ce qu'on lui donne, sans accès à la base.

import type { Example } from "@/data/example-repository";

export function ExampleList({ items }: { items: Example[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.id}</li>
      ))}
    </ul>
  );
}
