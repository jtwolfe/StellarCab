import { DAY, WINDOW_END_MJD, clampWindow } from "../catalog/constants";
import { depot } from "../catalog/depots";
import { burnFrac } from "../catalog/starship";
import { heliocentric, parkingRadius, norm } from "../astro/ephemeris";
import { heliocentricCircularGuess, lambert } from "../astro/lambert";
import { aerocapture } from "../astro/aero";
import { properSeconds } from "../astro/relativity";
import { strandAfter } from "./strand";
import type { Itinerary, Leg } from "./types";

function isoToMjd(iso: string) {
  const t = Date.parse(iso.endsWith("Z") ? iso : iso + "Z");
  if (!Number.isFinite(t)) throw new Error(`bad ready time ${iso}`);
  return t / 86400000 + 40587;
}

function sampleTofs(r1: number, r2: number) {
  const hoh = Math.PI * Math.sqrt(((r1 + r2) / 2) ** 3 / 1.32712440018e20) / DAY;
  const base = Math.max(8, hoh * 0.35);
  return [base, hoh * 0.7, hoh, hoh * 1.3, hoh * 1.8].map((d) => Math.min(900, d));
}

function parkingHelio(depotId: string, mjd: number) {
  const d = depot(depotId);
  const st = heliocentric(d.body, mjd);
  const rPark = parkingRadius(d.body, d.altM);
  const radial = norm(st.p);
  const scale = (radial + rPark) / Math.max(radial, 1);
  return { p: { x: st.p.x * scale, y: st.p.y * scale, z: st.p.z * scale }, v: st.v };
}

function viaId(viaBody: string) {
  if (viaBody === "moon") return "moon:llo";
  if (viaBody === "earth") return "earth:leo";
  if (viaBody === "mars") return "mars:lmo";
  if (viaBody === "venus") return "venus:orbit";
  if (viaBody === "callisto") return "callisto:orbit";
  if (viaBody === "ganymede") return "ganymede:orbit";
  if (viaBody === "enceladus") return "enceladus:orbit";
  if (viaBody === "titan") return "titan:orbit";
  return `${viaBody}:orbit`;
}

function tryLeg(from: string, to: string, depart: number, tofDays: number, fuel: number): { leg: Leg; fuel1: number } | null {
  const a = parkingHelio(from, depart);
  const arrive = depart + tofDays;
  if (arrive > WINDOW_END_MJD) return null;
  const b = parkingHelio(to, arrive);
  const sol = lambert(a.p, heliocentricCircularGuess(a.p), b.p, heliocentricCircularGuess(b.p), tofDays * DAY);
  if (!sol) return null;
  const aero = aerocapture(depot(to).body, sol.vInfArr);
  if (!aero.ok) return null;
  const shipDv = Math.max(0, sol.dv1 + sol.dv2 - aero.credit);
  if (shipDv > 12_000) return null;
  const fuel1 = Math.max(0, burnFrac(fuel, shipDv));
  return {
    fuel1,
    leg: {
      from, to, departMjd: depart, arriveMjd: arrive,
      kind: aero.credit > 50 ? "aerocapture" : "lambert",
      shipDv, aeroCredit: aero.credit, waitDays: 0,
    },
  };
}

const ASSISTS: Record<string, string[]> = {
  earth: ["venus", "moon", "mars"],
  moon: ["earth"],
  mars: ["earth", "venus"],
  ceres: ["mars", "earth"],
  europa: ["callisto", "ganymede"],
  ganymede: ["callisto"],
  callisto: ["ganymede"],
  titan: ["enceladus"],
  enceladus: ["titan"],
};

export function itineraryCost(it: Itinerary) {
  if (it.stranded) return 1e7 + it.flightDays;
  return it.flightDays + 0.25 * it.waitDays + 8 * (it.shipDv / 1000) + 0.4 * it.legs.length;
}

export function conventionalPlan(from: string, to: string, readyIso: string, fuel = 1): Itinerary {
  depot(from); depot(to);
  const ready = clampWindow(isoToMjd(readyIso));
  const waits = [0, 14, 30, 60, 120, 240, 400];
  let best: Itinerary | null = null;

  const consider = (legs: Leg[], fuel1: number, waitDays: number) => {
    const flight = legs.reduce((s, l) => s + (l.arriveMjd - l.departMjd), 0);
    const shipDv = legs.reduce((s, l) => s + l.shipDv, 0);
    const last = legs[legs.length - 1];
    const mid = parkingHelio(last.to, last.arriveMjd);
    const it: Itinerary = {
      origin: from, dest: to, readyMjd: ready, fuel0: fuel, fuel1, legs,
      flightDays: flight, waitDays, shipDv,
      properDays: properSeconds(flight * DAY, norm(mid.p), 15e3) / DAY,
      stranded: strandAfter(last.to, fuel1), source: "baseline",
    };
    if (!best || itineraryCost(it) < itineraryCost(best)) best = it;
  };

  for (const w of waits) {
    const depart = clampWindow(ready + w);
    const a = parkingHelio(from, depart);
    const bGuess = parkingHelio(to, depart);
    for (const tof of sampleTofs(norm(a.p), norm(bGuess.p))) {
      const hit = tryLeg(from, to, depart, tof, fuel);
      if (hit) consider([{ ...hit.leg, waitDays: w }], hit.fuel1, w);
    }
    for (const viaBody of ASSISTS[depot(from).body] ?? []) {
      const via = viaId(viaBody);
      try { depot(via); } catch { continue; }
      for (const tof1 of [20, 40, 80, 160]) {
        const hop = tryLeg(from, via, depart, tof1, fuel);
        if (!hop) continue;
        for (const tof2 of [20, 60, 120, 250]) {
          const hop2 = tryLeg(via, to, hop.leg.arriveMjd, tof2, hop.fuel1);
          if (!hop2) continue;
          consider([
            { ...hop.leg, kind: "assist", assistBody: viaBody, waitDays: w },
            hop2.leg,
          ], hop2.fuel1, w);
        }
      }
    }
  }

  return best ?? {
    origin: from, dest: to, readyMjd: ready, fuel0: fuel, fuel1: fuel, legs: [],
    flightDays: 1e9, waitDays: 0, shipDv: 1e9, properDays: 1e9, stranded: true, source: "baseline",
  };
}
