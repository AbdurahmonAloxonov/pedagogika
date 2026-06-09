/* ============================================================
   Bolalar adabiyoti — Test  (logic)
   ============================================================ */
(function () {
  "use strict";

  var ALL = (window.QUESTIONS || []).slice();
  var KEYS = ["A", "B", "C", "D", "E", "F"];

  // ---- settings ----
  var settings = { size: 20, mode: "practice", shuffle: true };

  // ---- session state ----
  var pool = [];      // questions for this run
  var i = 0;          // current index
  var score = 0;
  var answered = false;
  var wrong = [];     // {q, options, chosen, answer}

  // ---- elements ----
  var $ = function (id) { return document.getElementById(id); };
  var screens = { start: $("start"), quiz: $("quiz"), results: $("results") };

  // safe localStorage
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function show(name) {
    Object.keys(screens).forEach(function (n) {
      screens[n].classList.toggle("is-active", n === name);
    });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var t = a[k]; a[k] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------- START SCREEN ----------
  function initStart() {
    $("totalCount").textContent = ALL.length;

    bindChips("sizeChips", function (el) {
      var v = el.getAttribute("data-size");
      settings.size = v === "all" ? "all" : parseInt(v, 10);
    });
    bindChips("modeChips", function (el) {
      settings.mode = el.getAttribute("data-mode");
    });

    var shuf = $("shuffleToggle");
    shuf.addEventListener("change", function () { settings.shuffle = shuf.checked; });

    $("startBtn").addEventListener("click", startQuiz);

    var best = lsGet("ba_best");
    if (best) {
      $("bestLine").hidden = false;
      $("bestLine").textContent = "Eng yaxshi natijangiz: " + best + "%";
    }
  }

  function bindChips(containerId, onPick) {
    var box = $(containerId);
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (c) {
        c.classList.remove("is-on");
        c.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-on");
      btn.setAttribute("aria-checked", "true");
      onPick(btn);
    });
  }

  // ---------- QUIZ ----------
  function startQuiz() {
    var base = settings.shuffle ? shuffle(ALL) : ALL.slice();
    var n = settings.size === "all" ? base.length : Math.min(settings.size, base.length);
    pool = base.slice(0, n);
    i = 0; score = 0; wrong = [];
    show("quiz");
    render();
  }

  function render() {
    answered = false;
    var q = pool[i];

    $("counter").textContent = (i + 1) + " / " + pool.length;
    $("scorePill").textContent = score + " to'g'ri";
    $("qNumber").textContent = "Savol " + (i + 1);
    $("qText").textContent = q.q;
    $("progressBar").style.width = ((i) / pool.length * 100) + "%";

    var fb = $("feedback");
    fb.textContent = ""; fb.className = "feedback";

    var next = $("nextBtn");
    next.disabled = true;
    next.textContent = (i === pool.length - 1) ? "Yakunlash" : "Keyingi";

    // build options (shuffle order so position of correct varies)
    var order = settings.shuffle
      ? shuffle(q.options.map(function (_, idx) { return idx; }))
      : q.options.map(function (_, idx) { return idx; });

    var box = $("options");
    box.innerHTML = "";
    order.forEach(function (origIdx, pos) {
      var btn = document.createElement("button");
      btn.className = "opt";
      btn.type = "button";
      btn.setAttribute("data-orig", origIdx);
      btn.innerHTML =
        '<span class="opt__key">' + (KEYS[pos] || (pos + 1)) + "</span>" +
        '<span class="opt__txt"></span>';
      btn.querySelector(".opt__txt").textContent = q.options[origIdx];
      btn.addEventListener("click", function () { choose(btn, origIdx); });
      box.appendChild(btn);
    });
  }

  function choose(btn, origIdx) {
    if (answered) return;
    answered = true;

    var q = pool[i];
    var correct = q.answer;
    var opts = $("options").querySelectorAll(".opt");

    // disable all
    Array.prototype.forEach.call(opts, function (o) { o.disabled = true; });

    var isRight = origIdx === correct;
    if (isRight) score++;

    if (settings.mode === "practice") {
      // mark chosen + reveal correct
      btn.classList.add(isRight ? "is-correct" : "is-wrong");
      if (!isRight) {
        Array.prototype.forEach.call(opts, function (o) {
          if (parseInt(o.getAttribute("data-orig"), 10) === correct) o.classList.add("is-correct");
        });
      }
      var fb = $("feedback");
      fb.textContent = isRight ? "To'g'ri!" : "Noto'g'ri";
      fb.className = "feedback " + (isRight ? "ok" : "no");
    } else {
      // exam mode: neutral highlight, no reveal
      btn.style.borderColor = "var(--brand)";
      btn.style.background = "#FAFCF9";
    }

    if (!isRight) {
      wrong.push({
        q: q.q,
        chosen: q.options[origIdx],
        answer: q.options[correct]
      });
    }

    $("scorePill").textContent = score + " to'g'ri";
    $("nextBtn").disabled = false;
    $("nextBtn").focus();
  }

  function next() {
    if (!answered) return;
    if (i < pool.length - 1) {
      i++;
      render();
    } else {
      finish();
    }
  }

  // ---------- RESULTS ----------
  function finish() {
    $("progressBar").style.width = "100%";
    var pct = Math.round(score / pool.length * 100);

    show("results");
    $("resultRing").style.setProperty("--pct", pct);
    $("resultPct").textContent = pct + "%";
    $("resultLine").textContent =
      pool.length + " tadan " + score + " ta to'g'ri javob.";

    var title = "Yaxshi urinish!";
    if (pct >= 90) title = "Ajoyib natija!";
    else if (pct >= 70) title = "Zo'r ish!";
    else if (pct >= 50) title = "Yomon emas!";
    else title = "Mashqni davom eting";
    $("resultTitle").textContent = title;

    // best score
    var best = parseInt(lsGet("ba_best") || "0", 10);
    if (pct > best) lsSet("ba_best", String(pct));

    // build review (hidden until requested)
    var rev = $("review");
    rev.hidden = true;
    rev.innerHTML = "";
    if (wrong.length === 0) {
      rev.innerHTML = '<div class="review__item" style="border-left-color:var(--correct)">' +
        '<p class="review__q">Bitta ham xato yo\'q — barakalla!</p></div>';
    } else {
      wrong.forEach(function (w) {
        var item = document.createElement("div");
        item.className = "review__item";
        item.innerHTML =
          '<p class="review__q"></p>' +
          '<p class="review__row review__yours">Sizning javob: <b></b></p>' +
          '<p class="review__row review__right">To\'g\'ri javob: <b></b></p>';
        item.querySelector(".review__q").textContent = w.q;
        var bolds = item.querySelectorAll("b");
        bolds[0].textContent = w.chosen;
        bolds[1].textContent = w.answer;
        rev.appendChild(item);
      });
    }
    var revBtn = $("reviewBtn");
    revBtn.textContent = wrong.length ? ("Xatolarni ko'rish (" + wrong.length + ")") : "Javoblarni ko'rish";
  }

  // ---------- events ----------
  function initQuizEvents() {
    $("nextBtn").addEventListener("click", next);
    $("quitBtn").addEventListener("click", function () { show("start"); });
    $("againBtn").addEventListener("click", function () { show("start"); });
    $("reviewBtn").addEventListener("click", function () {
      var rev = $("review");
      rev.hidden = !rev.hidden;
      if (!rev.hidden) rev.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // keyboard: 1-4 / a-d to answer, Enter for next
    document.addEventListener("keydown", function (e) {
      if (!screens.quiz.classList.contains("is-active")) return;
      if (e.key === "Enter" && !$("nextBtn").disabled) { next(); return; }
      if (answered) return;
      var map = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
      var idx = map[e.key.toLowerCase()];
      if (idx === undefined) return;
      var opts = $("options").querySelectorAll(".opt");
      if (opts[idx]) opts[idx].click();
    });
  }

  // ---------- boot ----------
  function boot() {
    if (!ALL.length) {
      $("totalCount").textContent = "0";
      $("startBtn").disabled = true;
      $("brand") && ($("brand").textContent = "Savollar topilmadi.");
      return;
    }
    initStart();
    initQuizEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
