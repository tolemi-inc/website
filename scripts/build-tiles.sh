#!/usr/bin/env bash
set -euo pipefail

# Convert .geojsonl files to .pmtiles using tippecanoe
# Requires: brew install tippecanoe

MAPS_DIR="$(cd "$(dirname "$0")/../public/maps" && pwd)"

LAYERS=(
  "boston_parcels"
  "boston_heat_islands"
  "boston_floodmap"
  "boston_mbta"
)

for layer in "${LAYERS[@]}"; do
  src="$MAPS_DIR/${layer}.geojsonl"
  out="$MAPS_DIR/${layer}.pmtiles"

  if [ ! -f "$src" ]; then
    echo "SKIP: $src not found"
    continue
  fi

  echo "Converting $layer..."

  # Wrap newline-delimited GeoJSON features into a FeatureCollection
  tmp=$(mktemp /tmp/${layer}_XXXX.geojson)
  {
    echo '{"type":"FeatureCollection","features":['
    # Join lines with commas (sed adds comma after each line, then remove trailing comma)
    sed 's/$/,/' "$src" | sed '$ s/,$//'
    echo ']}'
  } > "$tmp"

  tippecanoe \
    --output="$out" \
    --force \
    --minimum-zoom=10 \
    --maximum-zoom=16 \
    --no-tile-compression \
    --drop-densest-as-needed \
    --layer="$layer" \
    "$tmp"

  rm -f "$tmp"
  echo "  -> $out ($(du -h "$out" | cut -f1))"
done

echo "Done. PMTiles files in $MAPS_DIR/"
