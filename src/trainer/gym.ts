import { WINDOW_END_MJD, WINDOW_START_MJD } from "../catalog/constants";
import { DEPOTS } from "../catalog/depots";
import { conventionalPlan, itineraryCost } from "../planner/conventional";
import type { Itinerary } from "../planner/types";
import { forward, nWeights, readResidual, zeroWeights } from "../policy/itinerary";
import { scoreItinerary } from "./score";

export type Brain = {
  weights: number[];
  sigma: number;
  gen: number;
  bestFit: number;
  rung: number;
};

export const LADDER = ["cislunar", "mars", "belt", "giants", "any"] as const;

const PAIRS: Record<(typeof LADDER)[number], [string, string][]> = {
  cislunar: [["earth:leo", "moon:llo"], ["moon:nsp", "earth:leo"], ["earth:leo", "earth:nrho"]],
  mars: [["earth:leo", "mars:lmo"], ["mars:lmo", "earth:leo"], ["earth:leo", "mars:phobos"]],
  belt: [["earth:leo", "ceres:orbit"], ["mars:lmo", "ceres:orbit"], ["ceres:orbit", "mars:lmo"]],
  giants: [["earth:leo", "callisto:orbit"], ["callisto:orbit", "europa:orbit"], ["earth:leo", "titan:orbit"], ["titan:orbit", "enceladus:orbit"]],
  any: DEPOTS.filter((d) => d.kind !== "dead").map((d) => ["earth:leo", d.id] as [string, string]),
};

export function defaultBrain(): Brain {
  return { weights: zeroWeights(), sigma: 0.18, gen: 0, bestFit: -1e9, rung: 0 };
}

function mjdToIso(mjd: number) {
  return new Date((mjd - 40587) * 86400000).toISOString().slice(0, 10);
}

function observe(from: string, to: string, readyMjd: number, fuel: number) {
  const fi = DEPOTS.findIndex((d) => d.id === from);
  const ti = DEPOTS.findIndex((d) => d.id === to);
  const t = (readyMjd - WINDOW_START_MJD) / (WINDOW_END_MJD - WINDOW_START_MJD);
  return [fi / 16, ti / 16, t * 2 - 1, fuel * 2 - 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function applyResidual(base: Itinerary, y: number[]): Itinerary {
  const r = readResidual(y);
  if (!base.legs.length) return base;
  const again = conventionalPlan(base.origin, base.dest, mjdToIso(base.readyMjd + r.extraWaitDays), base.fuel0);
  again.source = "student";
  again.waitDays += Math.max(0, r.extraWaitDays);
  if (!r.wantAssist) again.legs = again.legs.filter((l) => l.kind !== "assist");
  return again;
}

export function evaluate(brain: Brain, from: string, to: string, readyIso: string, fuel = 1) {
  const base = conventionalPlan(from, to, readyIso, fuel);
  const y = forward(brain.weights, observe(from, to, base.readyMjd, fuel));
  const student = applyResidual(base, y);
  return { baseline: base, student, fit: scoreItinerary(student) - 0.15 * itineraryCost(base) };
}

export function stepGen(brain: Brain, pop = 24) {
  const rung = LADDER[Math.min(brain.rung, LADDER.length - 1)];
  const pairs = PAIRS[rung];
  const pair = pairs[brain.gen % pairs.length];
  const ready = mjdToIso(WINDOW_START_MJD + 365 + ((brain.gen * 97) % 8000));
  const scored: { w: number[]; fit: number }[] = [];
  for (let i = 0; i < pop; i++) {
    const w = brain.weights.map((x) => {
      if (i === 0) return x;
      const z = Math.sqrt(-2 * Math.log(Math.max(1e-9, Math.random()))) * Math.cos(2 * Math.PI * Math.random());
      return Math.min(2.5, Math.max(-2.5, x + brain.sigma * z));
    });
    scored.push({ w, fit: evaluate({ ...brain, weights: w }, pair[0], pair[1], ready, 1).fit });
  }
  scored.sort((a, b) => b.fit - a.fit);
  const mu = Math.max(4, Math.floor(pop / 2));
  const mean = new Array(nWeights()).fill(0);
  for (let i = 0; i < mu; i++) for (let j = 0; j < mean.length; j++) mean[j] += scored[i].w[j] / mu;
  brain.weights = mean;
  brain.bestFit = Math.max(brain.bestFit, scored[0].fit);
  brain.gen += 1;
  if (brain.gen % 12 === 0 && brain.rung < LADDER.length - 1 && brain.bestFit > 8000) {
    brain.rung += 1;
    brain.sigma = Math.min(0.25, brain.sigma * 1.1);
  } else brain.sigma = Math.max(0.05, brain.sigma * 0.995);
  return { best: scored[0].fit, pair, ready, rung: LADDER[brain.rung] };
}
