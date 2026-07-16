import { useEffect, useState } from "react";
import type { Settings, Trip } from "../types/trip";
import { loadAppData } from "../services/data";

type DataState =
  | { status: "loading"; settings: null; trip: null; error: null }
  | { status: "ready"; settings: Settings; trip: Trip; error: null }
  | { status: "error"; settings: null; trip: null; error: Error };

export function useAppData(): DataState {
  const [state, setState] = useState<DataState>({
    status: "loading",
    settings: null,
    trip: null,
    error: null
  });

  useEffect(() => {
    let active = true;
    loadAppData()
      .then(({ settings, trip }) => {
        if (active) setState({ status: "ready", settings, trip, error: null });
      })
      .catch((error: Error) => {
        if (active) setState({ status: "error", settings: null, trip: null, error });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
