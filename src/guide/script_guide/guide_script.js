const hlsPrev = document.querySelectorAll(".hls_preview"),
  hlsShow = document.querySelectorAll(".hls");
hlsPrev.forEach((e, t) => {
  let s = e.outerHTML.split("\n"),
    o = [];
  (s.forEach((e, t) => {
    let r;
    0 !== t &&
      t !== s.length - 1 &&
      ((r = -1 !== e.indexOf('=""') ? e.replace('=""', "") : e),
      o.push(r.substr(14)));
  }),
    (hlsShow[t].innerHTML = o.join("\n")));
});
var setScript = () => {
  return new Promise((r) => {
    setTimeout(() => {
      const e = document.querySelector("head"),
        t = document.createElement("script");
      (t.setAttribute("src", "/v2/resources/js/ui.front.js"),
        e.parentNode.insertBefore(t, e),
        r());
    }, 10);
  });
};
setScript();
