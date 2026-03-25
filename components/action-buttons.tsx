"use client";

import { useCurrency } from "@/contexts/currency-context";
import { RefreshCw, Trash2 } from "lucide-react";

export function ActionButtons() {
  const { refresh, clear, brlAmount, lastUpdatedAt, isRefreshing } = useCurrency();

  const hasValues = brlAmount !== null;
  const lastUpdatedText = lastUpdatedAt
    ? (() => {
        const date = new Date(lastUpdatedAt);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = String(date.getFullYear());
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
      })()
    : null;

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Actualizando..." : "Actualizar"}</span>
        </button>
        <button
          onClick={clear}
          disabled={!hasValues}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span>Limpiar</span>
        </button>
      </div>
      <div className="h-4 flex items-center justify-center">
        {lastUpdatedText ? (
          <div className="text-xs text-zinc-500 text-center">
            Última actualización: {lastUpdatedText}
          </div>
        ) : (
          <div className="h-3 w-64 rounded bg-zinc-900 border border-zinc-800 animate-pulse" />
        )}
      </div>
    </div>
  );
}
