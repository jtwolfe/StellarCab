import { defaultBrain, evaluate, type Brain } from "../trainer/gym";
import type { RideQuery } from "../planner/types";

export function catchARide(q: RideQuery, brain: Brain = defaultBrain()) {
  return evaluate(brain, q.from, q.to, q.readyIso, q.fuel ?? 1);
}

export function formatItinerary(label: string, ev: ReturnType<typeof evaluate>["baseline"]) {
  const lines = [
    `${label}  ${ev.origin} → ${ev.dest}`,
    `  wait ${ev.waitDays.toFixed(1)} d   flight ${ev.flightDays.toFixed(1)} d   Δv ${(ev.shipDv / 1000).toFixed(2)} km/s`,
    `  fuel ${ev.fuel0.toFixed(2)} → ${ev.fuel1.toFixed(2)}   proper ${ev.properDays.toFixed(4)} d   stranded=${ev.stranded}`,
  ];
  for (const l of ev.legs) {
    lines.push(
      `  - ${l.kind}${l.assistBody ? "(" + l.assistBody + ")" : ""}  ${l.from} → ${l.to}  MJD ${l.departMjd.toFixed(1)}→${l.arriveMjd.toFixed(1)}  shipΔv ${(l.shipDv / 1000).toFixed(2)}  aero ${(l.aeroCredit / 1000).toFixed(2)}`,
    );
  }
  if (!ev.legs.length) lines.push("  (no legal leg in window)");
  return lines.join("\n");
}
