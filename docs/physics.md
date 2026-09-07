# Physics notes (2025–2050)

## Ephemeris

Planets use Keplerian elements + constant rates fitted to the quarter-century.
Moons are Keplerian about their parent, parent state from the planet stepper.
This is not DE440. Phase error over 25 years is acceptable for *window* learning.
Swap `src/astro/ephemeris.ts` when a SPICE kernel is worth the weight.

## Starship (public-order)

| Qty | v0 value |
|---|---|
| Dry mass | 120 t |
| Usable methalox | 1200 t |
| Vac Isp | 380 s |
| Payload (default cab) | 100 t |
| Max ship Δv, full, no payload | ~9.0 km/s |
| Max ship Δv, full + 100 t | ~8.4 km/s |

Raptor-vac and boil-off are not simulated. Δv is rocket-equation only.

## Aerobrake

If the target has `atmScaleH` and `atmRho0`, a periapsis inside the corridor grants

```
dvCredit = min(vInf * aeroFrac, heatLimited)
```

and rejects the leg when peak g or stagnation heat exceeds the Starship tile cartoon.

Venus, Earth, Mars, Titan are aerocapture-capable. Giant-planet atmospheres are not offered as a first-version arrival mode (entry is a science mission, not a cab).

## Gravity assist

A flyby is a patched-conic turn with `turn = 2 acos(1 / (1 + r_p v_inf² / μ))`,
clipped by a minimum periapsis (atmosphere + 3 scale heights, or icy-surface + 100 km).
The residual may pick the body; the plant computes the turn.

## Time dilation

Coordinate time `t` is TDB-like seconds on the ephemeris.
Proper time along the ship worldline:

```
dτ = dt * sqrt(1 - v²/c²) * sqrt(1 - r_s / r)
```

with `r_s` the solar Schwarzschild radius and `v` heliocentric.

At 15 km/s cruise, `γ − 1 ≈ 1.3e-9`. A 200-day hop loses ~20 ms.
The term is in the score so the model has the feature. It will not reorder 2033 vs 2035 Mars.

## Window

Random `ready` times and published synodic examples are clamped to
`MJD 60676` (2025-01-01) … `MJD 70170` (2050-12-31).
