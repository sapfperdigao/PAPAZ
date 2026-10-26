import json, re, math, statistics as st

MD = "/Users/I335997/FP_Labs/Lisbon_Restaurant_Ratings.md"

# --- formula constants (mirror src/scoring/consensus.ts) ---
TARGET_MEAN, TARGET_SD, M, CAP = 7.0, 1.2, 50, 0.5
DIST = {"google":(8.4,0.6),"tripadvisor":(8.0,0.8),"opentable":(8.6,0.6),"thefork":(9.0,0.4)}
W = {"personal":1.5,"google":0.9,"tripadvisor":0.7,"thefork":0.6,"opentable":0.6,"reddit":0.5}
clamp = lambda x,lo,hi: max(lo,min(hi,x))

def src_score(source, r10, v):
    if source in DIST:
        mu,sg = DIST[source]; z=(r10-mu)/sg; norm=clamp(TARGET_MEAN+TARGET_SD*z,0,10)
    else: norm=clamp(r10,0,10)
    v=max(v,1); return (v/(v+M))*norm + (M/(v+M))*TARGET_MEAN

def editorial_bonus(e):
    p=0.0
    if e.get("michelinStars",0)>=2: p+=0.5
    elif e.get("michelinStars",0)==1: p+=0.4
    elif e.get("inMichelinGuide"): p+=0.25
    p+=0.3*e.get("repsolSoles",0)
    if e.get("timeOut"): p+=0.2
    if e.get("best101"): p+=0.2
    p+=0.1*e.get("pressMentions",0)
    return min(CAP,p)

def consensus(sources, e):
    if not sources: return None
    num=den=0.0
    for s,r10,v in sources:
        w=W.get(s,0.5); num+=w*src_score(s,r10,v); den+=w
    crowd=num/den if den else TARGET_MEAN
    return round(clamp(crowd+editorial_bonus(e),0,10),1)

def parse_count(s):
    if not s: return 200  # unknown volume → modest default
    s=s.strip().lower().replace(" ","")
    m=re.match(r"([\d.,]+)(k?)",s)
    if not m: return 200
    num,k=m.group(1),m.group(2)
    if k=="k": return int(float(num.replace(",","."))*1000)
    num=num.replace(".","").replace(",","")  # PT thousands sep
    return int(num) if num.isdigit() else 200

def parse_sources(ks):
    out=[]
    # TheFork X.X (count)
    for m in re.finditer(r"TheFork\s*~?(\d\.\d)(?:[–-]\d\.\d)?\s*(?:\(([^)]+)\))?", ks):
        out.append(("thefork", float(m.group(1)), parse_count(m.group(2))))
    for m in re.finditer(r"\bTA\s*~?(\d\.\d)(?:[–-]\d\.\d)?\s*(?:\(([^)]+)\))?", ks):
        out.append(("tripadvisor", float(m.group(1))*2, parse_count(m.group(2))))
    for m in re.finditer(r"(?:^|[·|\s])G\s*~?(\d\.\d)\s*(?:\(([^)]+)\))?", ks):
        out.append(("google", float(m.group(1))*2, parse_count(m.group(2))))
    for m in re.finditer(r"OpenTable\s*(\d\.\d)", ks):
        out.append(("opentable", float(m.group(1))*2, 200))
    return out

def parse_editorial(name, notes):
    t = (name or "")+" "+(notes or "")
    e={}
    if "⭐" in t or re.search(r"Michelin[- ]star", t, re.I): e["michelinStars"]=1
    elif re.search(r"Michelin", t, re.I): e["inMichelinGuide"]=True
    if re.search(r"Repsol", t, re.I): e["repsolSoles"]=1
    if re.search(r'"101"|#\d+\s*"101"|\b101\b', t): e["best101"]=True
    if re.search(r"Time Out", t, re.I): e["timeOut"]=True
    press=sum(1 for w in ["Observador","Eater","Expresso","Público","Publico","NiT","Infatuation","Mesa Marcada","MAGG"] if re.search(w,t,re.I))
    if press: e["pressMentions"]=press
    return e

body = open(MD).read().split("Ranked master list")[1].split("## Excluded")[0]
rows=[]
for line in body.splitlines():
    m=re.match(r"\|\s*\*\*(\d\.\d)\*\*\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*$", line)
    if not m: continue
    human=float(m.group(1)); name=m.group(2); area=m.group(3); ks=m.group(4); notes=m.group(5)
    srcs=parse_sources(ks+" "+notes); ed=parse_editorial(name,notes)
    f=consensus(srcs, ed)
    rows.append((name.strip(), human, f, len(srcs), ed))

paired=[(n,h,f) for (n,h,f,ns,ed) in rows if f is not None]
errs=[f-h for (_,h,f) in paired]
print(f"parsed rows: {len(rows)}  scored: {len(paired)}")
print(f"human:   mean={st.mean([h for _,h,_ in paired]):.2f} sd={st.pstdev([h for _,h,_ in paired]):.2f}")
print(f"formula: mean={st.mean([f for _,_,f in paired]):.2f} sd={st.pstdev([f for _,_,f in paired]):.2f}")
print(f"mean err (formula-human)={st.mean(errs):+.2f}  MAE={st.mean([abs(e) for e in errs]):.2f}")
# Pearson correlation
hs=[h for _,h,_ in paired]; fs=[f for _,_,f in paired]
mh,mf=st.mean(hs),st.mean(fs)
cov=sum((h-mh)*(f-mf) for h,f in zip(hs,fs)); dh=math.sqrt(sum((h-mh)**2 for h in hs)); df=math.sqrt(sum((f-mf)**2 for f in fs))
print(f"correlation r={cov/(dh*df):.3f}")
print("\n biggest divergences (|formula-human|):")
for n,h,f in sorted(paired,key=lambda x:-abs(x[2]-x[1]))[:12]:
    print(f"  {n[:34]:34} human {h:.1f}  formula {f:.1f}  ({f-h:+.1f})")
