(function(win) {
  "use strict";

  var App = {
    init: function() {
      this.adapt(750, 100);
      this.fastClick();
    },
    fastClick: function() {
      if ("addEventListener" in document) {
        document.addEventListener(
          "DOMContentLoaded",
          function() {
            FastClick.attach(document.body);
          },
          false
        );
      }
    },
    adapt: function(designWidth, rem2px) {
      var d = win.document.createElement("div");
      d.style.width = "1rem";
      d.style.display = "none";
      var head = win.document.getElementsByTagName("head")[0];
      head.appendChild(d);
      var defaultFontSize = parseFloat(
        win.getComputedStyle(d, null).getPropertyValue("width")
      );
      d.remove();
      document.documentElement.style.fontSize =
        win.innerWidth / designWidth * rem2px / defaultFontSize * 100 + "%";
      var st = document.createElement("style");
      var portrait =
        "@media screen and (min-width: " +
        win.innerWidth +
        "px) {html{font-size:" +
        win.innerWidth / (designWidth / rem2px) / defaultFontSize * 100 +
        "%;}}";
      var landscape =
        "@media screen and (min-width: " +
        win.innerHeight +
        "px) {html{font-size:" +
        win.innerHeight / (designWidth / rem2px) / defaultFontSize * 100 +
        "%;}}";
      st.innerHTML = portrait + landscape;
      head.appendChild(st);
      return defaultFontSize;
    }
  };
  App.init();
})(window);