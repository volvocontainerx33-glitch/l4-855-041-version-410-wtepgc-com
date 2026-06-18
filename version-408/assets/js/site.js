(function () {
    function $(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function $all(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilters(scope) {
        var input = $('[data-filter-input]', scope);
        var category = $('[data-category-filter]', scope);
        var year = $('[data-year-filter]', scope);
        var region = $('[data-region-filter]', scope);
        var cards = $all('[data-movie-card]');
        var query = normalize(input && input.value);
        var cat = normalize(category && category.value);
        var y = normalize(year && year.value);
        var r = normalize(region && region.value);
        var visible = 0;

        cards.forEach(function (card) {
            var search = normalize(card.getAttribute('data-search'));
            var cardCat = normalize(card.getAttribute('data-category'));
            var cardYear = normalize(card.getAttribute('data-year'));
            var cardRegion = normalize(card.getAttribute('data-region'));
            var ok = true;

            if (query && search.indexOf(query) === -1) {
                ok = false;
            }

            if (cat && cardCat !== cat) {
                ok = false;
            }

            if (y && cardYear !== y) {
                ok = false;
            }

            if (r && cardRegion !== r) {
                ok = false;
            }

            card.classList.toggle('is-hidden', !ok);
            if (ok) {
                visible += 1;
            }
        });

        var empty = $('[data-empty]');
        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    function setupFilters() {
        var scope = $('[data-filter-scope]');
        if (!scope) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        var input = $('[data-filter-input]', scope);
        if (query && input) {
            input.value = query;
        }

        ['input', 'change'].forEach(function (eventName) {
            scope.addEventListener(eventName, function (event) {
                if (event.target.matches('input, select')) {
                    applyFilters(scope);
                }
            });
        });

        applyFilters(scope);
    }

    function setupMobileNav() {
        var toggle = $('.menu-toggle');
        var nav = $('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function setupHeroSearch() {
        var form = $('[data-search-form]');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './movies.html';
            }
        });
    }

    function setupRail() {
        var rail = $('[data-rail]');
        var prev = $('[data-rail-prev]');
        var next = $('[data-rail-next]');
        if (!rail || !prev || !next) {
            return;
        }

        function move(direction) {
            var amount = Math.max(260, Math.floor(rail.clientWidth * 0.82));
            rail.scrollBy({ left: direction * amount, behavior: 'smooth' });
        }

        prev.addEventListener('click', function () {
            move(-1);
        });

        next.addEventListener('click', function () {
            move(1);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupHeroSearch();
        setupFilters();
        setupRail();
    });
})();
