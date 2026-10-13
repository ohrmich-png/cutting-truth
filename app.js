// Cutting Truth — hero reel player.
// Auto-plays the 16 text cards of "The jersey nobody's showing you",
// fading every 2.5s, looping forever. No filming, no voiceover needed.

(function () {
  var CARDS = [
    "Everyone's arguing about the shirt.",
    "They're missing the real story.",
    "Look at the drummer.",
    "HIND RAJAB — age 5",
    "The media showed you the shirt.",
    "Not the jersey.",
    "Gillette Stadium. Owned by Robert Kraft.",
    "He got Macklemore BANNED for saying \u2018Free Palestine.\u2019",
    "Bryan said it on Kraft's own stage.",
    "Record crowd.",
    "A shirt gets you banned.",
    "A dead child's name gets you cheered.",
    "She died in a war Hamas started.",
    "Hiding behind children like her.",
    "A concert shirt got more coverage than a concert massacre.",
    "Why?"
  ];

  var DURATION = 2500; // ms per card
  var card = document.getElementById("reelCard");
  var bar = document.getElementById("reelBar");
  if (!card || !bar) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var i = 0;

  function restartBar() {
    bar.classList.remove("run");
    void bar.offsetWidth; // reflow: restart the CSS animation
    bar.classList.add("run");
  }

  function show(n) {
    card.classList.remove("show", "final");
    setTimeout(function () {
      card.textContent = CARDS[n];
      if (n === CARDS.length - 1) card.classList.add("final");
      card.classList.add("show");
      restartBar();
    }, 300);
  }

  if (reduceMotion) {
    // Static: show the closing card only.
    card.textContent = CARDS[CARDS.length - 1];
    card.classList.add("show", "final");
    return;
  }

  restartBar();
  setInterval(function () {
    i = (i + 1) % CARDS.length;
    show(i);
  }, DURATION);
})();

// Live world-headlines ticker — fed by headlines.json (GDELT, refreshed every 15 min).
(function () {
  var track = document.querySelector(".ticker-track");
  if (!track) return;
  var st = document.createElement("style");
  st.textContent = ".ticker-track span a{color:inherit;text-decoration:none}.ticker-track span a:hover{text-decoration:underline}";
  document.head.appendChild(st);
  fetch("headlines.json", { cache: "no-store" }).then(function (r) {
    if (!r.ok) throw new Error("no data");
    return r.json();
  }).then(function (d) {
    var items = (d.headlines || []).slice(0, 30);
    if (!items.length) throw new Error("empty");
    var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
    var html = items.map(function (h) {
      return '<span><a href="' + esc(h.u) + '" target="_blank" rel="noopener">' + esc(h.t) + "</a></span><i></i>";
    }).join("");
    track.innerHTML = html + html; // duplicated for the seamless -50% loop
    track.style.animationDuration = Math.max(30, items.length * 4) + "s";
    var ticker = track.closest(".ticker");
    if (ticker) ticker.removeAttribute("aria-hidden");
  }).catch(function () { /* keep the static brand ticker as fallback */ });
})();
