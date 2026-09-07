import { depot, DEPOTS, producingIds } from "../catalog/depots";
import { burnFrac, dvAvailable } from "../catalog/starship";

const ESCAPE_TAX: Record<string, number> = {
  "earth:leo": 3200,
  "earth:nrho": 900,
  "moon:llo": 700,
  "moon:nsp": 800,
  "mars:lmo": 1400,
  "mars:phobos": 600,
  "ceres:orbit": 450,
  "vesta:orbit": 400,
  "europa:orbit": 1800,
  "ganymede:orbit": 1600,
  "callisto:orbit": 1400,
  "titan:orbit": 1200,
  "enceladus:orbit": 250,
  "venus:orbit": 2800,
  "mercury:orbit": 2200,
  "io:orbit": 2200,
  "triton:orbit": 900,
};

function neighbors(id: string) {
  const here = depot(id);
  return DEPOTS.filter((d) => d.id !== id).filter((d) => {
    if (d.body === here.body) return true;
    if (here.kind === "producing" && d.kind !== "dead") return true;
    if (d.kind === "producing") return true;
    return false;
  });
}

/** True if, after a 60-day optional fill, the ship can reach a producer and still leave. */
export function canLeave(node: string, fuel: number) {
  const d = depot(node);
  let tank = fuel;
  if (d.kind === "producing") {
    const add = Math.min(d.maxTankT, d.fillRateTPerDay * 60) / 1200;
    tank = Math.min(1, tank + add);
  }
  const dv = dvAvailable(tank);
  const escape = ESCAPE_TAX[node] ?? 1500;
  if (d.kind === "producing" && dv > escape + 200) return true;
  const seen = new Set<string>([node]);
  const q = [{ id: node, fuel: tank }];
  const producers = new Set(producingIds());
  while (q.length) {
    const cur = q.pop()!;
    for (const n of neighbors(cur.id)) {
      if (seen.has(n.id)) continue;
      const hop = ESCAPE_TAX[cur.id] ?? 1500;
      if (dvAvailable(cur.fuel) < hop * 0.6) continue;
      const nextFuel = burnFrac(cur.fuel, hop * 0.6);
      seen.add(n.id);
      if (producers.has(n.id) && dvAvailable(nextFuel) > (ESCAPE_TAX[n.id] ?? 1500) * 0.5) return true;
      q.push({ id: n.id, fuel: nextFuel });
    }
  }
  return false;
}

export function strandAfter(node: string, fuel: number) {
  return !canLeave(node, fuel);
}
