import { describe, expect, it } from "vitest";
import { avoidLabel, avoidListFor, findConflicts, parseTermList } from "./allergens";
import { filterRecipes, RECIPES } from "./recipes";
import { ing, member, recipe } from "@/test/fixtures";

describe("findConflicts", () => {
  it("flags a preset allergen found in an ingredient name, including plurals", () => {
    const r = recipe("r", "Poha", [ing("a", "Peanuts", 30, "g")]);
    expect(findConflicts(r, ["peanut"])).toEqual(["peanut"]);
  });

  it("matches whole words only: 'egg' is not 'eggplant'", () => {
    const r = recipe("r", "Baingan", [ing("a", "Brinjal / Eggplant (large)", 1, "large")]);
    expect(findConflicts(r, ["egg"])).toEqual([]);
    const withEgg = recipe("r2", "Bhurji", [ing("b", "Eggs", 2, "piece")]);
    expect(findConflicts(withEgg, ["egg"])).toEqual(["egg"]);
  });

  it("uses the search terms too, so a peanut listed as 'groundnuts' is still caught", () => {
    const r = recipe("r", "Snack", [ing("a", "Roasted seeds mix", 30, "g", "groundnuts")]);
    expect(findConflicts(r, ["peanut"])).toEqual(["peanut"]);
  });

  it("looks at recipe steps and description, not just the ingredient list", () => {
    const r = recipe("r", "Kheer", [ing("a", "Rice", 50, "g")], {
      description: "Sweet rice pudding",
      steps: ["Garnish with chopped cashews."],
    });
    expect(findConflicts(r, ["tree_nut"])).toEqual(["tree_nut"]);
  });

  it("treats dairy foods as dairy but coconut milk as dairy-free", () => {
    const paneer = recipe("r", "Palak", [ing("a", "Paneer", 100, "g")]);
    const ghee = recipe("r2", "Dal", [ing("a", "Ghee", 10, "ml")]);
    const coconut = recipe("r3", "Stew", [ing("a", "Coconut milk", 100, "ml")]);
    const peanutButter = recipe("r4", "Toast", [ing("a", "Peanut butter", 20, "g")]);
    expect(findConflicts(paneer, ["dairy"])).toEqual(["dairy"]);
    expect(findConflicts(ghee, ["dairy"])).toEqual(["dairy"]);
    expect(findConflicts(coconut, ["dairy"])).toEqual([]);
    expect(findConflicts(peanutButter, ["dairy"])).toEqual([]);
    expect(findConflicts(peanutButter, ["peanut"])).toEqual(["peanut"]);
  });

  it("matches free-text entries typed by the user, case-insensitively", () => {
    const r = recipe("r", "Stir fry", [ing("a", "Mushroom", 100, "g")]);
    expect(findConflicts(r, ["  Mushrooms "])).toEqual(["  Mushrooms "]);
    expect(findConflicts(r, ["spinach"])).toEqual([]);
  });

  it("returns only the entries that matched, in the order given", () => {
    const r = recipe("r", "Mix", [ing("a", "Peanuts", 1, "g"), ing("b", "Paneer", 1, "g")]);
    expect(findConflicts(r, ["dairy", "soy", "peanut"])).toEqual(["dairy", "peanut"]);
  });

  it("returns nothing for an empty list and ignores one-letter entries", () => {
    const r = recipe("r", "Anything", [ing("a", "Aubergine", 1, "g")]);
    expect(findConflicts(r, [])).toEqual([]);
    expect(findConflicts(r, ["a", " "])).toEqual([]);
  });
});

describe("avoidListFor", () => {
  it("combines every member's allergies and dislikes, de-duplicated and tidied", () => {
    const list = avoidListFor([
      member("1", { allergies: ["peanut", "Dairy"], dislikes: ["Bitter  gourd"] }),
      member("2", { allergies: ["dairy"], dislikes: ["bitter gourd", "x"] }),
    ]);
    expect(list).toEqual(["peanut", "dairy", "bitter gourd"]);
  });
});

describe("parseTermList and avoidLabel", () => {
  it("splits on commas, semicolons and new lines", () => {
    expect(parseTermList("Prawns, mushroom;  okra\nkale ,")).toEqual(["prawns", "mushroom", "okra", "kale"]);
  });
  it("shows preset keys as readable names and free text as typed", () => {
    expect(avoidLabel("tree_nut")).toBe("Tree nuts");
    expect(avoidLabel("okra")).toBe("okra");
  });
});

describe("against the real recipe list", () => {
  const hasIngredient = (r: (typeof RECIPES)[number], words: string[]) =>
    r.ingredients.some((i) => words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(i.name)));

  it("removes recipes whose ingredient list literally names the allergen", () => {
    const cases: [string, string[]][] = [
      ["peanut", ["peanuts?"]],
      ["dairy", ["paneer", "ghee", "yoghurt", "butter", "fresh cream"]],
      ["egg", ["eggs?"]],
      ["fish", ["fish"]],
    ];
    for (const [key, words] of cases) {
      const flagged = RECIPES.filter((r) => hasIngredient(r, words));
      expect(flagged.length, `expected some real recipes to name ${key}`).toBeGreaterThan(0);
      const kept = filterRecipes({ dietType: "nonveg", avoid: [key] }).map((r) => r.id);
      for (const r of flagged) expect(kept, `${r.id} should be excluded for ${key}`).not.toContain(r.id);
    }
  });

  it("does not drop eggplant dishes for an egg allergy", () => {
    const eggplant = RECIPES.filter((r) => hasIngredient(r, ["eggplant"]) && !hasIngredient(r, ["eggs?"]));
    expect(eggplant.length).toBeGreaterThan(0);
    const kept = filterRecipes({ dietType: "nonveg", avoid: ["egg"] }).map((r) => r.id);
    for (const r of eggplant) expect(kept).toContain(r.id);
  });
});
