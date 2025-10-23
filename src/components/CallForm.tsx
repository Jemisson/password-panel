"use client";

import { useEffect, useRef, useState } from "react";
import type { CallTicket } from "@/lib/calls";
import {
  HISTORY_KEY,
  readHistory,
  writeHistory,
  lastTicket,
  nextNumberString,
} from "@/lib/calls";

export default function CallForm() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [history, setHistory] = useState<CallTicket[]>([]);
  const inputNameRef = useRef<HTMLInputElement | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setHistory(readHistory());
    channelRef.current = new BroadcastChannel("chamados");
    return () => channelRef.current?.close();
  }, []);

  useEffect(() => {
    const ch = channelRef.current!;
    ch.onmessage = (ev) => {
      const data = ev.data as { type: string; all?: CallTicket[] };
      if (data?.type === "NEW_TICKET" && Array.isArray(data.all)) {
        setHistory(data.all);
      }
      if (data?.type === "CLEAR_ALL") {
        setHistory([]);
      }
    };
    return () => {
      ch.onmessage = null;
    };
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) {
        try {
          const next = e.newValue ? (JSON.parse(e.newValue) as CallTicket[]) : [];
          setHistory(next);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function persistAndBroadcast(updated: CallTicket[]) {
    writeHistory(updated);
    channelRef.current?.postMessage({ type: "NEW_TICKET", all: updated });
  }

  function saveTicket(ticket: CallTicket) {
    const updated = [ticket, ...history].slice(0, 100);
    setHistory(updated);
    persistAndBroadcast(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() && !number.trim()) return;

    const ticket: CallTicket = {
      name: name.trim() || "",
      number: number.trim() || "",
      calledAt: new Date().toISOString(),
    };

    saveTicket(ticket);

    setName("");
    setNumber("");
    inputNameRef.current?.focus();
  }

  function handleCallNext() {
    const last = lastTicket();
    const nextNum = nextNumberString(last?.number);

    const ticket: CallTicket = {
      name: name.trim() || "",
      number: nextNum,
      calledAt: new Date().toISOString(),
    };

    saveTicket(ticket);

    setName("");
    setNumber("");
    inputNameRef.current?.focus();
  }

  function handleClearAll() {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    channelRef.current?.postMessage({ type: "CLEAR_ALL" });
  }

  const lastCalled = history[0];

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-white">Último número chamado</div>
          <div className="text-4xl font-extrabold tracking-tight">
            {lastCalled?.number ?? "—"}
          </div>
          {lastCalled?.name ? (
            <div className="text-sm text-white">{lastCalled.name}</div>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={handleCallNext}
            className="rounded-xl px-4 py-2 font-semibold border shadow-sm hover:shadow transition"
            title="Chamar a próxima senha (último + 1)"
          >
            Chamar Próximo
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-xl px-4 py-2 font-semibold border shadow-sm hover:shadow transition"
            title="Apagar todo o histórico"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nome (opcional)</label>
          <input
            ref={inputNameRef}
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Ana Silva"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Número (opcional)</label>
          <input
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring focus:ring-blue-200"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Ex.: 012"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl px-4 py-3 font-semibold shadow-sm border hover:shadow transition"
        >
          Chamar
        </button>
      </form>
    </div>
  );
}
