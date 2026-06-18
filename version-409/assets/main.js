(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-site-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = selectAll('[data-hero-slide]');
    var dots = selectAll('[data-hero-dot]');
    if (slides.length === 0) {
      return;
    }
    var active = 0;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    show(0);
    window.setInterval(function () {
      show(active + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFiltering() {
    var input = document.querySelector('[data-search-input]');
    var chips = selectAll('[data-filter-chip]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = selectAll('[data-movie-card]');
    var empty = document.querySelector('[data-empty-state]');
    if (cards.length === 0) {
      return;
    }
    var activeCategory = 'all';

    function update() {
      var keyword = normalize(input ? input.value : '');
      var activeType = normalize(typeSelect ? typeSelect.value : 'all');
      var activeYear = normalize(yearSelect ? yearSelect.value : 'all');
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' '));
        var category = normalize(card.getAttribute('data-category'));
        var type = normalize(card.getAttribute('data-type'));
        var year = normalize(card.getAttribute('data-year'));
        var matched = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (activeCategory !== 'all' && category !== activeCategory) {
          matched = false;
        }
        if (activeType !== 'all' && type !== activeType) {
          matched = false;
        }
        if (activeYear !== 'all' && year !== activeYear) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', update);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', update);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', update);
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = normalize(chip.getAttribute('data-filter-chip')) || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        update();
      });
    });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFiltering();
  });
})();
