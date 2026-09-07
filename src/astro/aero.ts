import { body } from "../catalog/bodies";
import { SHIP } from "../catalog/starship";

export type Aero = { credit: number; ok: boolean; reason: string };

/** Cartoon aerocapture: credit a fraction of v_inf if atmosphere exists and loads stay inside the tile. */
export function aerocapture(bodyId: string, vInf: number): Aero {
  const b = body(bodyId);
  if (!b.atmRho0 || !b.atmScaleH) return { credit: 0, ok: true, reason: "no-atm" };
  const frac = bodyId === "titan" ? 0.85 : bodyId === "venus" ? 0.7 : bodyId === "earth" ? 0.65 : 0.75;
  const credit = Math.min(vInf * frac, vInf - 200);
  const gEst = (vInf * vInf) / (4 * (b.radiusM + 2 * b.atmScaleH)) / 9.81;
  if (gEst > SHIP.maxG) return { credit: 0, ok: false, reason: "g-load" };
  if (vInf > 14000 && bodyId !== "titan") return { credit: 0, ok: false, reason: "heat" };
  return { credit: Math.max(0, credit), ok: true, reason: "ok" };
}
