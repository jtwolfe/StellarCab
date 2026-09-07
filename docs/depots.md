# ISRU depots and the never-strand rule

A legal destination is one you can leave. The catalog marks every parking orbit as `producing`, `staging`, or `dead`.

- **producing** — local feedstock can make methalox (CH4 + LOX) at a published-order rate.
- **staging** — tanks can be cached from a producer, but the body itself does not close the chemistry.
- **dead** — you may fly there, but only with reserved Δv to a producer. Arriving empty is a strand.

## Producing depots (v0)

| Depot | Orbit | Feedstock | Why it is on the graph |
|---|---|---|---|
| `earth:leo` | ~400 km | Earth industry | Default fill. Not ISRU; treated as infinite rate. |
| `earth:nrho` | NRHO staging | Lunar tankers | Gateway-class cache, not a mine. |
| `moon:llo` / `moon:nsp` | low lunar / south polar | Water ice → H2 + O2, carbon imported or from polar organics | Escape is cheap. Carbon is the weak link — v0 assumes imported C or modest polar organics so methalox can close at low rate. |
| `mars:lmo` | low Mars | Atmosphere CO2 + subsurface ice → Sabatier CH4 + LOX | The only high-rate off-Earth producer in this decade. |
| `mars:phobos` | Phobos parking | Same Mars ISRU, lofted | Cheap rendezvous, dust and tidal issues noted, still producing-via-tether to LMO. |
| `ceres:orbit` | low Ceres | Water ice, possible ammonium / organics | Belt hub. Escape ~0.5 km/s. Carbon assumed scarce — rate is low, but you can leave. |
| `vesta:orbit` | low Vesta | Hydrated minerals, poorer than Ceres | Backup belt staging; rate below Ceres. |
| `callisto:orbit` | high Jovian | Water ice, outside the worst belt | Jupiter-system producer. Radiation tax is lower than Europa. |
| `ganymede:orbit` | mid Jovian | Ice | Producer with a heavier radiation tax than Callisto. |
| `europa:orbit` | low Jovian | Ice + plume | Producer on paper, **harsh** radiation. Score taxes loiter. Prefer Callisto as the Jupiter fill-up. |
| `enceladus:orbit` | Saturn | Plume water | Tiny gravity, real water. Rate limited by collection, not escape. |
| `titan:orbit` | Saturn | Thick N2 + hydrocarbons | Best outer-system carbon. Methane is free; oxidiser is the plant. Treated as producing (CH4 harvest + water-ice LOX from other Saturn moons). |

## Staging only (not a home)

| Depot | Note |
|---|---|
| `venus:orbit` | Aerocapture yes, methalox ISRU no. Never a terminal empty arrival. |
| `mercury:orbit` | Solar power, almost no volatiles. Dead for fill. |
| `io:orbit` | Dead. Radiation + no useful ice. |
| `triton:orbit` | Ice, but Neptune is a 2025–2050 stretch. Marked staging pending a producer rate we trust. |

## Never-strand check

After each leg the planner asks:

1. Remaining ship Δv at the arrival orbit.
2. ISRU fill in a bounded loiter (default 60 days) if `producing`.
3. BFS on the depot graph with that tank fraction.
4. If no path to a `producing` node other than “sit here forever”, the itinerary is illegal.

So Europa is allowed as a science stop only if the itinerary already reserved the Δv (or a Callisto fill) to leave the Jovian well.

## What v0 does not model

Boil-off plants, tanker fleet scheduling, and Sabatier power curves. A producing node has a `fillRateTPerDay` and a `maxTankT`. That is the whole factory.
