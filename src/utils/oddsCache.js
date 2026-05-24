const CACHE_KEY  = "oddsCache_events";
const CACHE_META = "oddsCache_meta";

function msUntilMidnight() {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function saveCache(events, sports, remaining) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(events));
    localStorage.setItem(
      CACHE_META,
      JSON.stringify({
        expiresAt: nextMidnight(),
        sports:    [...sports].sort(),
        remaining,
        fetchedAt: Date.now(),
      })
    );
  } catch {
    // storage quota — skip silently
  }
}

export function loadCache(sports) {
  try {
    const raw  = localStorage.getItem(CACHE_KEY);
    const meta = localStorage.getItem(CACHE_META);
    if (!raw || !meta) return null;

    const parsed = JSON.parse(meta);

    if (Date.now() >= parsed.expiresAt) return null;

    const cachedSports  = [...(parsed.sports ?? [])].sort().join(",");
    const requestSports = [...sports].sort().join(",");
    if (cachedSports !== requestSports) return null;

    return { events: JSON.parse(raw), meta: parsed };
  } catch {
    return null;
  }
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_META);
}

export function cacheExpiresLabel() {
  const ms = msUntilMidnight();
  const h  = Math.floor(ms / 3_600_000);
  const m  = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}