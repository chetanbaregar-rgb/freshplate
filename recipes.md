# FreshPlate Regional Recipe Library

Comprehensive Indian recipe knowledge base covering breakfast, lunch, snack, and dinner
for every major state and union territory across six culinary zones (North, West, South,
East, Central, Northeast). Portions are sized for a 2-person household.

## Format notes (read this before parsing)

This file is structured as **vector memory**: each recipe below is a self-contained,
independently retrievable chunk bounded by `---` horizontal rules. Every chunk carries
its own metadata block (state, zone, meal type, diet type, tags) and repeats enough
context (dish name, region) that it makes sense on its own if retrieved in isolation —
no chunk depends on reading the chunks around it. This makes the file suitable for
splitting into one-chunk-per-embedding for RAG-style retrieval later.

Total recipes: 128 (6 zones × states × 4 meal types)

---

# North Zone

## Aloo Paratha (Punjab · Breakfast)

```yaml
id: punjab_breakfast_aloo_paratha
state: Punjab
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [breakfast staple, comfort food, stuffed bread]
goal_tags: [maintenance, weight_gain]
```

Whole wheat flatbread stuffed with spiced mashed potatoes, pan-fried in ghee and served with curd and pickle.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 520 kcal · 12g protein · 78g carbs · 18g fat

### Ingredients
- Whole wheat flour — 300 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Potato — 3 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Green chili — 2 piece (spice) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Coriander leaves — 20 g (vegetable) _(optional)_ — zepto: "coriander leaves" · instamart: "dhania patta"
- Ajwain (carom seeds) — 0.5 tsp (spice) _(optional)_ — zepto: "carom seeds ajwain" · instamart: "ajwain"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Curd — 200 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Salt — 1 tsp (other) — zepto: "iodised salt" · instamart: "namak"

### Steps
1. Boil potatoes, peel and mash them well; mix in chopped onion, green chili, coriander, ajwain, chili powder and salt.
2. Knead the wheat flour with water into a soft dough and rest for 10 minutes.
3. Divide dough into balls, stuff each with the potato filling, seal and roll gently into a paratha.
4. Cook on a hot tawa, applying ghee on both sides until golden brown spots appear.
5. Serve hot with curd and pickle.

---

## Rajma Chawal (Punjab · Lunch)

```yaml
id: punjab_lunch_rajma_chawal
state: Punjab
region_zone: North
meal_type: lunch
diet_type: veg
tags: [comfort food, protein-rich, one-pot]
goal_tags: [maintenance]
```

Slow-cooked kidney beans in a spiced onion-tomato gravy served over steamed basmati rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 18g protein · 75g carbs · 10g fat

### Ingredients
- Rajma (kidney beans) — 200 g (protein) — zepto: "kidney beans rajma" · instamart: "rajma"
- Basmati rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 3 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Bay leaf — 1 piece (spice) _(optional)_ — zepto: "bay leaf tej patta" · instamart: "tej patta"
- Garam masala — 1 tsp (spice) — zepto: "garam masala" · instamart: "garam masala"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Oil — 2 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Soak rajma overnight, then pressure cook with salt until soft.
2. Heat oil, splutter cumin and bay leaf, add onions and sauté until golden.
3. Add ginger-garlic paste, tomatoes, and spices; cook until the masala releases oil.
4. Add the boiled rajma along with its stock, simmer for 15-20 minutes until thick and creamy.
5. Serve hot with steamed basmati rice.

---

## Amritsari Chole Kulcha (Punjab · Snack)

```yaml
id: punjab_snack_amritsari_chole_kulcha
state: Punjab
region_zone: North
meal_type: snack
diet_type: veg
tags: [street food, spicy, popular]
goal_tags: [maintenance]
```

Spicy chickpea curry served with soft leavened flatbread, a beloved Punjabi street-food snack.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 450 kcal · 14g protein · 68g carbs · 12g fat

