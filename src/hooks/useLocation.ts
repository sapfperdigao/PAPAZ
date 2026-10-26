import { useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import type { LatLng } from '@/utils/haversine';

export type LocationStatus = 'undetermined' | 'granted' | 'denied';

export interface UseLocation {
  coords: LatLng | null;
  status: LocationStatus;
  request: () => Promise<void>;
}

// On-demand foreground location (spec §7.1). Returns null coords when the
// user denies permission — callers fall back to non-distance ordering. The
// in-flight ref makes request() idempotent so a re-render can't fire a second
// concurrent permission prompt.
export function useLocation(): UseLocation {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>('undetermined');
  const inFlight = useRef(false);

  const request = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        setStatus('denied');
        setCoords(null);
        return;
      }
      setStatus('granted');
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } finally {
      inFlight.current = false;
    }
  }, []);

  return { coords, status, request };
}
