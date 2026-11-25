// Couche présentation : affiche les contacts qu'on lui donne, avec leur étape
// et les actions possibles. Les règles (quelle étape suit, qui peut encore
// avancer) viennent de la couche service.

import { Button } from "@/components/ui/button";
import { STAGE_LABELS, StageBadge } from "@/components/stage-badge";
import type { Contact } from "@/data/contact-repository";
import { nextStage } from "@/services/stages";

type StageAction = (id: string) => Promise<void>;

type ContactListProps = {
  contacts: Contact[];
  advanceAction: StageAction;
  markLostAction: StageAction;
};

export function ContactList({ contacts, advanceAction, markLostAction }: ContactListProps) {
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
      {contacts.map((contact) => {
        const next = nextStage(contact.stage);
        return (
          <li key={contact.id} className="grid gap-3 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-heading text-lg font-semibold uppercase leading-tight tracking-wide">
                  {contact.name}
                </p>
                {contact.company && (
                  <p className="text-sm text-muted-foreground">{contact.company}</p>
                )}
              </div>
              <StageBadge stage={contact.stage} />
            </div>

            {next && (
              <div className="flex flex-wrap gap-2">
                <form action={advanceAction.bind(null, contact.id)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    aria-label={`Passer ${contact.name} à « ${STAGE_LABELS[next]} »`}
                    className="font-heading uppercase tracking-wider"
                  >
                    {`Passer à « ${STAGE_LABELS[next]} »`}
                  </Button>
                </form>
                <form action={markLostAction.bind(null, contact.id)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    aria-label={`Marquer ${contact.name} perdu`}
                    className="font-heading uppercase tracking-wider"
                  >
                    Perdu
                  </Button>
                </form>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
