# EdgeFinder — Value Bet Finder

A modular React + Vite + Tailwind app that finds value bets across multiple bookmakers.

## Project structure

```
src/
  data/
    constants.js        # Sports list, bookmaker list, defaults
    demoData.js         # Demo events shown without an API key
  utils/
    betting.js          # Pure math: EV, Kelly, formatting, ratings
    processEvents.js    # Transforms raw API events → enriched match objects
  hooks/
    useOdds.js          # Fetches odds from The Odds API, manages loading/error state
    useStorage.js       # useState persisted to localStorage
  components/
    ApiKeyModal.jsx     # First-launch API key entry
    Navbar.jsx          # Sticky top nav
    BetCard.jsx         # Collapsible match card
    SelectionWalkthrough.jsx  # 4-step guided breakdown per outcome
    OddsComparison.jsx  # Ranked bookmaker odds pills
    StatBox.jsx         # Small metric tile
    Step.jsx            # Numbered walkthrough step wrapper
  pages/
    TodayPage.jsx       # Daily plan — today's value bets only
    AllMatchesPage.jsx  # All upcoming events with filters
    SettingsPage.jsx    # Bankroll, API key, strategy explainers
  App.jsx               # Root: wires hooks → pages → navbar
  main.jsx              # Entry point
  index.css             # Tailwind directives + component layer
```

## Setup

### 1. Get a free API key
Sign up at [the-odds-api.com](https://the-odds-api.com). Free tier: 500 requests/month.

### 2. Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173, paste your API key, done.

### 3. Build for production
```bash
npm run build
```
Drag the `dist/` folder onto [netlify.com](https://netlify.com).

## How value betting works

- **EV%** = (implied probability × best odds − 1) × 100  
- Positive EV = bookmaker is offering more than the fair price → value bet  
- **Half-Kelly stake** = (kelly% / 2) × bankroll — reduces variance vs full Kelly  
- Implied probability derived from average odds across all bookmakers (removes vig)
