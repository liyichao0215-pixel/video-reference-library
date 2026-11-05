import { getResults, prepareItems, publicLink } from './catalog.js';
import { normalizeLanguage, t, categoryName, itemTitle } from './i18n.js';

const $ = selector => document.querySelector(selector);
const socialHosts = ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'];
const mediaHosts = ['media.beatapi.io'];
let savedLanguage;
try { savedLanguage = localStorage.getItem('video-reference-language'); } catch { /* Storage can be disabled. */ }
const state = { catalog: null, items: [], titles: {}, category: 'all', query: '', limit: 24, selected: null,
  language: normalizeLanguage(new URL(location.href).searchParams.get('lang') || savedLanguage), failed: false };
const text = (key, values) => t(state.language, key, values);
const dialog = $('#detail');
const player = $('#player');
let toastTimer;

function toast(message) {
  clearTimeout(toastTimer);
  (dialog.open ? dialog : document.body).append($('#toast'));
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2600);
}

async function copy(prompt) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(prompt);
    } else {
      const area = document.createElement('textarea');
      area.value = prompt;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      (dialog.open ? dialog : document.body).append(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      if (!copied) throw new Error('Clipboard unavailable');
    }
    toast(text('copied'));
  } catch {
    toast(text('copyError'));
  }
}

function stopPlayer() {
  player.pause();
  player.removeAttribute('src');
  player.removeAttribute('poster');
  player.load();
}

function renderDetailText(item) {
  $('#detail-code').textContent = item.code;
  $('#detail-category').textContent = categoryName(item.category, state.language);
  $('#detail-title').textContent = itemTitle(item, state.language, state.titles);
  $('#detail-meta').textContent = `${item.duration} · ${item.aspectRatio} · ${item.source.name}`;
  $('#prompt-body').textContent = item.prompt;
  $('#detail-source').textContent = text('source', { author: item.source.name });
  const sourceUrl = publicLink(item.source.url, socialHosts);
  $('#detail-source').hidden = !sourceUrl;
  if (sourceUrl) $('#detail-source').href = sourceUrl;
  $('#prompt-sources').replaceChildren();
  const label = document.createElement('span');
  label.textContent = text(item.promptVisibility === 'same-author-thread' ? 'thread' : 'originalPost');
  $('#prompt-sources').append(label);
  const sources = item.promptSourceUrls?.length ? item.promptSourceUrls : [item.source.url];
  sources.forEach((url, index) => {
    const safe = publicLink(url, socialHosts);
    if (!safe) return;
    const link = document.createElement('a');
    link.href = safe;
    link.textContent = sources.length > 1 ? text('sourceNumber', { number: index + 1 }) : text('promptSource');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    $('#prompt-sources').append(link);
  });
}

function openDetail(item, updateHash = true) {
  state.selected = item;
  renderDetailText(item);
  $('#video-error').hidden = true;
  stopPlayer();
  const video = publicLink(item.video, mediaHosts);
  const poster = publicLink(item.thumbnail, mediaHosts);
  if (video) player.src = video;
  else $('#video-error').hidden = false;
  if (poster) player.poster = poster;
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  if (updateHash) history.replaceState(null, '', `#${item.code}`);
}

function renderCategories() {
  const choices = [{ key: 'all', letter: 'ALL', count: state.items.length }, ...state.catalog.categories];
  $('#categories').replaceChildren(...choices.map(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `category-button${state.category === category.key ? ' active' : ''}`;
    button.setAttribute('aria-pressed', String(state.category === category.key));
    const letter = document.createElement('span');
    letter.className = 'category-letter';
    letter.textContent = category.letter;
    const name = document.createElement('span');
    name.className = 'category-label';
    name.textContent = categoryName(category.key, state.language);
    const count = document.createElement('span');
    count.className = 'category-count';
    count.textContent = category.count;
    button.append(letter, name, count);
    button.addEventListener('click', () => {
      state.category = category.key;
      state.limit = 24;
      renderCategories();
      renderCards();
    });
    return button;
  }));
}

