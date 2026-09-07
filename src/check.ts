import { BODIES } from "./catalog/bodies";
import { DEPOTS, producingIds } from "./catalog/depots";
import { heliocentric, norm } from "./astro/ephemeris";
import { WINDOW_START_MJD } from "./catalog/constants";
import { canLeave } from "./planner/strand";
import { conventionalPlan } from "./planner/conventional";
import { catchARide } from "./ride/query";
import { dvAvailable } from "./catalog/starship";

let fails = 0;
function ok(name: string, cond: boolean, extra = "") {
  if (!cond) {
    fails += 1;
    console.error("FAIL", name, extra);
  } else console.log("ok  ", name, extra);
}

ok("catalog bodies", BODIES.length >= 18);
ok("producing depots", producingIds().length >= 8);
ok("earth exists 2025", norm(heliocentric("earth", WINDOW_START_MJD).p) > 1e11);
ok("europa around jupiter", norm(heliocentric("europa", WINDOW_START_MJD).p) > 7e11);
ok("full tank Δv", dvAvailable(1) > 7000 && dvAvailable(1) < 12000);
ok("leo can leave", canLeave("earth:leo", 1));
ok("mercury empty cannot leave", !canLeave("mercury:orbit", 0.02));
ok("io dead empty cannot leave", !canLeave("io:orbit", 0.05));

const mars = conventionalPlan("earth:leo", "mars:lmo", "2033-04-01", 1);
ok("2033 earth-mars planned", mars.legs.length > 0, `flight=${mars.flightDays.toFixed(0)}d dv=${(mars.shipDv / 1000).toFixed(2)}`);
ok("2033 not stranded", !mars.stranded);

const ride = catchARide({ from: "earth:leo", to: "moon:llo", readyIso: "2028-06-01", fuel: 1 });
ok("ride dual itinerary", ride.baseline.legs.length + ride.student.legs.length > 0);

if (fails) {
  console.error(`${fails} failed`);
  process.exit(1);
}
console.log(`${DEPOTS.length} depots, ${BODIES.length} bodies, checks passed`);
