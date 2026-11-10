# Indian recipe and ingredient data sources

A log of where FreshPlate could get Indian recipe and ingredient data, what licence each source carries, and what is still needed before using it. Checked on 2026-11-10 from the sources' own pages. This is research, not legal advice, and licence statements can change, so re-check before relying on one.

Scope: India only for now. Sources about other cuisines are parked at the bottom.

**Rules for anything we import**

- Keep the source and licence with every record, and credit the source where its licence asks for it.
- A licence on a dataset only covers what the dataset's author owns. A dataset that was scraped from a website does not carry that website's rights with it.
- Do not copy recipe text or photos from websites. Ingredient lists and quantities are facts, but how a recipe is written is protected, so rewrite instructions in our own words unless a licence allows copying.
- No scraping of platforms against their terms.

## Candidates

| Source | What it gives | Licence found | Access | Status |
| --- | --- | --- | --- | --- |
| **Indian Nutrient Databank (INDB)**, Anuvaad Solutions and University of Edinburgh, 2024 | 1,014 common Indian recipes and 1,095 raw foods, with nutrients per 100 g and per serving. The closest match to FreshPlate. Built from IFCT 2017, Nutritive Value of Indian Foods (2004), CoFID (UK) and USDA values. | **None stated.** The Anuvaad page calls it "open-access" but gives no terms. The paper is open access, but the data licence was not confirmed. | Excel file `Anuvaad_INDB_2024.11.xlsx` from https://www.anuvaad.org.in/indian-nutrient-databank/. The GitHub address I found (`lindsayjaacks/Indian-Nutrient-Databank-INDB`) returned 404. | **Needs written permission** stating the licence, including commercial use. Also ask about the terms of the source tables it draws on. |
| **Indian Food Composition Tables 2017 (IFCT)**, National Institute of Nutrition (NIN), ICMR | Nutrient values for 542 key Indian foods. The standard Indian reference for ingredients. | The book is NIN's. A GitHub packaging of it (`ifct2017/ifct2017`) is AGPL-3.0 since April 2025 (earlier versions MIT), but that covers the code, and it states no licence for the underlying data. | Book from NIN; machine-readable copy via the GitHub package above. | **Needs permission from NIN/ICMR.** Avoid copying from the AGPL package, since AGPL terms could apply to what we build with it. |
| **Karya, Endangered Recipes Translated (500)** | 500 translated recipes, described as regional and little documented. The dataset card is gated, so I could not confirm they are Indian. | CC BY 4.0 | Hugging Face `karya/endangered-recipes-translated-500`, gated: needs a login and acceptance of conditions. The original 1,000-recipe release has a separate licence. | **Needs your login.** Read the gate's conditions and confirm the recipes are Indian before accepting. |
| **6000+ Indian Food Recipes (Mendeley Data)**, K. Jain, 2020 | 6,000+ recipes: ingredients, times, cuisine, diet, instructions. | CC BY 4.0 on the dataset page. | CSV and XLS at https://data.mendeley.com/datasets/xsphgmmh7b/1 | **Do not use yet.** The page says it was created by crawling Archana's Kitchen, so the recipe text belongs to that site, and the compiler's licence cannot grant it. Hindi entries were machine-translated. Needs permission from Archana's Kitchen. |
| **INDoRI**, Khanna et al., 2023 | Recipes and ingredients from seven online platforms across 18 regions. | None stated. | No download location found in the paper (arXiv 2309.10403). | **Skip** unless the authors grant a licence. |
| **Cooking (Indian)**, RWTH Aachen AHORN | 2,997 recipes as bare ingredient sets (1,664 ingredients), with no quantities, steps or names. From the "What's Cooking?" Kaggle competition. | "No license information provided by the source." | https://ahorn.rwth-aachen.de/dataset/cooking-indian | **Not useful** for recipes. Could inform ingredient pairing statistics if its licence were clarified. |
| **FKG.in** (Ashoka University) | Food knowledge graph for India. | The dataset page says "Coming Soon!". | https://fkg-india.github.io/library/datasets | **Nothing to use yet.** Worth watching. |
| **Old public-domain cookbooks** (for example *The Indian cookery book*, Wellcome Collection) | Historical recipes. | Public Domain Mark | https://wellcomelibrary.org/item/b2152824x | Low priority: dated and unstructured. |
| **RASOI** (Ashoka University) | Images of Indian dishes and thalis. | CC BY-NC-SA 4.0, non-commercial research only. | Kaggle | **Not usable** for a commercial product. |

## Permissions to get

1. **Anuvaad Solutions / INDB authors:** ask in writing for the licence of the Excel file, and whether commercial use is allowed. This is the single most valuable permission.
2. **NIN (ICMR), Hyderabad:** ask whether the IFCT 2017 values may be used in a commercial app, and under what credit.
3. **Karya:** accept the gate yourself on Hugging Face, check that the recipes are Indian, then place the file somewhere I can read it.
4. **Archana's Kitchen:** only if the Mendeley dataset is wanted.

## Not checked

- The PubMed Central article and the DOAJ record for INDB blocked automated access (bot check and 403), so the paper's own licence and data-availability statement were not read. Reading them in a browser may answer the INDB licence question.
- Whether any of the Indian sources use the regional names and spellings the app's recipes use. That needs a look at the files themselves.

## Parked: not India

- **USDA FoodData Central:** public domain (CC0), nutrient values for mostly US foods. Not needed while INDB and IFCT cover Indian ingredients.
- **Open Food Facts:** packaged products by barcode, ODbL. Not recipes.
