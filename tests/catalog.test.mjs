import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { getResults, prepareItems, publicLink } from '../dist/catalog.js';
import { LANGUAGES, MESSAGES, CATEGORY_NAMES, normalizeLanguage, t, categoryName, itemTitle } from '../dist/i18n.js';

const catalog = JSON.parse(await readFile(new URL('../dist/data/catalog.json', import.meta.url), 'utf8'));
const items = prepareItems(catalog);
const translations = JSON.parse(await readFile(new URL('../dist/data/titles.json', import.meta.url), 'utf8'));

test('all 550 records retain a unique fixed reference and original provenance', () => {
  assert.equal(items.length, 550);
  assert.equal(catalog.categories.length, 17);
  assert.equal(new Set(items.map(item => item.code)).size, 550);
  assert.equal(new Set(items.map(item => item.slug)).size, 550);
  assert.match(catalog.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(new Set(catalog.categories.map(category => category.letter)).size, 17);
  for (const category of catalog.categories) {
    const group = items.filter(item => item.category === category.key);
    assert.equal(group.length, category.count);
    group.forEach((item, i) => assert.equal(item.code, `${category.letter}${String(i + 1).padStart(3, '0')}`));
  }
  for (const item of items) {
    assert.ok(item.categoryInfo);
    assert.ok(item.prompt.trim().length >= 20);
    assert.ok(item.title.zh || item.title.en);
    assert.ok(item.source.name);
    assert.ok(publicLink(item.source.url, ['x.com', 'www.x.com', 'twitter.com']));
    assert.ok(publicLink(item.video, ['media.beatapi.io']));
    assert.ok(publicLink(item.thumbnail, ['media.beatapi.io']));
    for (const url of item.promptSourceUrls || []) assert.ok(publicLink(url, ['x.com', 'www.x.com', 'twitter.com']));
  }
});

test('reference lookup ignores case and whitespace, while respecting the selected category', () => {
  const chosen = items.find(item => item.code === 'C001');
  assert.deepEqual(getResults(items, 'all', '  c001  ').map(item => item.code), ['C001']);
  assert.equal(getResults(items, 'music-video', 'C001').length, 0);
  assert.ok(getResults(items, 'all', chosen.source.name).some(item => item.code === chosen.code));
  assert.equal(getResults(items, 'all', 'a-nonexistent-reference-981034').length, 0);
  assert.equal(getResults(items, 'all', '').length, 550);
  const before = items.map(item => item.code);
  getResults(items, 'product-commercial', '');
  assert.deepEqual(items.map(item => item.code), before);
});

test('untrusted URLs cannot become executable or misleading external links', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://x.com/test', 'https://x.com.evil.example/', 'https://user:secret@x.com/test', 'invalid']) {
    assert.equal(publicLink(url, ['x.com']), null);
  }
  assert.equal(publicLink('https://x.com/creator/status/123', ['x.com']), 'https://x.com/creator/status/123');
});

test('all four languages cover every UI key, category and catalog title', () => {
  const keys = Object.keys(MESSAGES.zh).sort();
  assert.equal(translations.sourceCommit, catalog.sourceCommit);
  assert.deepEqual(Object.keys(translations.titles).sort(), catalog.items.map(item => item.slug).sort());
  for (const language of Object.keys(LANGUAGES)) {
    assert.deepEqual(Object.keys(MESSAGES[language]).sort(), keys);
    for (const key of keys) {
      assert.ok(MESSAGES[language][key].trim(), `${language}: ${key}`);
      const placeholders = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(placeholders(MESSAGES[language][key]), placeholders(MESSAGES.zh[key]), `${language}: ${key}`);
    }
    for (const category of catalog.categories) {
      assert.ok(CATEGORY_NAMES[category.key][language]);
      assert.notEqual(categoryName(category.key, language), category.key);
    }
    for (const item of items) {
      const title = language === 'ja' || language === 'ko' ? translations.titles[item.slug][language] : item.title[language];
      assert.ok(typeof title === 'string' && title.trim(), `${item.code}: ${language}`);
      assert.equal(itemTitle(item, language, translations.titles), title);
      assert.doesNotMatch(title, /\n\s*\d{3}[.．]/);
    }
  }
});

test('language normalization and localized search preserve original reference IDs and prompts', () => {
  assert.equal(normalizeLanguage('ja-JP'), 'ja');
  assert.equal(normalizeLanguage('KO-kr'), 'ko');
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage('zh-CN'), 'zh');
  assert.equal(normalizeLanguage('invalid'), 'zh');
  assert.equal(normalizeLanguage(null), 'zh');
  assert.equal(t('en', 'categorySummary', { letter: 'C', count: 101 }), 'Category C · 101 video references');
  assert.equal(t('ko', 'results', { count: 550 }), '레퍼런스 550개');
  const localized = prepareItems(catalog, translations.titles);
  for (const language of Object.keys(LANGUAGES)) {
    const original = items.find(item => item.code === 'C001');
    const title = itemTitle(original, language, translations.titles);
    const found = getResults(localized, 'all', title);
    assert.ok(found.some(item => item.code === 'C001'));
    assert.equal(found.find(item => item.code === 'C001').prompt, original.prompt);
    assert.equal(getResults(localized, 'music-video', title).some(item => item.code === 'C001'), false);
  }
  assert.equal(getResults(localized, 'music-video', categoryName('music-video', 'ja')).length, 115);
  assert.deepEqual(localized.map(item => item.code), items.map(item => item.code));
});
