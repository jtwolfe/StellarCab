# How StellarCab trains

Same split as SpaceY: a written plant and GNC, a residual that only nudges them, a score that refuses cheap cheats.

## State

An episode is an itinerary, not a 6DOF integration of every second for three years.

```
Itinerary = [Leg, Leg, …]
Leg = {
  from, to,            # catalog ids
  departMjd,           # wait is implicit vs ready time
  kind,                # lambert | assist | aerocapture | depot
  assistBody?,         # optional flyby
  burnDv,              # ship-applied Δv after aero credit
}
```

The integrator only flies the legs the planner (or residual) emitted. Bodies move on the 2025–2050 ephemeris the whole time.

## Conventional planner (the GNC)

For a query `(origin, dest, ready, fuel)`:

1. Build the **depot graph**. Nodes are parking orbits. An edge exists if a Starship with a given tank fraction can fly it and still reach a producing depot.
2. Sample departure epochs from `ready` out to a cap (default 400 days). Waiting is legal. A two-week hold that unlocks a moon slingshot can beat an immediate Hohmann.
3. For each epoch, solve Lambert on the direct pair and on 1-assist candidates (parent planet, large moons, Venus/Earth/Jupiter as appropriate).
4. Apply aerocapture credit if the target has an atmosphere and periapsis can be flown without exceeding g / heat limits.
5. Keep the beam of itineraries that **never strand**: after every arrival, remaining Δv plus local ISRU fill rate must connect back into the producing-depot component.

That champion is the baseline Catch a Ride prints.

## Residual policy

The net does not output throttle. It outputs a **delta itinerary**:

- extra wait (days)
- prefer / forbid an assist body
- take or skip aerocapture
- insert a depot hop
- burn split (spend more now vs reserve for the next escape)

Zero weights copy the conventional champion. CMA-ES (sep-CMA, same family as SpaceY) walks those residuals. Topology starts small and grows identity blocks when σ plateaus, again like SpaceY.

## Score

Arrive is not enough.

```
score =
  + ARRIVE_JACKPOT
  − flightDays
  − 0.25 * waitDays          # wait is cheap if it shortens the cruise
  − 8 * shipDvKmS
  − STRAND_FINE              # if terminal node is not refill-and-leave
  − HEAT_REJECT / G_REJECT
  + aeroCredit
  − 1e-3 * (coordinateTime − properTime) days
```

Proper-time term exists so the gym *knows* clocks. It will not change a 2033 Mars window.

## Catch a Ride during training

`Trainer.query(req)` freezes sampling, runs one conventional solve, runs the current mean residual on the same request, returns both. The gym process keeps stepping generations in the background.

## Window

All random origins, destinations, and ready times are drawn inside **2025-01-01 … 2050-12-31**. Ephemeris rates are fitted to that quarter-century, not to 10 kyr.