function card(item) {
  const fragment = $('#card-template').content.cloneNode(true);
  const root = fragment.querySelector('article');
  root.dataset.code = item.code;
  const query = selector => root.querySelector(selector);
  const title = itemTitle(item, state.language, state.titles);
  query('.image-fallback').textContent = text('noPreview');
  query('.view-prompt').textContent = text('viewPrompt');
  query('.copy-card').textContent = text('copy');
  const image = query('img');
  const imageUrl = publicLink(item.thumbnail, mediaHosts);
  if (imageUrl) image.src = imageUrl;
  else query('.image-fallback').hidden = false;
  image.addEventListener('error', () => {
    image.hidden = true;
    query('.image-fallback').hidden = false;
  });
  query('.preview').setAttribute('aria-label', text('preview', { code: item.code, title }));
  query('.code-badge').textContent = item.code;
  query('.duration').textContent = item.duration;
  query('.category-name').textContent = categoryName(item.category, state.language);
  query('.ratio').textContent = item.aspectRatio;
  query('.title-button').textContent = title;
  query('.author').textContent = `${item.source.name} ↗`;
  const source = publicLink(item.source.url, socialHosts);
  if (source) query('.author').href = source;
  else query('.author').hidden = true;
  for (const target of ['.preview', '.title-button', '.view-prompt']) query(target).addEventListener('click', () => openDetail(item));
  query('.copy-card').setAttribute('aria-label', text('copyLabel', { code: item.code }));
  query('.copy-card').addEventListener('click', () => copy(item.prompt));
  return fragment;
}

function renderCards() {
  const results = getResults(state.items, state.category, state.query);
  const category = state.catalog.categories.find(entry => entry.key === state.category);
  $('#heading').replaceChildren(document.createTextNode(categoryName(state.category, state.language)));
  const dot = document.createElement('span');
  dot.className = 'heading-dot';
  dot.textContent = '.';
  $('#heading').append(dot);
  $('#summary').textContent = category ? text('categorySummary', { letter: category.letter, count: category.count }) : text('overview', { count: state.items.length, categories: state.catalog.categories.length });
  $('#result-count').textContent = text('results', { count: results.length });
  $('#grid').replaceChildren(...results.slice(0, state.limit).map(card));
  $('#message').hidden = results.length > 0;
  $('#message').textContent = text('empty');
  $('#more').hidden = results.length <= state.limit;
  $('#more').textContent = text('more', { shown: Math.min(state.limit, results.length), total: results.length });
}

function applyLanguage() {
  document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : state.language;
  document.title = text('siteName');
  $('meta[name="description"]').content = text('description');
  $('#language').value = state.language;
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text(element.dataset.i18n); });
  for (const attribute of ['aria-label', 'placeholder']) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      element.setAttribute(attribute, text(element.getAttribute(`data-i18n-${attribute}`)));
    });
  }
  if (state.catalog) {
    renderCategories();
    renderCards();
    if (state.selected) renderDetailText(state.selected);
  } else {
    $('#heading').textContent = text('all');
    $('#summary').textContent = text(state.failed ? 'unavailable' : 'loading');
    $('#message').textContent = text(state.failed ? 'loadError' : 'loadingVideos');
  }
}

$('#language').addEventListener('change', event => {
  state.language = normalizeLanguage(event.target.value);
  try { localStorage.setItem('video-reference-language', state.language); } catch { /* Keep the current selection without persistence. */ }
  const url = new URL(location.href);
  url.searchParams.set('lang', state.language);
  history.replaceState(null, '', url);
  $('#toast').hidden = true;
  applyLanguage();
});

$('#search').addEventListener('input', event => {
  state.query = event.target.value;
  state.limit = 24;
  renderCards();
});
$('#more').addEventListener('click', () => {
  const previous = state.limit;
  state.limit += 24;
  renderCards();
  $('#grid').children[previous]?.querySelector('button')?.focus({ preventScroll: true });
});
$('#copy-prompt').addEventListener('click', () => { if (state.selected) copy(state.selected.prompt); });
$('#close-detail').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  stopPlayer();
  state.selected = null;
  document.body.classList.remove('dialog-open');
  history.replaceState(null, '', location.pathname + location.search);
});
player.addEventListener('error', () => { if (player.getAttribute('src')) $('#video-error').hidden = false; });

async function load() {
  $('#search').disabled = true;
  try {
    const responses = await Promise.all([fetch('./data/catalog.json'), fetch('./data/titles.json')]);
    if (responses.some(response => !response.ok)) throw new Error('Catalog unavailable');
    const [catalog, translations] = await Promise.all(responses.map(response => response.json()));
    state.titles = translations.titles;
    state.items = prepareItems(catalog, state.titles);
    state.catalog = catalog;
    $('#category-total').textContent = state.catalog.categories.length;
    $('#snapshot-date').textContent = state.catalog.capturedOn.replaceAll('-', '.');
    $('#snapshot-date').dateTime = state.catalog.capturedOn;
    renderCategories();
    renderCards();
    $('#search').disabled = false;
    const selected = state.items.find(item => `#${item.code}` === location.hash);
    if (selected) openDetail(selected, false);
  } catch {
    state.failed = true;
    $('#message').hidden = false;
    $('#message').textContent = text('loadError');
    $('#summary').textContent = text('unavailable');
  }
}

applyLanguage();
load();
