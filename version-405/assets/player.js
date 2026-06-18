(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll(".player-stage")).forEach(function (stage) {
      var video = stage.querySelector("video");
      var button = stage.querySelector(".play-overlay");
      if (!video || !button) {
        return;
      }
      var attached = false;
      var bind = function () {
        if (attached) {
          return;
        }
        attached = true;
        var source = video.getAttribute("data-video") || "";
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else {
          video.src = source;
        }
      };
      var play = function () {
        bind();
        stage.classList.add("is-playing");
        var action = video.play();
        if (action && action.catch) {
          action.catch(function () {});
        }
      };
      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
          stage.classList.remove("is-playing");
        }
      });
      video.addEventListener("play", function () {
        stage.classList.add("is-playing");
      });
      video.addEventListener("pause", function () {
        if (!video.ended) {
          stage.classList.remove("is-playing");
        }
      });
    });
  });
})();
