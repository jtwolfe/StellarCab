/** SI + epoch. Window is the only era the gym claims to know. */

export const AU = 1.495978707e11;
export const DAY = 86400;
export const G0 = 9.80665;
export const C = 299792458;
export const MU_SUN = 1.32712440018e20;
export const RS_SUN = 2 * 1.32712440018e20 / (C * C);

/** 2025-01-01 00:00 TDB ≈ MJD 60676.0 */
export const WINDOW_START_MJD = 60676;
/** 2050-12-31 */
export const WINDOW_END_MJD = 70170;

export const MJD_J2000 = 51544.5;

export function clampWindow(mjd: number) {
  return Math.min(WINDOW_END_MJD, Math.max(WINDOW_START_MJD, mjd));
}
