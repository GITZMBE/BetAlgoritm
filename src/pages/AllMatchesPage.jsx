import { useState } from "react";
import { BetCard } from "../components/BetCard.jsx";
import { SPORTS } from "../data/constants.js";

/**
 * "All Matches" page — full list of upcoming events with sport/EV filters.
 */
export function AllMatchesPage({
  matches, bankroll,
  minEV, setMinEV,
  selectedSports, setSelectedSports,
}) {
  const [expandedIds,   setExpandedIds]   = useState(new Set());
  const [showValueOnly, setShowValueOnly] = useState(true);

  const toggle = (id) =>
    setExpandedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const toggleSport = (key) =>
    setSelectedSports((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );

  const displayed = showValueOnly ? matches.filter((m) => m.hasValue) : matches;
  const valueCount = matches.filter((m) => m.hasValue).length;

  return (
    <div>
      {/* ── Filters panel ── */}
      <div className="card px-5 py-4 mb-5">
        <div className="flex flex-wrap gap-6">
          {/* Sports */}
          <div className="flex-1 min-w-48">
            <p className="section-label">Sports</p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => toggleSport(s.key)}
                  className={`pill ${selectedSports.includes(s.key) ? "pill-active" : "pill-inactive"}`}
                >
                  {s.flag} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="min-w-48">
            <p className="section-label">Filters</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-sub font-body">Min EV</span>
              <input
                type="range" min="0" max="15" step="0.5" value={minEV}
                onChange={(e) => setMinEV(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-accent font-mono w-10">+{minEV}%</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-sub font-body">
              <input
                type="checkbox" checked={showValueOnly}
                onChange={(e) => setShowValueOnly(e.target.checked)}
              />
              Value bets only
            </label>
          </div>
        </div>
      </div>

      {/* ── Summary row ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Matches loaded",  value: matches.length,  accent: false },
          { label: "Value bets",      value: valueCount,      accent: true  },
          { label: "Best EV",         value: matches[0] ? `+${matches[0].topEV.toFixed(1)}%` : "—", accent: true },
        ].map((s) => (
          <div key={s.label} className="stat-box">
            <p className="text-xs text-dim font-body">{s.label}</p>
            <p className={`text-2xl font-display font-bold ${s.accent ? "text-accent" : "text-white"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Match list ── */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-dim font-body text-sm">
          No matches found. Try selecting more sports or lowering the min EV threshold.
        </div>
      ) : (
        displayed.map((m) => (
          <BetCard
            key={m.id}
            match={m}
            bankroll={bankroll}
            expanded={expandedIds.has(m.id)}
            onToggle={() => toggle(m.id)}
          />
        ))
      )}
    </div>
  );
}
