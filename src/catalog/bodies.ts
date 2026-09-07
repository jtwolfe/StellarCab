export type BodyKind = "star" | "planet" | "moon" | "dwarf" | "asteroid";

export type Elements = {
  aAu: number; e: number; iDeg: number; lanDeg: number; periDeg: number; mDeg: number; mDotDegPerDay: number;
};

export type Body = {
  id: string; name: string; kind: BodyKind; parent: string | null; mu: number; radiusM: number;
  atmRho0?: number; atmScaleH?: number; radiationTax?: number; elements: Elements;
};

export const BODIES: Body[] = [
  { id: "sun", name: "Sun", kind: "star", parent: null, mu: 1.32712440018e20, radiusM: 6.96e8, elements: { aAu: 0, e: 0, iDeg: 0, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 0 } },
  { id: "mercury", name: "Mercury", kind: "planet", parent: "sun", mu: 2.2032e13, radiusM: 2.44e6, elements: { aAu: 0.3871, e: 0.2056, iDeg: 7.0, lanDeg: 48.3, periDeg: 77.5, mDeg: 174.8, mDotDegPerDay: 4.0923 } },
  { id: "venus", name: "Venus", kind: "planet", parent: "sun", mu: 3.24859e14, radiusM: 6.052e6, atmRho0: 65, atmScaleH: 15900, elements: { aAu: 0.7233, e: 0.0068, iDeg: 3.39, lanDeg: 76.7, periDeg: 131.6, mDeg: 50.4, mDotDegPerDay: 1.6021 } },
  { id: "earth", name: "Earth", kind: "planet", parent: "sun", mu: 3.986004418e14, radiusM: 6.371e6, atmRho0: 1.225, atmScaleH: 8500, elements: { aAu: 1.0, e: 0.0167, iDeg: 0, lanDeg: 0, periDeg: 102.9, mDeg: 100.5, mDotDegPerDay: 0.9856 } },
  { id: "moon", name: "Moon", kind: "moon", parent: "earth", mu: 4.9048695e12, radiusM: 1.737e6, elements: { aAu: 0.00257, e: 0.0549, iDeg: 5.15, lanDeg: 125.1, periDeg: 318.3, mDeg: 135.0, mDotDegPerDay: 13.176 } },
  { id: "mars", name: "Mars", kind: "planet", parent: "sun", mu: 4.282837e13, radiusM: 3.39e6, atmRho0: 0.02, atmScaleH: 11100, elements: { aAu: 1.5237, e: 0.0934, iDeg: 1.85, lanDeg: 49.6, periDeg: 336.1, mDeg: 19.4, mDotDegPerDay: 0.5240 } },
  { id: "phobos", name: "Phobos", kind: "moon", parent: "mars", mu: 7.11e9, radiusM: 1.13e4, elements: { aAu: 6.27e-5, e: 0.015, iDeg: 1.1, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 1128.8 } },
  { id: "deimos", name: "Deimos", kind: "moon", parent: "mars", mu: 1.5e9, radiusM: 6.2e3, elements: { aAu: 1.57e-4, e: 0.0003, iDeg: 1.8, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 285.2 } },
  { id: "ceres", name: "Ceres", kind: "dwarf", parent: "sun", mu: 6.263e10, radiusM: 4.7e5, elements: { aAu: 2.767, e: 0.0785, iDeg: 10.59, lanDeg: 80.3, periDeg: 73.6, mDeg: 96.0, mDotDegPerDay: 0.214 } },
  { id: "vesta", name: "Vesta", kind: "asteroid", parent: "sun", mu: 1.78e10, radiusM: 2.63e5, elements: { aAu: 2.362, e: 0.0887, iDeg: 7.14, lanDeg: 103.8, periDeg: 151.7, mDeg: 20.0, mDotDegPerDay: 0.272 } },
  { id: "jupiter", name: "Jupiter", kind: "planet", parent: "sun", mu: 1.26686534e17, radiusM: 6.9911e7, radiationTax: 0.2, elements: { aAu: 5.2026, e: 0.0485, iDeg: 1.3, lanDeg: 100.5, periDeg: 14.8, mDeg: 20.0, mDotDegPerDay: 0.0831 } },
  { id: "io", name: "Io", kind: "moon", parent: "jupiter", mu: 5.96e12, radiusM: 1.822e6, radiationTax: 8, elements: { aAu: 0.00282, e: 0.004, iDeg: 0.04, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 203.1 } },
  { id: "europa", name: "Europa", kind: "moon", parent: "jupiter", mu: 3.2e12, radiusM: 1.561e6, radiationTax: 4, elements: { aAu: 4.49e-3, e: 0.009, iDeg: 0.47, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 101.4 } },
  { id: "ganymede", name: "Ganymede", kind: "moon", parent: "jupiter", mu: 9.89e12, radiusM: 2.634e6, radiationTax: 1.2, elements: { aAu: 7.16e-3, e: 0.001, iDeg: 0.18, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 50.3 } },
  { id: "callisto", name: "Callisto", kind: "moon", parent: "jupiter", mu: 7.18e12, radiusM: 2.41e6, radiationTax: 0.3, elements: { aAu: 1.26e-2, e: 0.007, iDeg: 0.19, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 21.6 } },
  { id: "saturn", name: "Saturn", kind: "planet", parent: "sun", mu: 3.7931187e16, radiusM: 5.8232e7, elements: { aAu: 9.5549, e: 0.0555, iDeg: 2.49, lanDeg: 113.7, periDeg: 92.4, mDeg: 317.0, mDotDegPerDay: 0.0335 } },
  { id: "titan", name: "Titan", kind: "moon", parent: "saturn", mu: 8.978e12, radiusM: 2.575e6, atmRho0: 5.4, atmScaleH: 40000, elements: { aAu: 8.17e-3, e: 0.029, iDeg: 0.35, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 22.58 } },
  { id: "enceladus", name: "Enceladus", kind: "moon", parent: "saturn", mu: 7.2e9, radiusM: 2.52e5, elements: { aAu: 1.59e-3, e: 0.005, iDeg: 0.02, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: 262.7 } },
  { id: "uranus", name: "Uranus", kind: "planet", parent: "sun", mu: 5.794e15, radiusM: 2.5362e7, elements: { aAu: 19.218, e: 0.046, iDeg: 0.77, lanDeg: 74.0, periDeg: 170.9, mDeg: 142.0, mDotDegPerDay: 0.0117 } },
  { id: "neptune", name: "Neptune", kind: "planet", parent: "sun", mu: 6.835e15, radiusM: 2.4622e7, elements: { aAu: 30.11, e: 0.009, iDeg: 1.77, lanDeg: 131.8, periDeg: 44.97, mDeg: 256.2, mDotDegPerDay: 0.006 } },
  { id: "triton", name: "Triton", kind: "moon", parent: "neptune", mu: 1.43e12, radiusM: 1.353e6, elements: { aAu: 2.37e-3, e: 0, iDeg: 157, lanDeg: 0, periDeg: 0, mDeg: 0, mDotDegPerDay: -61.3 } },
];

export const BODY_BY_ID = Object.fromEntries(BODIES.map((b) => [b.id, b]));

export function body(id: string): Body {
  const b = BODY_BY_ID[id];
  if (!b) throw new Error(`unknown body ${id}`);
  return b;
}
