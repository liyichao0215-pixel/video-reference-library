"""Prepare static Japanese/Korean titles from the public English catalog."""
import concurrent.futures
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist/data/titles.json"


def translate(text, language):
    query = urllib.parse.urlencode({"client": "gtx", "sl": "en", "tl": language, "dt": "t", "q": text})
    request = urllib.request.Request("https://translate.googleapis.com/translate_a/single?" + query,
                                     headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                data = json.load(response)
            return "".join(part[0] for part in data[0] if part[0]).strip()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)


def batch(titles, language):
    text = "\n".join(f"{i:03d}. {title}" for i, title in enumerate(titles, 1))
    translated = translate(text, language)
    matches = list(re.finditer(r"(?m)^\s*(\d{1,3})[.．]\s*", translated))
    if [int(match[1]) for match in matches] == list(range(1, len(titles) + 1)):
        values = [translated[match.end():matches[i + 1].start() if i + 1 < len(matches) else len(translated)].strip()
                  for i, match in enumerate(matches)]
        if all(values):
            return language, dict(zip(titles, values))
    values = {title: translate(title, language) for title in titles}
    assert all(values.values()), "Empty title translation"
    return language, values


def main():
    catalog = json.loads((ROOT / "dist/data/catalog.json").read_text())
    unique = list(dict.fromkeys(item["title"]["en"] for item in catalog["items"]))
    if OUTPUT.exists():
        previous = json.loads(OUTPUT.read_text())["titles"]
    else:
        previous = {}
    translated = {language: {item["title"]["en"]: previous.get(item["slug"], {}).get(language)
                             for item in catalog["items"] if previous.get(item["slug"], {}).get(language)}
                  for language in ("ja", "ko")}
    jobs = []
    for language in translated:
        missing = [title for title in unique if title not in translated[language]]
        jobs.extend((missing[i:i + 20], language) for i in range(0, len(missing), 20))

    def save():
        titles = {item["slug"]: {language: values[item["title"]["en"]]
                                  for language, values in translated.items() if item["title"]["en"] in values}
                  for item in catalog["items"]}
        result = {"method": "Google Translate, English to Japanese/Korean; machine-translated titles only",
                  "sourceCommit": catalog["sourceCommit"], "titles": titles}
        temporary = OUTPUT.with_suffix('.tmp')
        temporary.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")))
        temporary.replace(OUTPUT)

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = [pool.submit(batch, *job) for job in jobs]
        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            language, values = future.result()
            translated[language].update(values)
            save()
            print(f"Translated batch {i}/{len(jobs)} ({language})", flush=True)
    assert all(len(values) == len(unique) for values in translated.values()), "Incomplete translations"
    save()
    print(f"Complete: {len(catalog['items'])} titles in Japanese and Korean.")


if __name__ == "__main__":
    main()
