export function getDemoEvents() {
  const now = Date.now();
  const h = (hours) => new Date(now + 3_600_000 * hours).toISOString();

  return [
    {
      id: "d1", sport_key: "soccer_epl", sport_title: "Premier League",
      commence_time: h(4), home_team: "Arsenal", away_team: "Chelsea",
      bookmakers: [
        { key: "bet365",      title: "Bet365",       markets: [{ key: "h2h", outcomes: [{ name: "Arsenal", price: 2.10 }, { name: "Chelsea", price: 3.60 }, { name: "Draw", price: 3.20 }] }] },
        { key: "unibet",      title: "Unibet",       markets: [{ key: "h2h", outcomes: [{ name: "Arsenal", price: 2.05 }, { name: "Chelsea", price: 3.80 }, { name: "Draw", price: 3.10 }] }] },
        { key: "williamhill", title: "William Hill", markets: [{ key: "h2h", outcomes: [{ name: "Arsenal", price: 2.08 }, { name: "Chelsea", price: 3.50 }, { name: "Draw", price: 3.30 }] }] },
        { key: "pinnacle",    title: "Pinnacle",     markets: [{ key: "h2h", outcomes: [{ name: "Arsenal", price: 2.15 }, { name: "Chelsea", price: 3.55 }, { name: "Draw", price: 3.15 }] }] },
        { key: "bwin",        title: "Bwin",         markets: [{ key: "h2h", outcomes: [{ name: "Arsenal", price: 2.06 }, { name: "Chelsea", price: 3.65 }, { name: "Draw", price: 3.25 }] }] },
      ],
    },
    {
      id: "d2", sport_key: "soccer_epl", sport_title: "Premier League",
      commence_time: h(7), home_team: "Liverpool", away_team: "Man City",
      bookmakers: [
        { key: "bet365",   title: "Bet365",   markets: [{ key: "h2h", outcomes: [{ name: "Liverpool", price: 2.40 }, { name: "Man City", price: 2.90 }, { name: "Draw", price: 3.30 }] }] },
        { key: "unibet",   title: "Unibet",   markets: [{ key: "h2h", outcomes: [{ name: "Liverpool", price: 2.35 }, { name: "Man City", price: 3.00 }, { name: "Draw", price: 3.20 }] }] },
        { key: "pinnacle", title: "Pinnacle", markets: [{ key: "h2h", outcomes: [{ name: "Liverpool", price: 2.45 }, { name: "Man City", price: 2.95 }, { name: "Draw", price: 3.25 }] }] },
        { key: "nordicbet",title: "Nordicbet",markets: [{ key: "h2h", outcomes: [{ name: "Liverpool", price: 2.42 }, { name: "Man City", price: 2.88 }, { name: "Draw", price: 3.35 }] }] },
      ],
    },
    {
      id: "d3", sport_key: "soccer_sweden_allsvenskan", sport_title: "Allsvenskan",
      commence_time: h(3), home_team: "Malmö FF", away_team: "IFK Göteborg",
      bookmakers: [
        { key: "bet365",  title: "Bet365",  markets: [{ key: "h2h", outcomes: [{ name: "Malmö FF", price: 1.75 }, { name: "IFK Göteborg", price: 4.50 }, { name: "Draw", price: 3.60 }] }] },
        { key: "unibet",  title: "Unibet",  markets: [{ key: "h2h", outcomes: [{ name: "Malmö FF", price: 1.80 }, { name: "IFK Göteborg", price: 4.20 }, { name: "Draw", price: 3.50 }] }] },
        { key: "betsson", title: "Betsson", markets: [{ key: "h2h", outcomes: [{ name: "Malmö FF", price: 1.78 }, { name: "IFK Göteborg", price: 4.60 }, { name: "Draw", price: 3.55 }] }] },
        { key: "nordicbet",title:"Nordicbet",markets:[{ key: "h2h", outcomes: [{ name: "Malmö FF", price: 1.76 }, { name: "IFK Göteborg", price: 4.40 }, { name: "Draw", price: 3.58 }] }] },
      ],
    },
    {
      id: "d4", sport_key: "basketball_nba", sport_title: "NBA",
      commence_time: h(9), home_team: "Boston Celtics", away_team: "Golden State Warriors",
      bookmakers: [
        { key: "bet365",  title: "Bet365",  markets: [{ key: "h2h", outcomes: [{ name: "Boston Celtics", price: 1.65 }, { name: "Golden State Warriors", price: 2.25 }] }] },
        { key: "pinnacle",title: "Pinnacle",markets: [{ key: "h2h", outcomes: [{ name: "Boston Celtics", price: 1.67 }, { name: "Golden State Warriors", price: 2.30 }] }] },
        { key: "unibet",  title: "Unibet",  markets: [{ key: "h2h", outcomes: [{ name: "Boston Celtics", price: 1.62 }, { name: "Golden State Warriors", price: 2.35 }] }] },
      ],
    },
    {
      id: "d5", sport_key: "soccer_uefa_champs_league", sport_title: "Champions League",
      commence_time: h(52), home_team: "Real Madrid", away_team: "Bayern Munich",
      bookmakers: [
        { key: "bet365",      title: "Bet365",       markets: [{ key: "h2h", outcomes: [{ name: "Real Madrid", price: 2.20 }, { name: "Bayern Munich", price: 3.10 }, { name: "Draw", price: 3.40 }] }] },
        { key: "unibet",      title: "Unibet",       markets: [{ key: "h2h", outcomes: [{ name: "Real Madrid", price: 2.15 }, { name: "Bayern Munich", price: 3.20 }, { name: "Draw", price: 3.35 }] }] },
        { key: "williamhill", title: "William Hill", markets: [{ key: "h2h", outcomes: [{ name: "Real Madrid", price: 2.18 }, { name: "Bayern Munich", price: 3.15 }, { name: "Draw", price: 3.38 }] }] },
        { key: "pinnacle",    title: "Pinnacle",     markets: [{ key: "h2h", outcomes: [{ name: "Real Madrid", price: 2.22 }, { name: "Bayern Munich", price: 3.05 }, { name: "Draw", price: 3.42 }] }] },
      ],
    },
  ];
}
