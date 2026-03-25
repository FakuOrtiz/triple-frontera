"use client";

import { useEffect, useState } from "react";
import { CreditCard, Settings, Check } from "lucide-react";
import { Drawer } from "vaul";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCurrency } from "@/contexts/currency-context";

interface Quote {
  symbol: string;
  buy: number;
  sell?: number;
}

interface WalletData {
  quotes?: Quote[];
  logo: string;
  url: string;
  isPix: boolean;
}

interface ApiResponse {
  [key: string]: WalletData;
}

interface WalletRate {
  id: string;
  name: string;
  logo: string;
  rate: number;
}

const WALLET_NAMES: Record<string, string> = {
  fiwind: "Fiwind",
  belo: "Belo",
  cocos: "Cocos",
  takenos: "Takenos",
  satoshitango: "SatoshiTango",
  prex: "Prex",
  lemon: "Lemon",
  plus: "Plus Crypto",
  astropay: "Astropay",
  decrypto: "Decrypto",
  wallbit: "Wallbit",
  arq: "ARQ (DolarApp)",
  brubank: "Brubank",
  "mercado-pago": "Mercado Pago",
  p2pme: "P2P.me",
  vesseo: "Vesseo",
  wayni: "Wayni",
  global66: "Global66",
  caipi: "Caipi",
  ripio: "Ripio",
  binance: "Binance",
  peanut: "Peanut",
  "personal-pay": "Personal Pay",
};

const STORAGE_KEY = "triple-frontera-pix-wallets";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

interface WalletListProps {
  wallets: WalletRate[];
  enabledWallets: string[] | null;
  toggleWallet: (id: string) => void;
  formatRate: (value: number) => string;
  selectAll: () => void;
  selectNone: () => void;
  onClose: () => void;
}

