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
