import { useState } from "react";
import { formatCurrency } from "../utils/betting.js";
import { cacheExpiresLabel } from "../utils/oddsCache.js";

const KELLY_EXAMPLES = [
  { ev: 2,  kelly: 1.5, label: "Marginal bet (+2% EV)"  },
  { ev: 5,  kelly: 3.8, label: "Good bet (+5% EV)"      },
  { ev: 10, kelly: 7.2, label: "Strong bet (+10% EV)"   },
];

const EXPLAINERS = [
  {
    title: "Expected Value (EV%)",
    body: "EV is the core signal. +5% EV means for every 100 kr staked you expect 5 kr profit over a large number of bets. Individual bets still lose — EV only materialises over hundreds of bets.",
  },
  {
    title: "Half-Kelly staking",
    body: "Kelly calculates the exact % of bankroll to maximise growth. We use half-Kelly to reduce variance — it sacrifices a little expected return for much better protection against losing runs.",
  },
  {
    title: "Bankroll protection",
    body: "The Kelly formula ensures you bet proportionally to your edge. A big edge → larger stake; small edge → smaller stake. This protects you from ruin while compounding profits over time.",
  },
  {
    title: "Long-term thinking",
    body: "Value betting is a marathon. You will have losing days and weeks. The edge only shows over hundreds of bets. Stick to the stakes, don't chase losses, and track everything in a spreadsheet.",
  },
];

export function SettingsPage({
  bankroll, setBankroll,
  onChangeApiKey, remainingReqs, isDemo,
  fromCache, lastUpdated, onForceRefresh,
}) {
  const [input, setInput] = useState(bankroll > 0 ? String(bankroll) : "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    const val = parseFloat(input.replace(/\s/g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) { setError("Enter a positive number."); return; }
    setError("");
    setBankroll(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* Bankroll */}
      <div className="card px-6 py-5">
        <h2 className="text-xl font-display font-extrabold text-white mb-1">Your bankroll</h2>
        <p className="text-sm text-sub font-body leading-relaxed mb-5">
          Your total betting budget. Used to calculate exactly how much to stake on each bet using the half-Kelly criterion.
        </p>
        <div className="flex flex-wrap gap-3 items-start mb-4">
          <div className="relative flex-1 max-w-72">
            <input
              type="text"
              placeholder="e.g. 5000"
              value={input}
              onChange={(e) => { setInput(e.target.value); setSaved(false); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="input-field pr-10"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dim text-sm font-mono">kr</span>
          </div>
          <button onClick={handleSave} className="btn-primary">
            {saved ? "✓ Saved" : "Save bankroll"}
          </button>
        </div>
        {error && <p className="text-xs text-danger mb-3">{error}</p>}
        {bankroll > 0 && (
          <>
            <p className="section-label">Example stakes from {formatCurrency(bankroll)} bankroll</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {KELLY_EXAMPLES.map((ex) => {
                const stake = ((ex.kelly / 2) / 100) * bankroll;
                return (
                  <div key={ex.ev} className="stat-box">
                    <p className="text-xs text-dim font-body mb-1">{ex.label}</p>
                    <p className="text-xl font-display font-bold text-accent">{formatCurrency(stake)}</p>
                    <p className="text-xs text-dim font-mono">{(ex.kelly / 2).toFixed(1)}% stake</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* API connection */}
      <div className="card px-6 py-5">
        <h2 className="text-xl font-display font-extrabold text-white mb-2">API connection</h2>
        {isDemo ? (
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-sm text-sub font-body flex-1">
              ⚠️ Using demo data — connect an API key for live odds.
            </p>
            <button onClick={onChangeApiKey} className="btn-ghost">Connect API key</button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <p className="text-sm text-sub font-body flex-1">
                ✅ Connected · <strong className="text-white">{remainingReqs ?? "?"}</strong> requests remaining this month.
              </p>
              <button onClick={onChangeApiKey} className="btn-ghost">Change API key</button>
            </div>
            <div className="bg-surface-high border border-border rounded-xl p-4 text-sm font-body">
              {fromCache ? (
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-white font-semibold mb-0.5">📦 Serving cached data</p>
                    <p className="text-sub text-xs leading-relaxed">
                      Fetched at{" "}
                      {lastUpdated
                        ? lastUpdated.toLocaleString("sv-SE", { hour: "2-digit", minute: "2-digit" })
                        : "—"
                      }
                      {" "}· refreshes at midnight (in <strong className="text-accent">{cacheExpiresLabel()}</strong>).
                      No API requests used when browsing today.
                    </p>
                  </div>
                  <button onClick={onForceRefresh} className="btn-ghost text-xs flex-shrink-0">
                    Force refresh now
                  </button>
                </div>
              ) : (
                <p className="text-sub">
                  Data just fetched live. Cached until midnight — no further requests used today unless you change sports or force a refresh.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Strategy guide */}
      <div className="card px-6 py-5">
        <h2 className="text-xl font-display font-extrabold text-white mb-4">How value betting works</h2>
        <div className="space-y-4">
          {EXPLAINERS.map((item, i) => (
            <div key={item.title} className={`pb-4 ${i < EXPLAINERS.length - 1 ? "border-b border-border" : ""}`}>
              <h3 className="text-sm font-display font-bold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-sub font-body leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}