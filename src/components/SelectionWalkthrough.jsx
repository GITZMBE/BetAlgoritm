import { Step } from "./Step.jsx";
import { StatBox } from "./StatBox.jsx";
import { OddsComparison } from "./OddsComparison.jsx";
import {
  evRating,
  confidenceText,
  halfKellyStake,
  formatCurrency,
} from "../utils/betting.js";

/**
 * Four-step guided walkthrough for a single selection (outcome).
 * Used inside BetCard.
 */
export function SelectionWalkthrough({ selection, bankroll }) {
  const { name, bestOdds, bestBook, avgOdds, prob, ev, kelly, bookOdds, spread, numBooks } = selection;
  const rating    = evRating(ev);
  const stake     = bankroll > 0 ? halfKellyStake(prob, bestOdds, bankroll) : 0;
  const halfKelly = (kelly / 2).toFixed(1);
  const fairOdds  = (1 / prob).toFixed(2);
  const above     = ((bestOdds - avgOdds) / avgOdds * 100).toFixed(1);

  return (
    <div>
      {/* Step 1 — What to bet */}
      <Step num={1} title="What to bet">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xl font-display font-bold text-white">{name} to win</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${rating.bg}`}>
            {rating.dot} {rating.label}
          </span>
        </div>
        <p className="text-sm text-sub leading-relaxed font-body">{confidenceText(ev)}</p>
      </Step>

      {/* Step 2 — Where to bet */}
      <Step num={2} title="Where to place it">
        <div className="flex flex-wrap gap-4 items-start mb-3">
          <div className="bg-accent-bg border border-accent rounded-xl px-4 py-3">
            <p className="section-label mb-1">Best bookmaker</p>
            <p className="text-xl font-display font-bold text-accent">{bestBook}</p>
            <p className="text-sm font-mono text-accent-dim">Odds: {bestOdds.toFixed(2)}</p>
          </div>
          <p className="text-sm text-sub leading-relaxed font-body max-w-xs self-center">
            {bestBook} is offering odds {above}% above the market average of{" "}
            <span className="text-white font-mono">{avgOdds.toFixed(2)}</span>. That gap is
            your edge.
          </p>
        </div>
        <OddsComparison bookOdds={bookOdds} bestBook={bestBook} />
      </Step>

      {/* Step 3 — How much to stake */}
      <Step num={3} title="How much to stake">
        {bankroll > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <StatBox label="Recommended stake" value={formatCurrency(stake)} color="text-accent" large />
              <StatBox label="Half-Kelly %" value={`${halfKelly}% of bankroll`} />
              <StatBox label="Potential return" value={formatCurrency(stake * bestOdds)} />
              <StatBox label="Potential profit" value={`+${formatCurrency(stake * (bestOdds - 1))}`} color="text-green-300" />
            </div>
            <div className="bg-surface-high border border-border rounded-xl p-3 text-sm text-sub font-body leading-relaxed">
              💡 <strong className="text-white">Why this amount?</strong> We use{" "}
              <em>half-Kelly</em> ({halfKelly}% of your{" "}
              {formatCurrency(bankroll)} bankroll) — the mathematically optimal stake,
              halved to reduce variance and protect against bad streaks.
            </div>
          </>
        ) : (
          <div className="bg-surface-high border border-border rounded-xl p-3 text-sm text-sub font-body leading-relaxed">
            Set your bankroll in <strong className="text-white">Settings</strong> to see
            personalised stake recommendations.
            {kelly > 0 && (
              <span> Kelly suggests roughly <strong className="text-white">{halfKelly}%</strong> of your bankroll.</span>
            )}
          </div>
        )}
      </Step>

      {/* Step 4 — Why */}
      <Step num={4} title="Why this is a value bet">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <StatBox
            label="Expected value"
            value={`+${ev.toFixed(1)}%`}
            color={rating.color}
            note="Long-run profit per 100 kr staked"
          />
          <StatBox
            label="Fair probability"
            value={`${(prob * 100).toFixed(1)}%`}
            note="Market consensus after vig removal"
          />
          <StatBox
            label="Fair odds"
            value={fairOdds}
            note="Break-even odds based on true probability"
          />
          <StatBox
            label="Odds spread"
            value={`${spread.toFixed(1)}%`}
            note={`Gap between best and worst across ${numBooks} bookmakers`}
          />
        </div>
        <p className="text-sm text-sub leading-relaxed font-body">
          The consensus across <strong className="text-white">{numBooks} bookmakers</strong> puts
          the fair odds at <strong className="text-white font-mono">{fairOdds}</strong>, implying
          a <strong className="text-white">{(prob * 100).toFixed(1)}%</strong> chance of{" "}
          <em>{name}</em> winning.{" "}
          <strong className="text-white">{bestBook}</strong> is offering{" "}
          <strong className="text-accent font-mono">{bestOdds.toFixed(2)}</strong> — higher than
          the fair price. That gap of <strong className="text-accent">+{ev.toFixed(1)}%</strong>{" "}
          EV means for every 100 kr bet, you expect {ev.toFixed(1)} kr profit over time.
        </p>
      </Step>
    </div>
  );
}
