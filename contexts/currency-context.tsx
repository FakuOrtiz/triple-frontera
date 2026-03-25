"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface CurrencyContextType {
  brlAmount: number | null;
  setBrlAmount: (amount: number | null) => void;
  refreshKey: number;
  refresh: () => void;
  lastUpdatedAt: number | null;
  markUpdated: () => void;
  clear: () => void;
  onClear: (() => void) | null;
  setOnClear: (fn: (() => void) | null) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [brlAmount, setBrlAmount] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [onClear, setOnClear] = useState<(() => void) | null>(null);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const markUpdated = useCallback(() => {
    setLastUpdatedAt(Date.now());
  }, []);

  const clear = useCallback(() => {
    setBrlAmount(null);
    if (onClear) onClear();
  }, [onClear]);

  return (
    <CurrencyContext.Provider
      value={{
        brlAmount,
        setBrlAmount,
        refreshKey,
        refresh,
        lastUpdatedAt,
        markUpdated,
        clear,
        onClear,
        setOnClear,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
