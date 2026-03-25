"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

interface CurrencyContextType {
  brlAmount: number | null;
  setBrlAmount: (amount: number | null) => void;
  refreshKey: number;
  refresh: () => void;
  isRefreshing: boolean;
  finishRefreshFetch: (key: number) => void;
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
  const REFRESH_FETCH_TARGET = 3;
  const [brlAmount, setBrlAmount] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [onClear, setOnClear] = useState<(() => void) | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRefreshKey, setActiveRefreshKey] = useState<number | null>(null);
  const [remainingRefreshFetches, setRemainingRefreshFetches] = useState(0);
  const isRefreshingRef = useRef(false);
  const activeRefreshKeyRef = useRef<number | null>(null);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    activeRefreshKeyRef.current = activeRefreshKey;
  }, [activeRefreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => {
      const nextKey = prev + 1;
      setIsRefreshing(true);
      setActiveRefreshKey(nextKey);
      setRemainingRefreshFetches(REFRESH_FETCH_TARGET);
      isRefreshingRef.current = true;
      activeRefreshKeyRef.current = nextKey;
      return nextKey;
    });
  }, []);

  const finishRefreshFetch = useCallback((key: number) => {
    setRemainingRefreshFetches((prev) => {
      if (
        !isRefreshingRef.current ||
        activeRefreshKeyRef.current !== key ||
        prev <= 0
      ) {
        return prev;
      }
      const next = prev - 1;
      if (next === 0) {
        setIsRefreshing(false);
        setActiveRefreshKey(null);
        isRefreshingRef.current = false;
        activeRefreshKeyRef.current = null;
      }
      return next;
    });
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
        isRefreshing,
        finishRefreshFetch,
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
