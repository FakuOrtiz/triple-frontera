"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface Rates {
  ars: number;
  brl: number;
  pyg: number;
}

const CURRENCIES_CONFIG = [
  { code: "ARS", emoji: "🇦🇷", decimals: 2 },
  { code: "BRL", emoji: "🇧🇷", decimals: 2 },
  { code: "PYG", emoji: "🇵🇾", decimals: 0 },
];

export function ExchangeRates() {
  const { refreshKey } = useCurrency();
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      try {
        const [dolarResponse, frankfurterResponse] = await Promise.all([
          fetch(`https://dolarapi.com/v1/dolares?_t=${Date.now()}`, { cache: "no-store" }),
          fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=BRL,PYG", { cache: "no-store" }),
        ]);

        const dolarData = await dolarResponse.json();
        const frankfurterData = await frankfurterResponse.json();

        const ccl = dolarData.find(
          (d: { casa: string }) => d.casa === "contadoconliqui"
        );

        const brlRate = frankfurterData.find(
          (r: { quote: string }) => r.quote === "BRL"
        );
        const pygRate = frankfurterData.find(
          (r: { quote: string }) => r.quote === "PYG"
        );

        if (ccl && brlRate && pygRate) {
          setRates({
            ars: ccl.venta,
            brl: brlRate.rate,
            pyg: pygRate.rate,
          });
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [refreshKey]);

  const formatRate = (value: number, decimals: number = 2) => {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getRateValue = (code: string): number | null => {
    if (!rates) return null;
    switch (code) {
      case "ARS": return rates.ars;
      case "BRL": return rates.brl;
      case "PYG": return rates.pyg;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <TrendingUp className="w-4 h-4" />
        <span>Cotizaciones (1 USD)</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {CURRENCIES_CONFIG.map((currency) => {
          const value = getRateValue(currency.code);
          
          return (
            <div
              key={currency.code}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"
            >
              <div className="text-lg mb-1">{currency.emoji}</div>
              <div className="text-xs text-zinc-500 mb-1">{currency.code}</div>
              {loading ? (
                <div className="h-5 w-16 bg-zinc-800 rounded mx-auto animate-pulse" />
              ) : (
                <div className="text-sm font-semibold text-white">
                  {value !== null ? formatRate(value, currency.decimals) : "-"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
