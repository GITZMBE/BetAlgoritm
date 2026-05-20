import { evRating, formatTimeUntil, formatMatchTime, isWithinHours } from "../utils/betting.js";
import { SelectionWalkthrough } from "./SelectionWalkthrough.jsx";

/**
 * A collapsible card for a single match.
 * Shows summary in header; expands into guided per-selection walkthroughs.
 */
export function BetCard({ match, bankroll, expanded, onToggle }) {
  const topSel = match.valueSels[0] ?? match.selections[0];
  if (!topSel) return null;

  const rating   = evRating(topSel.ev);
  const urgent   = isWithinHours(match.time, 3);

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-200 mb-3 ${match.hasValue ? "border-border-bright" : "border-border"} bg-surface`}>
      {/* ── Header ── */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-surface-high transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-semibold text-dim uppercase tracking-widest">
              {match.sport}
            </span>
            {urgent && (
              <span className="text-[10px] bg-orange-950 text-warn px-2 py-0.5 rounded font-bold">
                ⚡ SOON
              </span>
            )}
            {match.hasValue && (
              <span className="text-[10px] bg-accent-bg text-accent px-2 py-0.5 rounded font-bold">
                VALUE BET
              </span>
            )}
          </div>
          <h3 className="text-lg font-display font-bold text-white leading-tight">
            {match.home}{" "}
            <span className="text-dim font-normal text-sm">vs</span>{" "}
            {match.away}
          </h3>
          <p className="text-xs text-sub mt-1 font-body">
            🕐 {formatMatchTime(match.time)} · {formatTimeUntil(match.time)} left
          </p>
        </div>

        {match.hasValue && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-dim mb-0.5">Best EV</p>
            <p className={`text-2xl font-display font-extrabold leading-none ${rating.color}`}>
              +{topSel.ev.toFixed(1)}%
            </p>
            <p className={`text-xs mt-1 ${rating.color}`}>{rating.label}</p>
          </div>
        )}

        <span className="text-dim text-sm mt-1 flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* ── Expanded walkthrough ── */}
      {expanded && (
        <div className="border-t border-border px-5 py-5 animate-fade-in">
          {match.valueSels.length > 0 ? (
            match.valueSels.map((sel, i) => (
              <div key={sel.name}>
                {match.valueSels.length > 1 && (
                  <h4 className="text-xs font-mono text-sub uppercase tracking-widest mb-4 pb-2 border-b border-border">
                    Option {i + 1} of {match.valueSels.length}
                  </h4>
                )}
                <SelectionWalkthrough selection={sel} bankroll={bankroll} />
                {i < match.valueSels.length - 1 && (
                  <hr className="border-border my-6" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-sub font-body">
              No value bets in this match at the current EV threshold. All odds are fairly priced.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
