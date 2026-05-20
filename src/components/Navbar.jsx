/**
 * Sticky top navigation bar.
 */
export function Navbar({ page, setPage, todayCount, loading, isDemo, lastUpdated, remainingReqs, onRefresh }) {
  const NavBtn = ({ id, label, badge }) => (
    <button
      onClick={() => setPage(id)}
      className={`nav-btn ${page === id ? "nav-btn-active" : ""}`}
    >
      {label}
      {badge > 0 && (
        <span className="bg-accent text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border h-14 flex items-center px-6 justify-between">
      {/* Logo + nav */}
      <div className="flex items-center gap-6">
        <span className="text-base font-display font-extrabold tracking-tight text-white flex-shrink-0">
          <span className="text-accent">◆</span> EdgeFinder
        </span>
        <nav className="flex gap-1">
          <NavBtn id="today"    label="Today"       badge={todayCount} />
          <NavBtn id="all"      label="All matches" />
          <NavBtn id="settings" label="Settings" />
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isDemo && (
          <span className="text-[10px] bg-orange-950 text-warn px-2 py-1 rounded font-semibold font-mono">
            Demo data
          </span>
        )}
        {lastUpdated && (
          <span className="text-xs text-dim hidden sm:block font-mono">
            {lastUpdated.toLocaleTimeString("sv-SE")}
          </span>
        )}
        {remainingReqs && (
          <span className="text-xs text-dim hidden sm:block font-mono">
            {remainingReqs} req left
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-ghost text-accent disabled:opacity-40"
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>
    </header>
  );
}
