import type { Itinerary } from "../planner/types";

export const ARRIVE = 12_000;

export function scoreItinerary(it: Itinerary) {
  if (!it.legs.length) return -8_000;
  if (it.stranded) return -7_000 - it.flightDays - it.shipDv / 50;
  const clock = it.flightDays - it.properDays;
  return (
    ARRIVE -
    it.flightDays -
    0.25 * it.waitDays -
    8 * (it.shipDv / 1000) -
    0.001 * clock * 86400
  );
}
