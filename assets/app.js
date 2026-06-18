(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero-carousel]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
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
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var inputs = Array.prototype.slice.call(scope.querySelectorAll("[data-search-input]"));
            var yearButtons = Array.prototype.slice.call(scope.querySelectorAll("[data-year-filter]"));
            var currentYear = "all";

            function normalize(value) {
                return (value || "").toString().trim().toLowerCase();
            }

            function filter() {
                var query = normalize(inputs.map(function (input) {
                    return input.value;
                }).join(" "));
                var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-row"));
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search"));
                    var year = card.getAttribute("data-year") || "";
                    var textMatched = !query || haystack.indexOf(query) !== -1;
                    var yearMatched = currentYear === "all" || year === currentYear;
                    card.classList.toggle("is-hidden", !(textMatched && yearMatched));
                });
            }

            inputs.forEach(function (input) {
                input.addEventListener("input", filter);
            });

            yearButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    currentYear = button.getAttribute("data-year-filter") || "all";
                    yearButtons.forEach(function (item) {
                        item.classList.toggle("active", item === button);
                    });
                    filter();
                });
            });
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (root) {
            var video = root.querySelector("video");
            var button = root.querySelector("[data-play-button]");
            var url = root.getAttribute("data-hls");
            var hls = null;
            var prepared = false;

            if (!video || !button || !url) {
                return;
            }

            function prepare() {
                if (prepared) {
                    return;
                }
                prepared = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        maxBufferLength: 30,
                        lowLatencyMode: false
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            function play() {
                prepare();
                button.classList.add("is-hidden");
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {
                        button.classList.remove("is-hidden");
                    });
                }
            }

            button.addEventListener("click", play);
            video.addEventListener("play", function () {
                button.classList.add("is-hidden");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    button.classList.remove("is-hidden");
                }
            });
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    }
}());
