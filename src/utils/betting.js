// ─── Betting Math ─────────────────────────────────────────────────────────────

/** Implied probability from decimal odds (after vig removal via avg) */
export function impliedProb(avgDecimalOdds) {
  return 1 / avgDecimalOdds;
}

/** Expected value in percent */
export function expectedValue(prob, bestOdds) {
  return (prob * bestOdds - 1) * 100;
}

/** Full Kelly % of bankroll */
export function kellyFraction(prob, bestOdds) {
  const b = bestOdds - 1;
  const q = 1 - prob;
  return Math.max(0, ((b * prob - q) / b) * 100);
}

/** Half-Kelly stake in currency units */
export function halfKellyStake(prob, bestOdds, bankroll) {
  return (kellyFraction(prob, bestOdds) / 2 / 100) * bankroll;
}

// ─── EV Rating ───────────────────────────────────────────────────────────────

export function evRating(ev) {
  if (ev >= 8)  return { label: "Exceptional",   color: "text-accent",    dot: "🟢", bg: "bg-accent-bg border-accent" };
  if (ev >= 4)  return { label: "Strong value",  color: "text-green-300", dot: "🟢", bg: "bg-green-950 border-green-700" };
  if (ev >= 2)  return { label: "Good value",    color: "text-lime-300",  dot: "🟡", bg: "bg-lime-950 border-lime-700" };
  if (ev >= 0)  return { label: "Marginal",      color: "text-warn",      dot: "🟡", bg: "bg-orange-950 border-orange-700" };
  return         { label: "No value",            color: "text-danger",    dot: "🔴", bg: "bg-danger-bg border-danger" };
}

// ─── Date / Time Helpers ──────────────────────────────────────────────────────

export function formatTimeUntil(isoString) {
  const diff = new Date(isoString) - Date.now();
  if (diff < 0) return "Started";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0)   return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatMatchTime(isoString) {
  return new Date(isoString).toLocaleString("sv-SE", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function isToday(isoString) {
  const d   = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth()    &&
    d.getDate()     === now.getDate()
  );
}

export function isWithinHours(isoString, hours) {
  const diff = new Date(isoString) - Date.now();
  return diff > 0 && diff < hours * 3_600_000;
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatCurrency(amount, currency = "kr") {
  return `${Math.round(amount).toLocaleString("sv-SE")} ${currency}`;
}

// ─── Confidence Explanations ──────────────────────────────────────────────────

export function confidenceText(ev) {
  if (ev >= 8) return "The market is significantly mispricing this outcome. Multiple bookmakers agree on lower odds, but one is offering considerably more — a rare edge worth acting on.";
  if (ev >= 4) return "Multiple bookmakers are offering odds higher than the market-implied probability. The math clearly favors this bet over the long run.";
  if (ev >= 2) return "There's a modest discrepancy between the best available odds and the fair market price. Worth including at a reduced stake.";
  if (ev >= 0) return "The odds are roughly fair — very little edge here. Only bet if you have a specific reason to believe in this outcome beyond the numbers.";
  return "The bookmaker odds are lower than the fair price. You'd be paying a premium. Avoid.";
}