function WalletList({
  wallets,
  enabledWallets,
  toggleWallet,
  formatRate,
  selectAll,
  selectNone,
  onClose,
}: WalletListProps) {
  const allSelected = enabledWallets !== null && enabledWallets.length === wallets.length;
  const noneSelected = enabledWallets !== null && enabledWallets.length === 0;

  return (
    <>
      <div className="flex gap-2 p-4 border-b border-zinc-800">
        <button
          onClick={selectAll}
          disabled={allSelected}
          className="flex-1 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
        >
          Seleccionar todas
        </button>
        <button
          onClick={selectNone}
          disabled={noneSelected}
          className="flex-1 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800"
        >
          Deseleccionar todas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]">
        {wallets.map((wallet) => {
          const isEnabled =
            enabledWallets === null || enabledWallets.includes(wallet.id);

          return (
            <button
              key={wallet.id}
              onClick={() => toggleWallet(wallet.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isEnabled
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-zinc-900 border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={wallet.logo}
                  alt={wallet.name}
                  className="w-8 h-8 rounded-lg object-contain bg-white p-1"
                />
                <div className="text-left">
                  <div className="font-medium text-white text-sm">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    1 BRL = {formatRate(wallet.rate)} ARS
                  </div>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                  isEnabled ? "bg-green-500" : "bg-zinc-700"
                }`}
              >
                {isEnabled && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-medium bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Listo
        </button>
      </div>
    </>
  );
}

export function PixRates() {
  const { brlAmount, refreshKey, markUpdated, finishRefreshFetch } = useCurrency();
  const [allWallets, setAllWallets] = useState<WalletRate[]>([]);
  const [enabledWallets, setEnabledWallets] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      try {
        setEnabledWallets(JSON.parse(saved));
      } catch {
        setEnabledWallets(null);
      }
      setIsFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad && allWallets.length > 0 && localStorage.getItem(STORAGE_KEY) === null) {
      const allIds = allWallets.map((w) => w.id);
      setEnabledWallets(allIds);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
      setIsFirstLoad(false);
    }
  }, [allWallets, isFirstLoad]);

  useEffect(() => {
    if (enabledWallets !== null && !isFirstLoad) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledWallets));
    }
  }, [enabledWallets, isFirstLoad]);

  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      try {
        const response = await fetch(`/api/pix-rates?_t=${Date.now()}`, {
          cache: "no-store",
        });
        const data: ApiResponse = await response.json();

        const walletRates: WalletRate[] = [];

        for (const [id, wallet] of Object.entries(data)) {
          if (!wallet.quotes || !wallet.isPix) continue;

          const brlArsQuote = wallet.quotes.find((q) => q.symbol === "BRLARS");
          if (!brlArsQuote) continue;

          walletRates.push({
            id,
            name: WALLET_NAMES[id] || id,
            logo: wallet.logo,
            rate: brlArsQuote.buy,
          });
        }

        walletRates.sort((a, b) => a.rate - b.rate);
        setAllWallets(walletRates);
        markUpdated();
      } catch (error) {
        console.error("Error fetching PIX rates:", error);
      } finally {
        setLoading(false);
        finishRefreshFetch(refreshKey);
      }
    }

    fetchRates();
  }, [refreshKey, markUpdated, finishRefreshFetch]);

  const formatRate = (value: number) => {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const toggleWallet = (id: string) => {
    const currentEnabled = enabledWallets ?? allWallets.map((w) => w.id);
    if (currentEnabled.includes(id)) {
      setEnabledWallets(currentEnabled.filter((w) => w !== id));
    } else {
      setEnabledWallets([...currentEnabled, id]);
    }
  };

  const selectAll = () => {
    setEnabledWallets(allWallets.map((w) => w.id));
  };

  const selectNone = () => {
    setEnabledWallets([]);
  };

  const hasAmount = brlAmount !== null && brlAmount > 0;
  const allSelected = enabledWallets !== null && enabledWallets.length === allWallets.length;
  const hasFavorites = !loading && !isFirstLoad && enabledWallets !== null && enabledWallets.length > 0 && !allSelected;
  const filteredWallets = showAll
    ? allWallets
    : allWallets.filter((w) => enabledWallets?.includes(w.id) ?? true);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <CreditCard className="w-4 h-4" />
          <span>Pagar con PIX</span>
        </div>
        <div className="flex items-center gap-2">
          {hasFavorites && (
            <div className="flex bg-zinc-900 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setShowAll(false)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  !showAll
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Favoritos
              </button>
              <button
                onClick={() => setShowAll(true)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  showAll
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Todas
              </button>
            </div>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Configurar billeteras"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-zinc-500 text-sm">
        {hasAmount ? formatRate(brlAmount) : "1,00"} BRL
      </div>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{ height: i === 0 ? "69.6px" : "57.6px" }}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse" />
                  <div className={i === 0 ? "space-y-1.5" : ""}>
                    <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
                    {i === 0 && (
                      <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse mt-1.5" />
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1.5">
                  <div className="w-24 h-4 bg-zinc-800 rounded ml-auto animate-pulse" />
                  <div className="w-28 h-3 bg-zinc-800 rounded ml-auto animate-pulse" />
                </div>
              </div>
            ))
          : filteredWallets.length === 0
            ? (
              <div className="text-center py-6 text-zinc-500 text-sm">
                No hay billeteras seleccionadas.
                <button
                  onClick={() => setShowSettings(true)}
                  className="block mx-auto mt-2 text-white underline"
                >
                  Configurar billeteras
                </button>
              </div>
            )
            : filteredWallets.map((wallet, index) => {
                const amount = hasAmount ? brlAmount : 1;
                const totalArs = wallet.rate * amount;

                return (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={wallet.logo}
                        alt={wallet.name}
                        className="w-8 h-8 rounded-lg object-contain bg-white p-1"
                      />
                      <div>
                        <div className="font-medium text-white text-sm">
                          {wallet.name}
                        </div>
                        {index === 0 && (
                          <span className="text-xs text-green-500">
                            Mejor opción
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {formatRate(totalArs)} ARS
                      </div>
                      {hasAmount && (
                        <div className="text-xs text-zinc-500">
                          1 BRL = {formatRate(wallet.rate)} ARS
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
      </div>

      {isDesktop ? (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white p-0 gap-0 max-w-md">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle>Billeteras PIX</DialogTitle>
              <DialogDescription className="sr-only">
                Selecciona las billeteras que quieres ver
              </DialogDescription>
            </DialogHeader>
            <WalletList
              wallets={allWallets}
              enabledWallets={enabledWallets}
              toggleWallet={toggleWallet}
              formatRate={formatRate}
              selectAll={selectAll}
              selectNone={selectNone}
              onClose={() => setShowSettings(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root open={showSettings} onOpenChange={setShowSettings}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/60" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-zinc-900 border-t border-zinc-800 flex flex-col">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mt-3" />
              <Drawer.Title className="font-semibold text-white p-4 pb-0">
                Billeteras PIX
              </Drawer.Title>
              <Drawer.Description className="sr-only">
                Selecciona las billeteras que quieres ver
              </Drawer.Description>
              <WalletList
                wallets={allWallets}
                enabledWallets={enabledWallets}
                toggleWallet={toggleWallet}
                formatRate={formatRate}
                selectAll={selectAll}
                selectNone={selectNone}
                onClose={() => setShowSettings(false)}
              />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
