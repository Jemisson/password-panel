"use client";

import type { CallTicket } from "@/lib/calls";
import { HISTORY_KEY, readHistory } from "@/lib/calls";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SenhaPage() {
  const [history, setHistory] = useState<CallTicket[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    channelRef.current = new BroadcastChannel("chamados");
    const ch = channelRef.current;

    ch.onmessage = (ev) => {
      const data = ev.data as { type: string; all?: CallTicket[] };
      if (data?.type === "NEW_TICKET" && Array.isArray(data.all)) {
        setHistory(data.all);
      }
    };

    return () => ch?.close();
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) {
        try {
          const next = e.newValue
            ? (JSON.parse(e.newValue) as CallTicket[])
            : [];
          setHistory(next);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

useEffect(() => {
  const ch = new BroadcastChannel("chamados");
  ch.onmessage = (ev) => {
    const data = ev.data as { type: string; all?: CallTicket[] };
    if (data?.type === "NEW_TICKET" && Array.isArray(data.all)) {
      setHistory(data.all);
    }
    if (data?.type === "CLEAR_ALL") {
      setHistory([]);
    }
  };
  return () => ch.close();
}, []);

  const current = history[0];
  const last10 = useMemo(() => history.slice(1, 11), [history]);

  return (
    <main className="min-h-screen grid md:grid-cols-3 gap-6 p-6">
      <section className="md:col-span-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wide text-gray-500">
            Chamando
          </div>
          {current ? (
            <>
              <div className="text-[14rem] leading-none font-black tracking-tight">
                {current.number}
              </div>
              <div className="mt-4 text-[8rem] font-semibold">
                {current.name}
              </div>
            </>
          ) : (
            <div className="text-2xl text-gray-400">
              Nenhuma senha chamada ainda
            </div>
          )}
        </div>
      </section>

      <aside className="md:col-span-1">
        <h2 className="text-xl font-bold mb-3">Últimos 10</h2>
        <ul className="space-y-2">
          {last10.length === 0 && (
            <li className="text-gray-400">Sem histórico</li>
          )}
          {last10.map((t, idx) => (
            <li
              key={`${t.number}-${t.calledAt}-${idx}`}
              className="flex items-center justify-between border rounded-lg px-3 py-2"
            >
              <div className="font-semibold text-lg">{t.number}</div>
              <div className="text-sm">{t.name}</div>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
