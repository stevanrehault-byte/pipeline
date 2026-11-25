"use client";

// Couche présentation : formulaire d'une action de ligne (avancer, perdu,
// programmer, fait). Affiche le message d'erreur renvoyé par l'action, pour
// qu'un refus du service ne passe jamais en silence.

import type { ReactNode } from "react";
import { useActionState } from "react";

type RowActionState = { error: string | null };

const idle: RowActionState = { error: null };

type RowActionFormProps = {
  action: (state: RowActionState, formData: FormData) => Promise<RowActionState>;
  initialState?: RowActionState;
  className?: string;
  children: ReactNode;
};

export function RowActionForm({
  action,
  initialState = idle,
  className,
  children,
}: RowActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className={className}>
      {children}
      {state.error && (
        <p role="alert" className="basis-full text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
