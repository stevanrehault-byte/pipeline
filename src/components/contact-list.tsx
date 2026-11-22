// Couche présentation : affiche les contacts qu'on lui donne.

import type { Contact } from "@/data/contact-repository";

export function ContactList({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-5 py-8 text-center text-muted-foreground">
        Aucun contact pour l&apos;instant. Ajoute le premier avec le formulaire
        ci-dessus.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-card text-card-foreground">
      {contacts.map((contact) => (
        <li key={contact.id} className="px-5 py-3">
          <p className="font-heading text-lg font-semibold uppercase leading-tight tracking-wide">
            {contact.name}
          </p>
          {contact.company && (
            <p className="text-sm text-muted-foreground">{contact.company}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
