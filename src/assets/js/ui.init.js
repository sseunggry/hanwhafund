if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
      throw new Error(
        "Sorry the polyfill Object.create only accepts the first parameter.",
      );
    }
    function F() {}
    F.prototype = o;
    return new F();
  };
}
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    var T, k;
    if (this === null) {
      throw new TypeError("error");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError("error");
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
if (!Object.keys) {
  Object.keys = (function () {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toDtring: null }.propertyIsEnumerable("toString"),
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (
        typeof obj !== "object" &&
        (typeof obj !== "function" || obj === null)
      ) {
        throw new TypeError("Object.keys called on non=object");
      }
      var result = [],
        prop,
        i;
      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }
      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  })();
}

(function ($, win, doc, undefined) {
  $("head")
    .append(
      '<script src="/v2/resources/js/ui.global.js?_ver=' +
        Date.now() +
        '"></script>',
    )
    .append(
      '<link rel="shortcut icon" type="image/x-icon" href="/resources/images/common/favicon.ico">',
    );
  if (MOui.util.deviceCode() === "MA") {
    $("head").append(
      '<script src="/v2/resources/js/native.js?_ver=' +
        Date.now() +
        '"></script>',
    );
  }

  // Monimo  Nethru Tag Manager(Log Collector)
  var ua = window.navigator.userAgent;
  if (/mblSappKndDvC=IFP/.test(ua)) {
    $("head").append(
      '<script src="/sfmi/v2/ui/common/ih.nethru.log.js?_ver=' +
        Date.now() +
        '"></script>',
    );
  }

  $.getScriptCached = function (url, callback) {
    return $.ajax({
      url: url,
      dataType: "script",
      cache: true,
    })
      .done(callback)
      .fail(callback);
  };
})(jQuery, window, document);
