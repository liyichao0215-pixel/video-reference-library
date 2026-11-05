"""Capture the current public catalog once, with persistent category codes."""
import collections
import datetime
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = "BeatAPI/awesome-minimax-h3-prompts"
CATEGORIES = [
    ("cinematic-story", "电影叙事", "A"),
    ("music-video", "音乐 MV", "B"),
    ("product-commercial", "产品广告", "C"),
    ("fashion", "时尚大片", "D"),
    ("action", "动作场面", "E"),
    ("anime", "动漫", "F"),
    ("vlog", "生活 Vlog", "G"),
    ("cinematic-travel", "旅行风光", "H"),
    ("gameplay", "游戏", "I"),
    ("animation", "动画", "J"),
    ("horror", "惊悚", "K"),
    ("motion-graphics", "动态图形", "L"),
    ("comedy", "喜剧", "M"),
    ("title-sequence", "片头设计", "N"),
    ("brand-film", "品牌短片", "O"),
    ("viral-short", "创意短片", "P"),
    ("product-demo", "产品演示", "Q"),
]


def get(url):
    request = urllib.request.Request(url, headers={"User-Agent": "VideoReferenceSnapshot/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()


def capture():
    destination = ROOT / "dist/data/catalog.json"
    # A snapshot is immutable; refresh requires a separate import that preserves its codes.
    if destination.exists():
        raise SystemExit("Snapshot already exists; refusing to overwrite stable reference numbers.")
    commit = json.loads(get(f"https://api.github.com/repos/{REPO}/commits/main"))["sha"]
    catalog = json.loads(get(f"https://raw.githubusercontent.com/{REPO}/{commit}/prompts/catalog.json"))
    categories = {key: {"key": key, "name": name, "letter": letter} for key, name, letter in CATEGORIES}
    counts = collections.Counter()
    slugs = set()
    for item in catalog["prompts"]:
        assert item["slug"] not in slugs, "Duplicate source slug"
        slugs.add(item["slug"])
        assert item["category"] in categories, "Unmapped source category"
        assert item["prompt"].strip(), "Missing prompt"
        for key in ("video", "thumbnail"):
            url = urllib.parse.urlparse(item[key])
            assert url.scheme == "https" and url.hostname == "media.beatapi.io", "Unexpected media host"
        source = urllib.parse.urlparse(item["source"]["url"])
        assert source.scheme == "https" and source.hostname in {"x.com", "twitter.com", "www.x.com"}, "Unexpected source URL"
        counts[item["category"]] += 1
        item["code"] = f'{categories[item["category"]]["letter"]}{counts[item["category"]]:03d}'
    result = {
        "capturedOn": "2026-11-05",
        "sourceRepository": f"https://github.com/{REPO}",
        "sourceCommit": commit,
        "sourceUpdatedAt": catalog.get("updatedAt"),
        "categories": [{**category, "count": counts[key]} for key, category in categories.items()],
        "items": catalog["prompts"],
    }
    destination.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (ROOT / "SOURCE-LICENSE.md").write_bytes(get(f"https://raw.githubusercontent.com/{REPO}/{commit}/LICENSE.md"))
    print(json.dumps({"items": len(slugs), "categories": len(categories), "counts": dict(counts), "commit": commit}))


if __name__ == "__main__":
    capture()
