(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 1) {
      var current = 0;
      var show = function (index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    Array.prototype.slice.call(document.querySelectorAll(".hero-search")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var target = form.getAttribute("data-target") || "search.html";
        var q = input ? input.value.trim() : "";
        window.location.href = target + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    });

    var filterInput = document.querySelector(".js-card-filter");
    var typeSelect = document.querySelector(".js-type-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-movie-card"));
    var applyFilter = function () {
      var q = filterInput ? filterInput.value.trim().toLowerCase() : "";
      var type = typeSelect ? typeSelect.value : "";
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-year")).toLowerCase();
        var okText = !q || text.indexOf(q) >= 0;
        var okType = !type || card.getAttribute("data-type") === type;
        card.classList.toggle("hidden-card", !(okText && okType));
      });
    };
    if (filterInput) {
      filterInput.addEventListener("input", applyFilter);
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query) {
        filterInput.value = query;
        applyFilter();
      }
    }
    if (typeSelect) {
      typeSelect.addEventListener("change", applyFilter);
    }
  });
})();
