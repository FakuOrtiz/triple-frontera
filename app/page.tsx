import { CurrencyConverter } from "@/components/currency-converter";
import { ExchangeRates } from "@/components/exchange-rates";
import { PixRates } from "@/components/pix-rates";
import { ActionButtons } from "@/components/action-buttons";
import { CurrencyProvider } from "@/contexts/currency-context";

export default function Home() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-lg font-semibold text-center">
              🌎 Triple Frontera
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 space-y-8">
          <CurrencyConverter />
          <ActionButtons />
          <ExchangeRates />
          <PixRates />
        </main>
      </div>
    </CurrencyProvider>
  );
}
