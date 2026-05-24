import { useEffect } from "react";
import { Navbar }         from "./components/Navbar.jsx";
import { ApiKeyModal }    from "./components/ApiKeyModal.jsx";
import { TodayPage }      from "./pages/TodayPage.jsx";
import { AllMatchesPage } from "./pages/AllMatchesPage.jsx";
import { SettingsPage }   from "./pages/SettingsPage.jsx";
import { useOdds }        from "./hooks/useOdds.js";
import { useStorage }     from "./hooks/useStorage.js";
import { DEFAULT_SPORTS } from "./data/constants.js";

export default function App() {
  const [apiKey,         setApiKey]         = useStorage("apiKey",         null);
  const [bankroll,       setBankroll]       = useStorage("bankroll",       0);
  const [selectedSports, setSelectedSports] = useStorage("selectedSports", DEFAULT_SPORTS);
  const [minEV,          setMinEV]          = useStorage("minEV",          2);
  const [page,           setPage]           = useStorage("page",           "today");
  const [showModal,      setShowModal]      = useStorage("showModal",      !apiKey);

  const {
    matches, loading, error, isDemo,
    lastUpdated, remainingReqs, fromCache,
    fetch, forceRefresh,
  } = useOdds(minEV);

  useEffect(() => {
    if (!showModal) fetch(apiKey, selectedSports);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const handleSportsChange = (next) => {
    setSelectedSports(next);
    forceRefresh(apiKey, next);
  };

  const todayCount = matches.filter((m) => m.isToday && m.hasValue).length;

  const handleApiSave = (key) => {
    setApiKey(key);
    setShowModal(false);
  };

  return (
    <>
      {showModal && <ApiKeyModal onSave={handleApiSave} />}

      <Navbar
        page={page}
        setPage={setPage}
        todayCount={todayCount}
        loading={loading}
        isDemo={isDemo}
        lastUpdated={lastUpdated}
        remainingReqs={remainingReqs}
        fromCache={fromCache}
        onRefresh={() => forceRefresh(apiKey, selectedSports)}
      />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-20">
        {error && (
          <div className="bg-danger-bg border border-danger text-danger text-sm font-body rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {page === "today" && (
          <TodayPage matches={matches} bankroll={bankroll} />
        )}

        {page === "all" && (
          <AllMatchesPage
            matches={matches}
            bankroll={bankroll}
            minEV={minEV}
            setMinEV={setMinEV}
            selectedSports={selectedSports}
            setSelectedSports={handleSportsChange}
          />
        )}

        {page === "settings" && (
          <SettingsPage
            bankroll={bankroll}
            setBankroll={setBankroll}
            onChangeApiKey={() => setShowModal(true)}
            remainingReqs={remainingReqs}
            isDemo={isDemo}
            fromCache={fromCache}
            lastUpdated={lastUpdated}
            onForceRefresh={() => forceRefresh(apiKey, selectedSports)}
          />
        )}
      </main>
    </>
  );
}