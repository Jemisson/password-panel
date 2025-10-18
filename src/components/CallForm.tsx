"use client";

import type { CallTicket } from "@/lib/calls";
import { readHistory, writeHistory } from "@/lib/calls";
import { useEffect, useRef, useState } from "react";

export default function CallForm() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const inputNameRef = useRef<HTMLInputElement | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel("chamados");
    return () => channelRef.current?.close();
  }, []);

  function saveToHistory(ticket: CallTicket) {
    const history = readHistory();
    const updated = [ticket, ...history].slice(0, 100);
    writeHistory(updated);
    channelRef.current?.postMessage({ type: "NEW_TICKET", all: updated });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() && !number.trim()) return;

    const ticket: CallTicket = {
      name: name.trim() || "",
      number: number.trim() || "",
      calledAt: new Date().toISOString(),
    };

    saveToHistory(ticket);

    setName("");
    setNumber("");
    inputNameRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
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
  );
}
