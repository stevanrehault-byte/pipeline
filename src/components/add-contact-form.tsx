"use client";

// Couche présentation : formulaire d'ajout. La validation vit dans le service ;
// ici on affiche seulement le message renvoyé.

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddContactState = {
  error: string | null;
  values: { name: string; company: string };
};

const emptyState: AddContactState = { error: null, values: { name: "", company: "" } };

type AddContactFormProps = {
  action: (state: AddContactState, formData: FormData) => Promise<AddContactState>;
  initialState?: AddContactState;
};

export function AddContactForm({
  action,
  initialState = emptyState,
}: AddContactFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const nameError = state.error;

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-4 rounded-md border border-border bg-card px-5 py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          defaultValue={state.values.name}
          autoComplete="off"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? "name-error" : undefined}
        />
        {nameError && (
          <p id="name-error" className="text-sm text-destructive">
            {nameError}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="company">
          Entreprise{" "}
          <span className="font-normal text-muted-foreground">(facultatif)</span>
        </Label>
        <Input
          id="company"
          name="company"
          defaultValue={state.values.company}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="font-heading uppercase tracking-wider sm:mt-6"
      >
        Ajouter
      </Button>
    </form>
  );
}
