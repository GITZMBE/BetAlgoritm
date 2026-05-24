import { useState, useCallback } from "react";
import { BOOKMAKERS_EU } from "../data/constants.js";
import { getDemoEvents } from "../data/demoData.js";
import { processEvents } from "../utils/processEvents.js";
import { loadCache, saveCache, clearCache } from "../utils/oddsCache.js";

export function useOdds(minEV) {
  const [matches,       setMatches]       = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [isDemo,        setIsDemo]        = useState(false);
  const [lastUpdated,   setLastUpdated]   = useState(null);
  const [remainingReqs, setRemainingReqs] = useState(null);
  const [fromCache,     setFromCache]     = useState(false);

  const fetch = useCallback(
    async (apiKey, selectedSports, { forceRefresh = false } = {}) => {
      if (!apiKey) {
        setMatches(processEvents(getDemoEvents(), minEV));
        setIsDemo(true);
        setFromCache(false);
        return;
      }

      if (!forceRefresh) {
        const cached = loadCache(selectedSports);
        if (cached) {
          setMatches(processEvents(cached.events, minEV));
          setLastUpdated(new Date(cached.meta.fetchedAt));
          setRemainingReqs(cached.meta.remaining);
          setIsDemo(false);
          setFromCache(true);
          return;
        }
      }

      setLoading(true);
      setError(null);
      setIsDemo(false);
      setFromCache(false);

      try {
        const allEvents = [];
        let remaining   = null;

        for (const sport of selectedSports.slice(0, 5)) {
          const url = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`);
          url.searchParams.set("apiKey",     apiKey);
          url.searchParams.set("regions",    "eu");
          url.searchParams.set("markets",    "h2h");
          url.searchParams.set("oddsFormat", "decimal");
          url.searchParams.set("bookmakers", BOOKMAKERS_EU.join(","));

          const res = await window.fetch(url.toString());
          const hdr = res.headers.get("x-requests-remaining");
          if (hdr) remaining = hdr;

          if (!res.ok) {
            if (res.status === 401) throw new Error("Invalid API key — check your key in Settings.");
            if (res.status === 429) throw new Error("Rate limit reached. Wait a minute and refresh.");
            throw new Error(`API error ${res.status}`);
          }

          allEvents.push(...(await res.json()));
        }

        saveCache(allEvents, selectedSports, remaining);

        setMatches(processEvents(allEvents, minEV));
        setLastUpdated(new Date());
        if (remaining) setRemainingReqs(remaining);

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

  const forceRefresh = useCallback(
    (apiKey, selectedSports) => {
      clearCache();
      fetch(apiKey, selectedSports, { forceRefresh: true });
    },
    [fetch]
  );

  return {
    matches, loading, error, isDemo,
    lastUpdated, remainingReqs, fromCache,
    fetch, forceRefresh,
  };
};
