(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initMenu() {
    var button = $('[data-menu-toggle]');
    var panel = $('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  }

  function initHero() {
    var carousel = $('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = $all('[data-hero-slide]', carousel);
    var dots = $all('[data-hero-dot]', carousel);
    var prev = $('[data-hero-prev]', carousel);
    var next = $('[data-hero-next]', carousel);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initImageFallbacks() {
    $all('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing-image');
      }, { once: true });
    });
  }

  function initGridFilter() {
    var grid = $('[data-filter-grid]');
    if (!grid) {
      return;
    }
    var searchInput = $('[data-grid-search]');
    var yearSelect = $('[data-grid-year]');
    var sortSelect = $('[data-grid-sort]');
    var count = $('[data-grid-count]');
    var cards = $all('[data-title]', grid);

    function getText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.category,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.year
      ].join(' '));
    }

    function apply() {
      var query = normalize(searchInput && searchInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var visible = 0;

      cards.forEach(function (card) {
        var matchesQuery = !query || getText(card).indexOf(query) !== -1;
        var matchesYear = !year || normalize(card.dataset.year) === year;
        var show = matchesQuery && matchesYear;
        card.classList.toggle('is-hidden-by-filter', !show);
        if (show) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '共 ' + visible + ' 部内容';
      }
    }

    function sortCards() {
      if (!sortSelect) {
        return;
      }
      var value = sortSelect.value;
      var sorted = cards.slice();
      if (value === 'year-desc') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        });
      } else if (value === 'year-asc') {
        sorted.sort(function (a, b) {
          return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
        });
      } else if (value === 'title') {
        sorted.sort(function (a, b) {
          return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-CN');
        });
      } else {
        sorted.sort(function (a, b) {
          return cards.indexOf(a) - cards.indexOf(b);
        });
      }
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      apply();
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', apply);
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', sortCards);
    }
    apply();
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 2).map(function (tag) {
      return '<em>' + escapeHtml(tag) + '</em>';
    }).join('');
    return [
      '<a class="movie-card" href="' + escapeAttr(movie.url) + '">',
      '  <span class="poster-shell">',
      '    <img src="' + escapeAttr(movie.cover) + '" alt="' + escapeAttr(movie.title) + '" loading="lazy">',
      '    <span class="poster-gradient"></span>',
      '    <span class="play-badge">▶</span>',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '  </span>',
      '  <span class="movie-card-body">',
      '    <strong>' + escapeHtml(movie.title) + '</strong>',
      '    <span class="line-clamp-2">' + escapeHtml(movie.oneLine) + '</span>',
      '    <span class="card-meta"><em>' + escapeHtml(movie.category) + '</em>' + tags + '</span>',
      '  </span>',
      '</a>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function initSearchPage() {
    var page = $('[data-search-page]');
    if (!page || !window.MOVIES) {
      return;
    }
    var input = $('[data-search-input]', page);
    var category = $('[data-search-category]', page);
    var type = $('[data-search-type]', page);
    var genre = $('[data-search-genre]', page);
    var result = $('[data-search-results]', page);
    var count = $('[data-search-count]', page);

    function matches(movie) {
      var query = normalize(input && input.value);
      var categoryValue = category && category.value;
      var typeValue = type && type.value;
      var genreValue = genre && genre.value;
      var haystack = normalize([
        movie.title,
        movie.year,
        movie.category,
        movie.type,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' '));
      if (query && haystack.indexOf(query) === -1) {
        return false;
      }
      if (categoryValue && movie.category !== categoryValue) {
        return false;
      }
      if (typeValue && movie.type !== typeValue) {
        return false;
      }
      if (genreValue && String(movie.genre || '').indexOf(genreValue) === -1) {
        return false;
      }
      return true;
    }

    function render() {
      var filtered = window.MOVIES.filter(matches).slice(0, 160);
      result.innerHTML = filtered.map(movieCard).join('');
      initImageFallbacks();
      if (count) {
        var suffix = filtered.length >= 160 ? '，当前显示前 160 部' : '';
        count.textContent = '找到 ' + window.MOVIES.filter(matches).length + ' 部内容' + suffix;
      }
    }

    [input, category, type, genre].forEach(function (control) {
      if (control) {
        control.addEventListener('input', render);
        control.addEventListener('change', render);
      }
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get('q') && input) {
      input.value = params.get('q');
    }
    render();
  }

  function initVideoPlayers() {
    $all('video[data-src]').forEach(function (video) {
      var source = video.getAttribute('data-src');
      var wrap = video.closest('.video-wrap');
      var overlay = wrap ? $('[data-video-play]', wrap) : null;

      function hideOverlay() {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      }

      function attachSource() {
        if (!source) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
      }

      attachSource();

      if (overlay) {
        overlay.addEventListener('click', function () {
          hideOverlay();
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
              video.controls = true;
            });
          }
        });
      }

      video.addEventListener('play', hideOverlay);
      video.addEventListener('pause', function () {
        if (overlay && video.currentTime === 0) {
          overlay.classList.remove('is-hidden');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initImageFallbacks();
    initGridFilter();
    initSearchPage();
    initVideoPlayers();
  });
})();
