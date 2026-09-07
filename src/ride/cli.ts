import { catchARide, formatItinerary } from "./query";

function arg(name: string, fallback: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const q = {
  from: arg("from", "earth:leo"),
  to: arg("to", "mars:lmo"),
  readyIso: arg("ready", "2033-04-01"),
  fuel: Number(arg("fuel", "1")),
};

const ev = catchARide(q);
console.log(`Catch a Ride  ${q.from} → ${q.to}  ready ${q.readyIso}`);
console.log(formatItinerary("STUDENT", ev.student));
console.log(formatItinerary("BASELINE", ev.baseline));
console.log(`fit ${ev.fit.toFixed(1)}`);
