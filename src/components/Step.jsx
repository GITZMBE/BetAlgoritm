/**
 * A numbered step row used inside BetCard's guided walkthrough.
 */
export function Step({ num, title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="step-number">{num}</span>
        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
          {title}
        </h4>
      </div>
      <div className="pl-9">{children}</div>
    </div>
  );
}
