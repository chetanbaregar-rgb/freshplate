import type { Member, Recipe } from "./types";

/**
 * Allergy / dislike matching. Recipes carry no allergen tags, so we match words in the
 * recipe's name, description, ingredients (with their search terms) and steps.
 * The matcher errs on the side of excluding: a false match drops a safe recipe, a miss
 * could serve an allergen.
 */

export type AllergenKey =
  | "peanut" | "tree_nut" | "dairy" | "egg" | "gluten"
  | "soy" | "sesame" | "fish" | "shellfish" | "mustard";

interface AllergenDef {
  label: string;
  keywords: string[];
  /** Phrases that contain a keyword but are not the allergen (e.g. "coconut milk" is not dairy). */
  notAllergen?: string[];
}

export const ALLERGENS: Record<AllergenKey, AllergenDef> = {
  peanut: { label: "Peanut", keywords: ["peanut", "groundnut", "moongphali"], notAllergen: [] },
  tree_nut: {
    label: "Tree nuts",
    keywords: ["almond", "cashew", "walnut", "pistachio", "hazelnut", "pecan", "badam", "kaju"],
  },
  dairy: {
    label: "Milk & dairy",
    keywords: [
      "milk", "paneer", "curd", "yoghurt", "yogurt", "dahi", "ghee", "butter", "cream",
      "cheese", "khoa", "mawa", "lassi", "buttermilk", "chaas",
    ],
    notAllergen: ["coconut milk", "coconut cream", "peanut butter", "cocoa butter"],
  },
  egg: { label: "Egg", keywords: ["egg", "anda", "omelette", "omelet"] },
  gluten: {
    label: "Gluten (wheat)",
    keywords: ["wheat", "atta", "maida", "semolina", "rava", "suji", "dalia", "bread", "roti", "pasta", "noodles", "barley"],
  },
  soy: { label: "Soy", keywords: ["soy", "soya", "tofu", "edamame"] },
  sesame: { label: "Sesame", keywords: ["sesame", "til", "gingelly"] },
  fish: { label: "Fish", keywords: ["fish", "surmai", "pomfret", "salmon", "tuna", "hilsa", "rohu"] },
  shellfish: { label: "Shellfish", keywords: ["prawn", "shrimp", "crab", "lobster", "squid"] },
  mustard: { label: "Mustard", keywords: ["mustard", "sarson"] },
};

export const ALLERGEN_KEYS = Object.keys(ALLERGENS) as AllergenKey[];

export function isAllergenKey(term: string): term is AllergenKey {
  return Object.prototype.hasOwnProperty.call(ALLERGENS, term);
}

/** Human-readable name for a stored allergy/dislike entry (preset key or free text). */
export function avoidLabel(term: string): string {
  return isAllergenKey(term) ? ALLERGENS[term].label : term;
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The word as typed plus its singular forms, so "mushrooms" also finds "mushroom". */
function wordForms(word: string): string[] {
  const forms = new Set([word]);
  if (word.endsWith("es") && word.length > 3) forms.add(word.slice(0, -2));
  if (word.endsWith("s") && word.length > 2) forms.add(word.slice(0, -1));
  return Array.from(forms);
}

/** Whole-word match, either number: "egg" matches "eggs" but not "eggplant". */
function containsWord(haystack: string, word: string): boolean {
  return wordForms(word).some((form) =>
    new RegExp(`(?<![\\p{L}])${escapeRegExp(form)}(?:s|es)?(?![\\p{L}])`, "u").test(haystack),
  );
}

function recipeText(recipe: Recipe): string {
  const parts = [recipe.name, recipe.description, ...recipe.steps];
  for (const ing of recipe.ingredients) {
    parts.push(ing.name, ing.searchTerms.zepto, ing.searchTerms.instamart);
  }
  return normalise(parts.join(" \n "));
}

/**
 * Returns the entries of `avoid` that the recipe conflicts with, in the order given.
 * Each entry is either a preset allergen key ("peanut") or free text typed by the user.
 */
export function findConflicts(recipe: Recipe, avoid: string[]): string[] {
  if (avoid.length === 0) return [];
  const text = recipeText(recipe);
  const hits: string[] = [];
  for (const raw of avoid) {
    const term = normalise(raw);
    if (term.length < 2) continue;
    let matched: boolean;
    if (isAllergenKey(term)) {
      const def = ALLERGENS[term];
      let scoped = text;
      for (const phrase of def.notAllergen ?? []) scoped = scoped.split(phrase).join(" ");
      matched = def.keywords.some((k) => containsWord(scoped, k));
    } else {
      matched = containsWord(text, term);
    }
    if (matched && !hits.includes(raw)) hits.push(raw);
  }
  return hits;
}

/**
 * Everything the household must avoid. Everyone eats the same plan, so one member's allergy
 * or dislike applies to every meal.
 */
export function avoidListFor(members: Pick<Member, "allergies" | "dislikes">[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of members) {
    for (const raw of [...(m.allergies ?? []), ...(m.dislikes ?? [])]) {
      const term = normalise(raw);
      if (term.length < 2 || seen.has(term)) continue;
      seen.add(term);
      out.push(term);
    }
  }
  return out;
}

/** Splits "prawns, mushroom" typed by a user into clean entries. */
export function parseTermList(input: string): string[] {
  return input
    .split(/[,\n;]/)
    .map(normalise)
    .filter((t) => t.length >= 2);
}
