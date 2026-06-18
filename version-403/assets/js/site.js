(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (menuButton && navLinks) {
      menuButton.addEventListener("click", function () {
        navLinks.classList.toggle("open");
      });
    }

    document.querySelectorAll("img.cover-image").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("cover-missing");
      });
    });

    mountHero();
    mountSearch();
    mountPlayers();
  });

  function mountHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length === 0) {
      return;
    }

    var current = 0;

    function showSlide(nextIndex) {
      current = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, index) {
        slide.classList.toggle("active", index === current);
      });

      dots.forEach(function (dot, index) {
        dot.classList.toggle("active", index === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    showSlide(0);

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function mountSearch() {
    var input = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    var status = document.querySelector("[data-search-status]");
    var empty = document.querySelector("[data-empty-search]");

    if (!input || cards.length === 0) {
      return;
    }

    function applySearch() {
      var keyword = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var content = (card.getAttribute("data-search-text") || "").toLowerCase();
        var matched = keyword === "" || content.indexOf(keyword) !== -1;
        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = keyword === "" ? "浏览全部影片" : "显示匹配影片";
      }

      if (empty) {
        empty.style.display = visible === 0 ? "block" : "none";
      }
    }

    input.addEventListener("input", applySearch);
    applySearch();
  }

  function mountPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var playLayer = player.querySelector("[data-play-layer]");

      if (!video) {
        return;
      }

      var source = video.getAttribute("data-src");

      if (source) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else {
          video.src = source;
        }
      }

      function playVideo() {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.then === "function") {
          playPromise.then(function () {
            player.classList.add("playing");
          }).catch(function () {
            player.classList.remove("playing");
          });
        } else {
          player.classList.add("playing");
        }
      }

      function toggleVideo() {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
          player.classList.remove("playing");
        }
      }

      if (playLayer) {
        playLayer.addEventListener("click", playVideo);
      }

      video.addEventListener("click", toggleVideo);
      video.addEventListener("play", function () {
        player.classList.add("playing");
      });
      video.addEventListener("pause", function () {
        player.classList.remove("playing");
      });
      video.addEventListener("ended", function () {
        player.classList.remove("playing");
      });
    });
  }
})();
