// Couche service : règles métier des relances.
// Toutes les heures sont en heure de Paris : on prospecte la France depuis
// la Thaïlande. Une relance est stockée telle qu'on la saisit
// (« 2026-11-25T09:30 »), sans conversion. « Aujourd'hui » se calcule au
// jour de Paris, à partir d'une horloge passée en paramètre.

import type { Contact } from "@/data/contact-repository";
import { canAdvance } from "@/services/stages";

const PARIS = "Europe/Paris";
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME = /^(\d{2}):(\d{2})$/;

export type DueFollowUp = { contact: Contact; lateDays: number };

// Jour de Paris au format « 2026-11-25 ».
export function parisToday(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function toFollowUp(date: string, time: string): string | null {
  const d = DATE.exec(date.trim());
  const t = TIME.exec(time.trim());
  if (!d || !t) return null;

  const [year, month, day] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const check = new Date(Date.UTC(year, month - 1, day));
  const validDate =
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day;
  const validTime = Number(t[1]) <= 23 && Number(t[2]) <= 59;
  if (!validDate || !validTime) return null;

  return `${d[0]}T${t[0]}`;
}

export function formatFollowUp(followUpAt: string): string {
  const [date, time] = followUpAt.split("T");
  const [, month, day] = date.split("-");
  return `${day}/${month} · ${time} (heure de Paris)`;
}

function daysBetween(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

// Relances dues : celles d'aujourd'hui et celles en retard, triées par heure.
// Un contact Gagné ou Perdu n'est plus à relancer, même s'il garde une date.
export function dueFollowUps(contacts: Contact[], now: Date): DueFollowUp[] {
  const today = parisToday(now);
  return contacts
    .filter((contact) => contact.followUpAt !== null && canAdvance(contact.stage))
    .filter((contact) => contact.followUpAt!.slice(0, 10) <= today)
    .sort((a, b) => a.followUpAt!.localeCompare(b.followUpAt!))
    .map((contact) => ({
      contact,
      lateDays: daysBetween(contact.followUpAt!.slice(0, 10), today),
    }));
}
