import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  addContact,
  advanceContact,
  markContactLost,
  scheduleFollowUp,
  completeFollowUp,
  refresh,
} = vi.hoisted(() => ({
  addContact: vi.fn(),
  advanceContact: vi.fn(),
  markContactLost: vi.fn(),
  scheduleFollowUp: vi.fn(),
  completeFollowUp: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/services/contact-service", () => ({
  contactService: {
    addContact,
    advanceContact,
    markContactLost,
    scheduleFollowUp,
    completeFollowUp,
  },
}));
vi.mock("next/cache", () => ({ refresh }));

import {
  addContactAction,
  advanceContactAction,
  completeFollowUpAction,
  markContactLostAction,
  scheduleFollowUpAction,
} from "@/app/actions";

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

const idle = { error: null };

describe("actions d'étape", () => {
  beforeEach(() => {
    advanceContact.mockReset();
    markContactLost.mockReset();
    refresh.mockReset();
  });

  it("fait avancer le contact puis rafraîchit la liste", async () => {
    advanceContact.mockResolvedValue({ ok: true });

    const state = await advanceContactAction("c1");

    expect(advanceContact).toHaveBeenCalledWith("c1");
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual(idle);
  });

  it("renvoie l'erreur sans rafraîchir quand le contact ne peut pas avancer", async () => {
    advanceContact.mockResolvedValue({ ok: false, error: "Contact introuvable." });

    const state = await advanceContactAction("c1");

    expect(state).toEqual({ error: "Contact introuvable." });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("marque le contact perdu puis rafraîchit la liste", async () => {
    markContactLost.mockResolvedValue({ ok: true });

    const state = await markContactLostAction("c1");

    expect(markContactLost).toHaveBeenCalledWith("c1");
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual(idle);
  });

  it("renvoie l'erreur sans rafraîchir quand le contact ne peut pas être marqué perdu", async () => {
    markContactLost.mockResolvedValue({ ok: false, error: "Ce contact ne peut plus avancer." });

    const state = await markContactLostAction("c1");

    expect(state).toEqual({ error: "Ce contact ne peut plus avancer." });
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("actions de relance", () => {
  beforeEach(() => {
    scheduleFollowUp.mockReset();
    completeFollowUp.mockReset();
    refresh.mockReset();
  });

  it("programme la relance saisie puis rafraîchit", async () => {
    scheduleFollowUp.mockResolvedValue({ ok: true });

    const state = await scheduleFollowUpAction(
      "c1",
      idle,
      formData({ date: "2026-11-25", time: "09:30" }),
    );

    expect(scheduleFollowUp).toHaveBeenCalledWith("c1", { date: "2026-11-25", time: "09:30" });
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual(idle);
  });

  it("renvoie l'erreur sans rafraîchir quand la relance est refusée", async () => {
    scheduleFollowUp.mockResolvedValue({
      ok: false,
      error: "Indique une date et une heure valides.",
    });

    const state = await scheduleFollowUpAction("c1", idle, formData({ date: "", time: "" }));

    expect(state).toEqual({ error: "Indique une date et une heure valides." });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("marque la relance faite puis rafraîchit", async () => {
    completeFollowUp.mockResolvedValue({ ok: true });

    const state = await completeFollowUpAction("c1");

    expect(completeFollowUp).toHaveBeenCalledWith("c1");
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual(idle);
  });

  it("renvoie l'erreur sans rafraîchir quand la relance ne peut pas être marquée faite", async () => {
    completeFollowUp.mockResolvedValue({ ok: false, error: "Contact introuvable." });

    const state = await completeFollowUpAction("c1");

    expect(state).toEqual({ error: "Contact introuvable." });
    expect(refresh).not.toHaveBeenCalled();
  });
});
