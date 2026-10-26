import { haversineKm } from '../haversine';

describe('haversineKm', () => {
  it('is zero for identical points', () => {
    expect(haversineKm({ lat: 38.72, lng: -9.14 }, { lat: 38.72, lng: -9.14 })).toBe(0);
  });

  it('is about 111 km for one degree of latitude', () => {
    const d = haversineKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });
    expect(d).toBeGreaterThan(110);
    expect(d).toBeLessThan(112.3);
  });

  it('is about 1.11 km for 0.01 degree of latitude', () => {
    const d = haversineKm({ lat: 38.7, lng: -9.14 }, { lat: 38.71, lng: -9.14 });
    expect(Math.abs(d - 1.112)).toBeLessThan(0.02);
  });
});
