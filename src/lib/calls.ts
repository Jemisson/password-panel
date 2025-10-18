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
