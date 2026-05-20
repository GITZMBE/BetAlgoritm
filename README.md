# Value Bet Finder

A React app that fetches real-time odds from multiple bookmakers and highlights value bets using expected value (EV) analysis.

## What it does
- Pulls live & upcoming odds from **Bet365, Unibet, William Hill, Pinnacle, Bwin, Betsson** and more
- Calculates **Expected Value (EV%)** for every outcome
- Shows **Kelly criterion** stake sizing
- Covers Premier League, Allsvenskan, Champions League, La Liga, Bundesliga, Serie A, Ligue 1, NBA, NFL, NHL, Tennis

## Setup

### 1. Get a free API key
Go to [https://the-odds-api.com](https://the-odds-api.com) and sign up for a free account.
- Free tier: **500 requests/month**
- Each refresh fetches 1 request per sport selected (e.g. 3 sports = 3 requests)

### 2. Install and run

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`. On first launch, enter your API key. It's saved in your browser so you only need to do this once.

### 3. Build for production (optional)

```bash
npm run build
```

Then serve the `build/` folder with any static host.

## How value bets work

**EV% = (implied probability × best available odds − 1) × 100**

- **Positive EV** = bookmaker odds are higher than the "true" probability suggests → value bet
- **Kelly %** = recommended % of bankroll to stake (from Kelly criterion)
- Green = strong value (EV > 5%), yellow = marginal, red = no value

The implied probability is derived from the **average odds across all bookmakers**, which approximates the true probability after removing the vig. The best available odds are then compared against this.

## Customising

Edit `src/App.js`:
- `SPORTS` array — add/remove leagues
- `BOOKMAKERS_EU` — change which bookmakers to compare
- `minEV` default — change the default EV filter threshold
