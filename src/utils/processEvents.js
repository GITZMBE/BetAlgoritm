import { impliedProb, expectedValue, kellyFraction, isToday } from "./betting.js";

/**
 * Transform raw Odds API events into enriched match objects with
 * per-selection EV, Kelly, best book, and value flags.
 *
 * @param {object[]} events   - Raw events from The Odds API
 * @param {number}   minEV    - Minimum EV% threshold for a "value" selection
 * @returns {object[]} Sorted matches (highest topEV first)
 */
export function processEvents(events, minEV = 2) {
  return events
    .map((ev) => {
      // Gather all outcomes across every bookmaker
      const allOutcomes = {};
      for (const bm of ev.bookmakers) {
        const market = bm.markets?.find((m) => m.key === "h2h");
        if (!market) continue;
        for (const outcome of market.outcomes) {
          if (!allOutcomes[outcome.name]) allOutcomes[outcome.name] = {};
          allOutcomes[outcome.name][bm.title ?? bm.key] = outcome.price;
        }
      }

      // Build selection objects
      const selections = Object.entries(allOutcomes)
        .map(([name, bookOdds]) => {
          const prices = Object.values(bookOdds).filter((p) => p > 1);
          if (prices.length === 0) return null;

          const bestOdds  = Math.max(...prices);
          const worstOdds = Math.min(...prices);
          const bestBook  = Object.entries(bookOdds).find(([, v]) => v === bestOdds)?.[0];
          const avgOdds   = prices.reduce((a, b) => a + b, 0) / prices.length;
          const prob      = impliedProb(avgOdds);
          const ev        = expectedValue(prob, bestOdds);
          const kelly     = kellyFraction(prob, bestOdds);
          const spread    = ((bestOdds - worstOdds) / worstOdds) * 100;

          return {
            name,
            bestOdds,
            bestBook,
            worstOdds,
            avgOdds,
            prob,
            ev,
            kelly,
            bookOdds,
            spread,
            numBooks: prices.length,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.ev - a.ev);

      const valueSels = selections.filter((s) => s.ev >= minEV);
      const topEV     = selections.length ? selections[0].ev : -Infinity;

      return {
        id:        ev.id,
        sport:     ev.sport_title,
        sportKey:  ev.sport_key,
        home:      ev.home_team,
        away:      ev.away_team,
        time:      ev.commence_time,
        selections,
        valueSels,
        hasValue:  valueSels.length > 0,
        topEV,
        isToday:   isToday(ev.commence_time),
      };
    })
    .sort((a, b) => b.topEV - a.topEV);
}
