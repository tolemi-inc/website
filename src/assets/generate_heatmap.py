#!/usr/bin/env python3
"""Generate an SVG heat map of US states from the instances CSV.

Downloads a public domain US states SVG from Wikimedia Commons and
colors each state based on how many instances are in that state.
"""

import csv
import os
import re
import urllib.request
from collections import Counter

# Tolemi logo colors (low -> mid -> high)
COLOR_LOW = (76, 213, 255)    # #4CD5FF blue
COLOR_MID = (255, 203, 27)    # #FFCB1B yellow
COLOR_HIGH = (255, 0, 37)     # #FF0025 red
COLOR_NONE = "#D0D0D0"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Read CSV and count instances per state ---
csv_path = os.path.join(SCRIPT_DIR, "Result 2026-03-24 13-47-07.csv")
state_counts = Counter()
with open(csv_path) as f:
    reader = csv.reader(f)
    next(reader)  # skip header
    for row in reader:
        if row:
            schema = row[0].strip().strip('"')
            state_code = schema[:2].upper()
            state_counts[state_code] += 1

max_count = max(state_counts.values()) if state_counts else 1


def interpolate_color(count):
    """Interpolate between blue -> yellow -> red based on count."""
    t = count / max_count
    if t <= 0.5:
        s = t * 2
        r = int(COLOR_LOW[0] + (COLOR_MID[0] - COLOR_LOW[0]) * s)
        g = int(COLOR_LOW[1] + (COLOR_MID[1] - COLOR_LOW[1]) * s)
        b = int(COLOR_LOW[2] + (COLOR_MID[2] - COLOR_LOW[2]) * s)
    else:
        s = (t - 0.5) * 2
        r = int(COLOR_MID[0] + (COLOR_HIGH[0] - COLOR_MID[0]) * s)
        g = int(COLOR_MID[1] + (COLOR_HIGH[1] - COLOR_MID[1]) * s)
        b = int(COLOR_MID[2] + (COLOR_HIGH[2] - COLOR_MID[2]) * s)
    return f"rgb({r},{g},{b})"


# --- Download the base US states SVG from Wikimedia Commons ---
SVG_URL = "https://upload.wikimedia.org/wikipedia/commons/1/1a/Blank_US_Map_%28states_only%29.svg"
cache_path = os.path.join(SCRIPT_DIR, ".us_states_base.svg")

if not os.path.exists(cache_path):
    print("Downloading US states SVG from Wikimedia Commons...")
    req = urllib.request.Request(SVG_URL, headers={"User-Agent": "TolemiHeatmapScript/1.0"})
    with urllib.request.urlopen(req) as resp, open(cache_path, "wb") as out:
        out.write(resp.read())
    print("Downloaded.")

with open(cache_path) as f:
    svg_content = f.read()

# --- Build CSS to color each state ---
# The Wikimedia SVG uses classes like .al, .ca, .ny on <path> elements.
# The default style sets .state { fill:#D0D0D0 }.
# We inject per-state fill rules into the existing <style> block.

css_rules = []
for code, count in state_counts.items():
    color = interpolate_color(count)
    css_rules.append(f".{code.lower()} {{fill:{color}}}")

# Insert our rules into the <style> block (before the closing </style>)
css_block = "\n".join(css_rules)
svg_content = svg_content.replace("</style>", f"\n{css_block}\n</style>")

# No title or legend — the map is used as a visual alongside marketing copy.

# --- Write output ---
output_path = os.path.join(SCRIPT_DIR, "state_heatmap.svg")
with open(output_path, "w") as f:
    f.write(svg_content)

# --- Print summary ---
print(f"Generated {output_path}")
print(f"Total instances: {sum(state_counts.values())}")
print(f"States with instances: {len(state_counts)}")
print(f"Max in one state: {max_count} ({max(state_counts, key=state_counts.get)})")
print("\nTop 10 states:")
for code, count in state_counts.most_common(10):
    print(f"  {code}: {count}")
