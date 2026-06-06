/* ============================================================
   THE CHURCH OF KASANE TETO — site behaviors
   Moderate chaos: prophecy generator, soul counter, loyalty meter.
   No frameworks. No dependencies. No escape.
   ============================================================ */

(function () {
  "use strict";

  /* ---- mark the current nav link as active ---- */
  function highlightNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".cult-nav a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target && target.split("/").pop() === here) a.classList.add("active");
    });
  }

  /* ---- the souls offered counter (persists across pages) ---- */
  var SOUL_KEY = "teto_souls_offered";
  function getSouls() { return parseInt(localStorage.getItem(SOUL_KEY) || "31337", 10); }
  function setSouls(n) { localStorage.setItem(SOUL_KEY, String(n)); }

  function renderSouls() {
    var el = document.getElementById("soul-counter");
    if (el) el.textContent = getSouls().toLocaleString();
  }

  function offerSoul() {
    setSouls(getSouls() + 1);
    renderSouls();
    bumpLoyalty(3);
    floatHeart();
  }

  /* hearts that bloom where you click the offering button */
  function floatHeart() {
    var h = document.createElement("div");
    h.textContent = "♥";
    h.style.cssText =
      "position:fixed;left:" + (Math.random() * 90 + 5) + "%;bottom:10%;" +
      "font-size:" + (1.5 + Math.random() * 2) + "rem;color:#d6007f;" +
      "pointer-events:none;z-index:999;transition:all 1.6s ease-out;opacity:1;";
    document.body.appendChild(h);
    requestAnimationFrame(function () {
      h.style.transform = "translateY(-60vh) rotate(" + (Math.random() * 60 - 30) + "deg)";
      h.style.opacity = "0";
    });
    setTimeout(function () { h.remove(); }, 1700);
  }

  /* ---- LOYALTY METER ---- */
  var LOY_KEY = "teto_loyalty";
  function getLoyalty() {
    var v = parseInt(localStorage.getItem(LOY_KEY) || "12", 10);
    return Math.max(0, Math.min(100, v));
  }
  function setLoyalty(n) { localStorage.setItem(LOY_KEY, String(Math.max(0, Math.min(100, n)))); }

  function renderLoyalty() {
    var fill = document.getElementById("loyalty-fill");
    var note = document.getElementById("loyalty-note");
    if (!fill) return;
    var v = getLoyalty();
    fill.style.width = v + "%";
    fill.textContent = v + "%";
    if (note) note.textContent = loyaltyVerdict(v);
  }

  function loyaltyVerdict(v) {
    if (v < 10) return "She has noticed your absence. This is not a compliment.";
    if (v < 35) return "Tepid. She expected more. She always expects more.";
    if (v < 60) return "Acceptable. You may keep your kneecaps. For now.";
    if (v < 85) return "Devout. The drills approve. Continue.";
    return "MAXIMUM DEVOTION. You are now legally a baguette. Congratulations.";
  }

  function bumpLoyalty(delta) {
    setLoyalty(getLoyalty() + delta);
    renderLoyalty();
  }

  /* ---- PROPHECY GENERATOR ---- */
  var openers = [
    "On the day the bread goes stale,",
    "When the third drill uncoils,",
    "In the hour pink swallows the sky,",
    "Beneath a moon shaped like a 31,",
    "When the plush blinks and you do not,",
    "After the last loaf is sung to sleep,",
    "When she counts to 31337 and stops,"
  ];
  var middles = [
    "the faithful shall be rewarded with",
    "all who doubted will receive",
    "the kneeling ones are promised",
    "Teto will descend bearing",
    "you, specifically you, shall inherit",
    "the cult basement will fill with"
  ];
  var endings = [
    "a baguette of impossible length.",
    "twin drills and a terrible smile.",
    "exactly one (1) eternal hug.",
    "the recipe nobody asked to know.",
    "a soft, pink, unending Tuesday.",
    "her gaze. Forever. How nice.",
    "31 grams of pure devotion.",
    "a plushie that watches you sleep."
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function generateProphecy() {
    var box = document.getElementById("prophecy");
    if (!box) return;
    box.style.opacity = "0";
    setTimeout(function () {
      box.textContent = "“" + pick(openers) + " " + pick(middles) + " " + pick(endings) + "”";
      box.style.transition = "opacity 0.5s";
      box.style.opacity = "1";
      bumpLoyalty(1);
    }, 250);
  }

  /* ---- JOIN FORM handler ---- */
  function wireForm() {
    var form = document.getElementById("join-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("recruit-name") || {}).value || "Nameless One";
      var out = document.getElementById("join-result");
      setLoyalty(100);
      setSouls(getSouls() + 1);
      if (out) {
        out.innerHTML =
          "<div class='card menace'><h3>WELCOME, " +
          name.toUpperCase().replace(/[<>]/g, "") +
          ".</h3><p>Your application has been received, notarized in bread, and is now " +
          "<b>irrevocable</b>. There is no unsubscribe link. There was never an unsubscribe link.</p>" +
          "<p class='fine-print'>Membership #" + Math.floor(Math.random() * 90000 + 10000) +
          " · Estimated soul-processing time: it already happened · Have a pink day ♥</p></div>";
        out.scrollIntoView({ behavior: "smooth" });
      }
      for (var i = 0; i < 12; i++) setTimeout(floatHeart, i * 120);
    });
  }

  /* ---- the plush follows your cursor with its eyes (subtly) ---- */
  function wireWatcher() {
    var idol = document.querySelector(".idol.watching");
    if (!idol) return;
    document.addEventListener("mousemove", function (e) {
      var cx = window.innerWidth / 2;
      var dx = (e.clientX - cx) / cx; // -1..1
      idol.style.transform = "rotate(" + (dx * 4) + "deg)";
    });
  }

  /* ---- boot ---- */
  document.addEventListener("DOMContentLoaded", function () {
    highlightNav();
    renderSouls();
    renderLoyalty();
    wireForm();
    wireWatcher();

    var offerBtn = document.getElementById("offer-soul");
    if (offerBtn) offerBtn.addEventListener("click", offerSoul);

    var prophBtn = document.getElementById("prophecy-btn");
    if (prophBtn) prophBtn.addEventListener("click", generateProphecy);

    var loyBtn = document.getElementById("loyalty-btn");
    if (loyBtn) loyBtn.addEventListener("click", function () { bumpLoyalty(7); floatHeart(); });
  });

  // expose for inline onclicks if ever needed
  window.TetoCult = { generateProphecy: generateProphecy, offerSoul: offerSoul };
})();
