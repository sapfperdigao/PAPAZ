import { consensusScore } from '../consensus';

describe('consensusScore', () => {
  // Oracle from the research brief's worked example.
  const sources = [
    { source: 'thefork', score: 9.3, reviewCount: 1200 },
    { source: 'google', score: 8.8, reviewCount: 6600 },
    { source: 'tripadvisor', score: 8.0, reviewCount: 12000 },
    { source: 'reddit', score: 7.5, reviewCount: 1 },
  ];

  it('blends crowd sources to ~7.0 before editorial (average for a good list)', () => {
    const c = consensusScore(sources);
    expect(c).not.toBeNull();
    expect(c!.score).toBeCloseTo(7.0, 1);
    expect(c!.sourceCount).toBe(4);
    expect(c!.totalReviews).toBe(19801);
  });

  it('adds a capped editorial bonus for a Michelin Guide listing (+0.25)', () => {
    const base = consensusScore(sources)!.score;
    const c = consensusScore(sources, { inMichelinGuide: true });
    expect(c!.score).toBeCloseTo(base + 0.25, 1);
  });

  it('shrinks a 5.0-from-3-reviews score hard toward the prior (not a 10)', () => {
    // Google 5.0/5 → r10 10, but only 3 reviews.
    const c = consensusScore([{ source: 'google', score: 10, reviewCount: 3 }]);
    expect(c!.score).toBeLessThan(7.6);
    expect(c!.score).toBeGreaterThan(6.8);
  });

  it('does not let TheFork 9.3 alone print as 9.3 (distribution-normalized)', () => {
    const c = consensusScore([{ source: 'thefork', score: 9.3, reviewCount: 1200 }]);
    expect(c!.score).toBeLessThan(8.2);
  });

  it('caps the editorial bonus at 0.5 even with many signals', () => {
    const base = consensusScore(sources)!.score;
    const c = consensusScore(sources, {
      michelinStars: 2,
      repsolSoles: 3,
      timeOut: true,
      best101: true,
      pressMentions: 5,
    })!;
    expect(c.score).toBeCloseTo(Math.min(10, base + 0.5), 1);
  });

  it('returns null when there are no crowd sources', () => {
    expect(consensusScore([])).toBeNull();
  });

  it('weights personal rating highest', () => {
    // Same score + volume, personal vs a crowd source: personal pulls the blend higher.
    const withPersonal = consensusScore([
      { source: 'tripadvisor', score: 8.0, reviewCount: 12000 },
      { source: 'personal', score: 9, reviewCount: 50 },
    ])!;
    const withCrowd = consensusScore([
      { source: 'tripadvisor', score: 8.0, reviewCount: 12000 },
      { source: 'google', score: 9, reviewCount: 50 },
    ])!;
    expect(withPersonal.score).toBeGreaterThan(withCrowd.score + 0.2);
  });
});
