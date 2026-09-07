import { C, RS_SUN } from "../catalog/constants";

/** Proper-time seconds for a coast of coordinate dt at heliocentric r, v. */
export function properSeconds(dt: number, rMag: number, vMag: number) {
  const sr = Math.sqrt(Math.max(0, 1 - (vMag / C) ** 2));
  const gr = Math.sqrt(Math.max(0, 1 - RS_SUN / Math.max(rMag, 2 * RS_SUN)));
  return dt * sr * gr;
}
