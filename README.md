# STELLARCAB

An interplanetary **Catch a Ride** gym for a Starship-class methalox ship.

The plant is a 2025–2050 solar-system ephemeris plus patched-conic / n-body hops.
The **conventional planner** is the GNC: Lambert legs, gravity-assist search, aerocapture credits, ISRU depot graph.
The **model** is a residual itinerary policy on top of that stack — same split SpaceY used for landing.
Training and **Catch a Ride** share one loop. Flip the mode, set origin / destination / ready time, and the current brain answers next to a porkchop baseline.

Nothing here is operational flight software. Numbers are public-order-of-magnitude Starship and body data.

![StellarCab](public/logo.svg)

## Why not “the net is the pilot”

SpaceY taught the hard way that a small net flying the whole plant from zeros is a bad prior.
StellarCab does not ask a network to invent Kepler.

| Layer | Owns |
|---|---|
| Ephemeris + integrator | Where every trained body is, 2025-01-01 → 2050-12-31 |
| Conventional planner | Feasible legs, assists, waits, aerobrake, depot fills |
| Residual policy | Which sequence, how long to wait, whether the slingshot is worth the hold |
| Score | Arrive soon, do not strand, do not dump prop on a worse-than-Hohmann path |

A ship that cannot leave its arrival orbit under remaining prop **and** local ISRU is a failed episode, even if it reached the destination.

## Run

```bash
npm install
npx jiti src/check.ts
npx jiti src/ride/cli.ts --from earth:leo --to mars:lmo --ready 2033-04-01
```

`npm run train` steps the gym. `npm run ride` is the same binary with the policy frozen for a query.

## Ladder

| Rung | What the policy must learn |
|---|---|
| Cislunar | LEO ↔ NRHO ↔ LLO, lunar depot |
| Mars synod | LEO ↔ LMO with wait + optional Venus assist + aerocapture |
| Inner belt | Add Ceres / Vesta depots |
| Giant moons | Jupiter/Saturn systems with ice-moon ISRU and radiation tax |
| Any-to-any | Random legal pair in the 2025–2050 window |

Unlock is consecutive generations that beat the conventional baseline on time **without** a stranded terminal state.

## Catch a Ride

At any generation:

```
origin        earth:leo | moon:nrho | mars:phobos | europa:orbit | …
destination  same catalog
ready         UTC instant in [2025-01-01, 2050-06-01]
fuel          fraction of a full Starship tank (default 1)
```

Response is two itineraries: **student** (current residual) and **baseline** (beam-search porkchop + assists). Compare flight time, wait, Δv, proper time, depot stops.

## Layout

| Path | What |
|---|---|
| `src/catalog/` | Bodies, moons, Starship, ISRU depots |
| `src/astro/` | Ephemeris, Lambert, aero, proper time |
| `src/planner/` | Conventional search + never-strand graph |
| `src/policy/` | Residual itinerary net |
| `src/trainer/` | CMA gym, score, ladder |
| `src/ride/` | Query mode |
| `docs/` | Physics notes and depot rationale |

## Honest limits

- Ephemeris is a compact Kepler + rates model, not SPICE DE440. Good enough to train windows; swap the catalog later.
- Time dilation is scored (special + weak-field gravity). At Starship speeds it is milliseconds over a cruise, not a routing driver.
- “Local resources” means published ice / atmosphere / carbon inventories, not a chemistry plant sim.
- Aerobrake is a Δv credit + heating/g-load reject, not a CFD skip-entry.

More: [docs/how-it-works.md](docs/how-it-works.md) · [docs/depots.md](docs/depots.md)
