import { useState } from "react";
import { BetCard } from "../components/BetCard.jsx";
import { evRating, formatTimeUntil, halfKellyStake, formatCurrency } from "../utils/betting.js";

/**
 * The "Today" page — shows only today's value bets with a summary plan at the top.
 */
export function TodayPage({ matches, bankroll }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const todayMatches = matches.filter((m) => m.isToday && m.hasValue);

  const toggle = (id) =>
    setExpandedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const totalStake = todayMatches.reduce((sum, m) => {
    const sel = m.valueSels[0];
    if (!sel || !bankroll) return sum;
    return sum + halfKellyStake(sel.prob, sel.bestOdds, bankroll);
  }, 0);

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-br from-accent-bg to-surface border border-border-bright rounded-2xl px-7 py-6 mb-6">
        <p className="section-label">
          {new Date().toLocaleDateString("sv-SE", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
        <h1 className="text-3xl font-display font-extrabold text-white mb-1">
          {todayMatches.length > 0
            ? `${todayMatches.length} value bet${todayMatches.length !== 1 ? "s" : ""} today`
            : "No value bets today"}
        </h1>
        {todayMatches.length > 0 && (
          <p className="text-sm text-sub font-body">
            {bankroll > 0 ? (
              <>
                Recommended total stake:{" "}
                <strong className="text-accent">{formatCurrency(totalStake)}</strong> across all
                bets
              </>
            ) : (
              <>Add your bankroll in <strong className="text-white">Settings</strong> to see stake recommendations.</>
            )}
          </p>
        )}
      </div>

      {todayMatches.length === 0 ? (
        <div className="text-center py-20 text-sub font-body">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-lg font-semibold text-sub mb-2">Nothing today</p>
          <p className="text-sm text-dim">Check All Matches for upcoming bets, or refresh later.</p>
        </div>
      ) : (
        <>
          {/* ── Summary plan table ── */}
          <div className="card mb-6 overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <p className="section-label mb-0">Today's betting plan</p>
            </div>
            {todayMatches.map((m, i) => {
              const sel    = m.valueSels[0];
              if (!sel) return null;
              const rating = evRating(sel.ev);
              const stake  = bankroll > 0 ? halfKellyStake(sel.prob, sel.bestOdds, bankroll) : null;

              return (
                <div
                  key={m.id}
                  className={`flex flex-wrap gap-3 items-center px-5 py-4 ${
                    i < todayMatches.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex-1 min-w-40">
                    <p className="text-sm font-display font-semibold text-white">
                      {m.home} vs {m.away}
                    </p>
                    <p className="text-xs text-sub font-body mt-0.5">
                      Bet: <strong className="text-white">{sel.name}</strong> @ {sel.bestBook}
                    </p>
                  </div>

                  <div className="text-right min-w-16">
                    <p className="text-xs text-dim">Odds</p>
                    <p className="text-base font-mono font-bold text-white">
                      {sel.bestOdds.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right min-w-16">
                    <p className="text-xs text-dim">EV</p>
                    <p className={`text-base font-mono font-bold ${rating.color}`}>
                      +{sel.ev.toFixed(1)}%
                    </p>
                  </div>

                  {stake !== null && (
                    <div className="text-right min-w-20">
                      <p className="text-xs text-dim">Stake</p>
                      <p className="text-base font-mono font-bold text-accent">
                        {formatCurrency(stake)}
                      </p>
                    </div>
                  )}

                  <span className="text-[10px] bg-accent-bg text-accent px-2 py-1 rounded font-mono font-bold whitespace-nowrap">
                    {formatTimeUntil(m.time)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Detailed cards ── */}
          <p className="section-label">Detailed breakdown</p>
          {todayMatches.map((m) => (
            <BetCard
              key={m.id}
              match={m}
              bankroll={bankroll}
              expanded={expandedIds.has(m.id)}
              onToggle={() => toggle(m.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
