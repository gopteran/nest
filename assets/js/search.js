/**
 * @file
 * A JavaScript file for flexsearch.
 */

import FlexSearch from 'flexsearch';

(function () {
  const index = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['title', 'tags', 'content', 'date'],
      store: ['title', 'summary', 'date', 'permalink'],
    },
    tokenize: 'forward',
  });

  // Get params from Hugo
  const searchLimit = window.hugoSearchLimit || 10;
  const basePath = window.hugoBasePath || '/';

  function showResults(items) {
    const template = document.querySelector('template');
    if (!template) {
      console.error('Search template not found');
      return;
    }

    const fragment = document.createDocumentFragment();
    const results = document.querySelector('[data-search-results]');

    if (!results) {
      console.error('Search results container not found');
      return;
    }

    results.textContent = '';

    if (Object.keys(items).length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'text-center py-12 text-[var(--color-fg)]/60 col-span-full';
      noResults.innerHTML = '<p class="text-lg">No results found. Try different keywords.</p>';
      results.appendChild(noResults);
      return;
    }

    for (const id in items) {
      const item = items[id];
      const result = template.content.cloneNode(true);
      const a = result.querySelector('a');
      const time = result.querySelector('time');
      const content = result.querySelector('.content');

      if (a) {
        a.innerHTML = item.title;
        a.href = item.permalink;
      }
      if (time) {
        time.innerText = item.date;
        time.dateTime = item.date;
      }
      if (content) {
        content.innerHTML = item.summary;
      }
      fragment.appendChild(result);
    }
    results.appendChild(fragment);
  }

  function doSearch() {
    const searchInput = document.querySelector('[data-search-text]');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) {
      const results = document.querySelector('[data-search-results]');
      if (results) results.textContent = '';
      return;
    }

    const results = index.search({
      query: query,
      enrich: true,
      limit: searchLimit,
    });

    const items = {};
    if (Array.isArray(results)) {
      results.forEach(function (result) {
        if (result.result && Array.isArray(result.result)) {
          result.result.forEach(function (r) {
            items[r.id] = r.doc;
          });
        }
      });
    }
    showResults(items);
  }

  function enableUI() {
    const searchform = document.querySelector('[data-search-form]');
    if (!searchform) {
      console.error('Search form not found');
      return;
    }

    searchform.addEventListener('submit', function (e) {
      e.preventDefault();
      doSearch();
    });

    searchform.addEventListener('input', function () {
      doSearch();
    });

    const loading = document.querySelector('[data-search-loading]');
    const input = document.querySelector('[data-search-input]');

    if (loading && input) {
      loading.classList.add('hidden');
      input.classList.remove('hidden');
    }
  }

  function buildIndex() {
    const searchindex = basePath === '/' ? '/searchindex.json' : basePath + 'searchindex.json';
    const loading = document.querySelector('[data-search-loading]');

    if (loading) {
      loading.classList.remove('hidden');
    }

    fetch(searchindex)
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`Search index not found: ${response.statusText}`);
        }
        return response.json();
      })
      .then(function (data) {
        if (Array.isArray(data)) {
          data.forEach(function (item) {
            index.add(item);
          });
        }
        enableUI();
      })
      .catch(function (error) {
        console.error('Failed to load search index:', error);
        const loading = document.querySelector('[data-search-loading]');
        if (loading) {
          loading.innerHTML =
            '<p class="text-center text-red-500">Failed to load search functionality</p>';
        }
      });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildIndex);
  } else {
    buildIndex();
  }
})();
