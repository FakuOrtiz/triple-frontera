import { CurrencyConverter } from "@/components/currency-converter";
import { ExchangeRates } from "@/components/exchange-rates";
import { PixRates } from "@/components/pix-rates";
import { ActionButtons } from "@/components/action-buttons";
import { CurrencyProvider } from "@/contexts/currency-context";
import Image from "next/image";

export default function Home() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-black text-white">
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800 pt-[env(safe-area-inset-top)]">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
              <Image
                src="/triple-frontera-logo.png"
                alt="Logo Triple Frontera"
                width={22}
                height={22}
                priority
              />
              <span>Triple Frontera</span>
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-8">
          <CurrencyConverter />
          <ActionButtons />
          <ExchangeRates />
          <PixRates />
        </main>
      </div>
    </CurrencyProvider>
  );
}
