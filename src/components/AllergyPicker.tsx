"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { ALLERGENS, ALLERGEN_KEYS, isAllergenKey, parseTermList } from "@/lib/allergens";
import { cn } from "@/lib/utils";

interface Props {
  allergies: string[];
  dislikes: string[];
  onChange: (value: { allergies: string[]; dislikes: string[] }) => void;
}

const inputClass =
  "w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400";

/** Allergy chips plus free-text boxes. Recipes containing any of these are never planned. */
export default function AllergyPicker({ allergies, dislikes, onChange }: Props) {
  const presets: string[] = allergies.filter(isAllergenKey);
  const [otherText, setOtherText] = useState(allergies.filter((a) => !isAllergenKey(a)).join(", "));
  const [dislikeText, setDislikeText] = useState(dislikes.join(", "));

  const emit = (nextPresets: string[], other: string, dis: string) =>
    onChange({ allergies: [...nextPresets, ...parseTermList(other)], dislikes: parseTermList(dis) });

  const toggle = (key: string) =>
    emit(presets.includes(key) ? presets.filter((p) => p !== key) : [...presets, key], otherText, dislikeText);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium mb-2">Allergies</p>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_KEYS.map((key) => {
            const on = presets.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(key)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                  on ? "border-red-300 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:border-gray-300",
                )}
              >
                {on && <Check className="w-3 h-3" />}
                {ALLERGENS[key].label}
              </button>
            );
          })}
        </div>
      </div>
      <input
        aria-label="Other allergies"
        placeholder="Other allergies, separated by commas"
        value={otherText}
        onChange={(e) => { setOtherText(e.target.value); emit(presets, e.target.value, dislikeText); }}
        className={inputClass}
      />
      <input
        aria-label="Foods to avoid"
        placeholder="Foods to avoid (dislikes), separated by commas"
        value={dislikeText}
        onChange={(e) => { setDislikeText(e.target.value); emit(presets, otherText, e.target.value); }}
        className={inputClass}
      />
      <p className="text-xs text-muted-foreground">
        We skip any recipe whose name, ingredients or steps mention these. Always check packaging too.
      </p>
    </div>
  );
}
