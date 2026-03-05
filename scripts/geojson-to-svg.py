"""
Convert Boston GeoJSON layers to SVGs for the hero map:
  1. boston_parcels.geojsonl → base map (street structure via parcel outlines)
  2. boston_heat_islands.geojsonl → heat island overlay
  3. boston_floodmap.geojsonl → floodplain overlay
  4. boston_mbta.geojsonl → transit overlay
"""
import json
import os

# SVG dimensions
SVG_W = 1200
SVG_H = 900

# Shared bounding box (union of all layers, with padding)
PAD = 0.005
MIN_LON = -71.191 - PAD
MAX_LON = -70.869 + PAD
MIN_LAT = 42.228 - PAD
MAX_LAT = 42.397 + PAD

LON_SPAN = MAX_LON - MIN_LON
LAT_SPAN = MAX_LAT - MIN_LAT


def project(lon, lat):
    x = (lon - MIN_LON) / LON_SPAN * SVG_W
    y = (1 - (lat - MIN_LAT) / LAT_SPAN) * SVG_H
    return x, y


def ring_to_path(coords, precision=0, min_dist=0):
    """Convert a ring of [lon, lat] to SVG path string.
    min_dist: skip vertices closer than this (in SVG units) to previous kept vertex.
    """
    pts = []
    prev_x, prev_y = None, None
    for c in coords:
        if isinstance(c[0], list):
            continue
        x, y = project(c[0], c[1])
        rx, ry = round(x, precision), round(y, precision)
        # Skip duplicate/too-close consecutive points
        if prev_x is not None:
            if rx == prev_x and ry == prev_y:
                continue
            if min_dist > 0 and abs(rx - prev_x) + abs(ry - prev_y) < min_dist:
                continue
        prev_x, prev_y = rx, ry
        fmt = f"{{:.{precision}f}}"
        cmd = "M" if len(pts) == 0 else "L"
        pts.append(f"{cmd}{fmt.format(rx)},{fmt.format(ry)}")
    if len(pts) < 3:
        return ""
    pts.append("Z")
    return "".join(pts)


def linestring_to_path(coords, precision=1):
    pts = []
    for c in coords:
        if isinstance(c[0], list):
            continue
        x, y = project(c[0], c[1])
        fmt = f"{{:.{precision}f}}"
        cmd = "M" if len(pts) == 0 else "L"
        pts.append(f"{cmd}{fmt.format(round(x, precision))},{fmt.format(round(y, precision))}")
    return "".join(pts)


def write_svg(path, content):
    with open(path, "w") as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SVG_W} {SVG_H}">\n')
        f.write(content)
        f.write("</svg>\n")
    size_kb = os.path.getsize(path) / 1024
    print(f"  {path}: {size_kb:.0f} KB")


def generate_parcels():
    """Base map: parcels as filled shapes — gaps between them form streets."""
    print("Generating parcels...")
    paths = []
    skipped = 0
    with open("public/maps/boston_parcels.geojsonl") as f:
        for line in f:
            feat = json.loads(line)
            geom = feat["geometry"]
            rings = []
            if geom["type"] == "MultiPolygon":
                for poly in geom["coordinates"]:
                    rings.append(poly[0])
            elif geom["type"] == "Polygon":
                rings.append(geom["coordinates"][0])

            for ring in rings:
                # Skip tiny parcels (< 0.8px extent)
                xs = [(c[0] - MIN_LON) / LON_SPAN * SVG_W for c in ring if not isinstance(c[0], list)]
                ys = [(1 - (c[1] - MIN_LAT) / LAT_SPAN) * SVG_H for c in ring if not isinstance(c[0], list)]
                if not xs:
                    continue
                extent = max(max(xs) - min(xs), max(ys) - min(ys))
                if extent < 0.8:
                    skipped += 1
                    continue
                d = ring_to_path(ring, precision=0, min_dist=0.5)
                if d:
                    paths.append(d)

    print(f"  {len(paths)} parcel paths ({skipped} skipped as too small)")
    content = f'<rect width="{SVG_W}" height="{SVG_H}" fill="#f8f8f8"/>\n'
    # Fill parcels with a light warm gray; the slightly darker gaps = streets
    content += f'<path d="{" ".join(paths)}" fill="#eeede9" stroke="#ddd" stroke-width="0.15"/>\n'
    write_svg("public/maps/boston_parcels.svg", content)


