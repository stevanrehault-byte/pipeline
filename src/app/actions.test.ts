import { beforeEach, describe, expect, it, vi } from "vitest";

const { addContact, refresh } = vi.hoisted(() => ({
  addContact: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/services/contact-service", () => ({
  contactService: { addContact },
}));
vi.mock("next/cache", () => ({ refresh }));

import { addContactAction } from "@/app/actions";

const emptyState = { error: null, values: { name: "", company: "" } };

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("addContactAction", () => {
  beforeEach(() => {
    addContact.mockReset();
    refresh.mockReset();
  });

  it("transmet le formulaire au service puis rafraîchit la liste", async () => {
    addContact.mockResolvedValue({ ok: true, contact: { id: "1" } });

    const state = await addContactAction(
      emptyState,
      formData({ name: "Camille Martin", company: "Boulangerie Martin" }),
    );

    expect(addContact).toHaveBeenCalledWith({
      name: "Camille Martin",
      company: "Boulangerie Martin",
    });
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual(emptyState);
  });

  it("renvoie le message d'erreur sans rafraîchir quand le nom manque", async () => {
    addContact.mockResolvedValue({ ok: false, error: "Le nom est obligatoire." });

    const state = await addContactAction(emptyState, formData({ name: "", company: "" }));

    expect(state.error).toBe("Le nom est obligatoire.");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("renvoie ce qui a été saisi quand le nom manque, pour ne pas l'effacer", async () => {
    addContact.mockResolvedValue({ ok: false, error: "Le nom est obligatoire." });

    const state = await addContactAction(
      emptyState,
      formData({ name: "  ", company: "Boulangerie Martin" }),
    );

    expect(state).toEqual({
      error: "Le nom est obligatoire.",
      values: { name: "  ", company: "Boulangerie Martin" },
    });
  });
});
