import { Loader2 } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { useAppData } from "./hooks/useAppData";
import { TripPage } from "./pages/TripPage";

export default function App() {
  const data = useAppData();

  if (data.status === "loading") {
    return (
      <main className="loading-screen" aria-live="polite">
        <Loader2 aria-hidden="true" className="spin" />
        <p>Sto preparando la camera oscura.</p>
      </main>
    );
  }

  if (data.status === "error") {
    return (
      <main className="loading-screen error">
        <h1>Qualcosa non torna nei dati.</h1>
        <p>{data.error.message}</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<TripPage settings={data.settings} trip={data.trip} />} />
      <Route path="/day/:dayId" element={<TripPage settings={data.settings} trip={data.trip} />} />
    </Routes>
  );
}
