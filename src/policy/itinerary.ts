/** Residual over a conventional itinerary. Zero weights copy the baseline. */

export const N_IN = 16;
export const N_HIDDEN = 8;
export const N_OUT = 6;

export function nWeights() {
  return N_HIDDEN * N_IN + N_HIDDEN + N_OUT * N_HIDDEN + N_OUT;
}

export function zeroWeights() {
  return new Array(nWeights()).fill(0);
}

function tanh(x: number) {
  if (x > 8) return 1;
  if (x < -8) return -1;
  const e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
}

export function forward(w: number[], x: number[]) {
  const h = new Array(N_HIDDEN).fill(0);
  for (let j = 0; j < N_HIDDEN; j++) {
    let s = w[N_HIDDEN * N_IN + j];
    for (let i = 0; i < N_IN; i++) s += w[j * N_IN + i] * x[i];
    h[j] = tanh(s);
  }
  const off = N_HIDDEN * N_IN + N_HIDDEN;
  const y = new Array(N_OUT).fill(0);
  for (let a = 0; a < N_OUT; a++) {
    let s = w[off + N_OUT * N_HIDDEN + a];
    for (let j = 0; j < N_HIDDEN; j++) s += w[off + a * N_HIDDEN + j] * h[j];
    y[a] = tanh(s);
  }
  return y;
}

export type Residual = {
  extraWaitDays: number;
  tofScale: number;
  wantAssist: boolean;
  wantAero: boolean;
  insertDepot: boolean;
  reserveFrac: number;
};

export function readResidual(y: number[]): Residual {
  return {
    extraWaitDays: y[0] * 80,
    tofScale: 1 + y[1] * 0.35,
    wantAssist: y[2] > 0.25,
    wantAero: y[3] > -0.1,
    insertDepot: y[4] > 0.45,
    reserveFrac: 0.5 + 0.4 * y[5],
  };
}
