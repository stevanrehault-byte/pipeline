"use server";

import { refresh } from "next/cache";
import { contactService } from "@/services/contact-service";

export type AddContactState = {
  error: string | null;
  // Ce qui a été saisi, renvoyé en cas d'erreur : React vide le formulaire
  // après chaque action, ces valeurs permettent de le re-remplir.
  values: { name: string; company: string };
};

export async function addContactAction(
  _previous: AddContactState,
  formData: FormData,
): Promise<AddContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const result = await contactService.addContact(values);

  if (!result.ok) {
    return { error: result.error, values };
  }

  refresh();
  return { error: null, values: { name: "", company: "" } };
}

// État des formulaires de ligne (avancer, perdu, relance, fait) : le message
// d'erreur du service, ou null quand tout s'est bien passé.
export type RowActionState = { error: string | null };

async function settle(result: { ok: true } | { ok: false; error: string }): Promise<RowActionState> {
  if (!result.ok) return { error: result.error };
  refresh();
  return { error: null };
}

export async function advanceContactAction(id: string): Promise<RowActionState> {
  return settle(await contactService.advanceContact(id));
}

export async function markContactLostAction(id: string): Promise<RowActionState> {
  return settle(await contactService.markContactLost(id));
}

export async function scheduleFollowUpAction(
  id: string,
  _previous: RowActionState,
  formData: FormData,
): Promise<RowActionState> {
  return settle(
    await contactService.scheduleFollowUp(id, {
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
    }),
  );
}

export async function completeFollowUpAction(id: string): Promise<RowActionState> {
  return settle(await contactService.completeFollowUp(id));
}
