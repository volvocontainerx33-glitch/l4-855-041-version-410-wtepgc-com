(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var isOpen = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    document.querySelectorAll(".site-search").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        if (!value) {
          event.preventDefault();
          window.location.href = "search.html";
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var heroIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === heroIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === heroIndex);
      });
    }

    if (slides.length > 1) {
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          showSlide(i);
        });
      });
      window.setInterval(function () {
        showSlide(heroIndex + 1);
      }, 5200);
    }

    var filter = document.querySelector(".page-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var noResults = document.querySelector(".no-results");

    function applyFilter() {
      if (!filter || !cards.length) {
        return;
      }
      var value = normalize(filter.value);
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.textContent
        ].join(" "));
        var matched = !value || haystack.indexOf(value) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          shown += 1;
        }
      });
      if (noResults) {
        noResults.style.display = shown ? "none" : "block";
      }
    }

    if (filter) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query) {
        filter.value = query;
      }
      filter.addEventListener("input", applyFilter);
      applyFilter();
    }
  });
})();
