/**
 * Displays all bookmaker odds for a selection, ranked best-first.
 * Highlights the best book in accent colour.
 */
export function OddsComparison({ bookOdds, bestBook }) {
  const sorted = Object.entries(bookOdds).sort(([, a], [, b]) => b - a);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sorted.map(([book, odds]) => {
        const isBest = book === bestBook;
        return (
          <div
            key={book}
            className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
              isBest
                ? "bg-accent-bg border-accent text-accent"
                : "bg-surface-high border-border text-dim"
            }`}
          >
            {book}{" "}
            <strong className={isBest ? "text-accent" : "text-sub"}>
              {odds.toFixed(2)}
            </strong>
            {isBest && <span className="ml-1 text-accent-dim">★</span>}
          </div>
        );
      })}
    </div>
  );
}
