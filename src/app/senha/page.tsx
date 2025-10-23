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
          const next = e.newValue ? (JSON.parse(e.newValue) as CallTicket[]) : [];
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
    <div className="w-full max-w-7xl mx-auto grid md:grid-cols-3 gap-6 p-6">
      <section className="md:col-span-2 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl uppercase tracking-wide text-white/70">Chamando</div>

          {current ? (
            <>
              <div className="leading-none font-black tracking-tight text-[18vw] md:text-[18rem]">
                {current.number}
              </div>

              <div className="mt-4 font-semibold text-[10vw] md:text-[4rem]">
                {current.name}
              </div>
            </>
          ) : (
            <div className="text-2xl text-white/70">Nenhuma senha chamada ainda</div>
          )}
        </div>
      </section>

      <aside className="md:col-span-1">
        <h2 className="text-xl font-bold mb-3 text-white">Últimos 10</h2>
        <ul className="space-y-2">
          {last10.length === 0 && <li className="text-white">Sem histórico</li>}
          {last10.map((t, idx) => (
            <li
              key={`${t.number}-${t.calledAt}-${idx}`}
              className="w-2xs flex items-center justify-center rounded-xl px-3 py-2 border-b-2 backdrop-blur-sm text-white"
            >
              <div className="font-semibold text-lg">
                {t.number}
                {t.name && <span className="text-sm text-white ml-2">- {t.name}</span>}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
