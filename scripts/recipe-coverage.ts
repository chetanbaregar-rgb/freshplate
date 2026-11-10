// How many recipes each state and union territory has against a target.
//   npm run recipes:coverage              (target 100 per region)
//   npm run recipes:coverage -- --target=50
// A recipe counts for every region in its cuisineRegion, so a dish shared by two states counts twice.
import { RECIPES } from "../src/lib/recipes";
import { INDIAN_STATES } from "../src/lib/utils";

const arg = process.argv.find((a) => a.startsWith("--target="));
const target = arg ? Number(arg.split("=")[1]) : 100;
if (!Number.isFinite(target) || target <= 0) {
  console.error("Use --target=<a positive number>");
  process.exit(1);
}

const count = (region: string) => RECIPES.filter((r) => r.cuisineRegion.includes(region)).length;
const veg = (region: string) => RECIPES.filter((r) => r.cuisineRegion.includes(region) && r.dietType === "veg").length;

const rows = INDIAN_STATES.map((region) => ({ region, n: count(region), veg: veg(region) })).sort((a, b) => a.n - b.n || a.region.localeCompare(b.region));
const width = Math.max(...rows.map((r) => r.region.length));

console.log(`Recipes per state/UT against a target of ${target} (${INDIAN_STATES.length} regions)\n`);
console.log(`${"Region".padEnd(width)}  Recipes  Veg  Of target  Still needed`);
for (const r of rows) {
  const pct = `${Math.min(100, Math.round((r.n / target) * 100))}%`.padStart(8);
  console.log(`${r.region.padEnd(width)}  ${String(r.n).padStart(7)}  ${String(r.veg).padStart(3)}  ${pct}  ${String(Math.max(0, target - r.n)).padStart(12)}`);
}

const have = rows.reduce((s, r) => s + Math.min(r.n, target), 0);
const needed = INDIAN_STATES.length * target;
const unassigned = RECIPES.filter((r) => !r.cuisineRegion.some((c) => INDIAN_STATES.includes(c))).length;
console.log(`\n${have} of ${needed} recipe slots filled (${Math.round((have / needed) * 100)}%); ${needed - have} still needed.`);
console.log(`${RECIPES.length} recipes in the library; ${unassigned} are tagged only to a wider area such as Pan-India, so they count for no single region.`);
console.log(`${rows.filter((r) => r.n >= target).length} of ${INDIAN_STATES.length} regions have reached the target.`);
