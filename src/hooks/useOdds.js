import { useState, useCallback } from "react";
import { BOOKMAKERS_EU } from "../data/constants.js";
import { getDemoEvents } from "../data/demoData.js";
import { processEvents } from "../utils/processEvents.js";

/**
 * Fetches odds from The Odds API for the given sports and processes them.
 * Falls back to demo data when no API key is provided or on error.
 */
export function useOdds(minEV) {
  const [matches, setMatches]               = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [isDemo, setIsDemo]                 = useState(false);
  const [lastUpdated, setLastUpdated]       = useState(null);
  const [remainingReqs, setRemainingReqs]   = useState(null);

  const fetch = useCallback(
    async (apiKey, selectedSports) => {
      if (!apiKey) {
        setMatches(processEvents(getDemoEvents(), minEV));
        setIsDemo(true);
        return;
      }

      setLoading(true);
      setError(null);
      setIsDemo(false);

      try {
        const allEvents = [];
        for (const sport of selectedSports.slice(0, 5)) {
          const url = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`);
          url.searchParams.set("apiKey", apiKey);
          url.searchParams.set("regions", "eu");
          url.searchParams.set("markets", "h2h");
          url.searchParams.set("oddsFormat", "decimal");
          url.searchParams.set("bookmakers", BOOKMAKERS_EU.join(","));

          const res = await window.fetch(url.toString());
          const remaining = res.headers.get("x-requests-remaining");
          if (remaining) setRemainingReqs(remaining);

          if (!res.ok) {
            if (res.status === 401) throw new Error("Invalid API key — check your key in Settings.");
            if (res.status === 429) throw new Error("Rate limit reached. Wait a minute and refresh.");
            throw new Error(`API error ${res.status}`);
          }

          allEvents.push(...(await res.json()));
        }

        setMatches(processEvents(allEvents, minEV));
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
        setMatches(processEvents(getDemoEvents(), minEV));
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    },
    [minEV]
  );

  return { matches, loading, error, isDemo, lastUpdated, remainingReqs, fetch };
}
