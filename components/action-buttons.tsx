"use client";

import { useCurrency } from "@/contexts/currency-context";
import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";

export function ActionButtons() {
  const { refresh, clear, brlAmount } = useCurrency();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const hasValues = brlAmount !== null;

  return (
    <div className="flex gap-3">
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
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
  );
}
