import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Page provisoire : montre le thème « Départs » en attendant les vrais écrans.
// Le contact affiché est fictif.

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-5xl font-semibold uppercase leading-none tracking-wide">
            Pipeline
          </h1>
          <p className="text-muted-foreground">
            Aperçu du thème. Contact fictif.
          </p>
        </div>
        <Button size="lg" className="font-heading uppercase tracking-wider">
          <Plus aria-hidden="true" />
          Ajouter
        </Button>
      </header>

      <article
        aria-labelledby="contact-camille"
        className="overflow-hidden rounded-md border border-border bg-card text-card-foreground"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 pt-5 pb-4">
          <div>
            <h2
              id="contact-camille"
              className="text-2xl font-semibold uppercase leading-tight tracking-wide"
            >
              Camille Martin
            </h2>
            <p className="text-sm text-muted-foreground">
              Boulangerie Martin · Lyon
            </p>
          </div>
          <span className="rounded-sm bg-primary px-2 py-1 font-heading text-sm font-semibold uppercase tracking-wider whitespace-nowrap text-primary-foreground">
            Retard 2 j
          </span>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 px-5 py-4 text-sm tabular-nums">
          <dt className="text-muted-foreground">Étape</dt>
          <dd>Proposition envoyée</dd>
          <dt className="text-muted-foreground">Relance</dt>
          <dd>Aujourd&apos;hui · 09:30 (heure de Paris)</dd>
          <dt className="text-muted-foreground">Montant</dt>
          <dd>1 850 €</dd>
          <dt className="text-muted-foreground">Téléphone</dt>
          <dd>04 78 12 34 56</dd>
        </dl>

        <div className="flex gap-2 px-5 pb-5">
          <Button size="lg" className="font-heading uppercase tracking-wider">
            Relancer
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="font-heading uppercase tracking-wider"
          >
            Reporter
          </Button>
        </div>
      </article>
    </main>
  );
}
