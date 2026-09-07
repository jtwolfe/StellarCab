import { MU_SUN } from "../catalog/constants";
import { dot, norm, type Vec } from "./ephemeris";

export type Lambert = {
  dv1: number;
  dv2: number;
  tofDays: number;
  vInfDep: number;
  vInfArr: number;
};

/** Short-way Lambert cartoon for window search. */
export function lambert(r1: Vec, vPark1: Vec, r2: Vec, vPark2: Vec, tofSec: number, mu = MU_SUN): Lambert | null {
  if (tofSec < 3600) return null;
  const r1n = norm(r1);
  const r2n = norm(r2);
  if (r1n < 1e6 || r2n < 1e6) return null;
  const cosd = Math.min(1, Math.max(-1, dot(r1, r2) / (r1n * r2n)));
  const c = Math.hypot(r1.x - r2.x, r1.y - r2.y, r1.z - r2.z);
  const s = (r1n + r2n + c) / 2;
  const amin = s / 2;
  let a = amin * 1.05;
  let v1mag = 0;
  let v2mag = 0;
  for (let k = 0; k < 16; k++) {
    const alpha = 2 * Math.asin(Math.min(1, Math.sqrt(s / (2 * a))));
    const beta = 2 * Math.asin(Math.min(1, Math.sqrt((s - c) / (2 * a))));
    const tof = Math.sqrt((a * a * a) / mu) * (alpha - beta - (Math.sin(alpha) - Math.sin(beta)));
    const err = tof - tofSec;
    if (Math.abs(err) < 200) break;
    a *= err > 0 ? 1.08 : 0.94;
    if (a < amin) a = amin * 1.001;
  }
  const p = (r1n * r2n * (1 - cosd)) / (r1n + r2n - 2 * Math.sqrt(r1n * r2n) * Math.cos(Math.acos(cosd) / 2));
  const f = 1 - (r2n / p) * (1 - cosd);
  const g = (r1n * r2n * Math.sin(Math.acos(cosd))) / Math.sqrt(mu * p);
  if (!Number.isFinite(g) || Math.abs(g) < 1e-6) {
    v1mag = Math.sqrt(mu * (2 / r1n - 1 / a));
    v2mag = Math.sqrt(mu * (2 / r2n - 1 / a));
  } else {
    v1mag = norm({
      x: (r2.x - f * r1.x) / g,
      y: (r2.y - f * r1.y) / g,
      z: (r2.z - f * r1.z) / g,
    });
    v2mag = Math.sqrt(Math.max(0, v1mag ** 2 + 2 * mu * (1 / r2n - 1 / r1n)));
  }
  return {
    dv1: Math.abs(v1mag - norm(vPark1)),
    dv2: Math.abs(v2mag - norm(vPark2)),
    tofDays: tofSec / 86400,
    vInfDep: Math.abs(v1mag - norm(vPark1)),
    vInfArr: Math.abs(v2mag - norm(vPark2)),
  };
}

export function heliocentricCircularGuess(r: Vec): Vec {
  const n = norm(r);
  const v = Math.sqrt(MU_SUN / n);
  return { x: (-v * r.y) / n, y: (v * r.x) / n, z: 0 };
}
