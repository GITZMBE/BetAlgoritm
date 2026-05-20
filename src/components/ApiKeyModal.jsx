import { useState } from "react";

/**
 * Fullscreen modal shown on first launch to collect The Odds API key.
 * onSave(key) — key is null if user chooses demo mode.
 */
export function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState("");

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-high border border-border-bright rounded-2xl p-8 max-w-lg w-full animate-fade-in">
        <h2 className="text-2xl font-display font-extrabold text-white mb-2">
          Connect live odds
        </h2>
        <p className="text-sm text-sub font-body leading-relaxed mb-6">
          EdgeFinder pulls real-time odds from{" "}
          <strong className="text-white">Bet365, Unibet, William Hill, Pinnacle</strong> and
          more via{" "}
          <a
            href="https://the-odds-api.com"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline"
          >
            The Odds API
          </a>
          .<br />
          <br />
          Get a free key at the-odds-api.com — 500 requests/month, plenty for daily use.
        </p>

        <input
          type="text"
          placeholder="Paste your API key here…"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && key.trim() && onSave(key.trim())}
          className="input-field mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={() => key.trim() && onSave(key.trim())}
            className="btn-primary flex-1"
          >
            Connect
          </button>
          <button onClick={() => onSave(null)} className="btn-ghost">
            Use demo data
          </button>
        </div>
      </div>
    </div>
  );
}
