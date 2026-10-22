"""
Build the CallToAction background map from BPDA building footprints
(Back Bay / South End / Beacon Hill / downtown).

Source: https://gis.bostonplans.org/hosting/rest/services/Boston_Buildings/FeatureServer/9
  query bbox -71.102,42.336,-71.040,42.362, outFields=BLDG_HGT_2010, outSR=4326,
  f=geojson, paged by resultOffset (2000 per page) into SRC_DIR/*.geojson

Usage: python3 scripts/make_buildings_svg.py SRC_DIR public/maps
Outputs:
  boston_buildings_footprints.svg  — all footprints, opacity tiered by height
  boston_buildings_highlight_a/b/c.svg — three sets of 18 buildings for accent colors
"""
import json, math, random, sys, glob, os

src_dir, out_dir = sys.argv[1], sys.argv[2]
W0, S0, E0, N0 = -71.102, 42.336, -71.040, 42.362
WIDTH = 1600
k = math.cos(math.radians((S0 + N0) / 2))
scale = WIDTH / ((E0 - W0) * k)
HEIGHT = round((N0 - S0) * scale)

def proj(c):
    return ((c[0] - W0) * k * scale, (N0 - c[1]) * scale)

def dp(pts, tol):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    imax, dmax = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
        if d > dmax:
            imax, dmax = i, d
    if dmax > tol:
        return dp(pts[: imax + 1], tol)[:-1] + dp(pts[imax:], tol)
    return [pts[0], pts[-1]]

def area(pts):
    return abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1] for i in range(len(pts)))) / 2

def ring_d(ring):
    pts = [proj(c) for c in ring]
    if area(pts) < 3:
        return None
    # closed ring: split at the vertex farthest from the start so DP has a real baseline
    far = max(range(len(pts)), key=lambda i: math.dist(pts[0], pts[i]))
    pts = dp(pts[: far + 1], 0.6)[:-1] + dp(pts[far:], 0.6)
    q = []
    for x, y in pts:
        p = (round(x), round(y))
        if not q or q[-1] != p:
            q.append(p)
    if len(q) > 1 and q[0] == q[-1]:
        q.pop()
    if len(q) < 3:
        return None
    # relative coords keep the file small
    out = f"M{q[0][0]} {q[0][1]}"
    for (ax, ay), (bx, by) in zip(q, q[1:]):
        out += f"l{bx - ax} {by - ay}"
    return out + "z"

def feature_d(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    parts = [ring_d(r) for poly in polys for r in poly]
    parts = [p for p in parts if p]
    return "".join(parts)

features = []
for f in sorted(glob.glob(os.path.join(src_dir, "*.geojson"))):
    features += json.load(open(f))["features"]

tiers = {0: [], 1: [], 2: []}
candidates = []
for f in features:
    if not f.get("geometry"):
        continue
    d = feature_d(f["geometry"])
    if not d:
        continue
    h = f["properties"].get("BLDG_HGT_2010") or 0
    t = 0 if h < 40 else 1 if h < 120 else 2
    tiers[t].append(d)
    c = f["geometry"]["coordinates"]
    ring = c[0] if f["geometry"]["type"] == "Polygon" else c[0][0]
    a = area([proj(p) for p in ring])
    x, y = proj(ring[0])
    if 40 < a < 400 and 250 < x < WIDTH - 250 and 60 < y < HEIGHT - 60:
        candidates.append(d)

random.seed(7)
picks = random.sample(candidates, 36)
# sampled separately so adding set c doesn't reshuffle a and b
picks += random.sample([c for c in candidates if c not in picks], 18)

def svg(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" '
            f'width="{WIDTH}" height="{HEIGHT}">{body}</svg>\n')

opac = {0: 0.55, 1: 0.8, 2: 1}
body = "".join(f'<path fill-opacity="{opac[t]}" d="{"".join(ds)}"/>' for t, ds in tiers.items())
open(os.path.join(out_dir, "boston_buildings_footprints.svg"), "w").write(svg(body))
open(os.path.join(out_dir, "boston_buildings_highlight_a.svg"), "w").write(svg(f'<path d="{"".join(picks[:18])}"/>'))
open(os.path.join(out_dir, "boston_buildings_highlight_b.svg"), "w").write(svg(f'<path d="{"".join(picks[18:36])}"/>'))
open(os.path.join(out_dir, "boston_buildings_highlight_c.svg"), "w").write(svg(f'<path d="{"".join(picks[36:])}"/>'))
print(WIDTH, HEIGHT, {t: len(v) for t, v in tiers.items()}, len(candidates))
