import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LatLng } from '@/utils/haversine';

export type LocationStatus = 'undetermined' | 'granted' | 'denied';

export interface UseLocation {
  coords: LatLng | null;
  status: LocationStatus;
  request: () => Promise<void>;
}

// On-demand foreground location (spec §7.1). Returns null coords when the
// user denies permission — callers fall back to non-distance ordering.
export function useLocation(): UseLocation {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>('undetermined');

  const request = useCallback(async () => {
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
  }, []);

  return { coords, status, request };
}
