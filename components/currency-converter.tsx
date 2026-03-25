"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/contexts/currency-context";

interface ExchangeRates {
  usdToArs: number;
  arsToUsd: number;
  usdToBrl: number;
  usdToPyg: number;
}

const CURRENCIES = [
  {
    code: "ARS",
    name: "Pesos Argentinos",
    emoji: "🇦🇷",
    flagSvg:
      "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f1e6-1f1f7.svg",
  },
  {
    code: "USD",
    name: "Dólares",
    emoji: "🇺🇸",
    flagSvg:
      "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f1fa-1f1f8.svg",
  },
  {
    code: "BRL",
    name: "Reales",
    emoji: "🇧🇷",
    flagSvg:
      "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f1e7-1f1f7.svg",
  },
  {
    code: "PYG",
    name: "Guaraníes",
    emoji: "🇵🇾",
    flagSvg:
      "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f1f5-1f1fe.svg",
  },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function CurrencyConverter() {
  const { setBrlAmount, refreshKey, setOnClear, markUpdated } = useCurrency();
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [activeInput, setActiveInput] = useState<CurrencyCode | null>(null);
  const [anchorCurrency, setAnchorCurrency] = useState<CurrencyCode | null>(null);
  const [anchorAmount, setAnchorAmount] = useState<number | null>(null);
  const [rawValue, setRawValue] = useState("");
  const [values, setValues] = useState<Record<CurrencyCode, string>>({
    ARS: "",
    USD: "",
    BRL: "",
    PYG: "",
  });
  const [loading, setLoading] = useState(true);

  const clearValues = useCallback(() => {
    setRawValue("");
    setAnchorCurrency(null);
    setAnchorAmount(null);
    setValues({ ARS: "", USD: "", BRL: "", PYG: "" });
  }, []);

  useEffect(() => {
    setOnClear(() => clearValues);
    return () => setOnClear(null);
  }, [setOnClear, clearValues]);

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
            usdToArs: ccl.venta,
            arsToUsd: ccl.compra,
            usdToBrl: brlRate.rate,
            usdToPyg: pygRate.rate,
          });
          markUpdated();
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [refreshKey, markUpdated]);

  const formatNumber = (value: number): string => {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const convertFromCurrency = useCallback(
    (amount: number, fromCurrency: CurrencyCode): { values: Record<CurrencyCode, string>; brl: number } => {
      if (!rates || isNaN(amount)) {
        return { values: { ARS: "", USD: "", BRL: "", PYG: "" }, brl: 0 };
      }

      let usdAmount: number;

      switch (fromCurrency) {
        case "USD":
          usdAmount = amount;
          break;
        case "ARS":
          usdAmount = amount / rates.arsToUsd;
          break;
        case "BRL":
          usdAmount = amount / rates.usdToBrl;
          break;
        case "PYG":
          usdAmount = amount / rates.usdToPyg;
          break;
        default:
          return { values: { ARS: "", USD: "", BRL: "", PYG: "" }, brl: 0 };
      }

      const brlValue = Math.round(usdAmount * rates.usdToBrl * 100) / 100;

      return {
        values: {
          USD: formatNumber(Math.round(usdAmount * 100) / 100),
          ARS: formatNumber(Math.round(usdAmount * rates.usdToArs * 100) / 100),
          BRL: formatNumber(brlValue),
          PYG: formatNumber(Math.round(usdAmount * rates.usdToPyg * 100) / 100),
        },
        brl: brlValue,
      };
    },
    [rates]
  );

  const handleInputChange = (currency: CurrencyCode, value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, "").replace(",", ".");

    if (cleanValue === "" || cleanValue === ".") {
      setRawValue("");
      setAnchorCurrency(null);
      setAnchorAmount(null);
      setValues({ ARS: "", USD: "", BRL: "", PYG: "" });
      setBrlAmount(null);
      return;
    }

    setRawValue(cleanValue);
    const numValue = parseFloat(cleanValue);

    if (!isNaN(numValue)) {
      setAnchorCurrency(currency);
      setAnchorAmount(numValue);
      const converted = convertFromCurrency(numValue, currency);
      setValues({
        ...converted.values,
        [currency]: cleanValue,
      });
      setBrlAmount(converted.brl);
    }
  };

  const handleFocus = (currency: CurrencyCode) => {
    setActiveInput(currency);
    const currentValue = values[currency];
    if (currentValue) {
      const numericValue = currentValue.replace(/\./g, "").replace(",", ".");
      setRawValue(numericValue);
    } else {
      setRawValue("");
    }
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const getDisplayValue = (code: CurrencyCode): string => {
    if (activeInput === code) {
      return rawValue;
    }
    return values[code];
  };

  useEffect(() => {
    if (!rates || anchorCurrency === null || anchorAmount === null) return;
    const converted = convertFromCurrency(anchorAmount, anchorCurrency);
    setValues(converted.values);
    setBrlAmount(converted.brl);
  }, [rates, anchorCurrency, anchorAmount, convertFromCurrency, setBrlAmount]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        <ArrowLeftRight className="w-4 h-4" />
        <span>Conversor</span>
      </div>
      <div className="space-y-4">
        {CURRENCIES.map((currency) => (
          <div key={currency.code} className="relative">
            <Input
              type="text"
              inputMode="decimal"
              disabled={loading}
              placeholder={loading ? "Cargando..." : "0,00"}
              value={loading ? "" : getDisplayValue(currency.code)}
              onFocus={() => handleFocus(currency.code)}
              onBlur={handleBlur}
              onChange={(e) => handleInputChange(currency.code, e.target.value)}
              className="h-14 text-lg font-medium pl-14 pr-4 rounded-xl bg-zinc-900 border-zinc-800 focus:border-zinc-600 transition-colors disabled:opacity-50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <span className="text-xl sm:hidden">{currency.emoji}</span>
              <img
                src={currency.flagSvg}
                alt={`Bandera ${currency.code}`}
                className="hidden sm:block w-6 h-6"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
