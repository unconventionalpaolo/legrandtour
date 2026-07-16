import { useEffect, useState } from "react";
import type { Settings } from "../types/trip";
import { getStoredPreview } from "../utils/storage";
import { type EffectiveDateTime, parisParts } from "../utils/time";

export function useEffectiveDate(settings: Settings): EffectiveDateTime {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const preview = getStoredPreview();
  if (preview) return preview;
  void tick;
  return parisParts(new Date(), settings.app.timezone);
}
