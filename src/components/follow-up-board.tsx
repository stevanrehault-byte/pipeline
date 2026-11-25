// Couche présentation : le tableau des départs. Les relances du jour et
// celles en retard, déjà calculées et triées par la couche service.

import { Button } from "@/components/ui/button";
import type { DueFollowUp } from "@/services/follow-ups";

type FollowUpBoardProps = {
  items: DueFollowUp[];
  completeAction: (id: string) => Promise<void>;
};

function Status({ lateDays }: { lateDays: number }) {
  if (lateDays > 0) {
    return (
      <span className="font-heading font-semibold uppercase tracking-wider text-primary">
        {`RETARD ${lateDays} J`}
      </span>
    );
  }
  return (
    <span className="font-heading font-semibold uppercase tracking-wider text-success">
      À L&apos;HEURE
    </span>
  );
}

export function FollowUpBoard({ items, completeAction }: FollowUpBoardProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-5 py-8 text-center text-muted-foreground">
        Personne à relancer aujourd&apos;hui.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card text-card-foreground">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Relances du jour et en retard, heure de Paris</caption>
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2 font-heading font-semibold uppercase tracking-wider">
              Heure
            </th>
            <th scope="col" className="px-4 py-2 font-heading font-semibold uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-4 py-2 font-heading font-semibold uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-4 py-2">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map(({ contact, lateDays }) => {
            const [date, time] = contact.followUpAt!.split("T");
            const [, month, day] = date.split("-");
            return (
              <tr key={contact.id}>
                <td className="px-4 py-3 tabular-nums">
                  <span className="text-base font-semibold">{time}</span>
                  {lateDays > 0 && (
                    <span className="block text-muted-foreground">{`${day}/${month}`}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="block font-semibold">{contact.name}</span>
                  {contact.company && (
                    <span className="block text-muted-foreground">{contact.company}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Status lateDays={lateDays} />
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={completeAction.bind(null, contact.id)}>
                    <Button
                      type="submit"
                      size="sm"
                      aria-label={`Marquer la relance de ${contact.name} comme faite`}
                      className="font-heading uppercase tracking-wider"
                    >
                      Fait
                    </Button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
