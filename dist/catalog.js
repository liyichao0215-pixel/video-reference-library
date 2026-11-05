import { CATEGORY_NAMES } from './i18n.js';

export function getResults(items, category, query) {
  const needle = query.trim().toLocaleLowerCase();
  return items.filter(item => (category === 'all' || item.category === category) && (!needle || item.searchText.includes(needle)));
}

export function prepareItems(catalog, titles = {}) {
  const categories = new Map(catalog.categories.map(category => [category.key, category]));
  return catalog.items.map(item => ({
    ...item,
    categoryInfo: categories.get(item.category),
    searchText: [item.code, ...Object.values(item.title), ...Object.values(titles[item.slug] || {}), item.source.name, item.prompt, ...Object.values(CATEGORY_NAMES[item.category] || {})].join(' ').toLocaleLowerCase(),
  }));
}

export function publicLink(value, hosts) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hosts.includes(url.hostname) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

