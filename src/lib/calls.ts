export const HISTORY_KEY = "chamados_history";

export type CallTicket = {
  name: string;
  number: string;
  calledAt: string;
};

export function readHistory(): CallTicket[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as CallTicket[]) : [];
  } catch {
    return [];
  }
}

export function writeHistory(next: CallTicket[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function lastTicket(): CallTicket | undefined {
  const h = readHistory();
  return h[0];
}

export function toIntOrNull(v?: string): number | null {
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export function nextNumberString(last?: string): string {
  const n = toIntOrNull(last);
  if (n === null) return "1";
  return String(n + 1);
}
