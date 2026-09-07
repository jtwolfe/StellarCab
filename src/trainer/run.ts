import { defaultBrain, stepGen } from "./gym";

const gens = Number(process.argv[2] ?? 8);
const brain = defaultBrain();
for (let i = 0; i < gens; i++) {
  const s = stepGen(brain);
  console.log(`gen ${brain.gen}  rung=${s.rung}  pair=${s.pair.join("→")}  ready=${s.ready}  best=${s.best.toFixed(1)}  σ=${brain.sigma.toFixed(3)}`);
}
console.log("done. Catch a Ride with: npx jiti src/ride/cli.ts --from earth:leo --to mars:lmo --ready 2033-04-01");