### Ingredients
- Chickpeas (kabuli chana) — 200 g (protein) — zepto: "kabuli chana chickpeas" · instamart: "kabuli chana"
- Refined flour (maida) — 250 g (grain) — zepto: "refined flour maida" · instamart: "maida"
- Yogurt — 2 tbsp (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Baking powder — 0.5 tsp (other) _(optional)_ — zepto: "baking powder" · instamart: "baking powder"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Tea leaves — 1 tsp (spice) _(optional)_ — zepto: "loose tea leaves" · instamart: "chai patti"
- Chole masala — 1.5 tbsp (spice) — zepto: "chole masala" · instamart: "chole masala"
- Ginger — 1 inch (spice) _(optional)_ — zepto: "ginger" · instamart: "adrak"
- Butter — 1 tbsp (dairy) _(optional)_ — zepto: "butter" · instamart: "makhan"

### Steps
1. Soak chickpeas overnight and pressure cook with a tea bag (for dark colour) until soft.
2. Knead maida with yogurt, baking powder and water into a soft dough; rest for 2 hours.
3. Sauté onion, ginger and tomato with chole masala, then add the boiled chickpeas and simmer until thick.
4. Roll out dough into ovals and cook kulchas on a hot tawa or in a tandoor until puffed and charred.
5. Brush kulchas with butter and serve hot alongside the chole.

---

## Sarson da Saag with Makki di Roti (Punjab · Dinner)

```yaml
id: punjab_dinner_sarson_da_saag_with_makki_di_roti
state: Punjab
region_zone: North
meal_type: dinner
diet_type: veg
tags: [winter special, greens, traditional]
goal_tags: [maintenance]
```

Slow-cooked mustard and spinach greens mashed together, served with hand-rolled maize flatbread and a dollop of white butter.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 45 min · **Difficulty:** medium
**Nutrition (approx per serving):** 420 kcal · 11g protein · 52g carbs · 18g fat

### Ingredients
- Mustard greens (sarson) — 400 g (vegetable) — zepto: "mustard greens sarson saag" · instamart: "sarson saag"
- Spinach — 150 g (vegetable) _(optional)_ — zepto: "spinach palak" · instamart: "palak"
- Bathua leaves — 100 g (vegetable) _(optional)_ — zepto: "bathua leaves" · instamart: "bathua"
- Maize flour (makki atta) — 250 g (grain) — zepto: "maize flour makki atta" · instamart: "makki atta"
- Green chili — 2 piece (spice) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Maize flour (for binding saag) — 2 tbsp (grain) _(optional)_ — zepto: "maize flour makki atta" · instamart: "makki atta"
- White butter (makhan) — 2 tbsp (dairy) — zepto: "white butter makhan" · instamart: "makhan"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"

### Steps
1. Boil mustard greens, spinach and bathua together until soft, then blend coarsely.
2. Heat butter, sauté onion, ginger-garlic paste and green chili, then add the greens back in.
3. Stir in a little makki flour to thicken, simmer for 20 minutes, mashing occasionally.
4. Knead makki atta with warm water and pat into rotis; cook on a hot tawa with ghee until crisp.
5. Serve the saag hot topped with white butter alongside makki di roti.

---

## Bajra Khichdi (Haryana · Breakfast)

```yaml
id: haryana_breakfast_bajra_khichdi
state: Haryana
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [winter, one-pot, wholesome]
goal_tags: [maintenance]
```

A comforting one-pot pearl millet and moong dal khichdi tempered with cumin and ghee, a winter breakfast staple in Haryana.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 30 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 12g protein · 60g carbs · 10g fat

### Ingredients
- Bajra (pearl millet) — 150 g (grain) — zepto: "pearl millet bajra" · instamart: "bajra"
- Moong dal — 80 g (protein) — zepto: "yellow moong dal" · instamart: "moong dal"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Buttermilk (chaas) — 300 ml (dairy) — zepto: "buttermilk chaas" · instamart: "chaas"
- Salt — 1 tsp (other) — zepto: "iodised salt" · instamart: "namak"
- Green chili — 1 piece (spice) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"

### Steps
1. Wash and soak bajra and moong dal together for 30 minutes.
2. Pressure cook bajra, dal, turmeric and salt with water until soft and mushy.
3. Heat ghee in a small pan, splutter cumin seeds and green chili, and pour over the khichdi.
4. Serve hot with a glass of chilled buttermilk.

---

## Kadhi Pakora with Rice (Haryana · Lunch)

```yaml
id: haryana_lunch_kadhi_pakora_with_rice
state: Haryana
region_zone: North
meal_type: lunch
diet_type: veg
tags: [comfort food, tangy, curry]
goal_tags: [maintenance]
```

Tangy yogurt-gram flour curry studded with crisp onion fritters, served over steamed rice.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 460 kcal · 14g protein · 62g carbs · 16g fat

### Ingredients
- Yogurt — 400 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Gram flour (besan) — 100 g (grain) — zepto: "gram flour besan" · instamart: "besan"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Oil — 3 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Whisk yogurt with half the besan and water to make the kadhi base; set aside.
2. Make a thick batter with remaining besan, chopped onion and spices, and deep-fry small pakoras.
3. Heat oil, temper mustard seeds and curry leaves, add the kadhi base and simmer for 20 minutes, stirring often.
4. Drop the pakoras into the simmering kadhi 5 minutes before serving.
5. Serve hot over steamed rice.

---

## Churma Ladoo (Haryana · Snack)

```yaml
id: haryana_snack_churma_ladoo
state: Haryana
region_zone: North
meal_type: snack
diet_type: veg
tags: [sweet, festive, energy-rich]
goal_tags: [maintenance]
```

Sweet crumbled wheat-flour and jaggery ladoos rich with ghee, a festive Haryanvi treat.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 320 kcal · 5g protein · 40g carbs · 15g fat

### Ingredients
- Whole wheat flour — 200 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Ghee — 100 g (oil) — zepto: "ghee" · instamart: "desi ghee"
- Jaggery (gur) — 100 g (other) — zepto: "jaggery gur" · instamart: "gur"
- Cardamom powder — 0.5 tsp (spice) _(optional)_ — zepto: "cardamom powder elaichi" · instamart: "elaichi powder"
- Chopped almonds — 20 g (protein) _(optional)_ — zepto: "almonds badam" · instamart: "badam"
- Semolina (sooji) — 2 tbsp (grain) _(optional)_ — zepto: "semolina sooji" · instamart: "sooji"

### Steps
1. Knead wheat flour with a little ghee and water into a stiff dough, shape into small discs and deep-fry or bake until deep golden.
2. Once cooled, crumble/grind the discs coarsely.
3. Melt jaggery with a little ghee to a syrup, then mix into the crumbled flour along with cardamom and almonds.
4. Shape the warm mixture into small round ladoos while still pliable.

---

## Hara Dhania Cholia with Bajra Roti (Haryana · Dinner)

```yaml
id: haryana_dinner_hara_dhania_cholia_with_bajra_roti
state: Haryana
region_zone: North
meal_type: dinner
diet_type: veg
tags: [winter special, wholesome, rustic]
goal_tags: [maintenance]
```

Fresh green chickpeas simmered in a light coriander-spiced curry, paired with hand-pressed pearl millet flatbread.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 400 kcal · 14g protein · 55g carbs · 12g fat

### Ingredients
- Green chickpeas (hara cholia) — 250 g (vegetable) — zepto: "green chickpeas hara chana" · instamart: "hara cholia"
- Bajra flour — 200 g (grain) — zepto: "bajra flour" · instamart: "bajra atta"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Coriander leaves — 30 g (vegetable) — zepto: "coriander leaves" · instamart: "dhania patta"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Green chili — 2 piece (spice) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"

### Steps
1. Heat ghee, splutter cumin, then sauté onion and green chili until soft.
2. Add tomato and cook until mushy, then add the shelled green chickpeas with a splash of water.
3. Cover and simmer for 12-15 minutes until the chickpeas are tender; finish with chopped coriander.
4. Knead bajra flour with warm water, pat into rotis by hand and cook on a hot tawa until charred spots appear.
5. Serve the cholia curry hot with bajra roti and a dollop of ghee.

---

## Siddu (Himachal Pradesh · Breakfast)

```yaml
id: himachal_pradesh_breakfast_siddu
state: Himachal Pradesh
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [steamed, mountain food, hearty]
goal_tags: [maintenance]
```

Steamed wheat bread stuffed with a walnut-poppy seed filling, served hot with melted ghee, a Himachali mountain breakfast.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 350 kcal · 9g protein · 50g carbs · 13g fat

### Ingredients
- Whole wheat flour — 250 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Instant yeast — 1 tsp (other) _(optional)_ — zepto: "instant yeast" · instamart: "yeast"
- Walnuts — 50 g (protein) — zepto: "walnuts akhrot" · instamart: "akhrot"
- Poppy seeds (khuskhus) — 2 tbsp (spice) _(optional)_ — zepto: "poppy seeds khuskhus" · instamart: "khuskhus"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Sugar — 1 tsp (other) _(optional)_ — zepto: "sugar" · instamart: "cheeni"
- Salt — 0.5 tsp (other) — zepto: "iodised salt" · instamart: "namak"

### Steps
1. Knead wheat flour with yeast, sugar, salt and warm water into a soft dough; let it proof for an hour.
2. Grind walnuts and poppy seeds coarsely with a little sugar to make the filling.
3. Flatten dough balls, stuff with the walnut filling, and seal into round buns.
4. Steam the stuffed buns for 20-25 minutes until cooked through.
5. Serve hot, generously drizzled with melted ghee.

---

## Chana Madra (Himachal Pradesh · Lunch)

```yaml
id: himachal_pradesh_lunch_chana_madra
state: Himachal Pradesh
region_zone: North
meal_type: lunch
diet_type: veg
tags: [festive, curry, yogurt-based]
goal_tags: [maintenance]
```

Chickpeas simmered in a rich yogurt-based curry flavored with whole spices, a signature dish from Himachali Dham feasts.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 430 kcal · 16g protein · 48g carbs · 18g fat

### Ingredients
- Chickpeas — 200 g (protein) — zepto: "kabuli chana chickpeas" · instamart: "kabuli chana"
- Yogurt — 300 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Cloves — 4 piece (spice) _(optional)_ — zepto: "cloves laung" · instamart: "laung"
- Cinnamon stick — 1 piece (spice) _(optional)_ — zepto: "cinnamon stick dalchini" · instamart: "dalchini"
- Bay leaf — 1 piece (spice) _(optional)_ — zepto: "bay leaf tej patta" · instamart: "tej patta"
- Gram flour — 1 tbsp (grain) _(optional)_ — zepto: "gram flour besan" · instamart: "besan"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"

### Steps
1. Soak chickpeas overnight and pressure cook until soft; retain the boiled liquid.
2. Whisk yogurt with gram flour to prevent curdling.
3. Heat ghee, temper cloves, cinnamon and bay leaf, then add the yogurt mixture, stirring continuously on low heat.
4. Add the boiled chickpeas and chili powder, simmer for 20 minutes until the gravy thickens and turns glossy.
5. Serve hot with steamed rice.

---

## Babru (Himachal Pradesh · Snack)

```yaml
id: himachal_pradesh_snack_babru
state: Himachal Pradesh
region_zone: North
meal_type: snack
diet_type: veg
tags: [fried, snack, tea-time]
goal_tags: [maintenance]
```

Himachali stuffed poori filled with spiced black gram paste, deep-fried and enjoyed with tamarind chutney.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 300 kcal · 8g protein · 38g carbs · 13g fat

### Ingredients
- Urad dal (black gram) — 100 g (protein) — zepto: "urad dal split" · instamart: "urad dal"
- Whole wheat flour — 200 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Fennel seeds — 1 tsp (spice) _(optional)_ — zepto: "fennel seeds saunf" · instamart: "saunf"
- Asafoetida (hing) — 1 piece (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"
- Oil for frying — 300 ml (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"
- Tamarind chutney — 2 tbsp (other) _(optional)_ — zepto: "tamarind chutney" · instamart: "imli chutney"

### Steps
1. Soak urad dal for 3-4 hours, then grind coarsely with fennel seeds and hing to make the filling.
2. Knead wheat flour with water into a soft dough.
3. Flatten small dough balls, stuff with the dal filling, seal and roll gently into discs.
4. Deep-fry until golden and puffed on both sides.
5. Serve hot with tamarind chutney.

---

## Sepu Vadi (Himachal Pradesh · Dinner)

```yaml
id: himachal_pradesh_dinner_sepu_vadi
state: Himachal Pradesh
region_zone: North
meal_type: dinner
diet_type: veg
tags: [curry, lentil, home-style]
goal_tags: [maintenance]
```

Sun-dried lentil dumplings simmered in a spiced yogurt-tomato gravy, a hearty Himachali dinner curry served with rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 410 kcal · 15g protein · 50g carbs · 14g fat

### Ingredients
- Urad dal vadi (lentil dumplings) — 150 g (protein) — zepto: "urad dal vadi" · instamart: "vadi"
- Yogurt — 200 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"

### Steps
1. Lightly roast or fry the vadi pieces until golden, then set aside.
2. Heat ghee, sauté onion until golden, then add tomato and cook until soft.
3. Add turmeric and chili powder, then whisked yogurt, stirring continuously to avoid curdling.
4. Add the roasted vadi and a little water, simmer for 15 minutes until the gravy thickens.
5. Serve hot with steamed rice.

---

## Aloo ke Gutke with Poori (Uttarakhand · Breakfast)

```yaml
id: uttarakhand_breakfast_aloo_ke_gutke_with_poori
state: Uttarakhand
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [mountain food, spiced potatoes, fried bread]
goal_tags: [maintenance]
```

Pan-roasted spiced potatoes tempered with cumin and Himalayan herbs, served with deep-fried whole wheat poori.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 480 kcal · 9g protein · 65g carbs · 20g fat

### Ingredients
- Potato — 4 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Whole wheat flour — 200 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Oil for frying poori — 200 ml (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"
- Coriander leaves — 10 g (vegetable) _(optional)_ — zepto: "coriander leaves" · instamart: "dhania patta"

### Steps
1. Boil potatoes until just tender, peel and cut into cubes.
2. Heat mustard oil, splutter cumin seeds, add turmeric and chili powder, then toss in the potatoes.
3. Roast on medium-low heat until the potatoes develop a light crust; garnish with coriander.
4. Knead wheat flour into a stiff dough, roll into small discs, and deep-fry until puffed and golden.
5. Serve the gutke hot with the poori.

---

## Bhatt ki Churkani (Uttarakhand · Lunch)

```yaml
id: uttarakhand_lunch_bhatt_ki_churkani
state: Uttarakhand
region_zone: North
meal_type: lunch
diet_type: veg
tags: [protein-rich, Kumaoni, hearty]
goal_tags: [maintenance, muscle, recovery]
```

Black soybeans simmered in a roasted-gram-flour thickened curry, a wholesome Kumaoni lunch classic served with rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 400 kcal · 20g protein · 45g carbs · 12g fat

### Ingredients
- Bhatt (black soybean) — 200 g (protein) — zepto: "black soybean bhatt" · instamart: "bhatt dal"
- Gram flour — 2 tbsp (grain) _(optional)_ — zepto: "gram flour besan" · instamart: "besan"
- Garlic — 6 piece (spice) — zepto: "garlic" · instamart: "lehsun"
- Ginger — 1 inch (spice) _(optional)_ — zepto: "ginger" · instamart: "adrak"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"

### Steps
1. Soak bhatt overnight, then pressure cook with turmeric and salt until soft.
2. Dry roast gram flour lightly and mix with a little water to make a smooth slurry.
3. Heat mustard oil, sauté crushed garlic and ginger until fragrant.
4. Add the boiled bhatt along with the besan slurry, simmer for 15 minutes until the curry thickens.
5. Serve hot with steamed rice.

---

## Bal Mithai (Uttarakhand · Snack)

```yaml
id: uttarakhand_snack_bal_mithai
state: Uttarakhand
region_zone: North
meal_type: snack
diet_type: veg
tags: [sweet, festive, milk-based]
goal_tags: [maintenance, weight_loss]
```

Roasted khoya fudge coated in white sugar balls, the iconic sweet treat of Almora, Uttarakhand.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 280 kcal · 6g protein · 35g carbs · 12g fat

### Ingredients
- Khoya (mawa) — 250 g (dairy) — zepto: "khoya mawa" · instamart: "mawa"
- Sugar — 100 g (other) — zepto: "sugar" · instamart: "cheeni"
- Sugar balls (dragees) — 30 g (other) _(optional)_ — zepto: "sugar balls dragees" · instamart: "sugar balls"
- Cardamom powder — 0.5 tsp (spice) _(optional)_ — zepto: "cardamom powder elaichi" · instamart: "elaichi powder"
- Ghee — 1 tbsp (oil) _(optional)_ — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Roast khoya in a heavy pan on low heat until it turns light brown and fragrant, stirring continuously.
2. Add sugar and cardamom, continue cooking until the mixture thickens and leaves the sides of the pan.
3. Spread the mixture on a greased plate and let it cool slightly.
4. Cut into small squares and coat each piece generously with sugar balls before serving.

---

## Kafuli (Uttarakhand · Dinner)

```yaml
id: uttarakhand_dinner_kafuli
state: Uttarakhand
region_zone: North
meal_type: dinner
diet_type: veg
tags: [greens, light dinner, Garhwali]
goal_tags: [maintenance]
```

Garhwali-style pureed spinach and fenugreek leaves cooked with rice flour, served with steamed rice or roti.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 10g protein · 40g carbs · 10g fat

### Ingredients
- Spinach — 300 g (vegetable) — zepto: "spinach palak" · instamart: "palak"
- Fenugreek leaves (methi) — 100 g (vegetable) _(optional)_ — zepto: "fenugreek leaves methi" · instamart: "methi"
- Rice flour — 2 tbsp (grain) — zepto: "rice flour" · instamart: "chawal ka atta"
- Garlic — 4 piece (spice) — zepto: "garlic" · instamart: "lehsun"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"

### Steps
1. Boil spinach and fenugreek leaves together until wilted, then blend to a coarse puree.
2. Mix rice flour with a little water to make a smooth slurry.
3. Heat ghee, splutter cumin and crushed garlic, then add the pureed greens.
4. Stir in the rice flour slurry and simmer for 10 minutes until the curry thickens.
5. Serve hot with steamed rice or roti.

---

## Chole Bhature (Delhi · Breakfast)

```yaml
id: delhi_breakfast_chole_bhature
state: Delhi
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [street food, indulgent, popular]
goal_tags: [maintenance, weight_gain]
```

Spicy chickpea curry paired with fluffy deep-fried leavened bread, Delhi's ultimate weekend breakfast indulgence.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 550 kcal · 16g protein · 75g carbs · 22g fat

### Ingredients
- Chickpeas — 200 g (protein) — zepto: "kabuli chana chickpeas" · instamart: "kabuli chana"
- Refined flour (maida) — 250 g (grain) — zepto: "refined flour maida" · instamart: "maida"
- Yogurt — 2 tbsp (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Chole masala — 1.5 tbsp (spice) — zepto: "chole masala" · instamart: "chole masala"
- Baking soda — 0.5 tsp (other) _(optional)_ — zepto: "baking soda" · instamart: "baking soda"
- Oil for frying — 300 ml (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Soak chickpeas overnight, then pressure cook with a pinch of baking soda until soft.
2. Knead maida with yogurt, a pinch of baking soda and water into a soft dough; rest for 2 hours.
3. Sauté onion and tomato with chole masala, add the boiled chickpeas and simmer until thick.
4. Roll dough into ovals and deep-fry until puffed and golden to make bhature.
5. Serve the chole hot with freshly fried bhature.

---

## Kadai Paneer (Delhi · Lunch)

```yaml
id: delhi_lunch_kadai_paneer
state: Delhi
region_zone: North
meal_type: lunch
diet_type: veg
tags: [restaurant-style, spicy, quick]
goal_tags: [maintenance]
```

Cottage cheese and bell peppers tossed in a coarsely ground spice-tomato masala, a Delhi restaurant-style lunch favorite with tandoori roti.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 420 kcal · 18g protein · 30g carbs · 24g fat

### Ingredients
- Paneer — 250 g (dairy) — zepto: "paneer fresh" · instamart: "paneer"
- Capsicum (bell pepper) — 2 medium (vegetable) — zepto: "capsicum green" · instamart: "shimla mirch"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 3 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Kadai masala — 1.5 tbsp (spice) — zepto: "kadai masala" · instamart: "kadai masala"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Whole wheat flour — 150 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Oil — 2 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Coarsely grind kadai masala with dry red chilies for a rustic texture.
2. Heat oil, sauté onion and ginger-garlic paste, then add tomato and cook until soft.
3. Add the ground kadai masala, capsicum and paneer cubes, tossing well for 5-7 minutes.
4. Knead wheat flour into a dough and roll into rotis; cook on a hot tawa or tandoor until charred.
5. Serve the kadai paneer hot with tandoori roti.

---

## Aloo Tikki Chaat (Delhi · Snack)

```yaml
id: delhi_snack_aloo_tikki_chaat
state: Delhi
region_zone: North
meal_type: snack
diet_type: veg
tags: [street food, chaat, tangy]
goal_tags: [maintenance]
```

Crisp shallow-fried potato patties topped with tangy tamarind and mint chutneys, yogurt, and crunchy sev.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 350 kcal · 7g protein · 48g carbs · 14g fat

### Ingredients
- Potato — 4 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Cornflour — 2 tbsp (grain) _(optional)_ — zepto: "cornflour" · instamart: "cornflour"
- Green chili — 1 piece (spice) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Tamarind chutney — 2 tbsp (other) — zepto: "tamarind chutney" · instamart: "imli chutney"
- Mint-coriander chutney — 2 tbsp (vegetable) — zepto: "mint coriander chutney" · instamart: "hari chutney"
- Yogurt — 100 g (dairy) _(optional)_ — zepto: "curd fresh" · instamart: "dahi"
- Sev — 30 g (other) _(optional)_ — zepto: "sev namkeen" · instamart: "sev"
- Oil for shallow fry — 4 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Boil potatoes, mash and mix with cornflour, chopped green chili and salt; shape into flat patties.
2. Shallow fry the patties on a griddle until golden and crisp on both sides.
3. Arrange the tikkis on a plate and top with whisked yogurt, tamarind chutney and mint chutney.
4. Sprinkle with sev and serve immediately.

---

## Butter Chicken (Delhi · Dinner)

```yaml
id: delhi_dinner_butter_chicken
state: Delhi
region_zone: North
meal_type: dinner
diet_type: nonveg
tags: [rich, iconic, restaurant-style]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Tandoori-roasted chicken simmered in a velvety tomato-cashew gravy finished with butter and cream, served with naan.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 520 kcal · 32g protein · 20g carbs · 32g fat

### Ingredients
- Chicken (boneless) — 400 g (protein) — zepto: "boneless chicken" · instamart: "chicken boneless"
- Yogurt — 100 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Butter — 3 tbsp (dairy) — zepto: "butter" · instamart: "makhan"
- Tomato puree — 300 g (vegetable) — zepto: "tomato puree" · instamart: "tamatar puree"
- Cashew nuts — 20 g (protein) _(optional)_ — zepto: "cashew nuts kaju" · instamart: "kaju"
- Fresh cream — 3 tbsp (dairy) — zepto: "fresh cream" · instamart: "malai cream"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Kasuri methi — 1 tsp (spice) _(optional)_ — zepto: "kasuri methi dried fenugreek" · instamart: "kasuri methi"
- Naan — 4 piece (grain) — zepto: "naan bread" · instamart: "naan"

### Steps
1. Marinate chicken with yogurt, ginger-garlic paste and spices for at least 1 hour; grill or pan-roast until charred at the edges.
2. Simmer tomato puree with cashews until soft, then blend into a smooth paste.
3. Heat butter, add the tomato-cashew paste and simmer for 10 minutes.
4. Add the roasted chicken, cream and crushed kasuri methi, simmering for another 10 minutes.
5. Serve hot with butter-brushed naan.

---

## Noon Chai with Kulcha (Jammu & Kashmir · Breakfast)

```yaml
id: jammu_kashmir_breakfast_noon_chai_with_kulcha
state: Jammu & Kashmir
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [traditional, beverage, Kashmiri]
goal_tags: [maintenance]
```

Traditional Kashmiri pink salted tea simmered with baking soda and milk, sipped with crisp sesame-topped kulcha bread.

**Serves:** 2 · **Prep:** 5 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 300 kcal · 7g protein · 42g carbs · 11g fat

### Ingredients
- Kashmiri green tea leaves — 2 tbsp (other) — zepto: "kashmiri green tea leaves" · instamart: "kashmiri chai patti"
- Baking soda — 1 piece (other) _(optional)_ — zepto: "baking soda" · instamart: "baking soda"
- Milk — 300 ml (dairy) — zepto: "full cream milk" · instamart: "doodh"
- Salt — 1 piece (other) _(optional)_ — zepto: "iodised salt" · instamart: "namak"
- Kulcha bread — 4 piece (grain) — zepto: "kulcha bread" · instamart: "kulcha"
- Sesame seeds — 1 tsp (spice) _(optional)_ — zepto: "sesame seeds til" · instamart: "til"
- Chopped almonds — 10 g (protein) _(optional)_ — zepto: "almonds badam" · instamart: "badam"

### Steps
1. Boil the tea leaves with water and a pinch of baking soda, whisking vigorously until the liquid turns deep pink.
2. Add milk and a pinch of salt, simmering gently for 10 minutes.
3. Strain into cups and garnish with crushed almonds.
4. Warm the sesame-topped kulcha and serve alongside the hot noon chai.

---

## Kashmiri Dum Aloo (Jammu & Kashmir · Lunch)

```yaml
id: jammu_kashmir_lunch_kashmiri_dum_aloo
state: Jammu & Kashmir
region_zone: North
meal_type: lunch
diet_type: veg
tags: [Kashmiri, vegetarian, curry]
goal_tags: [maintenance]
```

Baby potatoes slow-cooked in a fragrant yogurt-fennel gravy tinged red with Kashmiri chili, served with steamed rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 400 kcal · 8g protein · 55g carbs · 16g fat

### Ingredients
- Baby potatoes — 400 g (vegetable) — zepto: "baby potatoes" · instamart: "chote aloo"
- Yogurt — 200 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Kashmiri red chili powder — 1.5 tbsp (spice) — zepto: "kashmiri red chilli powder" · instamart: "kashmiri lal mirch"
- Fennel powder (saunf) — 1 tbsp (spice) — zepto: "fennel powder saunf" · instamart: "saunf powder"
- Dry ginger powder (saunth) — 0.5 tsp (spice) _(optional)_ — zepto: "dry ginger powder saunth" · instamart: "saunth"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"
- Asafoetida (hing) — 1 piece (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"

### Steps
1. Boil baby potatoes until just tender, peel and prick them lightly with a fork; shallow-fry until golden.
2. Whisk yogurt with Kashmiri chili powder, fennel powder and dry ginger powder.
3. Heat mustard oil, add a pinch of hing, then pour in the yogurt-spice mixture, stirring continuously.
4. Add the fried potatoes and a little water, cover and simmer on low heat for 15 minutes.
5. Serve hot with steamed rice.

---

## Nadru Monje (Jammu & Kashmir · Snack)

```yaml
id: jammu_kashmir_snack_nadru_monje
state: Jammu & Kashmir
region_zone: North
meal_type: snack
diet_type: veg
tags: [fried, crunchy, tea-time]
goal_tags: [maintenance, weight_loss]
```

Crunchy lotus stem slices coated in spiced gram flour batter and fried golden, a favorite Kashmiri teatime snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 280 kcal · 6g protein · 32g carbs · 14g fat

### Ingredients
- Lotus stem (nadru) — 250 g (vegetable) — zepto: "lotus stem" · instamart: "nadru"
- Gram flour (besan) — 100 g (grain) — zepto: "gram flour besan" · instamart: "besan"
- Red chili powder — 1 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Fennel powder — 0.5 tsp (spice) _(optional)_ — zepto: "fennel powder saunf" · instamart: "saunf powder"
- Carom seeds (ajwain) — 0.5 tsp (spice) _(optional)_ — zepto: "carom seeds ajwain" · instamart: "ajwain"
- Oil for frying — 200 ml (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Peel and slice the lotus stem into thin rounds; parboil briefly and pat dry.
2. Make a thick batter with besan, chili powder, fennel powder, ajwain, salt and water.
3. Dip the lotus stem slices into the batter and deep-fry until golden and crisp.
4. Drain on paper towels and serve hot with chutney or ketchup.

---

## Rogan Josh (Jammu & Kashmir · Dinner)

```yaml
id: jammu_kashmir_dinner_rogan_josh
state: Jammu & Kashmir
region_zone: North
meal_type: dinner
diet_type: nonveg
tags: [iconic, slow-cooked, festive]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Tender mutton braised in a deep red Kashmiri chili and yogurt gravy fragrant with fennel and dry ginger, served with steamed rice.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 60 min · **Difficulty:** hard
**Nutrition (approx per serving):** 500 kcal · 34g protein · 15g carbs · 30g fat

### Ingredients
- Mutton (bone-in) — 500 g (protein) — zepto: "mutton bone-in" · instamart: "mutton"
- Yogurt — 200 g (dairy) — zepto: "curd fresh" · instamart: "dahi"
- Kashmiri red chili powder — 2 tbsp (spice) — zepto: "kashmiri red chilli powder" · instamart: "kashmiri lal mirch"
- Fennel powder — 1 tbsp (spice) — zepto: "fennel powder saunf" · instamart: "saunf powder"
- Dry ginger powder (saunth) — 1 tsp (spice) _(optional)_ — zepto: "dry ginger powder saunth" · instamart: "saunth"
- Mustard oil — 4 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Bay leaf — 2 piece (spice) _(optional)_ — zepto: "bay leaf tej patta" · instamart: "tej patta"
- Rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"

### Steps
1. Heat mustard oil until smoking, then let it cool slightly; sear the mutton pieces with bay leaf until browned.
2. Whisk yogurt with Kashmiri chili powder, fennel powder and dry ginger powder.
3. Lower the heat, add the yogurt-spice mixture to the mutton, stirring continuously to prevent curdling.
4. Add water, cover and simmer on low heat for 45-50 minutes until the mutton is fork-tender and the gravy turns deep red.
5. Serve hot with steamed rice.

---

## Gur Gur Cha with Khambir (Ladakh · Breakfast)

```yaml
id: ladakh_breakfast_gur_gur_cha_with_khambir
state: Ladakh
region_zone: North
meal_type: breakfast
diet_type: veg
tags: [Himalayan, traditional, warming]
goal_tags: [maintenance]
```

Churned butter tea seasoned with salt, sipped with fresh Ladakhi fermented barley bread, a warming Himalayan breakfast.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 7g protein · 45g carbs · 12g fat

### Ingredients
- Brick/butter tea leaves — 2 tbsp (other) — zepto: "loose tea leaves" · instamart: "chai patti"
- Butter — 2 tbsp (dairy) — zepto: "butter" · instamart: "makhan"
- Salt — 1 piece (other) _(optional)_ — zepto: "iodised salt" · instamart: "namak"
- Milk — 100 ml (dairy) _(optional)_ — zepto: "full cream milk" · instamart: "doodh"
- Barley flour — 200 g (grain) — zepto: "barley flour" · instamart: "jau atta"
- Yeast/sourdough starter — 1 tsp (other) _(optional)_ — zepto: "instant yeast" · instamart: "yeast"

### Steps
1. Boil the tea leaves in water for 10 minutes until strong and dark.
2. Churn the tea with butter, milk and a pinch of salt until frothy and well blended.
3. Knead barley flour with yeast and warm water into a soft dough, let it ferment for a few hours.
4. Shape into small rounds and bake or pan-cook until lightly browned on both sides.
5. Serve the khambir warm alongside a cup of gur gur cha.

---

## Chicken Thukpa (Ladakh · Lunch)

```yaml
id: ladakh_lunch_chicken_thukpa
state: Ladakh
region_zone: North
meal_type: lunch
diet_type: nonveg
tags: [soup, noodles, Himalayan]
goal_tags: [maintenance, muscle, recovery]
```

Hearty hand-pulled noodle soup loaded with vegetables, shredded chicken and warming spices, a staple Ladakhi lunch bowl.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 22g protein · 45g carbs · 10g fat

### Ingredients
- Wheat noodles — 150 g (grain) — zepto: "hakka noodles wheat" · instamart: "noodles"
- Chicken (boneless) — 200 g (protein) — zepto: "boneless chicken" · instamart: "chicken boneless"
- Carrot — 1 medium (vegetable) — zepto: "carrot" · instamart: "gajar"
- Cabbage — 100 g (vegetable) — zepto: "cabbage" · instamart: "patta gobi"
- Spring onion — 2 piece (vegetable) _(optional)_ — zepto: "spring onion" · instamart: "hara pyaz"
- Garlic — 4 piece (spice) — zepto: "garlic" · instamart: "lehsun"
- Ginger — 1 inch (spice) _(optional)_ — zepto: "ginger" · instamart: "adrak"
- Soy sauce — 1 tbsp (other) _(optional)_ — zepto: "soy sauce" · instamart: "soy sauce"
- Oil — 1 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"

### Steps
1. Boil the noodles until just cooked, drain and set aside.
2. Heat oil, sauté garlic and ginger, then add sliced chicken and cook until browned.
3. Add carrot and cabbage, stir-fry briefly, then pour in water or stock and bring to a boil.
4. Season with soy sauce and salt, simmer for 10 minutes until the chicken is cooked through.
5. Add the boiled noodles to the broth, garnish with spring onion, and serve hot.

---

## Vegetable Momos (Ladakh · Snack)

```yaml
id: ladakh_snack_vegetable_momos
state: Ladakh
region_zone: North
meal_type: snack
diet_type: veg
tags: [steamed, dumplings, popular]
goal_tags: [maintenance]
```

Steamed dumplings filled with finely chopped vegetables, served with a fiery tomato-chili dip, Ladakh's favorite snack.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 300 kcal · 9g protein · 45g carbs · 8g fat

### Ingredients
- Refined flour (maida) — 200 g (grain) — zepto: "refined flour maida" · instamart: "maida"
- Cabbage — 150 g (vegetable) — zepto: "cabbage" · instamart: "patta gobi"
- Carrot — 1 medium (vegetable) — zepto: "carrot" · instamart: "gajar"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Garlic — 3 piece (spice) — zepto: "garlic" · instamart: "lehsun"
- Soy sauce — 1 tsp (other) _(optional)_ — zepto: "soy sauce" · instamart: "soy sauce"
- Oil — 1 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"
- Tomato — 3 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"

### Steps
1. Knead maida with water and a little oil into a smooth, firm dough; rest for 20 minutes.
2. Finely chop cabbage, carrot and onion, sauté briefly with garlic, soy sauce and salt to make the filling.
3. Roll small dough discs, place a spoonful of filling in the center and pleat to seal into momo shapes.
4. Steam the momos for 10-12 minutes until the wrappers turn translucent.
5. Blend tomatoes with dried red chilies and salt to make a spicy dip, and serve alongside.

---

## Skyu (Ladakh · Dinner)

```yaml
id: ladakh_dinner_skyu
state: Ladakh
region_zone: North
meal_type: dinner
diet_type: veg
tags: [one-pot, Himalayan, wholesome]
goal_tags: [maintenance]
```

Thumb-shaped pasta simmered with root vegetables in a light broth, a traditional one-pot Ladakhi dinner stew.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 350 kcal · 10g protein · 55g carbs · 8g fat

### Ingredients
- Whole wheat flour — 250 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Potato — 2 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Carrot — 1 medium (vegetable) — zepto: "carrot" · instamart: "gajar"
- Turnip — 1 medium (vegetable) _(optional)_ — zepto: "turnip" · instamart: "shalgam"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Garlic — 3 piece (spice) — zepto: "garlic" · instamart: "lehsun"
- Oil — 1 tbsp (oil) — zepto: "refined sunflower oil" · instamart: "khana pakane ka tel"
- Salt — 1 tsp (other) — zepto: "iodised salt" · instamart: "namak"

### Steps
1. Knead wheat flour with water into a firm dough; pinch off small pieces and shape into thumb-sized flattened discs.
2. Heat oil, sauté onion and garlic until fragrant, then add chopped potato, carrot and turnip.
3. Add water to make a broth, bring to a boil and season with salt.
4. Drop in the pasta pieces and simmer for 15-20 minutes until the vegetables and dough are cooked through and the stew thickens slightly.
5. Serve hot in bowls as a complete one-pot meal.

---

# West Zone

## Bajre ki Roti with Lehsun Chutney (Rajasthan · Breakfast)

```yaml
id: rajasthan_breakfast_bajre_ki_roti_with_lehsun_chutney
state: Rajasthan
region_zone: West
meal_type: breakfast
diet_type: veg
tags: [rustic, gluten-free, winter, traditional]
goal_tags: [maintenance]
```

A rustic pearl-millet flatbread served with a fiery garlic chutney and chilled buttermilk, a staple rural Rajasthani breakfast.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 8g protein · 55g carbs · 8g fat

### Ingredients
- Bajra flour — 200 g (grain) — zepto: "bajra flour" · instamart: "bajra atta"
- Garlic — 8 piece (vegetable) — zepto: "garlic" · instamart: "lehsun"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds" · instamart: "jeera"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Buttermilk — 400 ml (dairy) _(optional)_ — zepto: "buttermilk" · instamart: "chaas"

### Steps
1. Knead bajra flour with warm water and a pinch of salt into a firm dough; divide into 4 balls.
2. Pat or roll each ball between plastic sheets into thick rotis, as bajra dough is fragile.
3. Cook each roti on a hot tawa, flipping and pressing until golden brown spots appear; smear with ghee.
4. Pound garlic, green chili, cumin and salt together into a coarse chutney using a mortar and pestle.
5. Serve the hot bajra rotis with lehsun chutney and a glass of chilled buttermilk.

---

## Dal Baati Churma (Rajasthan · Lunch)

```yaml
id: rajasthan_lunch_dal_baati_churma
state: Rajasthan
region_zone: West
meal_type: lunch
diet_type: veg
tags: [festive, traditional, hearty, ghee-rich]
goal_tags: [maintenance, weight_gain]
```

Rajasthan's signature lunch of baked wheat dumplings dunked in ghee, served with spiced lentils and sweet crumbled churma.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 45 min · **Difficulty:** hard
**Nutrition (approx per serving):** 650 kcal · 16g protein · 80g carbs · 26g fat

### Ingredients
- Whole wheat flour — 300 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Semolina — 2 tbsp (grain) _(optional)_ — zepto: "semolina sooji" · instamart: "sooji"
- Ghee — 100 g (oil) — zepto: "ghee" · instamart: "desi ghee"
- Mixed lentils — 150 g (protein) — zepto: "mixed dal" · instamart: "mix dal"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Onion — 1 medium (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Red chili powder — 1 tsp (spice) _(optional)_ — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Jaggery — 100 g (other) — zepto: "jaggery gur" · instamart: "gud"
- Baking soda — 1 tsp (other) _(optional)_ — zepto: "baking soda" · instamart: "cooking soda"

### Steps
1. Knead wheat flour with semolina, a pinch of baking soda and melted ghee into a stiff dough; shape into round baatis.
2. Bake the baatis until hard and golden on the outside, then dunk each one in melted ghee.
3. Pressure cook the mixed lentils with turmeric until soft, then temper with onion, tomato and spices to make the dal.
4. Crumble a few baatis and mix with ghee and jaggery to prepare the sweet churma.
5. Serve hot baatis dunked in ghee alongside the dal and a portion of churma.

---

## Pyaaz Kachori (Rajasthan · Snack)

```yaml
id: rajasthan_snack_pyaaz_kachori
state: Rajasthan
region_zone: West
meal_type: snack
diet_type: veg
tags: [fried, spicy, street-food, festive]
goal_tags: [maintenance, weight_loss]
```

A Jodhpur specialty of crisp deep-fried pastry stuffed with a spiced onion filling, popular as a teatime snack.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 280 kcal · 6g protein · 32g carbs · 15g fat

### Ingredients
- All-purpose flour — 200 g (grain) — zepto: "maida flour" · instamart: "maida"
- Onion — 2 large (vegetable) — zepto: "onion" · instamart: "pyaz"
- Fennel seeds — 1 tsp (spice) _(optional)_ — zepto: "fennel seeds" · instamart: "saunf"
- Coriander powder — 1 tsp (spice) _(optional)_ — zepto: "coriander powder" · instamart: "dhaniya powder"
- Red chili powder — 1 tsp (spice) _(optional)_ — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Asafoetida — 1 tsp (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"
- Oil for deep frying — 300 ml (oil) — zepto: "sunflower oil" · instamart: "tel"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"

### Steps
1. Make a stiff dough with maida, a little salt and melted ghee (moyan); rest for 20 minutes.
2. Sauté finely chopped onion with fennel, coriander powder, chili powder, hing and salt until the mixture is dry.
3. Roll small dough balls into discs, stuff with the onion filling, and seal into round kachoris.
4. Deep fry on medium-low heat until crisp and golden brown on all sides.
5. Serve hot with tamarind or mint chutney.

---

## Laal Maas (Rajasthan · Dinner)

```yaml
id: rajasthan_dinner_laal_maas
state: Rajasthan
region_zone: West
meal_type: dinner
diet_type: nonveg
tags: [spicy, mutton, festive, rich]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A fiery Rajasthani mutton curry simmered in a deep red gravy of dried chilies, garlic and yogurt.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 50 min · **Difficulty:** medium
**Nutrition (approx per serving):** 420 kcal · 32g protein · 10g carbs · 26g fat

### Ingredients
- Mutton — 500 g (protein) — zepto: "mutton goat meat" · instamart: "mutton"
- Curd — 150 g (dairy) — zepto: "curd yogurt" · instamart: "dahi"
- Dried red chili — 10 piece (spice) — zepto: "kashmiri red chilli" · instamart: "sukhi lal mirch"
- Garlic paste — 2 tbsp (vegetable) — zepto: "garlic paste" · instamart: "lehsun paste"
- Ginger paste — 1 tbsp (vegetable) _(optional)_ — zepto: "ginger paste" · instamart: "adrak paste"
- Onion — 2 large (vegetable) — zepto: "onion" · instamart: "pyaz"
- Mustard oil — 4 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson tel"
- Whole garam masala — 1 tsp (spice) _(optional)_ — zepto: "whole garam masala" · instamart: "sabut garam masala"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"

### Steps
1. Marinate mutton pieces in curd and salt for at least an hour.
2. Soak the dried red chilies and grind into a fine paste with garlic paste.
3. Heat mustard oil, temper the whole garam masala, then sauté sliced onions until golden brown.
4. Add the red chili paste and cook until oil separates, then add marinated mutton and sear well.
5. Add water, cover and slow-cook until the mutton is tender and the gravy turns deep red and thick.
6. Serve hot with bajra roti or steamed rice.

---

## Methi Thepla (Gujarat · Breakfast)

```yaml
id: gujarat_breakfast_methi_thepla
state: Gujarat
region_zone: West
meal_type: breakfast
diet_type: veg
tags: [quick, travel-friendly, everyday, fiber-rich]
goal_tags: [maintenance, weight_loss]
```

A soft spiced flatbread made with fenugreek leaves and whole wheat, a quick everyday Gujarati breakfast.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 6g protein · 40g carbs · 9g fat

### Ingredients
- Whole wheat flour — 200 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Fresh fenugreek leaves — 1 piece (vegetable) — zepto: "fenugreek leaves methi" · instamart: "methi"
- Besan — 2 tbsp (grain) _(optional)_ — zepto: "gram flour besan" · instamart: "besan"
- Curd — 2 tbsp (dairy) _(optional)_ — zepto: "curd yogurt" · instamart: "dahi"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Red chili powder — 1 tsp (spice) _(optional)_ — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Carom seeds — 1 tsp (spice) _(optional)_ — zepto: "carom seeds ajwain" · instamart: "ajwain"
- Oil — 3 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"

### Steps
1. Mix wheat flour, besan, chopped methi leaves, curd, turmeric, chili powder, ajwain, salt and a little oil into a soft dough.
2. Rest the dough for 10 minutes, then divide into small balls.
3. Roll each ball into a thin round and cook on a hot tawa with a little oil until golden brown spots form on both sides.
4. Serve hot theplas with curd, pickle or chundo.

---

## Undhiyu (Gujarat · Lunch)

```yaml
id: gujarat_lunch_undhiyu
state: Gujarat
region_zone: West
meal_type: lunch
diet_type: veg
tags: [winter, festive, mixed-vegetable, traditional]
goal_tags: [maintenance]
```

A slow-cooked winter medley of mixed vegetables and fenugreek dumplings in a coconut-spice masala, Gujarat's most celebrated lunch dish.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 45 min · **Difficulty:** medium
**Nutrition (approx per serving):** 380 kcal · 10g protein · 42g carbs · 18g fat

### Ingredients
- Baby potato — 200 g (vegetable) — zepto: "baby potato" · instamart: "chota aloo"
- Sweet potato — 150 g (vegetable) _(optional)_ — zepto: "sweet potato" · instamart: "shakarkand"
- Flat beans (papdi) — 150 g (vegetable) — zepto: "flat beans papdi" · instamart: "papdi"
- Small brinjal — 4 piece (vegetable) — zepto: "small brinjal" · instamart: "baingan"
- Raw banana — 1 piece (vegetable) _(optional)_ — zepto: "raw banana" · instamart: "kaccha kela"
- Grated coconut — 3 tbsp (other) — zepto: "grated coconut" · instamart: "nariyal"
- Besan — 3 tbsp (grain) _(optional)_ — zepto: "gram flour besan" · instamart: "besan"
- Ginger-garlic-green chili paste — 2 tbsp (vegetable) _(optional)_ — zepto: "ginger garlic green chilli paste" · instamart: "adrak lehsun hari mirch paste"
- Oil — 4 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"
- Undhiyu masala — 2 tbsp (spice) _(optional)_ — zepto: "undhiyu masala" · instamart: "undhiyu masala"

### Steps
1. Prepare small besan-fenugreek muthia dumplings and lightly fry or steam them.
2. Make a stuffing paste of grated coconut, coriander, ginger-garlic-green chili paste and undhiyu masala; stuff into slit baby potatoes, brinjals and banana.
3. Heat oil in a heavy pot, add the stuffed vegetables along with papdi and sweet potato, and toss well.
4. Add the remaining masala, cover and slow-cook on low heat until all vegetables are tender.
5. Fold in the fried muthias in the last few minutes and mix gently.
6. Serve hot with puri or rotli.

---

## Dhokla (Gujarat · Snack)

```yaml
id: gujarat_snack_dhokla
state: Gujarat
region_zone: West
meal_type: snack
diet_type: veg
tags: [steamed, tangy, light, festive]
goal_tags: [maintenance, weight_loss]
```

A light, tangy steamed gram-flour cake tempered with mustard seeds and curry leaves, Gujarat's best-known snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 180 kcal · 7g protein · 28g carbs · 5g fat

### Ingredients
- Besan — 200 g (grain) — zepto: "gram flour besan" · instamart: "besan"
- Curd — 100 g (dairy) — zepto: "curd yogurt" · instamart: "dahi"
- Eno fruit salt — 1 tsp (other) — zepto: "eno fruit salt" · instamart: "eno"
- Turmeric powder — 1 tsp (spice) _(optional)_ — zepto: "turmeric powder" · instamart: "haldi"
- Green chili — 1 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Sugar — 2 tbsp (other) _(optional)_ — zepto: "sugar" · instamart: "chini"
- Oil — 2 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"

### Steps
1. Whisk besan with curd, turmeric, green chili paste, salt and water into a smooth, lump-free batter.
2. Just before steaming, add eno fruit salt and mix gently until the batter turns frothy.
3. Pour into a greased plate and steam for 15-18 minutes until a toothpick comes out clean.
4. Heat oil, crackle mustard seeds and curry leaves, then add a little water and sugar to make a thin tempering syrup.
5. Cut the steamed dhokla into squares and pour the tempering evenly over it.
6. Garnish with coriander and grated coconut, and serve with green chutney.

---

## Gujarati Kadhi Khichdi (Gujarat · Dinner)

```yaml
id: gujarat_dinner_gujarati_kadhi_khichdi
state: Gujarat
region_zone: West
meal_type: dinner
diet_type: veg
tags: [comfort-food, everyday, mild, digestive]
goal_tags: [maintenance]
```

A comforting weeknight combo of soft moong dal khichdi with a tangy, lightly sweet yogurt-besan kadhi.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** easy
**Nutrition (approx per serving):** 340 kcal · 11g protein · 50g carbs · 9g fat

### Ingredients
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"
- Moong dal — 100 g (protein) — zepto: "moong dal" · instamart: "moong dal"
- Curd — 300 ml (dairy) — zepto: "curd yogurt" · instamart: "dahi"
- Besan — 2 tbsp (grain) — zepto: "gram flour besan" · instamart: "besan"
- Ginger-green chili paste — 1 tsp (vegetable) _(optional)_ — zepto: "ginger green chilli paste" · instamart: "adrak hari mirch paste"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Jaggery — 1 tbsp (other) _(optional)_ — zepto: "jaggery gur" · instamart: "gud"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Wash and pressure cook rice and moong dal together with turmeric and salt until soft and mushy to make khichdi.
2. Whisk curd with besan and water until smooth, then bring to a gentle boil, stirring continuously to make the kadhi base.
3. Add ginger-green chili paste, jaggery and salt to the kadhi and simmer for 10 minutes.
4. Temper with ghee, mustard seeds and curry leaves, then pour over the kadhi.
5. Serve hot khichdi with a generous ladle of kadhi and a dollop of ghee on top.

---

## Kanda Poha (Maharashtra · Breakfast)

```yaml
id: maharashtra_breakfast_kanda_poha
state: Maharashtra
region_zone: West
meal_type: breakfast
diet_type: veg
tags: [quick, everyday, light, tangy]
goal_tags: [maintenance, weight_loss]
```

Flattened rice tossed with onions, peanuts and a tempering of mustard seeds and curry leaves, the everyday Maharashtrian breakfast.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 250 kcal · 5g protein · 40g carbs · 8g fat

### Ingredients
- Flattened rice (poha) — 200 g (grain) — zepto: "poha flattened rice" · instamart: "poha"
- Onion — 1 large (vegetable) — zepto: "onion" · instamart: "pyaz"
- Potato — 1 medium (vegetable) _(optional)_ — zepto: "potato" · instamart: "aloo"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Roasted peanuts — 2 tbsp (protein) _(optional)_ — zepto: "roasted peanuts" · instamart: "moongfali"
- Lemon — 1 piece (fruit) — zepto: "lemon" · instamart: "nimbu"
- Oil — 3 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"

### Steps
1. Rinse poha briefly in water and drain; set aside to soften.
2. Heat oil, crackle mustard seeds, curry leaves and chopped green chili, then add peanuts and diced potato and cook until tender.
3. Add chopped onion and sauté until translucent, then stir in turmeric and salt.
4. Add the softened poha, toss gently to coat evenly, and cook covered for 2-3 minutes.
5. Finish with a squeeze of lemon juice and chopped coriander before serving.

---

## Pithla Bhakri (Maharashtra · Lunch)

```yaml
id: maharashtra_lunch_pithla_bhakri
state: Maharashtra
region_zone: West
meal_type: lunch
diet_type: veg
tags: [rustic, everyday, comfort-food, gluten-free]
goal_tags: [maintenance]
```

A rustic gram-flour curry served with roasted millet flatbread, a beloved everyday Maharashtrian lunch.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 12g protein · 40g carbs · 12g fat

### Ingredients
- Besan — 150 g (grain) — zepto: "gram flour besan" · instamart: "besan"
- Jowar flour — 200 g (grain) — zepto: "jowar flour" · instamart: "jowar atta"
- Onion — 1 medium (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Garlic — 4 piece (vegetable) _(optional)_ — zepto: "garlic" · instamart: "lehsun"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Asafoetida — 1 tsp (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"
- Oil — 3 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"

### Steps
1. Knead jowar flour with warm water into a soft dough and pat into thick round bhakris.
2. Roast the bhakris directly on a tawa and open flame until cooked through with charred spots.
3. Heat oil, temper mustard seeds, hing, chopped garlic and green chili, then sauté onion until soft.
4. Add water, turmeric and salt, bring to a boil, then whisk in besan gradually, stirring until it thickens into a smooth pithla.
5. Serve the hot pithla with bhakri, a drizzle of raw oil and chopped onion on the side.

---

## Vada Pav (Maharashtra · Snack)

```yaml
id: maharashtra_snack_vada_pav
state: Maharashtra
region_zone: West
meal_type: snack
diet_type: veg
tags: [street-food, fried, spicy, iconic]
goal_tags: [maintenance]
```

Mumbai's iconic street snack of a spiced potato fritter sandwiched in a soft bun with garlic chutney.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 460 kcal · 10g protein · 58g carbs · 18g fat

### Ingredients
- Potato — 4 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Pav (bread buns) — 4 piece (grain) — zepto: "pav bread" · instamart: "pav"
- Besan — 150 g (grain) — zepto: "gram flour besan" · instamart: "besan"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Ginger-garlic-green chili paste — 1 tbsp (vegetable) _(optional)_ — zepto: "ginger garlic green chilli paste" · instamart: "adrak lehsun hari mirch paste"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Dry garlic chutney — 2 tbsp (other) _(optional)_ — zepto: "garlic chutney" · instamart: "lehsun chutney"
- Oil for frying — 300 ml (oil) — zepto: "sunflower oil" · instamart: "tel"

### Steps
1. Boil, peel and mash potatoes; temper with mustard seeds, curry leaves and ginger-garlic-green chili paste, then mix in turmeric and salt to make the vada filling.
2. Shape the potato mixture into round balls.
3. Dip each ball in a seasoned besan batter and deep fry until golden and crisp.
4. Slit the pav buns and spread garlic chutney inside.
5. Sandwich a hot vada inside each pav and serve with fried green chilies.

---

## Kolhapuri Chicken (Maharashtra · Dinner)

```yaml
id: maharashtra_dinner_kolhapuri_chicken
state: Maharashtra
region_zone: West
meal_type: dinner
diet_type: nonveg
tags: [spicy, fiery, festive, rich]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A fiery Kolhapur-style chicken curry built on a roasted coconut and dried red chili masala.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 430 kcal · 34g protein · 12g carbs · 26g fat

### Ingredients
- Chicken curry cut — 500 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Onion — 2 large (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Dried red chili — 8 piece (spice) — zepto: "dried red chilli" · instamart: "sukhi lal mirch"
- Desiccated coconut — 3 tbsp (other) — zepto: "desiccated coconut" · instamart: "sukha nariyal"
- Ginger-garlic paste — 1 tbsp (vegetable) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Kolhapuri masala — 2 tbsp (spice) _(optional)_ — zepto: "kolhapuri masala" · instamart: "kolhapuri masala"
- Oil — 4 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"
- Coriander leaves — 1 piece (vegetable) _(optional)_ — zepto: "coriander leaves" · instamart: "dhaniya patta"

### Steps
1. Dry roast dried red chilies and desiccated coconut until fragrant, then grind into a fine paste with a little water.
2. Heat oil, sauté onions until deep golden, then add ginger-garlic paste and cook until the raw smell disappears.
3. Add chopped tomatoes and cook until soft, then stir in the roasted chili-coconut paste and Kolhapuri masala.
4. Add chicken pieces, mix well to coat, and cook covered on medium heat until tender and the oil separates.
5. Adjust water for gravy consistency, simmer for a few minutes, and garnish with coriander before serving.

---

## Goan Ros Omelette (Goa · Breakfast)

```yaml
id: goa_breakfast_goan_ros_omelette
state: Goa
region_zone: West
meal_type: breakfast
diet_type: egg
tags: [spicy, coastal, quick, protein-rich]
goal_tags: [maintenance, weight_loss]
```

Sliced egg omelette simmered in a light coconut-tomato gravy, a popular spicy Goan breakfast served with pav.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 280 kcal · 16g protein · 10g carbs · 20g fat

### Ingredients
- Eggs — 4 piece (protein) — zepto: "eggs" · instamart: "anda"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"
- Coconut milk — 100 ml (dairy) — zepto: "coconut milk" · instamart: "nariyal doodh"
- Kashmiri red chili powder — 1 tsp (spice) _(optional)_ — zepto: "kashmiri red chilli powder" · instamart: "lal mirch powder"
- Turmeric powder — 1 tsp (spice) _(optional)_ — zepto: "turmeric powder" · instamart: "haldi"
- Garlic — 3 piece (vegetable) _(optional)_ — zepto: "garlic" · instamart: "lehsun"
- Vinegar — 1 tsp (other) _(optional)_ — zepto: "vinegar" · instamart: "sirka"
- Oil — 2 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"
- Pav bread — 2 piece (grain) _(optional)_ — zepto: "pav bread" · instamart: "pav"

### Steps
1. Make thin plain omelettes with beaten eggs and a little salt, then set aside and slice into strips.
2. Sauté chopped onion and garlic in oil until soft, then add tomato and cook until pulpy.
3. Stir in turmeric, chili powder, coconut milk and a splash of vinegar, and simmer into a light gravy.
4. Add the sliced omelette strips to the gravy and simmer for 2-3 minutes so they soak up the sauce.
5. Serve the ros omelette hot with pav bread.

---

## Goan Fish Curry with Rice (Goa · Lunch)

```yaml
id: goa_lunch_goan_fish_curry_with_rice
state: Goa
region_zone: West
meal_type: lunch
diet_type: nonveg
tags: [coastal, tangy, spicy, iconic]
goal_tags: [maintenance, muscle, recovery]
```

The quintessential Goan meal of fresh fish simmered in a tangy coconut-chili curry, served over steamed rice.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 28g protein · 55g carbs · 14g fat

### Ingredients
- Fish (pomfret or kingfish) — 500 g (protein) — zepto: "fish pomfret" · instamart: "machli"
- Grated coconut — 1 piece (other) — zepto: "grated coconut" · instamart: "nariyal"
- Dried red chili — 6 piece (spice) — zepto: "dried red chilli" · instamart: "sukhi lal mirch"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Coriander seeds — 1 tbsp (spice) _(optional)_ — zepto: "coriander seeds" · instamart: "sabut dhaniya"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Rice — 200 g (grain) — zepto: "rice" · instamart: "chawal"
- Coconut oil — 2 tbsp (oil) _(optional)_ — zepto: "coconut oil" · instamart: "nariyal tel"

### Steps
1. Grind grated coconut, dried red chilies, coriander seeds and turmeric with a little water into a smooth masala paste.
2. Heat coconut oil in a pan, sauté sliced onion and slit green chilies until soft.
3. Add the ground masala paste along with tamarind pulp and enough water to form a curry, and bring to a boil.
4. Simmer for 8-10 minutes, then gently slide in the fish pieces and cook until just done, without over-stirring.
5. Cook rice separately until fluffy, and serve alongside the hot fish curry.

---

## Choris Pao (Chorizo Pav) (Goa · Snack)

```yaml
id: goa_snack_choris_pao_chorizo_pav
state: Goa
region_zone: West
meal_type: snack
diet_type: nonveg
tags: [spicy, street-food, pork, coastal]
goal_tags: [maintenance]
```

Spiced, tangy Goan pork chorizo stuffed into a soft pav bun, a much-loved Goan street snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 350 kcal · 18g protein · 28g carbs · 20g fat

### Ingredients
- Goan pork chorizo sausage — 250 g (protein) — zepto: "pork chorizo sausage" · instamart: "chorizo"
- Pav bread — 4 piece (grain) — zepto: "pav bread" · instamart: "pav"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"
- Garlic — 3 piece (vegetable) _(optional)_ — zepto: "garlic" · instamart: "lehsun"
- Turmeric powder — 1 tsp (spice) _(optional)_ — zepto: "turmeric powder" · instamart: "haldi"
- Vinegar — 1 tsp (other) _(optional)_ — zepto: "vinegar" · instamart: "sirka"
- Oil — 1 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"

### Steps
1. Remove the chorizo from its casing and crumble it into a hot pan.
2. Sauté chopped onion and garlic in a little oil until soft, then add the chorizo and cook, breaking it up further.
3. Add chopped tomato, turmeric and a splash of vinegar, and cook until the mixture is rich and slightly dry.
4. Simmer for a few minutes until the fat renders and the masala clings to the meat.
5. Slit the pav buns, stuff generously with the hot chorizo mixture, and serve immediately.

---

## Goan Vegetable Xacuti (Goa · Dinner)

```yaml
id: goa_dinner_goan_vegetable_xacuti
state: Goa
region_zone: West
meal_type: dinner
diet_type: veg
tags: [coastal, spicy, roasted-spices, veg]
goal_tags: [maintenance]
```

Mixed vegetables simmered in Goa's signature roasted coconut and dried chili xacuti masala, a fragrant vegetarian dinner curry.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 300 kcal · 8g protein · 30g carbs · 16g fat

### Ingredients
- Mixed vegetables — 400 g (vegetable) — zepto: "mixed vegetables" · instamart: "mix sabzi"
- Grated coconut — 1 piece (other) — zepto: "grated coconut" · instamart: "nariyal"
- Dried red chili — 5 piece (spice) — zepto: "dried red chilli" · instamart: "sukhi lal mirch"
- Poppy seeds — 1 tbsp (spice) _(optional)_ — zepto: "poppy seeds khus khus" · instamart: "khus khus"
- Coriander seeds — 1 tbsp (spice) _(optional)_ — zepto: "coriander seeds" · instamart: "sabut dhaniya"
- Star anise — 1 piece (spice) _(optional)_ — zepto: "star anise" · instamart: "chakra phool"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tamarind — 1 tsp (other) _(optional)_ — zepto: "tamarind" · instamart: "imli"
- Oil — 3 tbsp (oil) — zepto: "sunflower oil" · instamart: "tel"

### Steps
1. Dry roast grated coconut, dried red chilies, poppy seeds, coriander seeds and star anise until aromatic, then cool and grind into a fine xacuti masala paste.
2. Heat oil and sauté sliced onion until golden brown.
3. Add the ground xacuti masala paste and cook until the oil separates from the mixture.
4. Add the mixed vegetables along with tamarind pulp and enough water, then cover and simmer until the vegetables are tender.
5. Adjust seasoning and consistency, and serve hot with steamed rice or poee bread.

---

# South Zone

## Rava Idli (Karnataka · Breakfast)

```yaml
id: karnataka_breakfast_rava_idli
state: Karnataka
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [steamed, light, tiffin, quick]
goal_tags: [maintenance, weight_loss]
```

Soft steamed semolina cakes tempered with mustard seeds, cashews and curry leaves, served with coconut chutney.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 6g protein · 40g carbs · 8g fat

### Ingredients
- Semolina (rava/sooji) — 150 g (grain) — zepto: "semolina rava sooji" · instamart: "suji rava"
- Curd (yogurt) — 150 g (dairy) — zepto: "curd" · instamart: "dahi"
- Carrot — 1 medium (vegetable) _(optional)_ — zepto: "carrot" · instamart: "gajar"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai sarson"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Cashew nuts — 10 piece (other) _(optional)_ — zepto: "cashew nuts" · instamart: "kaju"
- Eno fruit salt / baking soda — 1 tsp (other) — zepto: "eno fruit salt" · instamart: "eno"
- Ghee — 1 tbsp (dairy) — zepto: "ghee" · instamart: "ghee"

### Steps
1. Dry roast rava lightly for 3-4 minutes and cool; mix with curd, grated carrot, chopped green chilli and salt to a thick batter, rest 15 minutes.
2. Heat ghee, splutter mustard seeds, curry leaves and cashews, and fold this tempering into the batter.
3. Just before steaming, add eno/baking soda and a splash of water, mix gently.
4. Pour into greased idli moulds and steam for 12-15 minutes until a knife comes out clean.
5. Serve hot with coconut chutney and sambar.

---

## Bisi Bele Bath (Karnataka · Lunch)

```yaml
id: karnataka_lunch_bisi_bele_bath
state: Karnataka
region_zone: South
meal_type: lunch
diet_type: veg
tags: [one-pot, comfort, spicy, festive]
goal_tags: [maintenance]
```

A hearty one-pot Mysore-style rice and lentil dish simmered with mixed vegetables and a spicy roasted powder, finished with ghee.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 400 kcal · 11g protein · 62g carbs · 11g fat

### Ingredients
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"
- Toor dal — 100 g (protein) — zepto: "toor dal" · instamart: "arhar dal"
- Mixed vegetables (carrot, beans, peas, potato) — 200 g (vegetable) — zepto: "mixed vegetables" · instamart: "mix sabzi"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Bisi bele bath powder — 2 tbsp (spice) — zepto: "bisi bele bath masala" · instamart: "bisi bele bath masala"
- Peanuts — 2 tbsp (other) _(optional)_ — zepto: "raw peanuts" · instamart: "moongfali"
- Ghee — 2 tbsp (dairy) — zepto: "ghee" · instamart: "ghee"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai sarson"

### Steps
1. Pressure cook rice and toor dal together with the chopped vegetables until soft and mushy.
2. Soak tamarind in warm water and extract the pulp; add to the cooked rice-dal mixture along with bisi bele bath powder and salt.
3. Simmer for 10-12 minutes, adding water to reach a thick, porridge-like consistency.
4. In a small pan, heat ghee and fry peanuts, mustard seeds and curry leaves; pour this tempering over the bath.
5. Serve hot with boondi or crisp fried papad on the side.

---

## Mysore Bonda (Goli Baje) (Karnataka · Snack)

```yaml
id: karnataka_snack_mysore_bonda_goli_baje
state: Karnataka
region_zone: South
meal_type: snack
diet_type: veg
tags: [fried, tea-time, street-food]
goal_tags: [maintenance, weight_loss]
```

Deep-fried fluffy dumplings made from a curd-thickened maida batter, a popular Karnataka tea-time snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 240 kcal · 5g protein · 24g carbs · 13g fat

### Ingredients
- All-purpose flour (maida) — 150 g (grain) — zepto: "maida all purpose flour" · instamart: "maida"
- Curd (yogurt) — 100 g (dairy) — zepto: "curd" · instamart: "dahi"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Ginger — 1 tsp (spice) _(optional)_ — zepto: "ginger" · instamart: "adrak"
- Curry leaves — 6 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Coriander leaves — 2 tbsp (vegetable) _(optional)_ — zepto: "coriander leaves" · instamart: "dhaniya patta"
- Baking soda — 0.5 tsp (other) — zepto: "baking soda" · instamart: "baking soda"
- Oil (for deep frying) — 300 ml (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Whisk maida, curd, chopped green chilli, ginger, curry leaves, coriander and baking soda into a thick, drop-able batter; rest 20 minutes.
2. Heat oil to medium-hot in a kadai.
3. Drop small portions of the batter into the oil and fry on medium flame, turning occasionally, until golden brown and cooked through.
4. Drain on paper towels and serve hot with coconut chutney and filter coffee.

---

## Ragi Mudde with Saaru (Karnataka · Dinner)

```yaml
id: karnataka_dinner_ragi_mudde_with_saaru
state: Karnataka
region_zone: South
meal_type: dinner
diet_type: veg
tags: [millet, rustic, wholesome, gluten-free]
goal_tags: [maintenance]
```

Steamed finger-millet balls served with a tangy, spiced lentil-vegetable sambar, a staple rustic Karnataka dinner.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 320 kcal · 9g protein · 56g carbs · 6g fat

### Ingredients
- Ragi (finger millet) flour — 150 g (grain) — zepto: "ragi flour" · instamart: "ragi atta"
- Toor dal — 80 g (protein) — zepto: "toor dal" · instamart: "arhar dal"
- Drumstick — 1 piece (vegetable) _(optional)_ — zepto: "drumstick" · instamart: "saijan phali"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Sambar powder — 2 tbsp (spice) — zepto: "sambar powder" · instamart: "sambar masala"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai sarson"

### Steps
1. Boil water, gradually stir in ragi flour, cooking and mashing continuously until it forms a smooth, thick, lump-free dough (mudde).
2. Shape the hot dough into smooth balls using wet hands or a small bowl of water; set aside.
3. Cook toor dal with drumstick, onion and tomato until soft; add tamarind pulp, sambar powder and salt, simmer 10 minutes.
4. Temper with mustard seeds in hot oil and pour over the saaru (sambar).
5. Serve the ragi mudde balls hot alongside the saaru, eating by breaking off small pieces and dunking them in.

---

## Idli with Sambar (Tamil Nadu · Breakfast)

```yaml
id: tamil_nadu_breakfast_idli_with_sambar
state: Tamil Nadu
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [steamed, fermented, tiffin, light]
goal_tags: [maintenance, weight_loss]
```

Steamed fermented rice-lentil cakes served with a vegetable lentil sambar and coconut chutney, Tamil Nadu's everyday breakfast.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 290 kcal · 9g protein · 50g carbs · 6g fat

### Ingredients
- Idli rice — 200 g (grain) — zepto: "idli rice" · instamart: "idli chawal"
- Urad dal — 60 g (protein) — zepto: "urad dal" · instamart: "urad dal"
- Fenugreek seeds — 0.5 tsp (spice) _(optional)_ — zepto: "fenugreek seeds" · instamart: "methi dana"
- Toor dal — 80 g (protein) — zepto: "toor dal" · instamart: "arhar dal"
- Mixed vegetables (drumstick, carrot) — 150 g (vegetable) _(optional)_ — zepto: "mixed vegetables" · instamart: "mix sabzi"
- Sambar powder — 2 tbsp (spice) — zepto: "sambar powder" · instamart: "sambar masala"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Coconut (fresh) — 0.5 piece (other) — zepto: "fresh coconut" · instamart: "nariyal"

### Steps
1. Soak rice and urad dal (with fenugreek) separately for 4-6 hours, grind to a smooth batter, mix and ferment overnight.
2. Pour batter into greased idli moulds and steam for 10-12 minutes until springy.
3. For sambar, cook toor dal with vegetables until soft, add tamarind pulp, sambar powder and salt, and simmer 15 minutes; temper with mustard seeds and curry leaves.
4. Grind fresh coconut with green chilli and a little roasted gram into a smooth chutney.
5. Serve hot idlis with sambar and coconut chutney.

---

## Chettinad Chicken Curry (Tamil Nadu · Lunch)

```yaml
id: tamil_nadu_lunch_chettinad_chicken_curry
state: Tamil Nadu
region_zone: South
meal_type: lunch
diet_type: nonveg
tags: [spicy, curry, festive]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A fiery, aromatic Chettinad-style chicken curry made with freshly ground pepper, star anise and coconut, served with steamed rice.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 520 kcal · 32g protein · 42g carbs · 22g fat

### Ingredients
- Chicken (curry cut, bone-in) — 400 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Coconut (fresh, grated) — 0.5 piece (other) — zepto: "fresh coconut" · instamart: "nariyal"
- Chettinad masala (fennel, star anise, pepper, cinnamon) — 2 tbsp (spice) — zepto: "chettinad masala" · instamart: "chettinad masala"
- Ginger garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"
- Cooking oil — 2 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Dry roast fennel, star anise, pepper, cinnamon and dried red chillies, cool, and grind with grated coconut to a coarse paste.
2. Heat oil, fry curry leaves and sliced onions until golden, add ginger garlic paste and cook off the raw smell.
3. Add tomatoes and cook until mushy, then add the ground masala paste and cook until oil separates.
4. Add chicken pieces, salt and a little water; cover and simmer 20-25 minutes until the chicken is tender and the gravy thickens.
5. Serve hot with steamed rice.

---

## Murukku (Tamil Nadu · Snack)

```yaml
id: tamil_nadu_snack_murukku
state: Tamil Nadu
region_zone: South
meal_type: snack
diet_type: veg
tags: [fried, crunchy, festive, tea-time]
goal_tags: [maintenance, weight_loss]
```

Crisp, spiral-shaped deep-fried snack made from rice flour and urad dal flour, a classic Tamil Nadu tea-time favourite.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 210 kcal · 4g protein · 22g carbs · 12g fat

### Ingredients
- Rice flour — 200 g (grain) — zepto: "rice flour" · instamart: "chawal ka atta"
- Urad dal flour — 50 g (protein) — zepto: "urad dal flour" · instamart: "urad dal atta"
- Butter — 2 tbsp (dairy) — zepto: "butter" · instamart: "makhan"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds" · instamart: "jeera"
- Sesame seeds — 1 tsp (spice) _(optional)_ — zepto: "sesame seeds" · instamart: "til"
- Asafoetida — 1 pinch (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"
- Oil (for deep frying) — 300 ml (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Mix rice flour, urad dal flour, softened butter, cumin, sesame seeds, hing and salt with water into a smooth, pliable dough.
2. Fill the dough into a murukku press fitted with a star-shaped disc.
3. Press directly into hot oil in spiral shapes and deep fry on medium heat, turning once, until golden and crisp.
4. Drain on paper towels and cool completely before storing in an airtight container.

---

## Kothu Parotta (Tamil Nadu · Dinner)

```yaml
id: tamil_nadu_dinner_kothu_parotta
state: Tamil Nadu
region_zone: South
meal_type: dinner
diet_type: nonveg
tags: [street-food, spicy, hearty]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Shredded flaky parottas tossed on a hot griddle with scrambled egg, spiced chicken and vegetables, a beloved Tamil Nadu roadside dinner.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 560 kcal · 28g protein · 58g carbs · 24g fat

### Ingredients
- Parotta (frozen or fresh) — 4 piece (grain) — zepto: "malabar parotta" · instamart: "parotta"
- Chicken (boneless, chopped) — 250 g (protein) — zepto: "boneless chicken" · instamart: "chicken boneless"
- Egg — 2 piece (protein) _(optional)_ — zepto: "eggs" · instamart: "anda"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Chilli powder — 1 tbsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Garam masala — 1 tsp (spice) _(optional)_ — zepto: "garam masala" · instamart: "garam masala"
- Cooking oil — 2 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Cook parottas as per package instructions, then shred them into small pieces using two knives or a chopper.
2. In a pan, heat oil, sauté onions until golden, add ginger garlic paste, tomato, chilli powder and garam masala and cook to a thick masala.
3. Add chicken and cook through; push to one side, scramble the eggs in the same pan and mix everything together.
4. Add the shredded parotta and toss vigorously with the masala, chopping and mixing on the hot griddle until well combined and slightly crisp.
5. Serve hot, optionally with onion raita or a side of salna.

---

## Puttu with Kadala Curry (Kerala · Breakfast)

```yaml
id: kerala_breakfast_puttu_with_kadala_curry
state: Kerala
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [steamed, wholesome, traditional]
goal_tags: [maintenance]
```

Steamed cylinders of rice flour and coconut layers served with a spiced black chickpea curry, Kerala's iconic breakfast pairing.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 360 kcal · 12g protein · 58g carbs · 8g fat

### Ingredients
- Puttu podi (roasted rice flour) — 200 g (grain) — zepto: "puttu podi rice flour" · instamart: "puttu podi"
- Coconut (fresh, grated) — 100 g (other) — zepto: "fresh coconut" · instamart: "nariyal"
- Black chickpeas (kala chana) — 150 g (protein) — zepto: "kala chana black chickpeas" · instamart: "kala chana"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Coconut oil — 1 tbsp (oil) — zepto: "coconut oil" · instamart: "nariyal tel"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai sarson"

### Steps
1. Soak black chickpeas overnight and pressure cook until soft.
2. Mix puttu podi with a little salt and water until it reaches a crumbly, moist texture; layer alternately with grated coconut in a puttu maker/steamer and steam for 10-12 minutes.
3. For the kadala curry, heat coconut oil, splutter mustard seeds and curry leaves, sauté onions and tomatoes until soft.
4. Add cooked chickpeas along with turmeric, chilli powder and coriander powder, simmer 10-15 minutes with a little of the cooking water until thickened.
5. Unmould the puttu cylinders and serve hot with the kadala curry, and a ripe banana on the side if desired.

---

## Kerala Fish Curry (Meen Curry) (Kerala · Lunch)

```yaml
id: kerala_lunch_kerala_fish_curry_meen_curry
state: Kerala
region_zone: South
meal_type: lunch
diet_type: nonveg
tags: [tangy, spicy, coastal]
goal_tags: [maintenance, muscle, recovery]
```

Tangy, fiery fish curry cooked in a clay-pot style gravy of kokum, coconut and red chillies, served with steamed rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 470 kcal · 29g protein · 46g carbs · 17g fat

### Ingredients
- Fish (kingfish or pomfret, cleaned) — 400 g (protein) — zepto: "fish kingfish" · instamart: "machli"
- Kokum (kudampuli) — 3 piece (other) — zepto: "kudampuli kokum" · instamart: "kokum"
- Shallots — 8 piece (vegetable) — zepto: "small onion shallots" · instamart: "sambar onion"
- Coconut oil — 2 tbsp (oil) — zepto: "coconut oil" · instamart: "nariyal tel"
- Kashmiri chilli powder — 2 tbsp (spice) — zepto: "kashmiri red chilli powder" · instamart: "kashmiri lal mirch"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Ginger garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Soak kokum pieces in a little warm water and set aside.
2. Heat coconut oil in a clay pot or heavy pan, sauté shallots and curry leaves until soft, then add ginger garlic paste.
3. Add chilli powder and turmeric, mix well with a splash of water to avoid burning, then add the soaked kokum with its water.
4. Bring to a boil, slide in the fish pieces, season with salt and simmer gently for 12-15 minutes without stirring vigorously.
5. Rest the curry for a few minutes for flavours to deepen, and serve hot with steamed rice.

---

## Kerala Banana Chips (Ethakka Upperi) (Kerala · Snack)

```yaml
id: kerala_snack_kerala_banana_chips_ethakka_upperi
state: Kerala
region_zone: South
meal_type: snack
diet_type: veg
tags: [fried, crunchy, snack]
goal_tags: [maintenance, weight_loss]
```

Thin slices of raw plantain deep-fried in coconut oil until crisp and golden, a beloved Kerala snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 2g protein · 32g carbs · 14g fat

### Ingredients
- Raw plantain (nendran banana) — 3 piece (fruit) — zepto: "raw banana nendran plantain" · instamart: "kachha kela"
- Coconut oil — 400 ml (oil) — zepto: "coconut oil" · instamart: "nariyal tel"
- Turmeric powder — 0.5 tsp (spice) _(optional)_ — zepto: "turmeric powder" · instamart: "haldi powder"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "namak"

### Steps
1. Peel the raw plantains and slice them very thinly using a mandoline slicer directly into a bowl of turmeric-salted water.
2. Heat coconut oil in a deep kadai until hot.
3. Pat the slices dry and fry in batches, stirring occasionally, until golden and crisp.
4. Drain on paper towels, sprinkle with a little extra salt while hot, and cool completely before storing.

---

## Appam with Chicken Stew (Kerala · Dinner)

```yaml
id: kerala_dinner_appam_with_chicken_stew
state: Kerala
region_zone: South
meal_type: dinner
diet_type: nonveg
tags: [coconut, mild, comfort, festive]
goal_tags: [maintenance, muscle, recovery]
```

Lacy, soft-centred fermented rice pancakes paired with a mild coconut-milk chicken stew, a signature Kerala dinner.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 440 kcal · 26g protein · 44g carbs · 18g fat

### Ingredients
- Raw rice — 200 g (grain) — zepto: "raw rice" · instamart: "chawal"
- Cooked rice — 50 g (grain) _(optional)_ — zepto: "cooked rice" · instamart: "pakaya hua chawal"
- Coconut (fresh, grated) — 100 g (other) — zepto: "fresh coconut" · instamart: "nariyal"
- Chicken (curry cut, bone-in) — 350 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Coconut milk — 200 ml (dairy) — zepto: "coconut milk" · instamart: "nariyal doodh"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Whole spices (cinnamon, cloves, cardamom) — 1 tsp (spice) _(optional)_ — zepto: "whole garam masala" · instamart: "sabut garam masala"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"

### Steps
1. Soak raw rice for 5-6 hours, grind with cooked rice and grated coconut into a smooth batter, and ferment overnight with a little salt.
2. Heat a small amount of oil in a pan, add whole spices, sliced onions, green chillies and curry leaves and sauté until soft.
3. Add chicken pieces and cook for a few minutes, then pour in thin coconut milk and simmer until chicken is nearly cooked; add thick coconut milk at the end and simmer gently without boiling hard.
4. Heat an appam pan (kadai), pour a ladle of batter and swirl to coat the sides, cover and cook until the edges are lacy and crisp and the centre is soft.
5. Serve hot appams with the chicken stew.

---

## Pesarattu with Allam Chutney (Andhra Pradesh · Breakfast)

```yaml
id: andhra_pradesh_breakfast_pesarattu_with_allam_chutney
state: Andhra Pradesh
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [protein-rich, quick, tangy]
goal_tags: [maintenance, weight_loss]
```

A protein-rich crepe made from whole green gram batter, crisp at the edges, served with a tangy ginger chutney.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 270 kcal · 13g protein · 38g carbs · 6g fat

### Ingredients
- Whole green gram (moong dal, unpeeled) — 200 g (protein) — zepto: "whole green moong dal" · instamart: "sabut moong dal"
- Rice — 30 g (grain) _(optional)_ — zepto: "rice" · instamart: "chawal"
- Ginger — 1 tbsp (spice) — zepto: "ginger" · instamart: "adrak"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds" · instamart: "jeera"
- Onion (finely chopped, for topping) — 1 medium (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Tamarind — 1 tsp (other) — zepto: "tamarind" · instamart: "imli"
- Cooking oil — 2 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Soak whole green gram and rice together for 5-6 hours, then grind with ginger, green chilli and cumin into a smooth, pourable batter; no fermentation needed.
2. Heat a griddle, pour a ladle of batter and spread thin into a crepe; sprinkle chopped onions on top and drizzle oil around the edges.
3. Cook until the base is golden and crisp, then fold in half and remove.
4. For the chutney, blend ginger, tamarind, dried red chillies, jaggery and salt into a smooth-to-slightly-coarse paste.
5. Serve hot pesarattu with the allam (ginger) chutney.

---

## Gongura Mutton (Andhra Pradesh · Lunch)

```yaml
id: andhra_pradesh_lunch_gongura_mutton
state: Andhra Pradesh
region_zone: South
meal_type: lunch
diet_type: nonveg
tags: [spicy, tangy, festive]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Tender mutton simmered with tangy sorrel (gongura) leaves and fiery Andhra spices, a signature Andhra lunch dish served with rice.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 45 min · **Difficulty:** hard
**Nutrition (approx per serving):** 560 kcal · 34g protein · 44g carbs · 26g fat

### Ingredients
- Mutton (bone-in, curry cut) — 400 g (protein) — zepto: "mutton curry cut" · instamart: "mutton"
- Gongura leaves (sorrel leaves) — 150 g (vegetable) — zepto: "gongura leaves" · instamart: "gongura"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Ginger garlic paste — 1.5 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Red chilli powder — 2 tbsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Coriander powder — 1 tbsp (spice) — zepto: "coriander powder" · instamart: "dhaniya powder"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Cooking oil — 3 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Wash gongura leaves and cook them down with a splash of water until wilted and pulpy; set aside.
2. Pressure cook mutton with turmeric and salt until about 70% tender.
3. Heat oil, sauté onions until golden, add ginger garlic paste, green chillies, chilli powder and coriander powder, and cook until oil separates.
4. Add the cooked mutton along with its stock and simmer until fully tender.
5. Stir in the cooked gongura pulp and simmer for 10 more minutes until the flavours meld and the gravy thickens.
6. Serve hot with steamed rice.

---

## Mirchi Bajji (Andhra Pradesh · Snack)

```yaml
id: andhra_pradesh_snack_mirchi_bajji
state: Andhra Pradesh
region_zone: South
meal_type: snack
diet_type: veg
tags: [fried, spicy, street-food]
goal_tags: [maintenance, weight_loss]
```

Large mild green chillies stuffed with a tangy spiced filling, dipped in gram flour batter and deep-fried, a favourite Andhra street snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 230 kcal · 5g protein · 24g carbs · 13g fat

### Ingredients
- Bajji chillies (large mild green chillies) — 6 piece (vegetable) — zepto: "bajji mirchi green chilli" · instamart: "bajji mirch"
- Gram flour (besan) — 150 g (grain) — zepto: "besan gram flour" · instamart: "besan"
- Rice flour — 2 tbsp (grain) _(optional)_ — zepto: "rice flour" · instamart: "chawal ka atta"
- Tamarind — 1 tbsp (other) _(optional)_ — zepto: "tamarind" · instamart: "imli"
- Roasted peanuts (for stuffing, crushed) — 3 tbsp (other) _(optional)_ — zepto: "roasted peanuts" · instamart: "bhuni moongfali"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds" · instamart: "jeera"
- Oil (for deep frying) — 300 ml (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Slit the chillies lengthwise and remove seeds; stuff with a mix of crushed roasted peanuts, tamarind, cumin and salt.
2. Make a thick batter with gram flour, rice flour, a pinch of turmeric, salt and water.
3. Dip each stuffed chilli into the batter, coating well.
4. Deep fry in hot oil until golden and crisp on the outside.
5. Drain and serve hot with tamarind or coconut chutney.

---

## Gutti Vankaya Kura (Andhra Pradesh · Dinner)

```yaml
id: andhra_pradesh_dinner_gutti_vankaya_kura
state: Andhra Pradesh
region_zone: South
meal_type: dinner
diet_type: veg
tags: [stuffed, spicy, festive]
goal_tags: [maintenance]
```

Baby brinjals stuffed with a roasted peanut-sesame-coconut masala, simmered in a spicy tamarind gravy, a beloved Andhra dinner curry.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 340 kcal · 8g protein · 40g carbs · 16g fat

### Ingredients
- Baby brinjal (eggplant) — 300 g (vegetable) — zepto: "baby brinjal" · instamart: "choti baingan"
- Peanuts — 3 tbsp (other) — zepto: "raw peanuts" · instamart: "moongfali"
- Sesame seeds — 2 tbsp (spice) — zepto: "sesame seeds" · instamart: "til"
- Coconut (fresh or desiccated) — 3 tbsp (other) _(optional)_ — zepto: "fresh coconut" · instamart: "nariyal"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Red chilli powder — 1 tbsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Cooking oil — 3 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"
- Rice — 150 g (grain) _(optional)_ — zepto: "rice" · instamart: "chawal"

### Steps
1. Dry roast peanuts, sesame seeds and coconut, then grind with chilli powder, tamarind and salt into a thick paste.
2. Slit brinjals into quarters keeping the stem intact, and stuff generously with the ground masala paste.
3. Heat oil, sauté chopped onions until golden, then place the stuffed brinjals in gently and sauté for a few minutes.
4. Add any leftover masala paste with a little water, cover and cook on low heat until the brinjals are tender.
5. Simmer uncovered briefly to thicken the gravy, and serve hot with steamed rice or roti.

---

## Jonna Rotte with Vankaya Pachadi (Telangana · Breakfast)

```yaml
id: telangana_breakfast_jonna_rotte_with_vankaya_pachadi
state: Telangana
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [millet, rustic, gluten-free, wholesome]
goal_tags: [maintenance, weight_loss]
```

Rustic sorghum flatbreads paired with a smoky roasted brinjal chutney, a traditional dryland Telangana breakfast.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 290 kcal · 7g protein · 50g carbs · 7g fat

### Ingredients
- Jowar flour (sorghum flour) — 200 g (grain) — zepto: "jowar flour sorghum atta" · instamart: "jowar atta"
- Brinjal (large) — 1 large (vegetable) — zepto: "brinjal eggplant" · instamart: "baingan"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Garlic — 4 piece (spice) _(optional)_ — zepto: "garlic" · instamart: "lahsun"
- Tamarind — 1 tsp (other) _(optional)_ — zepto: "tamarind" · instamart: "imli"
- Onion (for chutney) — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Cooking oil — 1 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Knead jowar flour with hot water and a pinch of salt into a soft dough; pat into thin rounds directly on a damp cloth or banana leaf.
2. Cook the flattened rotte on a hot tawa on both sides until light brown spots appear and it is fully cooked.
3. Roast the whole brinjal directly over a flame or in the oven until the skin chars and the flesh softens; peel and mash.
4. Mix the mashed brinjal with chopped green chilli, garlic, onion, tamarind and salt into a coarse chutney (pachadi).
5. Serve the hot jonna rotte with a dollop of vankaya pachadi and a drizzle of oil.

---

## Hyderabadi Chicken Biryani (Telangana · Lunch)

```yaml
id: telangana_lunch_hyderabadi_chicken_biryani
state: Telangana
region_zone: South
meal_type: lunch
diet_type: nonveg
tags: [festive, aromatic, dum, spicy]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Fragrant basmati rice layered and dum-cooked with marinated chicken, fried onions and saffron, Telangana's most iconic lunch dish.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 45 min · **Difficulty:** hard
**Nutrition (approx per serving):** 610 kcal · 31g protein · 66g carbs · 24g fat

### Ingredients
- Basmati rice — 200 g (grain) — zepto: "basmati rice" · instamart: "basmati chawal"
- Chicken (curry cut, bone-in) — 400 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Curd (yogurt) — 150 g (dairy) — zepto: "curd" · instamart: "dahi"
- Fried onions (birista) — 100 g (vegetable) — zepto: "fried onions birista" · instamart: "fried onion"
- Ginger garlic paste — 1.5 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Biryani masala — 2 tbsp (spice) — zepto: "biryani masala" · instamart: "biryani masala"
- Mint leaves — 0.5 cup (vegetable) _(optional)_ — zepto: "mint leaves" · instamart: "pudina"
- Saffron — 1 pinch (spice) _(optional)_ — zepto: "saffron kesar" · instamart: "kesar"
- Ghee — 2 tbsp (dairy) — zepto: "ghee" · instamart: "ghee"

### Steps
1. Marinate chicken with curd, ginger garlic paste, biryani masala, half the fried onions and mint for at least 1 hour.
2. Parboil basmati rice with whole spices until 70% cooked, then drain.
3. Layer the marinated chicken in a heavy pot, top with the parboiled rice, remaining fried onions, saffron-soaked milk and ghee.
4. Cover tightly with a lid (seal with dough if needed) and cook on dum (low heat) for 25-30 minutes.
5. Rest for 10 minutes, then gently fluff and mix the layers before serving hot with raita.

---

## Osmania Biscuit (Telangana · Snack)

```yaml
id: telangana_snack_osmania_biscuit
state: Telangana
region_zone: South
meal_type: snack
diet_type: veg
tags: [baked, tea-time, sweet-salty]
goal_tags: [maintenance, weight_loss]
```

Buttery, slightly salty-sweet Hyderabadi tea biscuits, a beloved Telangana bakery snack traditionally paired with Irani chai.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 190 kcal · 3g protein · 24g carbs · 9g fat

### Ingredients
- All-purpose flour (maida) — 200 g (grain) — zepto: "maida all purpose flour" · instamart: "maida"
- Butter — 100 g (dairy) — zepto: "butter" · instamart: "makhan"
- Powdered sugar — 60 g (other) — zepto: "powdered sugar icing sugar" · instamart: "cheeni powder"
- Milk powder — 2 tbsp (dairy) _(optional)_ — zepto: "milk powder" · instamart: "milk powder"
- Baking powder — 0.5 tsp (other) — zepto: "baking powder" · instamart: "baking powder"
- Salt — 1 pinch (spice) — zepto: "salt" · instamart: "namak"
- Milk (for glazing) — 2 tbsp (dairy) _(optional)_ — zepto: "milk" · instamart: "doodh"

### Steps
1. Cream butter and powdered sugar together until light and fluffy.
2. Sift in maida, milk powder, baking powder and a pinch of salt, and bring together into a soft dough without overworking it.
3. Roll out to about 1 cm thickness and cut into round biscuits; brush tops lightly with milk.
4. Bake in a preheated oven at 170°C for 15-18 minutes until the edges turn light golden.
5. Cool completely on a wire rack before serving with hot Irani chai.

---

## Bagara Baingan (Telangana · Dinner)

```yaml
id: telangana_dinner_bagara_baingan
state: Telangana
region_zone: South
meal_type: dinner
diet_type: veg
tags: [nutty, tangy, festive]
goal_tags: [maintenance]
```

Small brinjals simmered in a rich tamarind, peanut and sesame gravy, a signature Hyderabadi-Telangana dinner curry.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 360 kcal · 7g protein · 46g carbs · 16g fat

### Ingredients
- Baby brinjal (eggplant) — 300 g (vegetable) — zepto: "baby brinjal" · instamart: "choti baingan"
- Peanuts — 3 tbsp (other) — zepto: "raw peanuts" · instamart: "moongfali"
- Sesame seeds — 2 tbsp (spice) — zepto: "sesame seeds" · instamart: "til"
- Desiccated coconut — 2 tbsp (other) _(optional)_ — zepto: "desiccated coconut" · instamart: "nariyal burada"
- Tamarind — 1.5 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Red chilli powder — 1 tbsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Cooking oil — 3 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"
- Rice — 150 g (grain) _(optional)_ — zepto: "rice" · instamart: "chawal"

### Steps
1. Dry roast peanuts, sesame seeds and coconut, cool, and grind to a smooth paste with a little water.
2. Slit the brinjals into quarters keeping the stem intact.
3. Heat oil, fry the brinjals lightly until just softened and set aside; in the same oil sauté sliced onions until golden.
4. Add the ground peanut-sesame paste, tamarind pulp, chilli powder and salt, and cook until oil separates.
5. Return the brinjals to the pan, add water to loosen the gravy, cover and simmer until fully tender.
6. Serve hot with steamed rice.

---

## Pondicherry Bonda Soup (Puducherry · Breakfast)

```yaml
id: puducherry_breakfast_pondicherry_bonda_soup
state: Puducherry
region_zone: South
meal_type: breakfast
diet_type: veg
tags: [street-food, comfort, spiced]
goal_tags: [maintenance, weight_loss]
```

Crisp deep-fried lentil bonda dunked in a piping hot, spiced vegetable-tamarind soup, a much-loved Puducherry breakfast street food.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 260 kcal · 7g protein · 34g carbs · 10g fat

### Ingredients
- Urad dal — 150 g (protein) — zepto: "urad dal" · instamart: "urad dal"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Carrot — 1 medium (vegetable) _(optional)_ — zepto: "carrot" · instamart: "gajar"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Toor dal — 50 g (protein) — zepto: "toor dal" · instamart: "arhar dal"
- Tamarind — 1 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Sambar powder — 1 tbsp (spice) — zepto: "sambar powder" · instamart: "sambar masala"
- Oil (for deep frying) — 300 ml (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Soak and grind urad dal into a thick, fluffy batter with chopped onion, green chilli and salt; shape into small balls and deep fry until golden (ulundu bonda).
2. Cook toor dal with diced carrot and tomato until soft, then mash lightly.
3. Add tamarind pulp, sambar powder and salt, and simmer into a thin, well-spiced soup.
4. Temper with mustard seeds and curry leaves and pour into the soup.
5. Serve the hot bonda soup in a bowl with 2-3 bondas dunked in, to be broken and eaten with a spoon.

---

## Pondicherry Meen Kuzhambu (Puducherry · Lunch)

```yaml
id: puducherry_lunch_pondicherry_meen_kuzhambu
state: Puducherry
region_zone: South
meal_type: lunch
diet_type: nonveg
tags: [coastal, tangy, spicy]
goal_tags: [maintenance, muscle, recovery]
```

A Franco-Tamil coastal fish curry from Puducherry, simmered with tamarind, coconut and country spices, served with rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 470 kcal · 28g protein · 46g carbs · 17g fat

### Ingredients
- Fish (seer fish or sardines, cleaned) — 400 g (protein) — zepto: "fish seer fish" · instamart: "machli"
- Tamarind — 2 tbsp (other) — zepto: "tamarind" · instamart: "imli"
- Shallots — 8 piece (vegetable) — zepto: "small onion shallots" · instamart: "sambar onion"
- Tomato — 1 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Coconut (fresh, grated) — 3 tbsp (other) _(optional)_ — zepto: "fresh coconut" · instamart: "nariyal"
- Red chilli powder — 1.5 tbsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Fenugreek seeds — 0.25 tsp (spice) _(optional)_ — zepto: "fenugreek seeds" · instamart: "methi dana"
- Curry leaves — 10 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Soak tamarind in warm water and extract a thick pulp.
2. Heat oil, splutter fenugreek seeds and curry leaves, sauté shallots and tomato until soft.
3. Add chilli powder and a paste of ground coconut, cook briefly, then pour in the tamarind water.
4. Bring to a boil, season with salt, and simmer for 8-10 minutes to cook out the raw tamarind taste.
5. Gently slide in the fish pieces and simmer without stirring for 10-12 minutes until cooked through and the gravy thickens.
6. Serve hot with steamed rice.

---

## Pondicherry French Toast (Puducherry · Snack)

```yaml
id: puducherry_snack_pondicherry_french_toast
state: Puducherry
region_zone: South
meal_type: snack
diet_type: egg
tags: [cafe-style, sweet, quick, fusion]
goal_tags: [maintenance, weight_loss]
```

Café-style egg-dipped pan-fried bread with a hint of vanilla and sugar, reflecting Puducherry's French colonial bakery legacy.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 280 kcal · 9g protein · 30g carbs · 13g fat

### Ingredients
- Bread slices — 4 piece (grain) — zepto: "white bread sandwich bread" · instamart: "bread"
- Egg — 2 piece (protein) — zepto: "eggs" · instamart: "anda"
- Milk — 60 ml (dairy) — zepto: "milk" · instamart: "doodh"
- Sugar — 2 tbsp (other) — zepto: "sugar" · instamart: "cheeni"
- Vanilla essence — 0.5 tsp (other) _(optional)_ — zepto: "vanilla essence" · instamart: "vanilla essence"
- Butter — 2 tbsp (dairy) — zepto: "butter" · instamart: "makhan"
- Cinnamon powder — 0.25 tsp (spice) _(optional)_ — zepto: "cinnamon powder" · instamart: "dalchini powder"

### Steps
1. Whisk together eggs, milk, sugar, vanilla essence and cinnamon in a wide shallow bowl.
2. Dip each bread slice into the mixture, coating both sides well without oversoaking.
3. Heat butter on a griddle or pan over medium heat.
4. Pan-fry the soaked bread slices for 2-3 minutes on each side until golden brown and set.
5. Serve warm with a drizzle of honey or a dusting of powdered sugar, café-style.

---

## Uppu Kari (Pondicherry Mutton Pepper Fry) (Puducherry · Dinner)

```yaml
id: puducherry_dinner_uppu_kari_pondicherry_mutton_pepper_fry
state: Puducherry
region_zone: South
meal_type: dinner
diet_type: nonveg
tags: [spicy, dry-roast, festive]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A dry, richly spiced mutton pepper fry considered a specialty of Puducherry's Tamil kitchens, traditionally served with rice or parotta.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 40 min · **Difficulty:** hard
**Nutrition (approx per serving):** 430 kcal · 32g protein · 10g carbs · 28g fat

### Ingredients
- Mutton (bone-in, small pieces) — 400 g (protein) — zepto: "mutton curry cut" · instamart: "mutton"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Black pepper (crushed) — 1.5 tbsp (spice) — zepto: "black pepper" · instamart: "kali mirch"
- Ginger garlic paste — 1.5 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Fennel seeds — 1 tsp (spice) _(optional)_ — zepto: "fennel seeds saunf" · instamart: "saunf"
- Curry leaves — 12 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Coconut (fresh, sliced thin) — 3 tbsp (other) _(optional)_ — zepto: "fresh coconut" · instamart: "nariyal"
- Cooking oil — 3 tbsp (oil) — zepto: "cooking oil" · instamart: "khana pakane ka tel"

### Steps
1. Pressure cook mutton with turmeric, salt and a little water until tender but not falling apart; reserve any leftover stock.
2. Heat oil, splutter fennel seeds and curry leaves, then sauté onions until deep golden.
3. Add ginger garlic paste and cook off the raw smell, then add crushed black pepper and the cooked mutton.
4. Sauté on high heat, adding a little reserved stock as needed, until the mutton is well coated and most of the liquid evaporates.
5. Toss in thin coconut slices in the last few minutes and fry until the mutton is dry, glossy and richly browned.
6. Serve hot with steamed rice or parotta.

---

# East Zone

## Luchi Aloor Dom (West Bengal · Breakfast)

```yaml
id: west_bengal_breakfast_luchi_aloor_dom
state: West Bengal
region_zone: East
meal_type: breakfast
diet_type: veg
tags: [fried, festive, comfort food, vegetarian]
goal_tags: [maintenance]
```

Fluffy deep-fried maida bread served with a fragrant, lightly spiced potato curry, a beloved Bengali breakfast and festive-morning staple.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 420 kcal · 8g protein · 58g carbs · 18g fat

### Ingredients
- Refined flour (maida) — 200 g (grain) — zepto: "refined flour maida" · instamart: "maida"
- Potatoes — 300 g (vegetable) — zepto: "potato" · instamart: "aloo"
- Ghee — 2 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Ginger paste — 1 tbsp (spice) — zepto: "ginger paste" · instamart: "adrak paste"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Sunflower/refined oil (for frying) — 250 ml (oil) — zepto: "sunflower oil" · instamart: "refined tel"
- Garam masala — 0.5 tsp (spice) _(optional)_ — zepto: "garam masala powder" · instamart: "garam masala"

### Steps
1. Knead maida with a little salt, ghee and water into a stiff dough; rest 20 minutes.
2. Boil, peel and roughly mash the potatoes; set aside.
3. Heat oil in a kadai, temper with cumin, add ginger paste, tomatoes and turmeric, and cook till soft.
4. Add potatoes, salt, green chilli and a splash of water; simmer 8-10 minutes and finish with garam masala.
5. Roll the dough into small discs and deep fry in hot oil until puffed and golden.
6. Serve the hot luchi immediately with the aloor dom.

---

## Machher Jhol (Bengali Fish Curry) with Rice (West Bengal · Lunch)

```yaml
id: west_bengal_lunch_machher_jhol_bengali_fish_curry_with_rice
state: West Bengal
region_zone: East
meal_type: lunch
diet_type: nonveg
tags: [fish, everyday, mustard oil, comfort food]
goal_tags: [maintenance, muscle, recovery]
```

A light, turmeric-forward everyday Bengali fish curry with potatoes, simmered in mustard oil and served over steamed rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 32g protein · 55g carbs · 14g fat

### Ingredients
- Rohu fish (fresh, curry cut) — 4 piece (protein) — zepto: "rohu fish fresh" · instamart: "rohu machli"
- Rice — 300 g (grain) — zepto: "rice" · instamart: "chawal"
- Potato — 1 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Turmeric powder — 1.5 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Nigella seeds (kalonji) — 0.5 tsp (spice) _(optional)_ — zepto: "kalonji nigella seeds" · instamart: "kalonji"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Cumin-coriander powder — 1 tsp (spice) — zepto: "cumin coriander powder" · instamart: "dhania jeera powder"
- Tomato — 1 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"

### Steps
1. Rub the fish pieces with salt and turmeric; shallow fry in mustard oil until lightly golden, then remove.
2. In the same oil, temper nigella seeds, add potato wedges and fry briefly.
3. Add turmeric, cumin-coriander powder, tomato and green chilli; cook till the oil separates.
4. Add water, bring to a boil and simmer the potatoes until half done.
5. Slide in the fried fish, cover and simmer 8-10 minutes until cooked through.
6. Serve hot with steamed rice.

---

## Jhal Muri (West Bengal · Snack)

```yaml
id: west_bengal_snack_jhal_muri
state: West Bengal
region_zone: East
meal_type: snack
diet_type: veg
tags: [quick, street food, spicy, no-cook]
goal_tags: [maintenance, weight_loss]
```

A spicy, tangy puffed-rice street snack tossed with mustard oil, peanuts, chopped vegetables and chaat masala.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 0 min · **Difficulty:** easy
**Nutrition (approx per serving):** 180 kcal · 5g protein · 28g carbs · 6g fat

### Ingredients
- Puffed rice (muri) — 150 g (grain) — zepto: "puffed rice murmura" · instamart: "muri"
- Roasted peanuts — 40 g (protein) — zepto: "roasted peanuts" · instamart: "moongfali"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 small (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Cucumber — 1 small (vegetable) _(optional)_ — zepto: "cucumber" · instamart: "kheera"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Chaat masala — 1 tsp (spice) — zepto: "chaat masala" · instamart: "chaat masala"
- Lemon — 1 piece (fruit) _(optional)_ — zepto: "lemon" · instamart: "nimbu"

### Steps
1. Finely chop the onion, tomato, cucumber and green chilli.
2. In a large bowl, combine puffed rice, peanuts and the chopped vegetables.
3. Drizzle mustard oil, sprinkle chaat masala and salt, and squeeze in lemon juice.
4. Toss everything well until evenly coated and serve immediately while crisp.

---

## Kosha Mangsho with Rice (West Bengal · Dinner)

```yaml
id: west_bengal_dinner_kosha_mangsho_with_rice
state: West Bengal
region_zone: East
meal_type: dinner
diet_type: nonveg
tags: [mutton, slow-cooked, festive, rich]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A rich, slow-cooked Bengali mutton curry deeply browned with onions and whole spices, traditionally served with rice or luchi.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 50 min · **Difficulty:** hard
**Nutrition (approx per serving):** 520 kcal · 34g protein · 20g carbs · 32g fat

### Ingredients
- Mutton (goat, curry cut) — 500 g (protein) — zepto: "mutton curry cut" · instamart: "mutton"
- Onion — 4 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Ginger-garlic paste — 2 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Curd (yogurt) — 100 g (dairy) — zepto: "curd yogurt" · instamart: "dahi"
- Mustard oil — 4 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Bay leaf — 2 piece (spice) _(optional)_ — zepto: "bay leaf tej patta" · instamart: "tej patta"
- Whole garam masala (cinnamon, cardamom, cloves) — 1 tbsp (spice) _(optional)_ — zepto: "whole garam masala" · instamart: "sabut garam masala"
- Red chilli powder — 1.5 tsp (spice) — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Sugar — 1 tsp (other) _(optional)_ — zepto: "sugar" · instamart: "cheeni"
- Potato — 2 medium (vegetable) _(optional)_ — zepto: "potato" · instamart: "aloo"

### Steps
1. Marinate the mutton with curd, ginger-garlic paste, turmeric and salt for at least 1 hour.
2. Heat mustard oil and caramelize sliced onions with whole garam masala and bay leaf until deep brown.
3. Add the marinated mutton and sear on high heat, stirring often, until well browned (the "kosha" stage).
4. Add red chilli powder and a little sugar, cover and cook on low heat, adding splashes of water, until the mutton is tender (40-45 minutes).
5. Add potatoes midway if using, and continue cooking until the gravy is thick and oil separates.
6. Serve hot with steamed rice or luchi.

---

## Chakuli Pitha (Odisha · Breakfast)

```yaml
id: odisha_breakfast_chakuli_pitha
state: Odisha
region_zone: East
meal_type: breakfast
diet_type: veg
tags: [fermented, breakfast staple, gluten-free]
goal_tags: [maintenance]
```

Soft, savoury fermented rice-and-urad-dal crepes, a staple Odia breakfast usually paired with tomato chutney or dalma.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 300 kcal · 9g protein · 48g carbs · 8g fat

### Ingredients
- Raw rice — 200 g (grain) — zepto: "raw rice" · instamart: "chawal"
- Urad dal (split black gram) — 60 g (protein) — zepto: "urad dal" · instamart: "urad dal"
- Cooked rice (leftover) — 50 g (grain) _(optional)_ — zepto: "rice" · instamart: "chawal"
- Cumin seeds — 0.5 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Green chilli — 1 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Sunflower/refined oil — 3 tbsp (oil) — zepto: "sunflower oil" · instamart: "refined tel"
- Tomato (for chutney) — 2 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"

### Steps
1. Soak rice and urad dal separately for 4-5 hours, then grind together with the cooked rice into a smooth, slightly thin batter; ferment overnight.
2. Mix in salt, cumin seeds, chopped onion and green chilli.
3. Heat a griddle, pour a ladle of batter and spread thin like a crepe.
4. Drizzle a little oil around the edges and cook until crisp and golden on the base; no need to flip.
5. Serve hot with tomato chutney or a bowl of dalma.

---

## Dalma with Rice (Odisha · Lunch)

```yaml
id: odisha_lunch_dalma_with_rice
state: Odisha
region_zone: East
meal_type: lunch
diet_type: veg
tags: [everyday, lentils, wholesome, one-pot]
goal_tags: [maintenance]
```

A wholesome Odia lentil-and-vegetable stew tempered with panch phutana, served over steamed rice as the quintessential daily lunch.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 16g protein · 60g carbs · 8g fat

### Ingredients
- Toor dal (split pigeon pea) — 150 g (protein) — zepto: "toor dal arhar dal" · instamart: "arhar dal"
- Raw banana — 1 piece (vegetable) _(optional)_ — zepto: "raw banana" · instamart: "kaccha kela"
- Pumpkin — 150 g (vegetable) _(optional)_ — zepto: "pumpkin" · instamart: "kaddu"
- Brinjal — 1 small (vegetable) _(optional)_ — zepto: "brinjal eggplant" · instamart: "baingan"
- Panch phutana (five-spice mix) — 1 tsp (spice) _(optional)_ — zepto: "panch phoron" · instamart: "panch phoron"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Ghee — 1 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"
- Dry red chilli — 2 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "sukhi lal mirch"
- Rice (for serving) — 300 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Pressure cook toor dal with turmeric, chopped raw banana, pumpkin and brinjal until soft.
2. Mash lightly and adjust the consistency with water; add salt and simmer 5 minutes.
3. Heat ghee in a small pan and temper panch phutana and dry red chillies until fragrant.
4. Pour the tempering over the dalma and mix well.
5. Serve hot with steamed rice.

---

## Ghuguni (Odisha · Snack)

```yaml
id: odisha_snack_ghuguni
state: Odisha
region_zone: East
meal_type: snack
diet_type: veg
tags: [street food, tangy, protein-rich, snack]
goal_tags: [maintenance, weight_loss]
```

A tangy, spiced curry of dried yellow peas simmered and finished with tamarind, onion and sev — a favourite Odia evening street snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 220 kcal · 11g protein · 34g carbs · 5g fat

### Ingredients
- Dried yellow peas — 200 g (protein) — zepto: "dried yellow peas" · instamart: "safed matar"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 1 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Tamarind pulp — 1 tbsp (other) _(optional)_ — zepto: "tamarind pulp imli" · instamart: "imli"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Sev (for garnish) — 30 g (other) _(optional)_ — zepto: "sev namkeen" · instamart: "sev"

### Steps
1. Soak the dried yellow peas overnight; pressure cook with turmeric and salt until soft.
2. Heat mustard oil, sauté onion until golden, then add ginger-garlic paste and tomato and cook till soft.
3. Add the boiled peas along with their water and simmer until the curry thickens slightly.
4. Stir in tamarind pulp for tang and adjust the seasoning.
5. Serve warm topped with chopped onion and sev.

---

## Macha Besara (Fish in Mustard Gravy) (Odisha · Dinner)

```yaml
id: odisha_dinner_macha_besara_fish_in_mustard_gravy
state: Odisha
region_zone: East
meal_type: dinner
diet_type: nonveg
tags: [fish, mustard, tangy, dinner]
goal_tags: [maintenance, muscle, recovery]
```

A classic Odia fish curry cooked in a pungent mustard-paste gravy, typically enjoyed for dinner with plain rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 400 kcal · 30g protein · 12g carbs · 22g fat

### Ingredients
- Rohu or Katla fish — 4 piece (protein) — zepto: "rohu fish fresh" · instamart: "rohu machli"
- Mustard seeds — 3 tbsp (spice) — zepto: "mustard seeds" · instamart: "rai sarson"
- Green chilli — 3 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Turmeric powder — 1.5 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Nigella seeds (kalonji) — 0.5 tsp (spice) _(optional)_ — zepto: "kalonji nigella seeds" · instamart: "kalonji"
- Garlic — 4 clove (vegetable) _(optional)_ — zepto: "garlic" · instamart: "lahsun"

### Steps
1. Marinate the fish pieces with salt and turmeric; shallow fry lightly in mustard oil and set aside.
2. Grind mustard seeds, green chilli and garlic with a little water into a smooth paste.
3. In the same oil, temper kalonji, add the mustard paste and turmeric, and cook briefly until the raw smell disappears.
4. Add water to form a thin gravy and bring to a simmer.
5. Slide in the fried fish, cover and cook 6-8 minutes on low heat without overcooking.
6. Serve hot with steamed rice.

---

## Sattu Paratha (Bihar · Breakfast)

```yaml
id: bihar_breakfast_sattu_paratha
state: Bihar
region_zone: East
meal_type: breakfast
diet_type: veg
tags: [stuffed paratha, protein-rich, breakfast staple]
goal_tags: [maintenance]
```

Whole-wheat flatbread stuffed with a spiced roasted-gram (sattu) filling, a protein-packed Bihari breakfast served with curd or pickle.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 340 kcal · 12g protein · 45g carbs · 12g fat

### Ingredients
- Whole wheat flour (atta) — 250 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Sattu (roasted gram flour) — 150 g (protein) — zepto: "sattu roasted gram flour" · instamart: "sattu"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Lemon — 1 piece (fruit) _(optional)_ — zepto: "lemon" · instamart: "nimbu"
- Ajwain (carom seeds) — 0.5 tsp (spice) _(optional)_ — zepto: "ajwain carom seeds" · instamart: "ajwain"
- Ghee (for roasting) — 2 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"
- Curd (to serve) — 100 g (dairy) _(optional)_ — zepto: "curd yogurt" · instamart: "dahi"

### Steps
1. Knead the wheat flour into a soft dough with water and a little salt; rest 15 minutes.
2. Mix sattu with chopped onion, green chilli, mustard oil, lemon juice, ajwain and salt, adding a splash of water to bind.
3. Roll a dough ball into a small disc, place the sattu filling in the centre and seal into a stuffed ball.
4. Roll out gently into a paratha and roast on a hot griddle with ghee until golden on both sides.
5. Serve hot with curd or pickle.

---

## Litti Chokha (Bihar · Lunch)

```yaml
id: bihar_lunch_litti_chokha
state: Bihar
region_zone: East
meal_type: lunch
diet_type: veg
tags: [iconic, roasted, wholesome, festive]
goal_tags: [maintenance]
```

Roasted sattu-stuffed wheat balls served with mashed spiced potato-brinjal chokha and a drizzle of ghee — Bihar's signature meal.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 450 kcal · 15g protein · 55g carbs · 18g fat

### Ingredients
- Whole wheat flour (atta) — 250 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Sattu (roasted gram flour) — 200 g (protein) — zepto: "sattu roasted gram flour" · instamart: "sattu"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Ajwain (carom seeds) — 1 tsp (spice) _(optional)_ — zepto: "ajwain carom seeds" · instamart: "ajwain"
- Brinjal — 1 large (vegetable) — zepto: "brinjal eggplant" · instamart: "baingan"
- Potato — 3 medium (vegetable) — zepto: "potato" · instamart: "aloo"
- Tomato — 2 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tamatar"
- Garlic — 4 clove (vegetable) _(optional)_ — zepto: "garlic" · instamart: "lahsun"
- Ghee — 3 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Knead the wheat flour into a stiff dough; make small balls and stuff with a mix of sattu, mustard oil, ajwain, chopped garlic, salt and a little water.
2. Seal the balls fully and roast on an open flame or in a hot oven, turning until crusty and cooked through.
3. Roast the brinjal, potatoes and tomatoes directly over flame or in the oven until charred and soft; peel.
4. Mash them together with garlic, mustard oil, green chilli and salt to make the chokha.
5. Dip the roasted littis in ghee and serve hot alongside the chokha.

---

## Chura Matar (Bihar · Snack)

```yaml
id: bihar_snack_chura_matar
state: Bihar
region_zone: East
meal_type: snack
diet_type: veg
tags: [quick, winter, light, tea-time]
goal_tags: [maintenance, weight_loss]
```

A light, home-style snack of flattened rice sautéed with green peas, mild spices and a hint of ghee — a favourite Bihari winter tea-time dish.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 210 kcal · 6g protein · 32g carbs · 7g fat

### Ingredients
- Thick poha (flattened rice) — 200 g (grain) — zepto: "poha flattened rice" · instamart: "poha"
- Green peas — 150 g (vegetable) — zepto: "green peas" · instamart: "matar"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Ghee — 2 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"
- Cumin seeds — 0.5 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Turmeric powder — 0.25 tsp (spice) _(optional)_ — zepto: "turmeric powder" · instamart: "haldi"

### Steps
1. Rinse the thick poha briefly and drain; set aside to soften slightly.
2. Heat ghee in a pan, temper cumin seeds, add onion and green chilli, and sauté until soft.
3. Add green peas and a little water, and cook until the peas are tender.
4. Add turmeric and salt, then fold in the softened poha, mixing gently.
5. Cook for 2-3 minutes on low heat and serve warm.

---

## Bihari Kadhi Badi with Rice (Bihar · Dinner)

```yaml
id: bihar_dinner_bihari_kadhi_badi_with_rice
state: Bihar
region_zone: East
meal_type: dinner
diet_type: veg
tags: [comfort food, tangy, dinner, curd-based]
goal_tags: [maintenance]
```

A tangy besan-and-curd kadhi studded with fried gram-flour dumplings, a comforting Bihari dinner staple served over rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 380 kcal · 13g protein · 48g carbs · 14g fat

### Ingredients
- Besan (gram flour) — 150 g (protein) — zepto: "besan gram flour" · instamart: "besan"
- Curd (sour yogurt) — 250 g (dairy) — zepto: "curd yogurt" · instamart: "dahi"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Mustard seeds — 0.5 tsp (spice) _(optional)_ — zepto: "mustard seeds" · instamart: "rai sarson"
- Curry leaves — 6 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Mustard/refined oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Rice (for serving) — 300 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Make a thick batter with half the besan, chopped onion, a pinch of salt and water; deep fry small dumplings (badi) until golden, then drain.
2. Whisk the remaining besan into sour curd with turmeric and water to make a smooth, thin mixture.
3. Heat oil, temper mustard seeds and curry leaves, then pour in the curd-besan mixture, stirring continuously to prevent curdling.
4. Simmer on low heat for 15-20 minutes until the kadhi thickens, then add the fried badi.
5. Simmer 5 more minutes and serve hot with steamed rice.

---

## Dhuska with Ghugni (Jharkhand · Breakfast)

```yaml
id: jharkhand_breakfast_dhuska_with_ghugni
state: Jharkhand
region_zone: East
meal_type: breakfast
diet_type: veg
tags: [fried, breakfast staple, tribal cuisine]
goal_tags: [maintenance]
```

Deep-fried, lightly spiced rice-and-lentil pancakes, a much-loved Jharkhand breakfast usually paired with spicy ghugni or aloo curry.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 350 kcal · 10g protein · 42g carbs · 16g fat

### Ingredients
- Raw rice — 200 g (grain) — zepto: "raw rice" · instamart: "chawal"
- Chana dal (split gram) — 80 g (protein) — zepto: "chana dal" · instamart: "chana dal"
- Onion — 1 small (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Cumin seeds — 0.5 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Green chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "hari mirch"
- Sunflower/refined oil (for frying) — 250 ml (oil) — zepto: "sunflower oil" · instamart: "refined tel"
- Dried yellow peas (for ghugni) — 150 g (protein) _(optional)_ — zepto: "dried yellow peas" · instamart: "safed matar"

### Steps
1. Soak the rice and chana dal together for 4-5 hours, then grind into a thick, slightly coarse batter.
2. Mix in chopped onion, green chilli, cumin seeds and salt.
3. Heat oil in a kadai, pour small ladlefuls of batter and deep fry until crisp and golden on both sides.
4. Meanwhile, prepare a simple ghugni by simmering soaked, boiled yellow peas with onion, turmeric and spices.
5. Serve the hot dhuska with ghugni or a side of spicy aloo curry.

---

## Rugra (Wild Mushroom) Curry with Rice (Jharkhand · Lunch)

```yaml
id: jharkhand_lunch_rugra_wild_mushroom_curry_with_rice
state: Jharkhand
region_zone: East
meal_type: lunch
diet_type: veg
tags: [tribal cuisine, mushroom, seasonal, rustic]
goal_tags: [maintenance]
```

A rustic tribal Jharkhand curry made from rugra, a seasonal wild desert-truffle mushroom, simmered in an onion-tomato gravy and served with rice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 320 kcal · 9g protein · 50g carbs · 9g fat

### Ingredients
- Rugra (wild mushroom, or button mushroom substitute) — 250 g (vegetable) — zepto: "mushroom fresh" · instamart: "mushroom"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger-garlic paste — 1 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Red chilli powder — 1 tsp (spice) _(optional)_ — zepto: "red chilli powder" · instamart: "lal mirch powder"
- Rice (for serving) — 300 g (grain) — zepto: "rice" · instamart: "chawal"

### Steps
1. Clean the rugra or mushrooms thoroughly and chop into bite-sized pieces.
2. Heat mustard oil, sauté onions until golden, then add ginger-garlic paste and cook till fragrant.
3. Add tomatoes, turmeric and red chilli powder, and cook until the masala thickens and oil separates.
4. Add the mushrooms and salt, cover and cook on low heat until tender, adding a little water as needed.
5. Simmer until the gravy reaches the desired consistency and serve hot with steamed rice.

---

## Thekua (Jharkhand · Snack)

```yaml
id: jharkhand_snack_thekua
state: Jharkhand
region_zone: East
meal_type: snack
diet_type: veg
tags: [sweet, fried, festive, tea-time]
goal_tags: [maintenance, weight_loss]
```

A dense, sweet, deep-fried wheat-flour and jaggery snack, traditionally made in Jharkhand and enjoyed as a tea-time and festive treat.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 3g protein · 38g carbs · 11g fat

### Ingredients
- Whole wheat flour (atta) — 200 g (grain) — zepto: "wheat flour atta" · instamart: "atta"
- Jaggery — 100 g (other) — zepto: "jaggery gur" · instamart: "gur"
- Ghee — 2 tbsp (dairy) — zepto: "ghee" · instamart: "desi ghee"
- Grated coconut (dried) — 30 g (other) _(optional)_ — zepto: "desiccated coconut" · instamart: "nariyal burada"
- Fennel seeds — 0.5 tsp (spice) _(optional)_ — zepto: "fennel seeds saunf" · instamart: "saunf"
- Sunflower/refined oil (for frying) — 250 ml (oil) — zepto: "sunflower oil" · instamart: "refined tel"

### Steps
1. Dissolve jaggery in a little warm water to make a syrup.
2. Mix wheat flour with ghee, grated coconut and fennel seeds, then knead into a stiff dough using the jaggery syrup.
3. Divide into small portions and press or shape into flat discs with ridged patterns.
4. Deep fry on low-medium heat until deep golden brown and crisp, turning occasionally.
5. Cool completely before storing or serving; keeps well for several days.

---

## Chilka Roti with Desi Chicken Curry (Jharkhand · Dinner)

```yaml
id: jharkhand_dinner_chilka_roti_with_desi_chicken_curry
state: Jharkhand
region_zone: East
meal_type: dinner
diet_type: nonveg
tags: [rustic, chicken, dinner, mustard oil]
goal_tags: [maintenance, muscle, recovery]
```

Rice-flour crepe-like flatbread paired with a rustic mustard-oil country chicken curry, a hearty Jharkhand dinner combination.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 32g protein · 38g carbs · 22g fat

### Ingredients
- Rice flour — 200 g (grain) — zepto: "rice flour" · instamart: "chawal ka atta"
- Chicken, curry cut — 500 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger-garlic paste — 1.5 tbsp (spice) — zepto: "ginger garlic paste" · instamart: "adrak lahsun paste"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi"
- Red chilli powder — 1.5 tsp (spice) _(optional)_ — zepto: "red chilli powder" · instamart: "lal mirch powder"

### Steps
1. Mix rice flour with water and a pinch of salt into a thin, lump-free batter; rest 15 minutes.
2. Heat mustard oil, sauté onions until golden, then add ginger-garlic paste, tomatoes, turmeric and chilli powder, cooking till the oil separates.
3. Add chicken pieces, sear on high heat for a few minutes, then add salt and a little water.
4. Cover and simmer until the chicken is fully cooked and the gravy thickens.
5. Meanwhile, pour ladles of rice batter onto a hot griddle and cook into thin crepes (chilka roti) on both sides.
6. Serve the hot chilka roti alongside the chicken curry.

---

# Central Zone

## Kachori Sabzi (Uttar Pradesh · Breakfast)

```yaml
id: uttar_pradesh_breakfast_kachori_sabzi
state: Uttar Pradesh
region_zone: Central
meal_type: breakfast
diet_type: veg
tags: [spicy, deep-fried, traditional, street-food]
goal_tags: [maintenance]
```

Deep-fried spiced urad dal-stuffed kachoris served with a tangy, mildly spiced potato curry, a much-loved Uttar Pradesh breakfast.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 11g protein · 60g carbs · 22g fat

### Ingredients
- Wheat flour (maida) — 150 g (grain) — zepto: "refined flour maida" · instamart: "maida"
- Urad dal (split) — 50 g (protein) — zepto: "urad dal split" · instamart: "urad dal dhuli"
- Fennel seeds — 1 tsp (spice) _(optional)_ — zepto: "fennel seeds saunf" · instamart: "saunf"
- Potato — 300 g (vegetable) — zepto: "potato" · instamart: "aloo"
- Tomato — 150 g (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger — 15 g (vegetable) _(optional)_ — zepto: "fresh ginger" · instamart: "adrak"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Red chili powder — 1 tsp (spice) — zepto: "red chili powder" · instamart: "lal mirch powder"
- Cooking oil — 400 ml (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Soak urad dal for 2 hours, then grind coarsely with fennel seeds, ginger and green chili to make the stuffing.
2. Knead a stiff dough with maida, a little oil and water; rest for 20 minutes.
3. Stuff small dough balls with the dal mixture, flatten gently into discs, and deep fry on low-medium heat until golden and crisp.
4. Boil and lightly mash the potatoes; sauté with chopped tomato, ginger, turmeric and red chili powder in a little oil, then add water to form a thin gravy and simmer 10 minutes.
5. Serve the hot kachoris crushed lightly into the sabzi, garnished with coriander.

---

## Tehri (Vegetable Pulao) (Uttar Pradesh · Lunch)

```yaml
id: uttar_pradesh_lunch_tehri_vegetable_pulao
state: Uttar Pradesh
region_zone: Central
meal_type: lunch
diet_type: veg
tags: [one-pot, comfort, quick, homestyle]
goal_tags: [maintenance]
```

A one-pot turmeric-spiced vegetable rice pulao made with everyday vegetables, a humble yet iconic UP lunch staple.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 420 kcal · 8g protein · 70g carbs · 12g fat

### Ingredients
- Basmati rice — 200 g (grain) — zepto: "basmati rice" · instamart: "chawal"
- Potato — 100 g (vegetable) — zepto: "potato" · instamart: "aloo"
- Cauliflower — 100 g (vegetable) — zepto: "cauliflower" · instamart: "phool gobi"
- Carrot — 50 g (vegetable) _(optional)_ — zepto: "carrot" · instamart: "gajar"
- Green peas — 50 g (vegetable) _(optional)_ — zepto: "green peas" · instamart: "matar"
- Onion — 100 g (vegetable) — zepto: "onion" · instamart: "pyaz"
- Ginger-garlic paste — 10 g (vegetable) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Cumin seeds — 1 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Ghee — 2 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Wash and soak the rice for 20 minutes, then drain.
2. Heat ghee, splutter cumin seeds, and sauté onions until golden.
3. Add ginger-garlic paste, turmeric and all chopped vegetables; sauté for 5 minutes.
4. Add the drained rice, salt and water (1:2 ratio); bring to a boil.
5. Cover and cook on low heat for about 15 minutes until the rice is fluffy and fully cooked.
6. Fluff gently and serve hot with raita or a simple salad.

---

## Aloo Tikki Chaat (Uttar Pradesh · Snack)

```yaml
id: uttar_pradesh_snack_aloo_tikki_chaat
state: Uttar Pradesh
region_zone: Central
meal_type: snack
diet_type: veg
tags: [street-food, tangy, quick, chaat]
goal_tags: [maintenance]
```

Crisp shallow-fried potato patties topped with tangy tamarind and mint chutneys, yogurt and sev — a classic UP street-food snack.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 8g protein · 52g carbs · 15g fat

### Ingredients
- Potato — 300 g (vegetable) — zepto: "potato" · instamart: "aloo"
- Cornflour — 20 g (other) — zepto: "cornflour" · instamart: "corn flour"
- Green chili — 1 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Curd (yogurt) — 100 g (dairy) — zepto: "fresh curd" · instamart: "dahi"
- Tamarind chutney — 30 g (other) — zepto: "tamarind chutney" · instamart: "imli chutney"
- Mint-coriander chutney — 30 g (other) — zepto: "mint coriander chutney" · instamart: "hari chutney"
- Sev — 30 g (other) — zepto: "sev namkeen" · instamart: "sev"
- Chaat masala — 1 tsp (spice) _(optional)_ — zepto: "chaat masala" · instamart: "chaat masala"
- Cooking oil — 3 tbsp (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Boil and mash the potatoes; mix with cornflour, chopped green chili and salt, then shape into flat patties.
2. Shallow fry the patties on a griddle until golden and crisp on both sides.
3. Whisk the curd smooth; keep the tamarind and mint chutneys ready.
4. Plate the hot tikkis and top with curd, both chutneys and chaat masala.
5. Sprinkle sev over the top and serve immediately.

---

## Murgh Korma (Awadhi Chicken Korma) (Uttar Pradesh · Dinner)

```yaml
id: uttar_pradesh_dinner_murgh_korma_awadhi_chicken_korma
state: Uttar Pradesh
region_zone: Central
meal_type: dinner
diet_type: nonveg
tags: [rich, festive, awadhi, creamy]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A rich, mildly spiced Lucknowi chicken curry braised in a cashew-onion-yogurt gravy, a signature Awadhi dinner dish.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 32g protein · 12g carbs · 32g fat

### Ingredients
- Chicken (curry cut, bone-in) — 500 g (protein) — zepto: "chicken curry cut" · instamart: "chicken"
- Curd (yogurt) — 150 g (dairy) — zepto: "fresh curd" · instamart: "dahi"
- Cashew nuts — 30 g (other) — zepto: "cashew nuts kaju" · instamart: "kaju"
- Onion — 150 g (vegetable) — zepto: "onion" · instamart: "pyaz"
- Ginger-garlic paste — 15 g (vegetable) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Green cardamom — 3 piece (spice) _(optional)_ — zepto: "green cardamom elaichi" · instamart: "elaichi"
- Cinnamon stick — 1 piece (spice) _(optional)_ — zepto: "cinnamon stick dalchini" · instamart: "dalchini"
- Red chili powder — 1 tsp (spice) — zepto: "red chili powder" · instamart: "lal mirch powder"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Fry sliced onions until deep golden, then blend to a smooth paste along with soaked cashews.
2. Marinate the chicken with curd, ginger-garlic paste and a pinch of turmeric for 20 minutes.
3. Heat ghee, temper the whole spices, add the marinated chicken and sear for 5 minutes.
4. Stir in the onion-cashew paste and red chili powder; cover and cook on low heat until the chicken is tender, about 20-25 minutes.
5. Adjust consistency with a little water and season with salt.
6. Serve hot with sheermal or steamed rice.

---

## Indori Poha (Madhya Pradesh · Breakfast)

```yaml
id: madhya_pradesh_breakfast_indori_poha
state: Madhya Pradesh
region_zone: Central
meal_type: breakfast
diet_type: veg
tags: [quick, tangy, street-food, light]
goal_tags: [maintenance]
```

Flattened rice tempered with mustard seeds and curry leaves, topped with sev, pomegranate and lemon — Indore's most iconic breakfast.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 6g protein · 55g carbs · 9g fat

### Ingredients
- Thick poha (flattened rice) — 200 g (grain) — zepto: "thick poha flattened rice" · instamart: "poha"
- Potato — 100 g (vegetable) _(optional)_ — zepto: "potato" · instamart: "aloo"
- Onion — 80 g (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Green chili — 1 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Sev — 30 g (other) — zepto: "sev namkeen" · instamart: "sev"
- Lemon — 1 piece (fruit) — zepto: "lemon" · instamart: "nimbu"
- Cooking oil — 2 tbsp (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Rinse the poha in a colander under running water until softened; drain and set aside.
2. Heat oil, splutter mustard seeds and curry leaves, then sauté onion, potato and green chili until soft.
3. Add turmeric and a pinch of sugar, then fold in the softened poha; toss gently on low heat for 3-4 minutes.
4. Season with salt, cover and steam for 2 minutes.
5. Top with sev and a squeeze of lemon before serving hot.

---

## Dal Bafla (Madhya Pradesh · Lunch)

```yaml
id: madhya_pradesh_lunch_dal_bafla
state: Madhya Pradesh
region_zone: Central
meal_type: lunch
diet_type: veg
tags: [hearty, traditional, festive, ghee-rich]
goal_tags: [maintenance, weight_gain]
```

Whole wheat dough balls boiled then roasted and soaked in ghee, served with spicy mixed-lentil dal — the Malwa region's hearty signature lunch.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 45 min · **Difficulty:** medium
**Nutrition (approx per serving):** 620 kcal · 18g protein · 78g carbs · 26g fat

### Ingredients
- Whole wheat flour (atta) — 250 g (grain) — zepto: "whole wheat flour atta" · instamart: "atta"
- Semolina (sooji) — 30 g (grain) _(optional)_ — zepto: "semolina sooji" · instamart: "sooji"
- Mixed lentils (toor, chana, moong, urad dal) — 150 g (protein) — zepto: "mixed dal panchmel" · instamart: "mix dal"
- Onion — 80 g (vegetable) — zepto: "onion" · instamart: "pyaz"
- Tomato — 100 g (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Ginger-garlic paste — 10 g (vegetable) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Red chili powder — 1 tsp (spice) — zepto: "red chili powder" · instamart: "lal mirch powder"
- Ghee — 60 g (oil) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Knead a stiff dough with atta, sooji and a little ghee and water; shape into round baflas.
2. Boil the baflas in water for 20 minutes until firm, then roast in an oven or over a tawa until golden and crusted.
3. Pressure cook the mixed lentils with turmeric until soft, then mash lightly.
4. Prepare a tempering with onion, tomato, ginger-garlic paste and red chili powder, then simmer the dal in it for 10 minutes.
5. Crack open the hot baflas and soak generously in melted ghee.
6. Serve the baflas with the hot dal and extra ghee on the side.

---

## Bhutte ka Kees (Madhya Pradesh · Snack)

```yaml
id: madhya_pradesh_snack_bhutte_ka_kees
state: Madhya Pradesh
region_zone: Central
meal_type: snack
diet_type: veg
tags: [corn, quick, indori, snack]
goal_tags: [maintenance, weight_loss]
```

Grated corn slow-cooked with milk, mustard seeds and green chillies into a creamy, savory Indori snack finished with a squeeze of lime.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 6g protein · 34g carbs · 11g fat

### Ingredients
- Sweet corn (on cob) — 3 medium (vegetable) — zepto: "sweet corn cob" · instamart: "bhutta"
- Milk — 100 ml (dairy) — zepto: "toned milk" · instamart: "doodh"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Ginger — 10 g (vegetable) _(optional)_ — zepto: "fresh ginger" · instamart: "adrak"
- Mustard seeds — 0.5 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Cumin seeds — 0.5 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Turmeric powder — 0.25 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Butter — 2 tbsp (oil) — zepto: "butter" · instamart: "makhan"
- Lemon — 1 piece (fruit) _(optional)_ — zepto: "lemon" · instamart: "nimbu"

### Steps
1. Grate the corn kernels off the cob coarsely using a box grater.
2. Heat butter, splutter mustard and cumin seeds, then sauté ginger and green chili.
3. Add the grated corn, turmeric and milk; cook on low heat, stirring frequently, until thick and creamy, about 12-15 minutes.
4. Season with salt and a pinch of sugar if desired.
5. Garnish with coriander and a squeeze of lemon, and serve hot.

---

## Bhopali Gosht Korma (Madhya Pradesh · Dinner)

```yaml
id: madhya_pradesh_dinner_bhopali_gosht_korma
state: Madhya Pradesh
region_zone: Central
meal_type: dinner
diet_type: nonveg
tags: [rich, festive, nawabi, slow-cooked]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A slow-cooked mutton curry simmered in a fragrant onion-yogurt gravy, reflecting Bhopal's Nawabi culinary heritage — a special-occasion dinner dish.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 50 min · **Difficulty:** hard
**Nutrition (approx per serving):** 520 kcal · 34g protein · 10g carbs · 36g fat

### Ingredients
- Mutton (curry cut, bone-in) — 500 g (protein) — zepto: "mutton curry cut" · instamart: "mutton"
- Curd (yogurt) — 150 g (dairy) — zepto: "fresh curd" · instamart: "dahi"
- Onion — 200 g (vegetable) — zepto: "onion" · instamart: "pyaz"
- Ginger-garlic paste — 20 g (vegetable) — zepto: "ginger garlic paste" · instamart: "adrak lehsun paste"
- Whole garam masala (bay leaf, cinnamon, cloves, cardamom) — 1 tbsp (spice) _(optional)_ — zepto: "whole garam masala" · instamart: "sabut garam masala"
- Red chili powder — 1.5 tsp (spice) — zepto: "red chili powder" · instamart: "lal mirch powder"
- Coriander powder — 1 tsp (spice) — zepto: "coriander powder dhania" · instamart: "dhania powder"
- Ghee — 3 tbsp (oil) — zepto: "ghee" · instamart: "desi ghee"

### Steps
1. Fry sliced onions until deep golden and crisp; reserve some for garnish and grind the rest into a paste.
2. Marinate the mutton with curd, ginger-garlic paste and turmeric for 30 minutes.
3. Heat ghee, temper the whole garam masala, add the marinated mutton and sear until the color changes.
4. Stir in the onion paste, red chili and coriander powder; cover and cook on low flame, adding water as needed, until the mutton is fall-off-the-bone tender, about 35-40 minutes.
5. Adjust seasoning and garnish with the reserved fried onions.
6. Serve hot with sheermal, naan or steamed rice.

---

## Chila (Chhattisgarh · Breakfast)

```yaml
id: chhattisgarh_breakfast_chila
state: Chhattisgarh
region_zone: Central
meal_type: breakfast
diet_type: veg
tags: [fermented, quick, homestyle, breakfast]
goal_tags: [maintenance]
```

A savory pancake made from a fermented rice-urad dal batter, pan-cooked and served with tomato or garlic chutney — a staple Chhattisgarhi breakfast.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 300 kcal · 9g protein · 48g carbs · 8g fat

### Ingredients
- Rice — 150 g (grain) — zepto: "rice" · instamart: "chawal"
- Urad dal (split) — 50 g (protein) — zepto: "urad dal split" · instamart: "urad dal dhuli"
- Onion — 50 g (vegetable) _(optional)_ — zepto: "onion" · instamart: "pyaz"
- Green chili — 1 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Ginger — 10 g (vegetable) _(optional)_ — zepto: "fresh ginger" · instamart: "adrak"
- Cumin seeds — 0.5 tsp (spice) _(optional)_ — zepto: "cumin seeds jeera" · instamart: "jeera"
- Cooking oil — 2 tbsp (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Soak the rice and urad dal together for 4-5 hours, then grind to a smooth, medium-thick batter; ferment for a few hours if time allows.
2. Mix in finely chopped onion, green chili, ginger, cumin seeds and salt.
3. Heat a griddle, pour a ladle of batter and spread into a thin round pancake.
4. Drizzle a little oil around the edges and cook until golden and crisp on both sides.
5. Serve hot with tomato or garlic chutney.

---

## Bafauri (Chhattisgarh · Lunch)

```yaml
id: chhattisgarh_lunch_bafauri
state: Chhattisgarh
region_zone: Central
meal_type: lunch
diet_type: veg
tags: [steamed, protein-rich, traditional, homestyle]
goal_tags: [maintenance]
```

Steamed chana dal and cabbage dumplings simmered in a lightly spiced tomato curry, served with rice for a wholesome Chhattisgarhi lunch.

**Serves:** 2 · **Prep:** 25 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 380 kcal · 16g protein · 52g carbs · 10g fat

### Ingredients
- Chana dal (split) — 200 g (protein) — zepto: "chana dal split" · instamart: "chana dal"
- Cabbage (shredded) — 100 g (vegetable) _(optional)_ — zepto: "cabbage" · instamart: "patta gobi"
- Ginger — 10 g (vegetable) _(optional)_ — zepto: "fresh ginger" · instamart: "adrak"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Tomato — 100 g (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Onion — 80 g (vegetable) — zepto: "onion" · instamart: "pyaz"
- Cooking oil — 2 tbsp (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Soak the chana dal for 3-4 hours, then grind coarsely along with ginger and green chili.
2. Mix in the shredded cabbage and salt, shape into small dumplings, and steam for 15-20 minutes until firm.
3. Heat oil, temper mustard seeds, then sauté onion and tomato with turmeric until softened.
4. Add water to form a light gravy, bring to a boil, then gently add the steamed bafauri and simmer for 5 minutes.
5. Garnish with coriander and serve hot with steamed rice.

---

## Faraa (Chhattisgarh · Snack)

```yaml
id: chhattisgarh_snack_faraa
state: Chhattisgarh
region_zone: Central
meal_type: snack
diet_type: veg
tags: [steamed, light, tea-time, quick]
goal_tags: [maintenance, weight_loss]
```

Steamed rice flour dumplings tempered with mustard seeds and curry leaves, a light and popular Chhattisgarhi tea-time snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 240 kcal · 5g protein · 46g carbs · 5g fat

### Ingredients
- Rice flour — 200 g (grain) — zepto: "rice flour" · instamart: "chawal ka atta"
- Green chili — 1 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Ginger — 10 g (vegetable) _(optional)_ — zepto: "fresh ginger" · instamart: "adrak"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Curry leaves — 8 piece (spice) _(optional)_ — zepto: "curry leaves" · instamart: "kadi patta"
- Asafoetida — 1 piece (spice) _(optional)_ — zepto: "asafoetida hing" · instamart: "hing"
- Cooking oil — 2 tbsp (oil) — zepto: "refined cooking oil" · instamart: "tel"

### Steps
1. Bring water to a boil with salt, chopped ginger and green chili, then stir in the rice flour to form a smooth, lump-free dough.
2. Shape the dough into small cylindrical rolls and steam for 12-15 minutes.
3. Once cooled slightly, slice the steamed rolls into bite-sized pieces.
4. Heat oil, temper mustard seeds, curry leaves and asafoetida.
5. Toss the sliced faraa in the tempering and garnish with coriander before serving.

---

## Bastar-style Vegetable Aamat (Chhattisgarh · Dinner)

```yaml
id: chhattisgarh_dinner_bastar_style_vegetable_aamat
state: Chhattisgarh
region_zone: Central
meal_type: dinner
diet_type: veg
tags: [tribal, light, tangy, rice-pairing]
goal_tags: [maintenance, weight_loss]
```

A tangy, lightly spiced mixed vegetable curry from the Bastar region of Chhattisgarh, traditionally cooked in mustard oil and served with rice for dinner.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 7g protein · 38g carbs · 8g fat

### Ingredients
- Mixed vegetables (pumpkin, drumstick, beans) — 300 g (vegetable) — zepto: "mixed vegetables" · instamart: "mix sabzi"
- Tomato — 100 g (vegetable) — zepto: "tomato" · instamart: "tamatar"
- Garlic — 10 g (vegetable) _(optional)_ — zepto: "fresh garlic" · instamart: "lehsun"
- Green chili — 2 piece (vegetable) _(optional)_ — zepto: "green chili" · instamart: "hari mirch"
- Mustard seeds — 1 tsp (spice) _(optional)_ — zepto: "mustard seeds rai" · instamart: "rai"
- Turmeric powder — 0.5 tsp (spice) — zepto: "turmeric powder haldi" · instamart: "haldi"
- Tamarind pulp — 20 g (other) _(optional)_ — zepto: "tamarind pulp imli" · instamart: "imli"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "sarson ka tel"

### Steps
1. Chop the mixed vegetables into bite-sized pieces.
2. Heat mustard oil, temper mustard seeds, then add crushed garlic and green chili.
3. Add chopped tomato and turmeric, cook until softened, then add the mixed vegetables along with a little water.
4. Cover and simmer until the vegetables are tender, then stir in the tamarind pulp for tang.
5. Adjust salt and consistency, and garnish with coriander.
6. Serve hot with steamed rice.

---

# Northeast Zone

## Chira Doi (Flattened Rice with Curd and Jaggery) (Assam · Breakfast)

```yaml
id: assam_breakfast_chira_doi_flattened_rice_with_curd_and_jaggery
state: Assam
region_zone: Northeast
meal_type: breakfast
diet_type: veg
tags: [quick, no-cook, festive, sweet]
goal_tags: [maintenance]
```

A quick Bihu-morning classic of soaked flattened rice mixed with fresh curd and jaggery.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 0 min · **Difficulty:** easy
**Nutrition (approx per serving):** 320 kcal · 9g protein · 58g carbs · 6g fat

### Ingredients
- Flattened rice (thick chira/poha) — 150 g (grain) — zepto: "thick poha flattened rice" · instamart: "chira poha thick"
- Curd (dahi) — 300 g (dairy) — zepto: "fresh curd" · instamart: "curd"
- Jaggery (gur) — 80 g (other) — zepto: "jaggery gur" · instamart: "jaggery"
- Banana — 2 medium (fruit) _(optional)_ — zepto: "banana" · instamart: "banana"
- Milk — 100 ml (dairy) _(optional)_ — zepto: "toned milk" · instamart: "milk"

### Steps
1. Rinse the thick flattened rice briefly and let it soften for 5 minutes.
2. Whisk the curd until smooth, loosening with a little milk if needed.
3. Divide the soaked chira into two bowls and top with curd and jaggery.
4. Add sliced banana and serve immediately.

---

## Masor Tenga (Sour Fish Curry) (Assam · Lunch)

```yaml
id: assam_lunch_masor_tenga_sour_fish_curry
state: Assam
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [sour, light, everyday, fish]
goal_tags: [maintenance, muscle, recovery]
```

A light, tangy Assamese fish curry soured with tomato and lemon, the everyday centerpiece of an Assamese lunch.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 420 kcal · 32g protein · 12g carbs · 22g fat

### Ingredients
- Rohu fish (curry cut) — 400 g (protein) — zepto: "rohu fish curry cut" · instamart: "rohu fish"
- Tomato — 3 medium (vegetable) — zepto: "tomato" · instamart: "tomato"
- Lemon — 1 piece (fruit) — zepto: "lemon" · instamart: "lemon"
- Mustard oil — 3 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"
- Fenugreek seeds — 1 tsp (spice) — zepto: "methi dana fenugreek seeds" · instamart: "fenugreek seeds"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Green chilli — 3 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Elephant apple (outenga), or raw mango as substitute — 1 piece (fruit) _(optional)_ — zepto: "raw mango" · instamart: "raw mango"

### Steps
1. Marinate fish pieces with turmeric and salt, shallow fry lightly in mustard oil, and set aside.
2. In the same oil, temper fenugreek seeds until fragrant.
3. Add chopped tomatoes (and elephant apple or raw mango, if using) and cook until pulpy and sour.
4. Add water, turmeric and salt, and bring to a boil.
5. Slide in the fried fish and green chillies, and simmer for 8-10 minutes.
6. Finish with a squeeze of lemon juice and serve hot with steamed rice.

---

## Til Pitha (Sesame Rice Rolls) (Assam · Snack)

```yaml
id: assam_snack_til_pitha_sesame_rice_rolls
state: Assam
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [sweet, festive, tea-time, rice-flour]
goal_tags: [maintenance, weight_loss]
```

Thin rice flour crepes rolled around a sweet roasted sesame-jaggery filling, a beloved Assamese tea-time snack.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 280 kcal · 5g protein · 45g carbs · 9g fat

### Ingredients
- Rice flour — 200 g (grain) — zepto: "rice flour" · instamart: "rice flour"
- Black sesame seeds — 150 g (other) — zepto: "black til sesame seeds" · instamart: "sesame seeds"
- Jaggery — 100 g (other) — zepto: "jaggery gur" · instamart: "jaggery"
- Water — 300 ml (other) — zepto: "packaged drinking water" · instamart: "drinking water"
- Salt — 1 pinch (spice) — zepto: "salt" · instamart: "salt"

### Steps
1. Dry roast sesame seeds until fragrant, cool, and coarsely pound with jaggery to make the filling.
2. Make a thin batter with rice flour, a pinch of salt and water.
3. Pour a ladleful onto a hot greased griddle to form a thin crepe (pitha).
4. While still warm and pliable, spoon the sesame-jaggery filling along one edge and roll it up tightly.
5. Repeat with the remaining batter and serve warm.

---

## Khar (Raw Papaya and Lentil Alkaline Curry) (Assam · Dinner)

```yaml
id: assam_dinner_khar_raw_papaya_and_lentil_alkaline_curry
state: Assam
region_zone: Northeast
meal_type: dinner
diet_type: veg
tags: [alkaline, traditional, comfort, healthy]
goal_tags: [maintenance, weight_loss]
```

Assam's signature alkaline dish of raw papaya and lentils simmered with a traditional filtered ash-water base, always the opening course of an Assamese meal.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 10g protein · 30g carbs · 11g fat

### Ingredients
- Raw papaya — 300 g (vegetable) — zepto: "raw papaya" · instamart: "raw papaya"
- Split black gram (kolai dal) — 100 g (protein) — zepto: "urad dal split" · instamart: "urad dal"
- Khar (traditional culinary alkali) — 2 tbsp (other) _(optional)_ — zepto: "baking soda" · instamart: "baking soda"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Garlic — 4 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Dried red chilli — 2 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "dried red chilli"

### Steps
1. Heat mustard oil and temper with dried red chilli and crushed garlic.
2. Add cubed raw papaya and lightly roasted lentils, and sauté for 2 minutes.
3. Pour in water and the khar (or a pinch of baking soda as a home substitute), and season with salt.
4. Simmer until the papaya turns soft and slightly mushy.
5. Finish with slit green chillies and serve as the first course with steamed rice.

---

## Pumaloi (Steamed Rice Cake) (Meghalaya · Breakfast)

```yaml
id: meghalaya_breakfast_pumaloi_steamed_rice_cake
state: Meghalaya
region_zone: Northeast
meal_type: breakfast
diet_type: veg
tags: [steamed, simple, staple, gluten-free]
goal_tags: [maintenance, weight_loss]
```

A soft, fluffy steamed rice cake, the everyday Khasi breakfast eaten with tea or a side of pork.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 5g protein · 55g carbs · 2g fat

### Ingredients
- Rice (short-grain) — 250 g (grain) — zepto: "rice" · instamart: "rice"
- Salt — 1 pinch (spice) — zepto: "salt" · instamart: "salt"
- Water — 100 ml (other) — zepto: "packaged drinking water" · instamart: "drinking water"

### Steps
1. Soak rice for a few hours, then drain and grind coarsely to a semolina-like texture (or use store-bought coarse rice flour).
2. Sprinkle the coarse rice flour with a little water and salt until it turns crumbly, not wet.
3. Steam the mixture in a muslin-lined or idli-style steamer for 15-20 minutes until fluffy.
4. Fluff up with a fork and serve warm with tea.

---

## Jadoh (Khasi Rice with Pork) (Meghalaya · Lunch)

```yaml
id: meghalaya_lunch_jadoh_khasi_rice_with_pork
state: Meghalaya
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [one-pot, festive, hearty, tribal]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Meghalaya's most iconic one-pot dish - rice cooked in a rich pork stock - traditionally eaten for a hearty midday meal.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 520 kcal · 30g protein · 55g carbs · 18g fat

### Ingredients
- Rice — 250 g (grain) — zepto: "rice" · instamart: "rice"
- Pork (with some fat) — 350 g (protein) — zepto: "pork curry cut" · instamart: "pork curry cut"
- Pork blood (for traditional colour) — 50 ml (protein) _(optional)_ — zepto: "pork" · instamart: "pork"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Garlic — 5 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Bay leaf — 2 piece (spice) _(optional)_ — zepto: "tej patta bay leaf" · instamart: "bay leaf"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Boil the pork in water with turmeric and salt until tender, and reserve the stock.
2. In a heavy pot, heat mustard oil and sauté onion, ginger, garlic and bay leaf until golden.
3. Add the cooked pork and fry briefly, then stir in pork blood if using, for the traditional deep colour.
4. Add washed rice and the reserved pork stock, topped up with water as needed.
5. Cook covered on low heat until the rice is done and has absorbed all the flavour, stirring gently once or twice.
6. Serve hot, traditionally with a side onion salad or pickle.

---

## Pukhlein (Sweet Rice Fritters) (Meghalaya · Snack)

```yaml
id: meghalaya_snack_pukhlein_sweet_rice_fritters
state: Meghalaya
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [fried, sweet, street-food, festive]
goal_tags: [maintenance, weight_loss]
```

Deep-fried, jaggery-sweetened rice flour fritters, a favourite Khasi tea-time and market-stall snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 220 kcal · 3g protein · 32g carbs · 9g fat

### Ingredients
- Rice flour — 200 g (grain) — zepto: "rice flour" · instamart: "rice flour"
- Jaggery — 100 g (other) — zepto: "jaggery gur" · instamart: "jaggery"
- Ripe banana — 1 medium (fruit) _(optional)_ — zepto: "banana" · instamart: "banana"
- Water — 100 ml (other) — zepto: "packaged drinking water" · instamart: "drinking water"
- Cooking oil for deep frying — 300 ml (oil) — zepto: "cooking oil" · instamart: "refined oil"

### Steps
1. Dissolve jaggery in a little warm water and mash in the ripe banana if using.
2. Mix in rice flour to form a thick, dropping-consistency batter.
3. Heat oil in a kadai and drop spoonfuls of the batter in.
4. Fry on medium heat until golden brown and cooked through, turning occasionally.
5. Drain on paper and serve warm.

---

## Dohneiiong (Pork with Black Sesame) (Meghalaya · Dinner)

```yaml
id: meghalaya_dinner_dohneiiong_pork_with_black_sesame
state: Meghalaya
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [nutty, rich, tribal, festive]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A rich Khasi pork curry thickened with roasted black sesame paste, a signature dinner dish across Meghalaya.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 480 kcal · 28g protein · 10g carbs · 32g fat

### Ingredients
- Pork (with fat) — 400 g (protein) — zepto: "pork curry cut" · instamart: "pork curry cut"
- Black sesame seeds — 100 g (other) — zepto: "black til sesame seeds" · instamart: "sesame seeds"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger-garlic paste — 1 tbsp (vegetable) — zepto: "ginger garlic paste" · instamart: "ginger garlic paste"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Dried red chilli — 3 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "dried red chilli"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Dry roast the black sesame seeds and grind to a coarse paste with a little water.
2. Heat mustard oil, sauté onions until soft, then add ginger-garlic paste and dried red chillies.
3. Add pork pieces, turmeric and salt, and sear for 5-6 minutes.
4. Pour in water, cover, and simmer until the pork is nearly tender.
5. Stir in the sesame paste and simmer uncovered until the gravy thickens and turns glossy.
6. Serve hot with steamed rice.

---

## Chak-hao Kheer (Black Rice Pudding) (Manipur · Breakfast)

```yaml
id: manipur_breakfast_chak_hao_kheer_black_rice_pudding
state: Manipur
region_zone: Northeast
meal_type: breakfast
diet_type: veg
tags: [sweet, festive, antioxidant, slow-cooked]
goal_tags: [maintenance]
```

Manipur's prized black rice slow-cooked into a fragrant, naturally purple sweet pudding, often enjoyed on special mornings.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 40 min · **Difficulty:** easy
**Nutrition (approx per serving):** 310 kcal · 6g protein · 55g carbs · 7g fat

### Ingredients
- Black rice (chak-hao) — 150 g (grain) — zepto: "black rice" · instamart: "black rice"
- Milk — 500 ml (dairy) — zepto: "toned milk" · instamart: "milk"
- Sugar — 80 g (other) — zepto: "sugar" · instamart: "sugar"
- Cardamom powder — 1 tsp (spice) _(optional)_ — zepto: "elaichi cardamom powder" · instamart: "cardamom powder"
- Cashew nuts — 20 g (other) _(optional)_ — zepto: "cashew nuts" · instamart: "cashew"

### Steps
1. Soak the black rice overnight, then drain.
2. Simmer the rice in milk on low heat, stirring often, until the grains soften and the milk thickens into a pudding, about 35-40 minutes.
3. Stir in sugar and cardamom powder and cook for a further 5 minutes.
4. Garnish with cashew nuts and serve warm or chilled.

---

## Eromba (Mashed Vegetable and Fermented Fish Chutney) (Manipur · Lunch)

```yaml
id: manipur_lunch_eromba_mashed_vegetable_and_fermented_fish_chutney
state: Manipur
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [fermented, spicy, staple, comfort]
goal_tags: [maintenance, weight_loss]
```

A rustic Meitei staple of boiled vegetables mashed together with fiery fermented fish (ngari) and chillies, eaten with rice at almost every Manipuri lunch.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 260 kcal · 14g protein · 28g carbs · 8g fat

### Ingredients
- Potato — 2 medium (vegetable) — zepto: "potato" · instamart: "potato"
- Pumpkin or squash — 200 g (vegetable) — zepto: "pumpkin" · instamart: "pumpkin"
- Ngari (fermented fish) — 30 g (protein) _(optional)_ — zepto: "dried fish" · instamart: "dried fish"
- Green chilli — 4 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Fermented bamboo shoot (soibum) — 30 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"

### Steps
1. Boil the potato and pumpkin (and any other vegetables of choice) until soft.
2. Roast the ngari lightly wrapped in foil until fragrant, or pan toast a dried fish substitute.
3. Mash the boiled vegetables coarsely in a bowl.
4. Mix in the roasted fermented fish, chopped raw onion, chillies and fermented bamboo shoot if using.
5. Mash everything together by hand until well combined and slightly chunky.
6. Serve at room temperature with steamed rice.

---

## Singju (Raw Vegetable Salad) (Manipur · Snack)

```yaml
id: manipur_snack_singju_raw_vegetable_salad
state: Manipur
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [raw, tangy, healthy, quick]
goal_tags: [maintenance, weight_loss]
```

A zesty raw salad of shredded vegetables tossed with roasted gram powder, chilli and perilla seeds, Manipur's favourite light snack.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 5 min · **Difficulty:** easy
**Nutrition (approx per serving):** 180 kcal · 6g protein · 20g carbs · 8g fat

### Ingredients
- Cabbage — 200 g (vegetable) — zepto: "cabbage" · instamart: "cabbage"
- Raw papaya or banana flower — 150 g (vegetable) _(optional)_ — zepto: "raw papaya" · instamart: "raw papaya"
- Roasted gram powder (bhuna besan) — 3 tbsp (protein) — zepto: "roasted chana besan" · instamart: "roasted gram powder"
- Perilla seeds — 1 tbsp (spice) _(optional)_ — zepto: "til sesame seeds" · instamart: "sesame seeds"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"
- Ngari (fermented fish) — 15 g (protein) _(optional)_ — zepto: "dried fish" · instamart: "dried fish"

### Steps
1. Finely shred the cabbage and raw papaya or banana flower.
2. Dry roast the perilla seeds and coarsely crush them.
3. Toss the shredded vegetables with roasted gram powder, crushed perilla seeds, chopped chillies and mustard oil.
4. Mix in flaked roasted ngari if using, for the authentic fermented note.
5. Serve immediately as a light, tangy snack.

---

## Kangshoi (Vegetable Stew) (Manipur · Dinner)

```yaml
id: manipur_dinner_kangshoi_vegetable_stew
state: Manipur
region_zone: Northeast
meal_type: dinner
diet_type: veg
tags: [light, broth, everyday, healthy]
goal_tags: [maintenance, weight_loss]
```

A comforting, lightly seasoned Manipuri vegetable broth that typically rounds off the everyday evening meal.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 150 kcal · 5g protein · 20g carbs · 4g fat

### Ingredients
- Mixed seasonal vegetables (pumpkin, beans, squash) — 300 g (vegetable) — zepto: "mixed vegetables" · instamart: "mixed vegetables"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Ngari (fermented fish, for stock) — 15 g (protein) _(optional)_ — zepto: "dried fish" · instamart: "dried fish"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"

### Steps
1. Bring water to a boil and add turmeric, salt and the ngari if using, for depth of flavour.
2. Add the chopped mixed vegetables and onion.
3. Simmer until the vegetables are just tender, keeping the stew light and brothy.
4. Toss in slit green chillies at the end and simmer for 2 more minutes.
5. Serve hot alongside steamed rice as the final course of the meal.

---

## Sawhchiar (Rice and Meat Porridge) (Mizoram · Breakfast)

```yaml
id: mizoram_breakfast_sawhchiar_rice_and_meat_porridge
state: Mizoram
region_zone: Northeast
meal_type: breakfast
diet_type: nonveg
tags: [porridge, comfort, one-pot, warming]
goal_tags: [maintenance, muscle, recovery]
```

A warming rice porridge cooked with minced pork or chicken, a classic Mizo breakfast especially on cool mornings and festivals.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** easy
**Nutrition (approx per serving):** 350 kcal · 20g protein · 45g carbs · 9g fat

### Ingredients
- Rice — 150 g (grain) — zepto: "rice" · instamart: "rice"
- Minced pork or chicken — 200 g (protein) — zepto: "chicken keema minced chicken" · instamart: "chicken keema"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Spring onion — 2 stalk (vegetable) _(optional)_ — zepto: "spring onion" · instamart: "spring onion"
- Black pepper powder — 1 tsp (spice) — zepto: "black pepper powder" · instamart: "black pepper powder"

### Steps
1. In a pot, sauté chopped onion, ginger and garlic until soft.
2. Add the minced meat and cook until it changes colour.
3. Add washed rice and plenty of water, then bring to a boil.
4. Simmer on low heat, stirring occasionally, until the rice breaks down into a thick porridge, about 30 minutes.
5. Season with salt and black pepper, top with spring onion, and serve hot in bowls.

---

## Bai (Mizo Vegetable and Pork Stew) (Mizoram · Lunch)

```yaml
id: mizoram_lunch_bai_mizo_vegetable_and_pork_stew
state: Mizoram
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [boiled, low-spice, everyday, healthy]
goal_tags: [maintenance, muscle, recovery]
```

Mizoram's everyday one-pot lunch of boiled greens and vegetables simmered with pork fat, deliberately kept low on oil and spice.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 22g protein · 20g carbs · 22g fat

### Ingredients
- Mustard greens or spinach — 250 g (vegetable) — zepto: "mustard greens sarson saag" · instamart: "spinach"
- Pork belly (with fat) — 250 g (protein) — zepto: "pork belly" · instamart: "pork"
- Fermented bamboo shoot — 50 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"
- Bekang (fermented soybean) — 20 g (protein) _(optional)_ — zepto: "soybean" · instamart: "soybean"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"

### Steps
1. Boil the pork pieces in a little water until half-cooked.
2. Add the chopped greens, onion and bamboo shoot if using.
3. Simmer everything together until the vegetables and pork are fully tender, adding water as needed to keep it stew-like.
4. Stir in the fermented soybean (bekang) if using, and slit green chillies, in the last few minutes.
5. Lightly mash some of the vegetables against the side of the pot to thicken, season with salt, and serve with rice.

---

## Vawksa Rep (Smoked Pork Strips) (Mizoram · Snack)

```yaml
id: mizoram_snack_vawksa_rep_smoked_pork_strips
state: Mizoram
region_zone: Northeast
meal_type: snack
diet_type: nonveg
tags: [smoked, protein-rich, tribal, preserved]
goal_tags: [maintenance, weight_loss, muscle, recovery]
```

Strips of pork smoked over a wood fire until dry and intensely flavoured, a favourite Mizo snack eaten plain or pan-seared.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 15 min · **Difficulty:** medium
**Nutrition (approx per serving):** 260 kcal · 24g protein · 2g carbs · 17g fat

### Ingredients
- Pork belly strips — 300 g (protein) — zepto: "pork belly" · instamart: "pork"
- Salt — 1 tsp (spice) — zepto: "salt" · instamart: "salt"
- Black pepper powder — 1 tsp (spice) _(optional)_ — zepto: "black pepper powder" · instamart: "black pepper powder"
- Bird's eye chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "green chilli"

### Steps
1. Rub the pork strips generously with salt and let them cure for a couple of hours.
2. Traditionally, hang and smoke the strips over a wood fire for several hours until dry and deep brown; at home, approximate by slow-roasting at low heat until dry and lightly charred.
3. To serve, pan-sear the smoked strips briefly until hot and slightly crisp at the edges.
4. Serve as is, or with a side of crushed bird's eye chilli, a popular tea-time bite.

---

## Bekang Um (Fermented Soybean Pork Stew) (Mizoram · Dinner)

```yaml
id: mizoram_dinner_bekang_um_fermented_soybean_pork_stew
state: Mizoram
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [fermented, pungent, comfort, tribal]
goal_tags: [maintenance, muscle, recovery]
```

A pungent, deeply savoury Mizo stew built on fermented soybean (bekang) and pork, a favourite dinner comfort dish.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 340 kcal · 20g protein · 12g carbs · 22g fat

### Ingredients
- Bekang (fermented soybean) — 100 g (protein) _(optional)_ — zepto: "soybean" · instamart: "soybean"
- Pork (with fat) — 250 g (protein) — zepto: "pork curry cut" · instamart: "pork"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Tomato — 1 medium (vegetable) _(optional)_ — zepto: "tomato" · instamart: "tomato"

### Steps
1. Boil the pork with ginger and salt until nearly tender.
2. Add chopped onion and tomato and simmer until softened.
3. Mash in the fermented soybean (bekang), stirring well to distribute its flavour through the stew.
4. Simmer for another 8-10 minutes until the stew thickens slightly.
5. Add slit green chillies, adjust salt, and serve hot with rice.

---

## Galho (Rice, Vegetable and Smoked Meat Porridge) (Nagaland · Breakfast)

```yaml
id: nagaland_breakfast_galho_rice_vegetable_and_smoked_meat_porridge
state: Nagaland
region_zone: Northeast
meal_type: breakfast
diet_type: nonveg
tags: [one-pot, comfort, porridge, smoked]
goal_tags: [maintenance, muscle, recovery]
```

A hearty one-pot rice porridge cooked with greens and smoked meat, Nagaland's favourite comforting breakfast or brunch dish.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** easy
**Nutrition (approx per serving):** 360 kcal · 20g protein · 45g carbs · 10g fat

### Ingredients
- Rice — 150 g (grain) — zepto: "rice" · instamart: "rice"
- Smoked pork — 150 g (protein) — zepto: "pork" · instamart: "pork"
- Mustard greens or spinach — 150 g (vegetable) — zepto: "mustard greens sarson saag" · instamart: "spinach"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Bird's eye chilli — 2 piece (vegetable) _(optional)_ — zepto: "green chilli" · instamart: "green chilli"

### Steps
1. Boil the smoked pork with ginger and garlic until tender, reserving the stock.
2. Add washed rice to the pork and stock, along with extra water, and bring to a boil.
3. Simmer, stirring occasionally, until the rice starts breaking down into a thick porridge.
4. Stir in the chopped greens and onion, and cook until wilted and the porridge is creamy.
5. Season with salt, top with crushed bird's eye chilli, and serve hot.

---

## Smoked Pork with Bamboo Shoot (Nagaland · Lunch)

```yaml
id: nagaland_lunch_smoked_pork_with_bamboo_shoot
state: Nagaland
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [smoked, fermented, spicy, tribal, iconic]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

Nagaland's best-known dish - smoky pork slow-cooked with fermented bamboo shoot and dried chillies - the heart of a Naga lunch thali.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 40 min · **Difficulty:** medium
**Nutrition (approx per serving):** 430 kcal · 30g protein · 10g carbs · 28g fat

### Ingredients
- Smoked pork — 400 g (protein) — zepto: "pork" · instamart: "pork"
- Fermented bamboo shoot — 80 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"
- Dried red chilli (or Naga king chilli) — 2 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "dried red chilli"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Garlic — 4 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"

### Steps
1. Boil the smoked pork with ginger, garlic and turmeric until nearly tender.
2. Add sliced onion and the fermented bamboo shoot to the pot.
3. Simmer everything together on low heat until the pork is fully tender and the flavours meld, about 25 minutes.
4. Add dried chillies (whole or crushed, to taste) in the last 10 minutes for heat.
5. Adjust salt and serve hot with steamed rice, traditionally with very little oil.

---

## Axone Chutney (Fermented Soybean Chutney) (Nagaland · Snack)

```yaml
id: nagaland_snack_axone_chutney_fermented_soybean_chutney
state: Nagaland
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [fermented, pungent, condiment, tribal]
goal_tags: [maintenance, weight_loss]
```

A pungent, powerful chutney of fermented soybean pounded with chillies and garlic, eaten in small amounts as a side or snack with rice.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 10 min · **Difficulty:** easy
**Nutrition (approx per serving):** 90 kcal · 6g protein · 8g carbs · 4g fat

### Ingredients
- Axone (fermented soybean, akhuni) — 60 g (protein) _(optional)_ — zepto: "soybean" · instamart: "soybean"
- Dried red chilli — 3 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "dried red chilli"
- Garlic — 4 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Ginger — 1 inch (vegetable) _(optional)_ — zepto: "ginger" · instamart: "ginger"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Lightly roast the axone wrapped in a leaf or foil over low heat until fragrant.
2. Dry roast the red chillies briefly.
3. Pound the roasted axone, chillies, garlic and ginger together into a coarse chutney using a mortar and pestle.
4. Stir in a little mustard oil and salt to bind.
5. Serve in small portions alongside rice or boiled vegetables as a pungent snack-side.

---

## Naga King Chilli Pork (Nagaland · Dinner)

```yaml
id: nagaland_dinner_naga_king_chilli_pork
state: Nagaland
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [spicy, fiery, iconic, tribal]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A fiery pork curry cooked with the world-famous Naga king chilli (bhut jolokia), the showstopper dinner dish of Nagaland.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 440 kcal · 28g protein · 8g carbs · 30g fat

### Ingredients
- Pork (with some fat) — 400 g (protein) — zepto: "pork curry cut" · instamart: "pork"
- Naga king chilli (bhut jolokia) — 2 piece (spice) _(optional)_ — zepto: "dry red chilli" · instamart: "dried red chilli"
- Onion — 2 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Garlic — 5 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tomato"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Heat mustard oil and sauté onion, ginger and garlic until golden.
2. Add pork pieces and sear until lightly browned on all sides.
3. Add chopped tomato and salt, cover, and simmer until the pork is nearly tender.
4. Crush the Naga king chilli (handle with gloves) and stir into the curry, adjusting the amount to taste for heat.
5. Simmer uncovered for another 10 minutes until the gravy thickens.
6. Serve hot with steamed rice, with extra chilli on the side for the brave.

---

## Mosdeng (Mashed Fish and Vegetable Chutney) (Tripura · Breakfast)

```yaml
id: tripura_breakfast_mosdeng_mashed_fish_and_vegetable_chutney
state: Tripura
region_zone: Northeast
meal_type: breakfast
diet_type: nonveg
tags: [raw, spicy, quick, staple]
goal_tags: [maintenance, weight_loss]
```

A simple raw-mashed chutney of dried fish, chillies and herbs eaten with warm rice, a staple light Tripuri morning meal.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 5 min · **Difficulty:** easy
**Nutrition (approx per serving):** 180 kcal · 12g protein · 10g carbs · 10g fat

### Ingredients
- Dried fish — 50 g (protein) — zepto: "dried fish" · instamart: "dried fish"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Green chilli — 3 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Coriander leaves — 10 g (vegetable) _(optional)_ — zepto: "coriander leaves" · instamart: "coriander"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"
- Lemon — 0.5 piece (fruit) _(optional)_ — zepto: "lemon" · instamart: "lemon"

### Steps
1. Roast the dried fish lightly over a flame or in a dry pan until crisp, then flake it.
2. Finely chop the onion, green chillies and coriander leaves.
3. Mix everything together with mustard oil, a squeeze of lemon and salt, mashing lightly by hand.
4. Serve at room temperature with warm steamed rice.

---

## Chakhwi (Bamboo Shoot and Pork Curry) (Tripura · Lunch)

```yaml
id: tripura_lunch_chakhwi_bamboo_shoot_and_pork_curry
state: Tripura
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [tangy, fermented, tribal, everyday]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

A tangy, fragrant Tripuri curry of bamboo shoot simmered with pork and mustard, a beloved everyday lunch dish of the Mui Borok kitchen.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 400 kcal · 24g protein · 14g carbs · 26g fat

### Ingredients
- Pork — 300 g (protein) — zepto: "pork curry cut" · instamart: "pork"
- Bamboo shoot (fresh or fermented) — 150 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"
- Mustard seeds — 1 tsp (spice) — zepto: "rai mustard seeds" · instamart: "mustard seeds"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Garlic — 4 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Mustard oil — 2 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Heat mustard oil and splutter mustard seeds, then add crushed garlic.
2. Add pork pieces with turmeric and salt, and sear for a few minutes.
3. Add the bamboo shoot and enough water to just cover, then cover and simmer until the pork is tender.
4. Add slit green chillies in the last 5 minutes.
5. Simmer uncovered briefly to thicken slightly, and serve hot with rice.

---

## Muya Bwtwi (Bamboo Shoot Fritters) (Tripura · Snack)

```yaml
id: tripura_snack_muya_bwtwi_bamboo_shoot_fritters
state: Tripura
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [fried, tea-time, approximated, crunchy]
goal_tags: [maintenance, weight_loss]
```

Crisp fritters made from tender bamboo shoot and gram flour, a home-style Tripuri tea-time snack approximated from regional bamboo-shoot cooking traditions.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 15 min · **Difficulty:** easy
**Nutrition (approx per serving):** 210 kcal · 6g protein · 22g carbs · 11g fat

### Ingredients
- Bamboo shoot (boiled, sliced) — 150 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"
- Gram flour (besan) — 100 g (grain) — zepto: "besan gram flour" · instamart: "besan"
- Rice flour — 2 tbsp (grain) _(optional)_ — zepto: "rice flour" · instamart: "rice flour"
- Green chilli — 2 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Turmeric powder — 1 tsp (spice) — zepto: "turmeric powder" · instamart: "haldi powder"
- Cooking oil for frying — 250 ml (oil) — zepto: "cooking oil" · instamart: "refined oil"

### Steps
1. Boil the bamboo shoot slices until tender, then drain well and pat dry.
2. Make a thick batter with gram flour, rice flour, turmeric, chopped chilli, salt and a little water.
3. Dip the bamboo shoot slices in the batter to coat evenly.
4. Deep fry in hot oil until golden and crisp on both sides.
5. Drain and serve hot as a crunchy snack.

---

## Gudok (Fermented Fish and Taro Stew) (Tripura · Dinner)

```yaml
id: tripura_dinner_gudok_fermented_fish_and_taro_stew
state: Tripura
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [fermented, pungent, hearty, tribal]
goal_tags: [maintenance]
```

A pungent, hearty stew of taro root cooked with fermented fish (berma), a classic warming Tripuri dinner dish.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 30 min · **Difficulty:** medium
**Nutrition (approx per serving):** 320 kcal · 18g protein · 30g carbs · 12g fat

### Ingredients
- Taro root (kachu/arbi) — 300 g (vegetable) — zepto: "arbi taro root" · instamart: "arbi"
- Fermented fish (berma/shidol) — 40 g (protein) _(optional)_ — zepto: "dried fish" · instamart: "dried fish"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Green chilli — 3 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Peel and cube the taro root, then boil until just tender.
2. Roast the fermented fish lightly wrapped in foil until fragrant, then flake it.
3. Heat mustard oil, sauté onion and garlic, then add the flaked fermented fish.
4. Add the boiled taro along with a little of its cooking water and simmer for 10 minutes until the flavours combine.
5. Add slit green chillies, adjust salt, and serve hot with rice.

---

## Thukpa (Noodle Soup) (Arunachal Pradesh · Breakfast)

```yaml
id: arunachal_pradesh_breakfast_thukpa_noodle_soup
state: Arunachal Pradesh
region_zone: Northeast
meal_type: breakfast
diet_type: nonveg
tags: [soup, warming, himalayan, comfort]
goal_tags: [maintenance, muscle, recovery]
```

A warming Tibetan-influenced noodle soup with vegetables and meat, a favourite breakfast in the Monpa highlands of Arunachal Pradesh.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 380 kcal · 20g protein · 48g carbs · 11g fat

### Ingredients
- Wheat noodles — 200 g (grain) — zepto: "noodles" · instamart: "noodles"
- Chicken or pork, sliced — 150 g (protein) — zepto: "chicken" · instamart: "chicken"
- Carrot — 1 medium (vegetable) — zepto: "carrot" · instamart: "carrot"
- Cabbage — 100 g (vegetable) — zepto: "cabbage" · instamart: "cabbage"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"
- Spring onion — 2 stalk (vegetable) _(optional)_ — zepto: "spring onion" · instamart: "spring onion"

### Steps
1. Simmer the chicken or pork with ginger and garlic in water to make a light broth.
2. Add sliced carrot and cabbage and cook until just tender.
3. Separately, boil the noodles until al dente, then drain.
4. Add the noodles to the broth and season with salt and pepper.
5. Ladle into bowls, top with spring onion, and serve piping hot.

---

## Zan (Fermented Millet Porridge with Greens) (Arunachal Pradesh · Lunch)

```yaml
id: arunachal_pradesh_lunch_zan_fermented_millet_porridge_with_greens
state: Arunachal Pradesh
region_zone: Northeast
meal_type: lunch
diet_type: nonveg
tags: [tribal, staple, one-pot, approximated]
goal_tags: [maintenance]
```

A traditional Nyishi/Apatani one-pot porridge of millet or maize flour served alongside a fiery fish chutney, a genuine everyday Arunachali lunch (recipe approximated from tribal cooking traditions).

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** medium
**Nutrition (approx per serving):** 340 kcal · 14g protein · 50g carbs · 9g fat

### Ingredients
- Millet flour or maize flour — 200 g (grain) — zepto: "millet flour bajra atta" · instamart: "bajra atta"
- Mustard greens or spinach — 150 g (vegetable) — zepto: "mustard greens sarson saag" · instamart: "spinach"
- Dried or fermented fish — 30 g (protein) _(optional)_ — zepto: "dried fish" · instamart: "dried fish"
- Green chilli — 3 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Bring water to a boil and gradually whisk in the millet flour to avoid lumps, cooking into a thick porridge.
2. Stir in the chopped greens and cook until wilted into the porridge.
3. Separately, pound roasted dried fish with garlic, green chillies and a little mustard oil into a rough chutney.
4. Season the porridge with salt.
5. Serve the warm porridge with a spoonful of the fish chutney on the side, mixing to taste as you eat.

---

## Momos (Steamed Dumplings) (Arunachal Pradesh · Snack)

```yaml
id: arunachal_pradesh_snack_momos_steamed_dumplings
state: Arunachal Pradesh
region_zone: Northeast
meal_type: snack
diet_type: nonveg
tags: [steamed, himalayan, popular, dumplings]
goal_tags: [maintenance, weight_loss]
```

Soft steamed dumplings filled with spiced minced meat, the most popular snack across the Himalayan belt of Arunachal Pradesh.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 260 kcal · 14g protein · 32g carbs · 8g fat

### Ingredients
- All-purpose flour (maida) — 200 g (grain) — zepto: "maida all purpose flour" · instamart: "all purpose flour"
- Minced chicken or pork — 200 g (protein) — zepto: "chicken keema minced chicken" · instamart: "chicken keema"
- Cabbage, finely chopped — 100 g (vegetable) — zepto: "cabbage" · instamart: "cabbage"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger-garlic paste — 1 tbsp (vegetable) — zepto: "ginger garlic paste" · instamart: "ginger garlic paste"
- Soy sauce — 1 tbsp (other) _(optional)_ — zepto: "soy sauce" · instamart: "soy sauce"

### Steps
1. Knead the flour with water into a smooth, firm dough and rest for 20 minutes.
2. Mix the minced meat with chopped cabbage, onion, ginger-garlic paste, soy sauce and salt.
3. Roll the dough into small thin circles and place a spoonful of filling in the centre of each.
4. Pleat and seal the edges to form dumplings.
5. Steam for 12-15 minutes until the wrappers turn translucent.
6. Serve hot with a chilli dipping sauce.

---

## Pika Pila (Pork with Fermented Bamboo Shoot and Mustard Oil) (Arunachal Pradesh · Dinner)

```yaml
id: arunachal_pradesh_dinner_pika_pila_pork_with_fermented_bamboo_shoot_and_mustard_
state: Arunachal Pradesh
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [tribal, pungent, fermented, iconic]
goal_tags: [maintenance, muscle, recovery, weight_gain]
```

An Adi-tribe specialty of pork cooked in generous mustard oil with pungent fermented bamboo shoot, a distinctive Arunachali dinner dish.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 35 min · **Difficulty:** medium
**Nutrition (approx per serving):** 450 kcal · 26g protein · 8g carbs · 32g fat

### Ingredients
- Pork (with fat) — 400 g (protein) — zepto: "pork curry cut" · instamart: "pork"
- Fermented bamboo shoot — 100 g (vegetable) _(optional)_ — zepto: "bamboo shoot" · instamart: "bamboo shoot"
- Mustard oil — 4 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"
- Green chilli — 3 piece (vegetable) — zepto: "green chilli" · instamart: "green chilli"
- Garlic — 4 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Ginger — 1 inch (vegetable) — zepto: "ginger" · instamart: "ginger"

### Steps
1. Heat a generous amount of mustard oil until it just smokes, then let it cool slightly, a traditional Adi technique for flavour.
2. Sauté garlic and ginger, then add the pork pieces and sear well.
3. Add the fermented bamboo shoot and a splash of water, cover, and simmer until the pork is tender.
4. Add slit green chillies and cook uncovered for a final 5 minutes so the oil separates slightly.
5. Serve hot with rice, letting the mustard oil flavour come through strongly.

---

## Sel Roti (Sweet Rice Ring Bread) (Sikkim · Breakfast)

```yaml
id: sikkim_breakfast_sel_roti_sweet_rice_ring_bread
state: Sikkim
region_zone: Northeast
meal_type: breakfast
diet_type: veg
tags: [fried, sweet, festive, rice-based]
goal_tags: [maintenance, weight_loss]
```

A crisp, golden ring-shaped fried bread made from fermented rice batter, a festive and everyday Sikkimese breakfast favourite.

**Serves:** 2 · **Prep:** 20 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 290 kcal · 4g protein · 45g carbs · 11g fat

### Ingredients
- Rice (soaked and ground) — 250 g (grain) — zepto: "rice" · instamart: "rice"
- Sugar — 60 g (other) — zepto: "sugar" · instamart: "sugar"
- Milk — 100 ml (dairy) _(optional)_ — zepto: "toned milk" · instamart: "milk"
- Ghee — 1 tbsp (dairy) _(optional)_ — zepto: "ghee" · instamart: "ghee"
- Cardamom powder — 1 tsp (spice) _(optional)_ — zepto: "elaichi cardamom powder" · instamart: "cardamom powder"
- Cooking oil for deep frying — 300 ml (oil) — zepto: "cooking oil" · instamart: "refined oil"

### Steps
1. Soak rice for several hours, then grind to a smooth, slightly thick batter, allowing it to ferment lightly for a few hours if time permits.
2. Mix in sugar, milk, ghee and cardamom powder until well combined.
3. Heat oil in a kadai and pour the batter in a circular ring motion directly into the hot oil to form a ring shape.
4. Fry until golden brown and crisp on both sides, then drain.
5. Serve warm, on their own or with tea.

---

## Gundruk ko Jhol (Fermented Leafy Greens Soup) (Sikkim · Lunch)

```yaml
id: sikkim_lunch_gundruk_ko_jhol_fermented_leafy_greens_soup
state: Sikkim
region_zone: Northeast
meal_type: lunch
diet_type: veg
tags: [fermented, tangy, healthy, everyday]
goal_tags: [maintenance, weight_loss]
```

A sour, tangy soup made from sun-dried fermented leafy greens, a distinctly Sikkimese-Nepali lunch dish valued for its tang and shelf-stable base.

**Serves:** 2 · **Prep:** 10 min · **Cook:** 20 min · **Difficulty:** easy
**Nutrition (approx per serving):** 150 kcal · 6g protein · 16g carbs · 6g fat

### Ingredients
- Gundruk (fermented dried leafy greens) — 50 g (vegetable) _(optional)_ — zepto: "dried spinach" · instamart: "spinach"
- Potato — 2 medium (vegetable) — zepto: "potato" · instamart: "potato"
- Tomato — 2 medium (vegetable) — zepto: "tomato" · instamart: "tomato"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Cumin seeds — 1 tsp (spice) — zepto: "jeera cumin seeds" · instamart: "cumin seeds"
- Mustard oil — 1 tbsp (oil) — zepto: "mustard oil" · instamart: "mustard oil"

### Steps
1. Soak the gundruk briefly in warm water to soften, then roughly chop it.
2. Heat mustard oil and temper cumin seeds and garlic until fragrant.
3. Add chopped tomato and cook until pulpy.
4. Add cubed potato, the softened gundruk, and enough water to make a soupy consistency.
5. Simmer until the potatoes are cooked through and the soup turns pleasantly sour.
6. Season with salt and serve hot with rice.

---

## Momos (Steamed Dumplings, Sikkimese-style) (Sikkim · Snack)

```yaml
id: sikkim_snack_momos_steamed_dumplings_sikkimese_style
state: Sikkim
region_zone: Northeast
meal_type: snack
diet_type: veg
tags: [steamed, popular, himalayan, dumplings]
goal_tags: [maintenance, weight_loss]
```

Delicate steamed dumplings, arguably Sikkim's most beloved snack, served with a fiery tomato-sesame chutney.

**Serves:** 2 · **Prep:** 30 min · **Cook:** 20 min · **Difficulty:** medium
**Nutrition (approx per serving):** 240 kcal · 9g protein · 34g carbs · 7g fat

### Ingredients
- All-purpose flour (maida) — 200 g (grain) — zepto: "maida all purpose flour" · instamart: "all purpose flour"
- Mixed vegetables (cabbage, carrot) or paneer — 250 g (vegetable) — zepto: "cabbage carrot mixed vegetables" · instamart: "mixed vegetables"
- Onion — 1 medium (vegetable) — zepto: "onion" · instamart: "onion"
- Ginger-garlic paste — 1 tbsp (vegetable) — zepto: "ginger garlic paste" · instamart: "ginger garlic paste"
- Tomato (for chutney) — 2 medium (vegetable) — zepto: "tomato" · instamart: "tomato"
- Sesame seeds (for chutney) — 1 tbsp (other) _(optional)_ — zepto: "til sesame seeds" · instamart: "sesame seeds"

### Steps
1. Knead the flour with water into a smooth dough and rest for 20 minutes.
2. Finely chop or grate the vegetables (or crumble paneer) and mix with onion, ginger-garlic paste and salt.
3. Roll small dough circles, fill with the vegetable mixture, and pleat closed.
4. Steam for 12-15 minutes until translucent.
5. For the chutney, roast tomatoes and sesame seeds, then blend with chilli and salt.
6. Serve the hot momos with the tomato-sesame chutney.

---

## Thukpa (Hearty Noodle Soup) (Sikkim · Dinner)

```yaml
id: sikkim_dinner_thukpa_hearty_noodle_soup
state: Sikkim
region_zone: Northeast
meal_type: dinner
diet_type: nonveg
tags: [soup, warming, himalayan, hearty]
goal_tags: [maintenance, muscle, recovery]
```

A filling brothy noodle soup loaded with vegetables and meat, the classic cold-weather Sikkimese dinner.

**Serves:** 2 · **Prep:** 15 min · **Cook:** 25 min · **Difficulty:** easy
**Nutrition (approx per serving):** 420 kcal · 24g protein · 50g carbs · 12g fat

### Ingredients
- Wheat noodles — 200 g (grain) — zepto: "noodles" · instamart: "noodles"
- Chicken, sliced — 200 g (protein) — zepto: "chicken" · instamart: "chicken"
- Cabbage — 100 g (vegetable) — zepto: "cabbage" · instamart: "cabbage"
- Carrot — 1 medium (vegetable) — zepto: "carrot" · instamart: "carrot"
- Tomato — 1 medium (vegetable) — zepto: "tomato" · instamart: "tomato"
- Garlic — 3 clove (vegetable) — zepto: "garlic" · instamart: "garlic"
- Spring onion — 2 stalk (vegetable) _(optional)_ — zepto: "spring onion" · instamart: "spring onion"

### Steps
1. Make a broth by simmering chicken pieces with garlic in water for 15 minutes.
2. Add chopped tomato, carrot and cabbage, and cook until tender.
3. Boil the noodles separately until al dente and drain.
4. Combine the noodles with the broth and vegetables, and season with salt and pepper.
5. Simmer for 2-3 minutes to let the flavours meld.
6. Garnish with spring onion and serve hot in deep bowls.

---

