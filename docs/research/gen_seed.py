import json, re, unicodedata, os, glob

NORM       = "/Users/I335997/FP_Labs/restaurant-app/docs/research/eat-list-normalized.json"
MD         = "/Users/I335997/FP_Labs/Lisbon_Restaurant_Ratings.md"
NR_FILE    = "/Users/I335997/FP_Labs/restaurant-app/docs/research/needs-research.json"
SCORES_DIR = "/Users/I335997/FP_Labs/restaurant-app/docs/research/scores"
OUT        = "/Users/I335997/FP_Labs/restaurant-app/src/db/seeds/lisbon-restaurants.ts"

def norm_name(s):
    s = s or ""
    s = "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))
    s = re.sub(r"[⭐🆕⚠️]", "", s)
    s = re.sub(r"\b(restaurante|cervejaria|tasca|tasquinha|taberna|marisqueira)\b", "", s, flags=re.I)
    s = re.sub(r"[^a-z0-9]+", "", s.lower())
    return s

def pc(s):
    if not s: return None
    s = s.strip().lower().replace(" ", ""); m = re.match(r"([\d.,]+)(k?)", s)
    if not m: return None
    num, k = m.group(1), m.group(2)
    if k == "k": return int(float(num.replace(",", ".")) * 1000)
    num = num.replace(".", "").replace(",", ""); return int(num) if num.isdigit() else None

def parse_sources(ks):
    out = []
    for m in re.finditer(r"TheFork\s*~?(\d\.\d)(?:[–-]\d\.\d)?\s*(?:\(([^)]+)\))?", ks):
        out.append(("thefork", float(m.group(1)), 10, pc(m.group(2))))
    for m in re.finditer(r"\bTA\s*~?(\d\.\d)(?:[–-]\d\.\d)?\s*(?:\(([^)]+)\))?", ks):
        out.append(("tripadvisor", float(m.group(1)), 5, pc(m.group(2))))
    for m in re.finditer(r"(?:^|[·|\s])G\s*~?(\d\.\d)\s*(?:\(([^)]+)\))?", ks):
        out.append(("google", float(m.group(1)), 5, pc(m.group(2))))
    for m in re.finditer(r"OpenTable\s*(\d\.\d)", ks):
        out.append(("opentable", float(m.group(1)), 5, None))
    return out

def parse_editorial(text):
    e = {}
    if "⭐" in text or re.search(r"Michelin[- ]star", text, re.I): e["michelinStars"] = 1
    elif re.search(r"Michelin", text, re.I): e["inMichelinGuide"] = True
    if re.search(r"Repsol", text, re.I): e["repsolSoles"] = 1
    if re.search(r'"101"|\b101\b', text): e["best101"] = True
    if re.search(r"Time Out", text, re.I): e["timeOut"] = True
    p = sum(1 for w in ["Observador","Eater","Expresso","Publico","Público","NiT","Infatuation","Mesa Marcada","MAGG"] if re.search(w, text, re.I))
    if p: e["pressMentions"] = p
    return e

# .md notes map (name -> full "name + notes" text for editorial)
md_text = {}
body = open(MD).read().split("Ranked master list")[1].split("## Excluded")[0]
for line in body.splitlines():
    m = re.match(r"\|\s*\*\*\d\.\d\*\*\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*$", line)
    if m: md_text[norm_name(m.group(1))] = m.group(1) + " " + m.group(4)

# Research scores map: norm_name -> score_data from workflow output
nr_data = json.load(open(NR_FILE))
research_map = {}
loaded = 0
for fn in sorted(glob.glob(os.path.join(SCORES_DIR, "*.json")), key=lambda p: int(os.path.basename(p).replace(".json", ""))):
    try:
        s = json.load(open(fn))
        idx = s.get("index")
        if idx is None or idx >= len(nr_data): continue
        nr_name = nr_data[idx]["name"]
        research_map[norm_name(nr_name)] = s
        loaded += 1
    except Exception as exc:
        print(f"  warn: {fn}: {exc}")
print(f"loaded {loaded} research score files")

