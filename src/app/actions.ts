"use server";

import { refresh } from "next/cache";
import { contactService } from "@/services/contact-service";

export type AddContactState = { error: string | null };

export async function addContactAction(
  _previous: AddContactState,
  formData: FormData,
): Promise<AddContactState> {
  const result = await contactService.addContact({
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  refresh();
  return { error: null };
}
