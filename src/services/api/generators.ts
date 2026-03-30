/**
 * Algorithmic Mock Data Generators
 *
 * These generators produce realistic looking time series data using multiple
 * techniques that avoid the "flat data set" problem for pure random generation
 *
 * 1. `Random Walk`:  Each point is derived from the previous one ( + or - delta),
 *    creating natural looking trends and momentum.
 * 2. `Seasonality`: A sine wave modifier adds weekly cycles (weekday peaks,
 *    weekend dips) to deployment and failure data.
 * 3. `Mean Reversion`: Values are gently pulled back toward a baseline to
 *    prevent runaway drift that would produce absurd numbers.
 * 4. `Spike Injection`: Random "incident" spikes are injected with low
 *    probability to simulate real-world production events.
 * 5. `Clamping`: All values are clamped to sensible min/max bounds so
 *    charts never show negative or unrealistic values.
 *
 * These generators are seeded by Date.now() and produce different data on each page load
 */

import type {
  DeploymentFrequency,
  PipelineDuration,
  TestResults,
  TestSuiteFailure,
} from '../schemas/types';

// Utilities

/** Simple seeded PRNG (mulberry32) for reproducible-within-session randomness */
function createRng(seed: number) {
  let s = seed | 0;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createRng(Date.now());

/** Clamp a value between min and max */
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

/** Round to N decimal places */
const round = (val: number, decimals = 0) => {
  const f = Math.pow(10, decimals);
  return Math.round(val * f) / f;
};

/** Generate an ISO date string for N days ago */
const daysAgoISO = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0); // normalize to noon for stability
  return d.toISOString();
};

/**
 * Random Walk Generator with Mean Reversion & Spike Injection
 *
 * @param steps       Number of data points
 * @param baseline    Central value to revert toward
 * @param volatility  Max step size per tick
 * @param reversion   Strength of pull toward baseline (0-1, higher = stronger)
 * @param spikeProb   Probability of a spike on any given tick
 * @param spikeMag    Magnitude multiplier for spikes
 * @param min         Minimum allowed value
 * @param max         Maximum allowed value
 */
function randomWalk(
  steps: number,
  baseline: number,
  volatility: number,
  reversion: number = 0.1,
  spikeProb: number = 0.05,
  spikeMag: number = 2.5,
  min: number = 0,
  max: number = Infinity,
): number[] {
  const values: number[] = [];
  let current = baseline + (rng() - 0.5) * volatility * 2;

  for (let i = 0; i < steps; i++) {
    // Mean reversion force
    const pull = (baseline - current) * reversion;

    // Random step
    const step = (rng() - 0.5) * volatility * 2;

    // Spike injection
    const isSpike = rng() < spikeProb;
    const spike = isSpike ? (rng() > 0.5 ? 1 : -1) * volatility * spikeMag : 0;

    current = clamp(round(current + pull + step + spike), min, max);
    values.push(current);
  }

  return values;
}

/**
 * Seasonal modifier — adds a sine-wave pattern approximating weekly cycles
 * @param dayIndex   Which day (0 = oldest)
 * @param amplitude  Amplitude of the wave
 * @param phase      Phase offset (default 0 = peak on day 0)
 */
function seasonal(dayIndex: number, amplitude: number, phase: number = 0): number {
  return round(amplitude * Math.sin(((dayIndex + phase) / 7) * 2 * Math.PI));
}

// Generators

export function generatePipelineDurations(days = 30): PipelineDuration[] {
  // Dev: fast, low variance; Staging: medium; Prod: slow with occasional spikes
  const devWalk = randomWalk(days, 8, 2, 0.15, 0.03, 2, 3, 20);
  const stgWalk = randomWalk(days, 15, 3, 0.12, 0.05, 2, 8, 35);
  const prodWalk = randomWalk(days, 25, 5, 0.1, 0.08, 3, 12, 50);

  return Array.from({ length: days }, (_, i) => ({
    date: daysAgoISO(days - 1 - i),
    devDuration: devWalk[i],
    stagingDuration: stgWalk[i],
    prodDuration: prodWalk[i],
  }));
}

export function generateDeployments(days = 20): DeploymentFrequency[] {
  const baseWalk = randomWalk(days, 25, 8, 0.12, 0.06, 2.5, 1, 60);

  return Array.from({ length: days }, (_, i) => {
    // Weekend dip: reduce deploys on "weekends" (every 7th and 6th day)
    const weekdayFactor = i % 7 >= 5 ? 0.2 : 1;
    const seasonalBoost = seasonal(i, 5, 2);
    const value = round(clamp(baseWalk[i] * weekdayFactor + seasonalBoost, 1, 60));

    return {
      date: daysAgoISO(days - 1 - i),
      devDeployments: value,
    };
  });
}

export function generateTestResults(days = 20): TestResults[] {
  // Total tests stays relatively stable (400-500 range)
  const totalWalk = randomWalk(days, 455, 10, 0.2, 0, 0, 400, 500);

  // Failure rate does a random walk — with a deliberate spike injection
  // to simulate regression events
  const failWalk = randomWalk(days, 8, 6, 0.08, 0.1, 4, 1, 80);

  return Array.from({ length: days }, (_, i) => {
    const total = totalWalk[i];
    const failed = clamp(failWalk[i], 1, round(total * 0.2)); // cap at 20% failure
    return {
      date: daysAgoISO(days - 1 - i),
      passed: total - failed,
      failed,
    };
  });
}

export function generateTestSuiteFailures(days = 7): TestSuiteFailure[] {
  const suites = ['Auth', 'Checkout', 'Profile', 'Search', 'Settings'];

  // Each test suite has a different failure "personality":
  // - Some are consistently low (Auth)
  // - Some are moderate (Checkout, Settings)
  // - Some are high/erratic (Search)
  const profiles: Record<string, { baseline: number; volatility: number; spikeProb: number }> = {
    Auth: { baseline: 1, volatility: 1, spikeProb: 0.05 },
    Checkout: { baseline: 3, volatility: 2, spikeProb: 0.1 },
    Profile: { baseline: 1.5, volatility: 1.5, spikeProb: 0.08 },
    Search: { baseline: 5, volatility: 3, spikeProb: 0.15 },
    Settings: { baseline: 2, volatility: 1.5, spikeProb: 0.08 },
  };

  const results: TestSuiteFailure[] = [];

  for (const s of suites) {
    const p = profiles[s];
    const walk = randomWalk(days, p.baseline, p.volatility, 0.2, p.spikeProb, 2, 0, 12);

    for (let d = 0; d < days; d++) {
      results.push({
        suite: s,
        date: daysAgoISO(days - 1 - d),
        failures: walk[d],
      });
    }
  }

  return results;
}
