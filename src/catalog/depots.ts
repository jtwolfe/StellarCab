export type NodeKind = "producing" | "staging" | "dead";

export type Depot = {
  id: string;
  body: string;
  label: string;
  kind: NodeKind;
  /** parking altitude above surface, m */
  altM: number;
  fillRateTPerDay: number;
  maxTankT: number;
  radiationTax: number;
};

export const DEPOTS: Depot[] = [
  { id: "earth:leo", body: "earth", label: "LEO", kind: "producing", altM: 400e3, fillRateTPerDay: 2000, maxTankT: 1200, radiationTax: 0 },
  { id: "earth:nrho", body: "earth", label: "NRHO cache", kind: "staging", altM: 70e6, fillRateTPerDay: 0, maxTankT: 1200, radiationTax: 0.05 },
  { id: "moon:llo", body: "moon", label: "LLO", kind: "producing", altM: 100e3, fillRateTPerDay: 8, maxTankT: 600, radiationTax: 0.05 },
  { id: "moon:nsp", body: "moon", label: "south polar surface-tether", kind: "producing", altM: 50e3, fillRateTPerDay: 12, maxTankT: 800, radiationTax: 0.05 },
  { id: "venus:orbit", body: "venus", label: "Venus high", kind: "dead", altM: 400e3, fillRateTPerDay: 0, maxTankT: 0, radiationTax: 0.1 },
  { id: "mercury:orbit", body: "mercury", label: "Mercury high", kind: "dead", altM: 300e3, fillRateTPerDay: 0, maxTankT: 0, radiationTax: 0.4 },
  { id: "mars:lmo", body: "mars", label: "LMO", kind: "producing", altM: 250e3, fillRateTPerDay: 40, maxTankT: 1200, radiationTax: 0.05 },
  { id: "mars:phobos", body: "phobos", label: "Phobos", kind: "producing", altM: 30e3, fillRateTPerDay: 20, maxTankT: 800, radiationTax: 0.05 },
  { id: "ceres:orbit", body: "ceres", label: "Ceres", kind: "producing", altM: 80e3, fillRateTPerDay: 6, maxTankT: 800, radiationTax: 0.1 },
  { id: "vesta:orbit", body: "vesta", label: "Vesta", kind: "staging", altM: 80e3, fillRateTPerDay: 1, maxTankT: 200, radiationTax: 0.1 },
  { id: "io:orbit", body: "io", label: "Io", kind: "dead", altM: 200e3, fillRateTPerDay: 0, maxTankT: 0, radiationTax: 8 },
  { id: "europa:orbit", body: "europa", label: "Europa", kind: "producing", altM: 150e3, fillRateTPerDay: 4, maxTankT: 400, radiationTax: 4 },
  { id: "ganymede:orbit", body: "ganymede", label: "Ganymede", kind: "producing", altM: 200e3, fillRateTPerDay: 5, maxTankT: 500, radiationTax: 1.2 },
  { id: "callisto:orbit", body: "callisto", label: "Callisto", kind: "producing", altM: 200e3, fillRateTPerDay: 7, maxTankT: 700, radiationTax: 0.3 },
  { id: "titan:orbit", body: "titan", label: "Titan", kind: "producing", altM: 800e3, fillRateTPerDay: 15, maxTankT: 1200, radiationTax: 0.2 },
  { id: "enceladus:orbit", body: "enceladus", label: "Enceladus", kind: "producing", altM: 40e3, fillRateTPerDay: 3, maxTankT: 300, radiationTax: 0.2 },
  { id: "triton:orbit", body: "triton", label: "Triton", kind: "staging", altM: 200e3, fillRateTPerDay: 0.4, maxTankT: 100, radiationTax: 0.3 },
];

export const DEPOT_BY_ID = Object.fromEntries(DEPOTS.map((d) => [d.id, d]));

export function depot(id: string): Depot {
  const d = DEPOT_BY_ID[id];
  if (!d) throw new Error(`unknown depot ${id}`);
  return d;
}

export function depotsOn(bodyId: string) {
  return DEPOTS.filter((d) => d.body === bodyId);
}

export function producingIds() {
  return DEPOTS.filter((d) => d.kind === "producing").map((d) => d.id);
}
