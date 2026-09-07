import { G0 } from "./constants";

/** Public-order Starship cartoon. Not a SpaceX spec. */
export const SHIP = {
  dryT: 120,
  propT: 1200,
  payloadT: 100,
  ispVac: 380,
  maxG: 5,
  heatLimit: 1,
};

export function wetMassT(propFrac: number, payloadT = SHIP.payloadT) {
  const p = Math.min(1, Math.max(0, propFrac));
  return SHIP.dryT + payloadT + SHIP.propT * p;
}

export function dvAvailable(propFrac: number, payloadT = SHIP.payloadT) {
  const m0 = wetMassT(propFrac, payloadT);
  const mf = SHIP.dryT + payloadT;
  if (m0 <= mf) return 0;
  return SHIP.ispVac * G0 * Math.log(m0 / mf);
}

export function burnFrac(propFrac: number, dv: number, payloadT = SHIP.payloadT) {
  const m0 = wetMassT(propFrac, payloadT);
  const mf = m0 / Math.exp(Math.max(0, dv) / (SHIP.ispVac * G0));
  const propLeft = Math.max(0, mf - SHIP.dryT - payloadT);
  return propLeft / SHIP.propT;
}
