import os
import sys
import json
import xml.etree.ElementTree as ET

def build_gid_to_key(map_json, map_path):
    gid_to_key = {}

    base_dir = os.path.dirname(map_path)

    for ts in map_json.get("tilesets", []):
        firstgid = ts["firstgid"]

        # Case 1: Tileset er embedded i map-json (har "tiles" direkte)
        if "tiles" in ts:
            for tile in ts.get("tiles", []):
                tid = tile["id"]
                props = {p["name"]: p["value"] for p in tile.get("properties", [])}
                key = props.get("key")
                if key:
                    gid_to_key[firstgid + tid] = key
            continue

        # Case 2: Tileset er ekstern fil (har "source")
        source = ts.get("source")
        if not source:
            continue

        source_path = os.path.join(base_dir, source)

        # Hvis du har .tsj (JSON tileset)
        if source_path.lower().endswith(".tsj"):
            with open(source_path, "r", encoding="utf-8") as f:
                tsj = json.load(f)
            for tile in tsj.get("tiles", []):
                tid = tile["id"]
                props = {p["name"]: p["value"] for p in tile.get("properties", [])}
                key = props.get("key")
                if key:
                    gid_to_key[firstgid + tid] = key

        # Hvis du har .tsx (XML tileset)
        elif source_path.lower().endswith(".tsx"):
            tree = ET.parse(source_path)
            root = tree.getroot()

            for tile_el in root.findall("tile"):
                tid = int(tile_el.get("id"))
                props_el = tile_el.find("properties")
                key_val = None
                if props_el is not None:
                    for p in props_el.findall("property"):
                        if p.get("name") == "key":
                            key_val = p.get("value")
                            break
                if key_val:
                    gid_to_key[firstgid + tid] = key_val

    return gid_to_key

def layer_to_grid(layer, width, height, gid_to_key, empty="."):
    data = layer.get("data")
    if not data:
        raise ValueError(f'Layer "{layer.get("name")}" mangler data')

    if len(data) != width * height:
        raise ValueError(f'Layer "{layer.get("name")}" har feil lengde: {len(data)} vs {width*height}')

    grid = []
    for y in range(height):
        row = []
        for x in range(width):
            gid = data[y * width + x]
            if gid == 0:
                row.append(empty)
            else:
                row.append(gid_to_key.get(gid, empty))  # ukjent gid => "."
        grid.append(row)
    return grid

def main():
    if len(sys.argv) < 2:
        print("Bruk: python tools/import_tiled.py path/to/map.json")
        sys.exit(1)

    path = sys.argv[1]
    with open(path, "r", encoding="utf-8") as f:
        mj = json.load(f)

    width = mj["width"]
    height = mj["height"]

    gid_to_key = build_gid_to_key(mj, path)

    layers = {l["name"]: l for l in mj.get("layers", []) if l.get("type") == "tilelayer"}

    # Forventede lag
    base = layers.get("base")
    mid = layers.get("mid")
    top = layers.get("top")

    if not base or not mid or not top:
        raise ValueError('Må ha tile layers med navn: "base", "mid", "top"')

    grid_base = layer_to_grid(base, width, height, gid_to_key)
    grid_mid  = layer_to_grid(mid,  width, height, gid_to_key)
    grid_top  = layer_to_grid(top,  width, height, gid_to_key)

    # Print JS snippet
    print(f"width: {width},")
    print(f"height: {height},")
    print("grid_base:", json.dumps(grid_base, ensure_ascii=False), ",")
    print("grid_mid:",  json.dumps(grid_mid,  ensure_ascii=False), ",")
    print("grid_top:",  json.dumps(grid_top,  ensure_ascii=False), ",")

if __name__ == "__main__":
    main()
