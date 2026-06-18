(function () {
    function setupMoviePlayer(id, source) {
        var shell = document.getElementById(id);
        if (!shell) {
            return;
        }
        var video = shell.querySelector("video");
        var button = shell.querySelector(".player-start");
        var hlsInstance = null;
        var ready = false;

        function prepare() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            prepare();
            if (button) {
                button.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }

        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (!video.currentTime || video.ended) {
                if (button) {
                    button.classList.remove("is-hidden");
                }
            }
        });

        shell.addEventListener("click", function (event) {
            if (event.target === video && !ready) {
                start();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