def generate_heat_islands():
    """Heat island overlay: polygons colored by gridcode intensity."""
    print("Generating heat islands...")
    # Group paths by gridcode for different opacities
    groups = {}  # gridcode -> [path_d, ...]
    with open("public/maps/boston_heat_islands.geojsonl") as f:
        for line in f:
            feat = json.loads(line)
            gc = int(feat["properties"].get("gridcode", 0))
            geom = feat["geometry"]
            rings = []
            if geom["type"] == "MultiPolygon":
                for poly in geom["coordinates"]:
                    rings.append(poly[0])
            elif geom["type"] == "Polygon":
                rings.append(geom["coordinates"][0])
            for ring in rings:
                d = ring_to_path(ring, precision=1)
                if d:
                    groups.setdefault(gc, []).append(d)

    content = ""
    max_gc = 14
    for gc in sorted(groups.keys()):
        if gc == 0:
            continue  # skip baseline
        intensity = gc / max_gc
        # Interpolate from yellow-orange to deep red
        r = 255
        g = int(200 * (1 - intensity))
        b = int(50 * (1 - intensity))
        opacity = 0.05 + intensity * 0.25
        color = f"#{r:02x}{g:02x}{b:02x}"
        content += f'<path d="{" ".join(groups[gc])}" fill="{color}" fill-opacity="{opacity:.2f}" stroke="{color}" stroke-width="0.5" stroke-opacity="{opacity + 0.1:.2f}"/>\n'

    write_svg("public/maps/boston_heat_islands.svg", content)


def generate_floodmap():
    """Floodplain overlay: flood zones colored by severity."""
    print("Generating floodmap...")
    zone_colors = {
        "VE": ("#4CD5FF", 0.20),  # coastal high hazard — most intense
        "AE": ("#4CD5FF", 0.12),  # 100-yr flood
        "A":  ("#4CD5FF", 0.10),
        "AO": ("#7EE0FF", 0.08),  # shallow flooding
        "X":  ("#7EE0FF", 0.03),  # minimal
    }
    zone_paths = {}
    with open("public/maps/boston_floodmap.geojsonl") as f:
        for line in f:
            feat = json.loads(line)
            zone = feat["properties"].get("fld_zone", "X")
            geom = feat["geometry"]
            rings = []
            if geom["type"] == "MultiPolygon":
                for poly in geom["coordinates"]:
                    rings.append(poly[0])
            elif geom["type"] == "Polygon":
                rings.append(geom["coordinates"][0])
            for ring in rings:
                d = ring_to_path(ring, precision=1)
                if d:
                    zone_paths.setdefault(zone, []).append(d)

    content = ""
    # Render less severe zones first, most severe on top
    for zone in ["X", "AO", "A", "AE", "VE"]:
        if zone not in zone_paths:
            continue
        color, opacity = zone_colors.get(zone, ("#4CD5FF", 0.05))
        content += f'<path d="{" ".join(zone_paths[zone])}" fill="{color}" fill-opacity="{opacity}" stroke="{color}" stroke-width="0.5" stroke-opacity="{opacity + 0.1:.2f}"/>\n'

    write_svg("public/maps/boston_floodmap.svg", content)


def generate_mbta():
    """Transit overlay: MBTA lines colored by line name."""
    print("Generating MBTA...")
    line_colors = {
        "RED": "#FF0025",
        "ORANGE": "#FF8C00",
        "GREEN": "#37A04F",
        "BLUE": "#4CD5FF",
        "SILVER": "#C0C0C0",
    }
    line_paths = {}
    with open("public/maps/boston_mbta.geojsonl") as f:
        for line_str in f:
            feat = json.loads(line_str)
            line_name = feat["properties"].get("line", "")
            geom = feat["geometry"]
            coords_list = []
            if geom["type"] == "MultiLineString":
                coords_list = geom["coordinates"]
            elif geom["type"] == "LineString":
                coords_list = [geom["coordinates"]]
            for coords in coords_list:
                d = linestring_to_path(coords)
                if d:
                    line_paths.setdefault(line_name, []).append(d)

    content = ""
    for line_name in ["SILVER", "GREEN", "BLUE", "ORANGE", "RED"]:
        if line_name not in line_paths:
            continue
        color = line_colors.get(line_name, "#888")
        width = "3" if line_name in ("RED", "ORANGE", "GREEN", "BLUE") else "2"
        opacity = "0.7" if line_name != "SILVER" else "0.4"
        dash = ' stroke-dasharray="6 4"' if line_name == "SILVER" else ""
        content += f'<path d="{" ".join(line_paths[line_name])}" fill="none" stroke="{color}" stroke-width="{width}" stroke-opacity="{opacity}" stroke-linecap="round"{dash}/>\n'

    write_svg("public/maps/boston_mbta.svg", content)


if __name__ == "__main__":
    generate_parcels()
    generate_heat_islands()
    generate_floodmap()
    generate_mbta()
    print("Done!")
