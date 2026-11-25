import { Suspense } from "react";
import { connection } from "next/server";
import {
  addContactAction,
  advanceContactAction,
  markContactLostAction,
} from "@/app/actions";
import { AddContactForm } from "@/components/add-contact-form";
import { ContactList } from "@/components/contact-list";
import { contactService } from "@/services/contact-service";

async function Contacts() {
  // Lecture à chaque requête : sans ça, Next figerait la liste au moment du build.
  await connection();
  const contacts = await contactService.listContacts();
  return (
    <ContactList
      contacts={contacts}
      advanceAction={advanceContactAction}
      markLostAction={markContactLostAction}
    />
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="grid gap-1">
        <h1 className="text-5xl font-semibold uppercase leading-none tracking-wide">
          Pipeline
        </h1>
        <p className="text-muted-foreground">Mes contacts de prospection.</p>
      </header>

      <AddContactForm action={addContactAction} />

      <section aria-labelledby="contacts-title" className="grid gap-3">
        <h2
          id="contacts-title"
          className="text-2xl font-semibold uppercase leading-tight tracking-wide"
        >
          Contacts
        </h2>
        <Suspense
          fallback={<p className="text-muted-foreground">Chargement des contacts…</p>}
        >
          <Contacts />
        </Suspense>
      </section>
    </main>
  );
}
