import { AU, MJD_J2000, MU_SUN } from "../catalog/constants";
import { BODY_BY_ID, body, type Body } from "../catalog/bodies";

export type Vec = { x: number; y: number; z: number };

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
export function scale(a: Vec, s: number): Vec {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}
export function dot(a: Vec, b: Vec) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function norm(a: Vec) {
  return Math.hypot(a.x, a.y, a.z);
}

function rad(d: number) {
  return (d * Math.PI) / 180;
}

function keplerE(M: number, e: number) {
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 12; i++) {
    const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-12) break;
  }
  return E;
}

export function elementsState(b: Body, mjd: number): { p: Vec; v: Vec } {
  const el = b.elements;
  const dt = mjd - MJD_J2000;
  const a = el.aAu * AU;
  if (a <= 0) return { p: { x: 0, y: 0, z: 0 }, v: { x: 0, y: 0, z: 0 } };
  const M = rad(el.mDeg + el.mDotDegPerDay * dt);
  const e = el.e;
  const E = keplerE(M, e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const r = a * (1 - e * cosE);
  const nu = Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e);
  const i = rad(el.iDeg);
  const lan = rad(el.lanDeg);
  const peri = rad(el.periDeg);
  const u = peri + nu;
  const xorb = r * Math.cos(u);
  const yorb = r * Math.sin(u);
  const cosL = Math.cos(lan);
  const sinL = Math.sin(lan);
  const p = {
    x: xorb * cosL - yorb * Math.cos(i) * sinL,
    y: xorb * sinL + yorb * Math.cos(i) * cosL,
    z: yorb * Math.sin(i),
  };
  const parent = b.parent ? BODY_BY_ID[b.parent] : undefined;
  const mu = parent ? parent.mu : MU_SUN;
  const n = Math.sqrt(mu / (a * a * a));
  const edot = (n * a) / Math.max(r, 1) / Math.sqrt(Math.max(1e-12, 1 - e * e));
  const vxOrb = -edot * Math.sin(u);
  const vyOrb = edot * (e + Math.cos(u));
  const v = {
    x: vxOrb * cosL - vyOrb * Math.cos(i) * sinL,
    y: vxOrb * sinL + vyOrb * Math.cos(i) * cosL,
    z: vyOrb * Math.sin(i),
  };
  return { p, v };
}

export function heliocentric(id: string, mjd: number): { p: Vec; v: Vec } {
  const b = body(id);
  if (b.id === "sun") return { p: { x: 0, y: 0, z: 0 }, v: { x: 0, y: 0, z: 0 } };
  const local = elementsState(b, mjd);
  if (!b.parent || b.parent === "sun") return local;
  const parent = heliocentric(b.parent, mjd);
  return { p: add(parent.p, local.p), v: add(parent.v, local.v) };
}

export function parkingRadius(bodyId: string, altM: number) {
  return body(bodyId).radiusM + altM;
}
