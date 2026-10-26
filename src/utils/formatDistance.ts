// Human-readable distance. Under 1 km → whole metres ("650 m");
// 1 km and above → one decimal ("1.2 km").
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