def parse_research_ratings(s):
    """Convert research score file to [(source, raw, max_score, count)] list."""
    out = []
    for src, mx in [("google", 5), ("tripadvisor", 5), ("opentable", 5), ("thefork", 10)]:
        entry = s.get(src)
        if entry and isinstance(entry, dict) and "score" in entry:
            cnt = entry.get("count")
            out.append((src, float(entry["score"]), mx, cnt))
    return out

def parse_research_editorial(s):
    """Extract non-falsy editorial signals from score file."""
    raw = s.get("editorial") or {}
    return {k: v for k, v in raw.items() if v is not None and v is not False and v != 0}

def infer_category(name):
    n = name.lower()
    if "cervejaria" in n: return "cervejaria"
    if "marisqueira" in n or "marisco" in n: return "marisqueira"
    if "tasca" in n or "tasquinha" in n or "taberna" in n: return "tasca"
    return "other"

data = json.load(open(NORM))
entries = []
scored_md = 0
scored_research = 0
unscored = 0

for x in data:
    if x.get("status") in ("closed", "not-a-restaurant"): continue
    name = x["name"]
    cat = infer_category(name)
    zone = x.get("area") or x.get("city") or None
    ks = x.get("existing_key_scores")
    ratings = []

    # 1. Scores from the curated .md (highest fidelity, already human-verified)
    if ks:
        for src, raw, mx, cnt in parse_sources(ks):
            r = {"source": src, "score": round(raw * (10.0 / mx), 2), "max_score": mx}
            if cnt is not None: r["review_count"] = cnt
            ratings.append(r)

    # 2. Editorial from matching .md notes
    ed = {}
    for cand in [name] + x.get("aliases", []):
        t = md_text.get(norm_name(cand))
        if t: ed = parse_editorial(t); break

    # 3. Researched scores (for restaurants without .md ratings)
    if not ratings:
        for cand in [name] + x.get("aliases", []):
            rd = research_map.get(norm_name(cand))
            if rd and rd.get("found") and rd.get("confidence") in ("high", "medium"):
                for src, raw, mx, cnt in parse_research_ratings(rd):
                    r = {"source": src, "score": round(raw * (10.0 / mx), 2), "max_score": mx}
                    if cnt is not None: r["review_count"] = cnt
                    ratings.append(r)
                if not ed:
                    ed = parse_research_editorial(rd)
                break

    if ratings and ks:
        scored_md += 1
    elif ratings:
        scored_research += 1
    else:
        unscored += 1

    e = {"name": name, "category": cat}
    if zone: e["zone"] = zone
    if x.get("city"): e["city"] = x["city"]
    if x.get("region"): e["region"] = x["region"]
    if x.get("country"): e["country"] = x["country"]
    if x.get("dish_notes"): e["dish_notes"] = x["dish_notes"]
    if ratings: e["ratings"] = ratings
    if ed: e["editorial"] = ed
    entries.append(e)

hdr = '''import type { Category, RatingSource, PriceRange } from '@/domain';
import type { EditorialSignals } from '@/scoring/consensus';

export interface SeedRating {
  source: RatingSource | 'opentable';
  score: number; // already on the 0–10 axis
  max_score?: number;
  review_count?: number;
}

export interface SeedRestaurant {
  name: string;
  category: Category;
  zone?: string;
  city?: string;
  region?: string;
  country?: string;
  price_range?: PriceRange;
  latitude?: number;
  longitude?: number;
  dish_notes?: string;
  ratings?: SeedRating[];
  editorial?: EditorialSignals;
}

// Generated from the user\'s curated eat-list + Lisbon_Restaurant_Ratings.md
// (docs/research/gen_seed.py). MD scores = human-verified; research scores =
// web-researched via workflow agents. Restaurants without ratings are unscored.
export const lisbonSeed: SeedRestaurant[] = '''

open(OUT, "w").write(hdr + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n")
print(f"wrote {len(entries)} restaurants  (md={scored_md} research={scored_research} unscored={unscored}) -> {OUT}")
