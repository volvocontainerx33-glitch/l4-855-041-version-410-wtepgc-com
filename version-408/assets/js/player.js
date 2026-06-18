(function () {
    function startVideo(box) {
        var video = box.querySelector('video');
        var overlay = box.querySelector('.player-overlay');
        if (!video) {
            return;
        }

        var src = video.getAttribute('data-hls');
        if (!src) {
            return;
        }

        if (!video.dataset.ready) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                video._hls = hls;
            } else {
                video.src = src;
            }
            video.dataset.ready = '1';
        }

        if (overlay) {
            overlay.style.display = 'none';
        }

        video.setAttribute('controls', 'controls');
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(function () {});
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (box) {
            var overlay = box.querySelector('.player-overlay');
            var video = box.querySelector('video');

            if (overlay) {
                overlay.addEventListener('click', function () {
                    startVideo(box);
                });
            }

            if (video) {
                video.addEventListener('click', function () {
                    if (!video.dataset.ready) {
                        startVideo(box);
                    }
                });
            }
        });
    });
})();
