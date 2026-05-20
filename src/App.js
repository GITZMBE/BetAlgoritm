import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SPORTS = [
  { key: "soccer_epl",            label: "Premier League",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { key: "soccer_sweden_allsvenskan", label: "Allsvenskan",  flag: "🇸🇪" },
  { key: "soccer_uefa_champs_league", label: "Champions League", flag: "⭐" },
  { key: "soccer_spain_la_liga",  label: "La Liga",          flag: "🇪🇸" },
  { key: "soccer_germany_bundesliga", label: "Bundesliga",   flag: "🇩🇪" },
  { key: "soccer_italy_serie_a",  label: "Serie A",          flag: "🇮🇹" },
  { key: "soccer_france_ligue_one", label: "Ligue 1",        flag: "🇫🇷" },
  { key: "basketball_nba",        label: "NBA",              flag: "🏀" },
  { key: "americanfootball_nfl",  label: "NFL",              flag: "🏈" },
  { key: "icehockey_nhl",         label: "NHL",              flag: "🏒" },
  { key: "tennis_atp_french_open","label": "Tennis ATP",     flag: "🎾" },
];

const BOOKMAKERS_EU = [
  "bet365","unibet","williamhill","betfair","pinnacle",
  "bwin","nordicbet","betsson","matchbook","marathonbet"
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
function calcImpliedProb(decimal) { return 1 / decimal; }
function calcEV(myProb, decimal) { return (myProb * decimal - 1) * 100; }
function calcKelly(myProb, decimal) {
  const b = decimal - 1;
  const q = 1 - myProb;
  return Math.max(0, ((b * myProb - q) / b) * 100);
}
function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = d - now;
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (diff < 0) return "Live / started";
  if (hours < 1) return `${mins}m`;
  if (hours < 24) return `${hours}h ${mins}m`;
  return d.toLocaleDateString("sv-SE", { weekday:"short", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}
function oddsColor(ev) {
  if (ev >= 8) return "#4ade80";
  if (ev >= 3) return "#86efac";
  if (ev >= 0) return "#bbf7d0";
  return "#f87171";
}

// ─── DEMO DATA (shown when no API key) ───────────────────────────────────────
function demoData() {
  const now = Date.now();
  return [
    {
      id:"demo1", sport_key:"soccer_epl", sport_title:"Premier League",
      commence_time: new Date(now + 3600000*5).toISOString(),
      home_team:"Arsenal", away_team:"Chelsea",
      bookmakers:[
        { key:"bet365", title:"Bet365", markets:[{ key:"h2h", outcomes:[
          {name:"Arsenal",price:2.10},{name:"Chelsea",price:3.60},{name:"Draw",price:3.20}
        ]}]},
        { key:"unibet", title:"Unibet", markets:[{ key:"h2h", outcomes:[
          {name:"Arsenal",price:2.05},{name:"Chelsea",price:3.75},{name:"Draw",price:3.10}
        ]}]},
        { key:"williamhill", title:"William Hill", markets:[{ key:"h2h", outcomes:[
          {name:"Arsenal",price:2.08},{name:"Chelsea",price:3.50},{name:"Draw",price:3.30}
        ]}]},
        { key:"pinnacle", title:"Pinnacle", markets:[{ key:"h2h", outcomes:[
          {name:"Arsenal",price:2.15},{name:"Chelsea",price:3.55},{name:"Draw",price:3.15}
        ]}]},
      ]
    },
    {
      id:"demo2", sport_key:"soccer_epl", sport_title:"Premier League",
      commence_time: new Date(now + 3600000*28).toISOString(),
      home_team:"Liverpool", away_team:"Man City",
      bookmakers:[
        { key:"bet365", title:"Bet365", markets:[{ key:"h2h", outcomes:[
          {name:"Liverpool",price:2.40},{name:"Man City",price:2.90},{name:"Draw",price:3.30}
        ]}]},
        { key:"unibet", title:"Unibet", markets:[{ key:"h2h", outcomes:[
          {name:"Liverpool",price:2.35},{name:"Man City",price:3.00},{name:"Draw",price:3.20}
        ]}]},
        { key:"pinnacle", title:"Pinnacle", markets:[{ key:"h2h", outcomes:[
          {name:"Liverpool",price:2.45},{name:"Man City",price:2.95},{name:"Draw",price:3.25}
        ]}]},
      ]
    },
    {
      id:"demo3", sport_key:"soccer_sweden_allsvenskan", sport_title:"Allsvenskan",
      commence_time: new Date(now + 3600000*50).toISOString(),
      home_team:"Malmö FF", away_team:"IFK Göteborg",
      bookmakers:[
        { key:"bet365", title:"Bet365", markets:[{ key:"h2h", outcomes:[
          {name:"Malmö FF",price:1.75},{name:"IFK Göteborg",price:4.50},{name:"Draw",price:3.60}
        ]}]},
        { key:"unibet", title:"Unibet", markets:[{ key:"h2h", outcomes:[
          {name:"Malmö FF",price:1.80},{name:"IFK Göteborg",price:4.20},{name:"Draw",price:3.50}
        ]}]},
      ]
    },
    {
      id:"demo4", sport_key:"basketball_nba", sport_title:"NBA",
      commence_time: new Date(now + 3600000*10).toISOString(),
      home_team:"Boston Celtics", away_team:"Golden State Warriors",
      bookmakers:[
        { key:"bet365", title:"Bet365", markets:[{ key:"h2h", outcomes:[
          {name:"Boston Celtics",price:1.65},{name:"Golden State Warriors",price:2.25}
        ]}]},
        { key:"draftkings", title:"DraftKings", markets:[{ key:"h2h", outcomes:[
          {name:"Boston Celtics",price:1.62},{name:"Golden State Warriors",price:2.30}
        ]}]},
        { key:"pinnacle", title:"Pinnacle", markets:[{ key:"h2h", outcomes:[
          {name:"Boston Celtics",price:1.67},{name:"Golden State Warriors",price:2.20}
        ]}]},
      ]
    },
  ];
}

// ─── PROCESS EVENTS INTO VALUE BETS ──────────────────────────────────────────
function processEvents(events, minEV) {
  const results = [];
  events.forEach(ev => {
    const allOutcomes = {};
    ev.bookmakers.forEach(bm => {
      const market = bm.markets?.find(m => m.key === "h2h");
      if (!market) return;
      market.outcomes.forEach(o => {
        if (!allOutcomes[o.name]) allOutcomes[o.name] = {};
        allOutcomes[o.name][bm.title || bm.key] = o.price;
      });
    });

    const selections = Object.entries(allOutcomes).map(([name, bookOdds]) => {
      const prices = Object.values(bookOdds).filter(p => p > 1);
      if (prices.length === 0) return null;
      const bestOdds = Math.max(...prices);
      const bestBook = Object.entries(bookOdds).find(([,v]) => v === bestOdds)?.[0];
      const avgOdds = prices.reduce((a,b) => a+b, 0) / prices.length;
      const impliedProb = calcImpliedProb(avgOdds);
      const ev = calcEV(impliedProb, bestOdds);
      const kelly = calcKelly(impliedProb, bestOdds);
      return { name, bestOdds, bestBook, avgOdds, impliedProb, ev, kelly, bookOdds };
    }).filter(Boolean);

    const valueSels = selections.filter(s => s.ev >= minEV);

    results.push({
      id: ev.id,
      sport: ev.sport_title,
      sportKey: ev.sport_key,
      home: ev.home_team,
      away: ev.away_team,
      time: ev.commence_time,
      selections,
      valueSels,
      hasValue: valueSels.length > 0,
      topEV: Math.max(...selections.map(s => s.ev)),
    });
  });
  return results.sort((a,b) => b.topEV - a.topEV);
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
      <div style={{background:"#13131f",border:"1px solid #2a2a40",borderRadius:16,padding:"2rem",maxWidth:480,width:"90%"}}>
        <div style={{fontSize:24,fontWeight:700,marginBottom:8,color:"#f0f0ff"}}>Connect to live odds</div>
        <p style={{color:"#888",lineHeight:1.6,marginBottom:20,fontSize:14}}>
          This app uses <strong style={{color:"#c8c8ff"}}>The Odds API</strong> to fetch real-time odds from Bet365, Unibet, William Hill, Pinnacle and more.<br/><br/>
          Get a free API key at <a href="https://the-odds-api.com" target="_blank" rel="noreferrer" style={{color:"#818cf8"}}>the-odds-api.com</a> (500 free requests/month — enough for daily use).
        </p>
        <input
          type="text"
          placeholder="Paste your API key here..."
          value={key}
          onChange={e => setKey(e.target.value)}
          style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",borderRadius:8,border:"1px solid #2a2a40",background:"#0a0a0f",color:"#f0f0ff",fontSize:14,marginBottom:12,fontFamily:"JetBrains Mono, monospace"}}
        />
        <div style={{display:"flex",gap:10}}>
          <button onClick={() => key.trim() && onSave(key.trim())} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:"#6366f1",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>
            Connect
          </button>
          <button onClick={() => onSave(null)} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #2a2a40",background:"transparent",color:"#888",cursor:"pointer",fontSize:14}}>
            Use demo data
          </button>
        </div>
      </div>
    </div>
  );
}

function OddsTable({ bookOdds, bestBook }) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
      {Object.entries(bookOdds).sort((a,b) => b[1]-a[1]).map(([book,odds]) => (
        <div key={book} style={{
          padding:"3px 8px",borderRadius:6,fontSize:12,fontFamily:"JetBrains Mono, monospace",
          background: book === bestBook ? "#312e81" : "#1a1a2e",
          color: book === bestBook ? "#a5b4fc" : "#666",
          border: book === bestBook ? "1px solid #4338ca" : "1px solid transparent",
        }}>
          {book}: <strong style={{color: book===bestBook?"#e0e7ff":"#888"}}>{odds.toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, expanded, onToggle }) {
  const urgency = new Date(match.time) - Date.now();
  const isUrgent = urgency < 3600000 * 6;
  return (
    <div style={{
      background:"#0f0f1a",border:`1px solid ${match.hasValue ? "#312e81" : "#1a1a28"}`,
      borderRadius:12,overflow:"hidden",transition:"border-color 0.2s",
      boxShadow: match.hasValue ? "0 0 0 1px #4338ca22" : "none"
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,
          background: match.hasValue ? "linear-gradient(135deg,#0f0f22,#13132a)" : "#0f0f1a"}}
      >
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:11,fontWeight:600,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.08em"}}>{match.sport}</span>
            {isUrgent && urgency > 0 && <span style={{fontSize:10,background:"#7f1d1d",color:"#fca5a5",padding:"2px 6px",borderRadius:4,fontWeight:600}}>SOON</span>}
            {match.hasValue && <span style={{fontSize:10,background:"#14532d",color:"#86efac",padding:"2px 6px",borderRadius:4,fontWeight:600}}>VALUE</span>}
          </div>
          <div style={{fontSize:16,fontWeight:600,color:"#f0f0ff"}}>{match.home} <span style={{color:"#444",fontWeight:400}}>vs</span> {match.away}</div>
          <div style={{fontSize:12,color:"#555",marginTop:3}}>{formatDate(match.time)}</div>
        </div>
        <div style={{textAlign:"right"}}>
          {match.hasValue && (
            <div style={{fontSize:20,fontWeight:700,color:oddsColor(match.topEV),fontFamily:"JetBrains Mono, monospace"}}>
              +{match.topEV.toFixed(1)}%
            </div>
          )}
          <div style={{fontSize:12,color:"#333",marginTop:2}}>{expanded ? "▲" : "▼"}</div>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{borderTop:"1px solid #1a1a28",padding:"16px 20px"}}>
          {match.selections.map(sel => (
            <div key={sel.name} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid #111120"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontWeight:600,color:"#d0d0f0",fontSize:15}}>{sel.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{
                    fontFamily:"JetBrains Mono, monospace",fontSize:13,fontWeight:600,
                    color: sel.ev >= 3 ? "#4ade80" : sel.ev >= 0 ? "#86efac" : "#f87171"
                  }}>
                    EV {sel.ev >= 0 ? "+" : ""}{sel.ev.toFixed(1)}%
                  </div>
                  {sel.kelly > 0 && (
                    <div style={{fontSize:11,background:"#1e3a29",color:"#4ade80",padding:"2px 8px",borderRadius:6}}>
                      Kelly {sel.kelly.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              <div style={{fontSize:12,color:"#555",marginBottom:6}}>
                Best: <strong style={{color:"#a5b4fc",fontFamily:"JetBrains Mono, monospace"}}>{sel.bestOdds.toFixed(2)}</strong> at {sel.bestBook}
                <span style={{marginLeft:12}}>Avg: <span style={{color:"#666",fontFamily:"JetBrains Mono, monospace"}}>{sel.avgOdds.toFixed(2)}</span></span>
                <span style={{marginLeft:12}}>Fair odds: <span style={{color:"#666",fontFamily:"JetBrains Mono, monospace"}}>{(1/sel.impliedProb).toFixed(2)}</span></span>
              </div>
              <OddsTable bookOdds={sel.bookOdds} bestBook={sel.bestBook} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("oddsApiKey") || null);
  const [showModal, setShowModal] = useState(!localStorage.getItem("oddsApiKey"));
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSports, setSelectedSports] = useState(["soccer_epl","soccer_sweden_allsvenskan","basketball_nba"]);
  const [minEV, setMinEV] = useState(2);
  const [showValueOnly, setShowValueOnly] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchOdds = useCallback(async (key) => {
    if (!key) {
      setRawEvents(demoData());
      setIsDemo(true);
      return;
    }
    setLoading(true);
    setError(null);
    setIsDemo(false);
    try {
      const allEvents = [];
      for (const sport of selectedSports.slice(0, 4)) {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${key}&regions=eu&markets=h2h&oddsFormat=decimal&bookmakers=${BOOKMAKERS_EU.join(",")}`
        );
        const remaining = res.headers.get("x-requests-remaining");
        if (remaining) setRemainingRequests(remaining);
        if (!res.ok) {
          if (res.status === 401) throw new Error("Invalid API key. Please check and try again.");
          if (res.status === 429) throw new Error("Rate limit reached. Try again in a minute.");
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        allEvents.push(...data);
      }
      setRawEvents(allEvents);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
      setRawEvents(demoData());
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, [selectedSports]);

  useEffect(() => {
    if (!showModal) fetchOdds(apiKey);
  }, [showModal]);

  const processed = processEvents(rawEvents, minEV);
  const displayed = showValueOnly ? processed.filter(m => m.hasValue) : processed;
  const totalValue = processed.filter(m => m.hasValue).length;

  const toggleExpand = (id) => setExpandedIds(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const handleApiSave = (key) => {
    if (key) {
      localStorage.setItem("oddsApiKey", key);
      setApiKey(key);
    }
    setShowModal(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#f0f0ff",fontFamily:"Space Grotesk, sans-serif"}}>
      {showModal && <ApiKeyModal onSave={handleApiSave} />}

      {/* Header */}
      <div style={{borderBottom:"1px solid #12121e",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#0a0a0f",zIndex:10}}>
        <div>
          <div style={{fontSize:20,fontWeight:700,letterSpacing:"-0.02em"}}>
            <span style={{color:"#6366f1"}}>◆</span> Value Bet Finder
          </div>
          {lastUpdated && <div style={{fontSize:11,color:"#333",marginTop:2}}>Updated {lastUpdated.toLocaleTimeString("sv-SE")}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {remainingRequests && <div style={{fontSize:11,color:"#444"}}>{remainingRequests} API req. left</div>}
          {isDemo && <div style={{fontSize:11,background:"#451a03",color:"#fdba74",padding:"4px 10px",borderRadius:6}}>Demo data</div>}
          <button onClick={() => fetchOdds(apiKey)} disabled={loading} style={{
            padding:"7px 14px",borderRadius:8,border:"1px solid #2a2a40",background:"transparent",
            color:"#a5b4fc",cursor:"pointer",fontSize:13,fontWeight:500,
            opacity: loading ? 0.5 : 1
          }}>
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
          <button onClick={() => setShowModal(true)} style={{
            padding:"7px 14px",borderRadius:8,border:"1px solid #2a2a40",background:"transparent",
            color:"#666",cursor:"pointer",fontSize:13
          }}>API key</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>

        {/* Filters */}
        <div style={{background:"#0f0f1a",border:"1px solid #1a1a28",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
          <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start"}}>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontSize:11,fontWeight:600,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Sports</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {SPORTS.map(s => (
                  <button key={s.key} onClick={() => setSelectedSports(prev =>
                    prev.includes(s.key) ? prev.filter(x=>x!==s.key) : [...prev, s.key]
                  )} style={{
                    padding:"4px 10px",borderRadius:6,border:"1px solid",fontSize:12,cursor:"pointer",
                    background: selectedSports.includes(s.key) ? "#1e1b4b" : "transparent",
                    borderColor: selectedSports.includes(s.key) ? "#4338ca" : "#1a1a28",
                    color: selectedSports.includes(s.key) ? "#a5b4fc" : "#555",
                  }}>{s.flag} {s.label}</button>
                ))}
              </div>
            </div>
            <div style={{minWidth:180}}>
              <div style={{fontSize:11,fontWeight:600,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Min EV%</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="range" min="0" max="15" step="0.5" value={minEV}
                  onChange={e => setMinEV(parseFloat(e.target.value))}
                  style={{width:100,accentColor:"#6366f1"}} />
                <span style={{fontSize:14,fontFamily:"JetBrains Mono, monospace",color:"#a5b4fc",minWidth:40}}>+{minEV}%</span>
              </div>
              <div style={{marginTop:12}}>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"#666"}}>
                  <input type="checkbox" checked={showValueOnly} onChange={e => setShowValueOnly(e.target.checked)}
                    style={{accentColor:"#6366f1"}} />
                  Show value bets only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
          {[
            { label:"Matches loaded", val: processed.length },
            { label:"Value bets found", val: totalValue, highlight: totalValue > 0 },
            { label:"Best EV", val: processed[0] ? `+${processed[0].topEV.toFixed(1)}%` : "—", highlight: true },
          ].map(s => (
            <div key={s.label} style={{background:"#0f0f1a",border:"1px solid #1a1a28",borderRadius:10,padding:"14px 18px"}}>
              <div style={{fontSize:11,color:"#444",marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:24,fontWeight:700,color: s.highlight ? "#a5b4fc" : "#f0f0ff"}}>{s.val}</div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{background:"#2d0808",border:"1px solid #7f1d1d",borderRadius:8,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#fca5a5"}}>
            {error}
          </div>
        )}

        {/* Match list */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {displayed.length === 0 && !loading && (
            <div style={{textAlign:"center",color:"#333",padding:"60px 0",fontSize:15}}>
              No matches found. Try selecting more sports or lowering the min EV threshold.
            </div>
          )}
          {displayed.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              expanded={expandedIds.has(match.id)}
              onToggle={() => toggleExpand(match.id)}
            />
          ))}
        </div>

        <div style={{textAlign:"center",fontSize:12,color:"#222",marginTop:40,paddingBottom:40}}>
          Odds from The Odds API · Value = (your implied prob × best odds − 1) · Bet responsibly
        </div>
      </div>
    </div>
  );
}
