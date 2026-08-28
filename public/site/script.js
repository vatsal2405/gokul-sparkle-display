(function () {
  "use strict";

  var LS_P = "gokul.products.v1";
  var LS_R = "gokul.reviews.v1";
  var CATS = ["All", "TVs", "Refrigerators", "Coolers", "Washing Machines", "Accessories"];
  var IMG = "https://images.unsplash.com/";

  var DEFAULT_PRODUCTS = [
    { id: "p1", name: 'Samsung 43" 4K Smart LED TV', cat: "TVs", mrp: 46990, price: 32990, desc: "Crystal 4K UHD, HDR10+, built-in apps and voice remote.", img: IMG + "photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=70" },
    { id: "p2", name: 'LG 32" HD Ready Smart TV', cat: "TVs", mrp: 24990, price: 15990, desc: "Compact smart TV, perfect for bedrooms and small halls.", img: IMG + "photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=70" },
    { id: "p3", name: "Whirlpool 265L Double Door Fridge", cat: "Refrigerators", mrp: 34990, price: 26490, desc: "Frost-free, 3-star inverter cooling with large veggie crisper.", img: IMG + "photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=70" },
    { id: "p4", name: "Godrej 190L Single Door Fridge", cat: "Refrigerators", mrp: 19990, price: 14490, desc: "Energy-efficient compressor with base drawer storage.", img: IMG + "photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=70" },
    { id: "p5", name: "Symphony 70L Desert Air Cooler", cat: "Coolers", mrp: 17990, price: 8990, desc: "Powerful blower, honeycomb pads and ice chamber for hot days.", img: IMG + "photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=70" },
    { id: "p6", name: "Bajaj 36L Personal Air Cooler", cat: "Coolers", mrp: 9990, price: 5490, desc: "Slim, low power draw and easy to shift between rooms.", img: IMG + "photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=70" },
    { id: "p7", name: "IFB 7kg Fully Automatic Front Load", cat: "Washing Machines", mrp: 39990, price: 28990, desc: "Aqua energie wash, 14 programs and inbuilt heater.", img: IMG + "photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=70" },
    { id: "p8", name: "Samsung 6.5kg Top Load Washer", cat: "Washing Machines", mrp: 21990, price: 15490, desc: "Diamond drum, center jet pulsator and quick 15-min wash.", img: IMG + "photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=70" },
    { id: "p9", name: "Mixer Grinder 750W · 3 Jars", cat: "Accessories", mrp: 5490, price: 2749, desc: "Tough motor with stainless jars for daily kitchen use.", img: IMG + "photo-1585237017125-24baf8d7406f?auto=format&fit=crop&w=800&q=70" },
    { id: "p10", name: "Wall Mount Bracket & HDMI Kit", cat: "Accessories", mrp: 2490, price: 1245, desc: "Universal TV bracket with 3m high-speed HDMI cable.", img: IMG + "photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=70" },
    { id: "p11", name: "Voltas 1.5 Ton Window AC", cat: "Accessories", mrp: 36990, price: 27990, desc: "Fast cooling, copper condenser and turbo mode.", img: IMG + "photo-1631545806609-a15c4b3b1c0a?auto=format&fit=crop&w=800&q=70" },
    { id: "p12", name: "Induction Cooktop 2000W", cat: "Accessories", mrp: 3990, price: 1990, desc: "8 preset menus with auto shut-off safety.", img: IMG + "photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=70" }
  ];

  var DEFAULT_REVIEWS = [
    { name: "Rohit Kulkarni", rating: 5, msg: "Bought a Samsung TV here. Best price in Dhanori and they installed it the same evening.", date: "2026-06-12" },
    { name: "Sneha Patil", rating: 5, msg: "Very honest shop. Explained the difference between models patiently without pushing costly ones.", date: "2026-05-28" },
    { name: "Imran Shaikh", rating: 4, msg: "Got a Symphony cooler at a good discount. Delivery was quick, just had to wait a bit at billing.", date: "2026-04-19" },
    { name: "Aarti Deshmukh", rating: 5, msg: "Washing machine service support was excellent. They followed up until the issue was solved.", date: "2026-03-06" }
  ];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };
  var off = function (p) { return p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0; };

  function load(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) && v.length ? v : fallback.slice();
    } catch (e) { return fallback.slice(); }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  var products = load(LS_P, DEFAULT_PRODUCTS);
  var reviews = load(LS_R, DEFAULT_REVIEWS);
  var activeCat = "All";
  var query = "";
  var editingId = null;

  /* ---------- toast ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  /* ---------- open/closed status ---------- */
  function updateStatus() {
    var el = $("#status"), txt = $("#statusText");
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = 10 * 60, close = 21 * 60;
    var isOpen = mins >= open && mins < close;
    el.classList.toggle("open", isOpen);
    el.classList.toggle("closed", !isOpen);
    if (isOpen) {
      var left = close - mins;
      txt.textContent = left <= 60 ? "Open now · closing in " + left + " min" : "Open now · closes 9:00 PM";
    } else {
      txt.textContent = mins < open ? "Closed · opens 10:00 AM" : "Closed · opens 10:00 AM tomorrow";
    }
  }

  /* ---------- products ---------- */
  function filtered() {
    var q = query.trim().toLowerCase();
    return products.filter(function (p) {
      var okCat = activeCat === "All" || p.cat === activeCat;
      var okQ = !q || (p.name + " " + p.cat + " " + (p.desc || "")).toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });
  }

  function renderFilters() {
    $("#filters").innerHTML = CATS.map(function (c) {
      return '<button type="button" class="chip' + (c === activeCat ? " on" : "") + '" data-cat="' + esc(c) + '" aria-pressed="' + (c === activeCat) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function renderProducts() {
    var list = filtered();
    $("#empty").hidden = list.length > 0;
    $("#productGrid").innerHTML = list.map(function (p) {
      var d = off(p);
      return '<article class="p-card reveal in">' +
        '<div class="p-media">' +
        (d ? '<span class="badge">' + d + "% OFF</span>" : "") +
        '<img src="' + esc(p.img || "") + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&amp;fit=crop&amp;w=800&amp;q=70\'" />' +
        "</div>" +
        '<div class="p-body">' +
        '<span class="p-cat">' + esc(p.cat) + "</span>" +
        '<h3 class="p-name">' + esc(p.name) + "</h3>" +
        '<p class="p-desc">' + esc(p.desc || "") + "</p>" +
        '<p class="p-price"><b>' + money(p.price) + "</b>" + (d ? "<s>" + money(p.mrp) + "</s>" : "") + "</p>" +
        '<a class="btn btn-primary btn-sm" href="tel:07775011155" data-enquire="' + esc(p.name) + '">Enquire Now</a>' +
        "</div></article>";
    }).join("");
  }

  /* ---------- reviews ---------- */
  function starStr(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }

  function renderReviews() {
    $("#reviewList").innerHTML = reviews.map(function (r) {
      var d = new Date(r.date);
      var label = isNaN(d) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      return '<article class="r-item reveal in"><div class="r-top"><strong>' + esc(r.name) + "</strong><time>" + esc(label) + "</time></div>" +
        '<div class="stars" aria-label="' + r.rating + ' out of 5">' + starStr(r.rating) + "</div>" +
        "<p>" + esc(r.msg) + "</p></article>";
    }).join("");
  }

  var pickRating = 5;
  function renderStarPick() {
    $("#starPick").innerHTML = [1, 2, 3, 4, 5].map(function (i) {
      return '<button type="button" class="' + (i <= pickRating ? "on" : "") + '" data-star="' + i + '" aria-label="' + i + ' star' + (i > 1 ? "s" : "") + '">★</button>';
    }).join("");
  }

  /* ---------- owner panel ---------- */
  function renderManage() {
    $("#manageList").innerHTML = products.map(function (p) {
      return '<div class="m-row"><img src="' + esc(p.img || "") + '" alt="" /><div><strong>' + esc(p.name) + "</strong>" +
        "<small>" + esc(p.cat) + " · " + money(p.price) + " · " + off(p) + "% off</small></div>" +
        '<button class="icon-btn" data-edit="' + p.id + '">Edit</button>' +
        '<button class="icon-btn danger" data-del="' + p.id + '">Delete</button></div>';
    }).join("");
  }

  function fillForm(p) {
    $("#pName").value = p ? p.name : "";
    $("#pCat").value = p ? p.cat : "TVs";
    $("#pImg").value = p ? p.img : "";
    $("#pMrp").value = p ? p.mrp : "";
    $("#pPrice").value = p ? p.price : "";
    $("#pDesc").value = p ? p.desc : "";
    editingId = p ? p.id : null;
    $("#formTitle").textContent = p ? "Edit product" : "Add product";
    $("#cancelEdit").hidden = !p;
  }

  /* ---------- counters ---------- */
  function runCounters() {
    var nodes = document.querySelectorAll("[data-count]");
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = Number(el.dataset.count), suffix = el.dataset.suffix || "", start = performance.now();
      (function step(t) {
        var k = Math.min((t - start) / 1400, 1);
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * e).toLocaleString("en-IN") + suffix;
        if (k < 1) requestAnimationFrame(step);
      })(start);
    });
  }

  /* ---------- reveal ---------- */
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          if (en.target.id === "stats") runCounters();
          io.unobserve(en.target);
        });
      }, { threshold: 0.15 })
    : null;

  function observeReveals() {
    if (!io) { Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (e) { e.classList.add("in"); }); runCounters(); return; }
    Array.prototype.forEach.call(document.querySelectorAll(".reveal:not(.in)"), function (e) { io.observe(e); });
    io.observe($("#stats"));
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    document.body.classList.add("has-cursor");
    var c = $("#cursor"), x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      c.style.left = cx + "px"; c.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      var hot = e.target.closest("a,button,input,textarea,select,.p-card");
      c.classList.toggle("hot", !!hot);
    });
  }

  /* ---------- events ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $("#year").textContent = new Date().getFullYear();
    updateStatus();
    setInterval(updateStatus, 60000);
    renderFilters(); renderProducts(); renderReviews(); renderStarPick(); renderManage();
    observeReveals();
    initCursor();

    var nav = $("#nav");
    window.addEventListener("scroll", function () { nav.classList.toggle("stuck", window.scrollY > 10); }, { passive: true });

    var burger = $("#burger"), links = $("#navLinks");
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });

    $("#search").addEventListener("input", function (e) { query = e.target.value; renderProducts(); });

    $("#filters").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      activeCat = b.dataset.cat;
      renderFilters(); renderProducts();
    });

    $("#productGrid").addEventListener("click", function (e) {
      var a = e.target.closest("[data-enquire]");
      if (a) toast("Calling the store about: " + a.dataset.enquire);
    });

    $("#starPick").addEventListener("click", function (e) {
      var b = e.target.closest("[data-star]");
      if (!b) return;
      pickRating = Number(b.dataset.star);
      renderStarPick();
    });

    $("#reviewForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#rName").value.trim(), msg = $("#rMsg").value.trim();
      if (!name || !msg) { $("#rHint").textContent = "Please add your name and message."; return; }
      reviews.unshift({ name: name, rating: pickRating, msg: msg, date: new Date().toISOString().slice(0, 10) });
      save(LS_R, reviews);
      renderReviews();
      e.target.reset();
      pickRating = 5; renderStarPick();
      $("#rHint").textContent = "Thanks! Your review is saved.";
      toast("Review added");
    });

    $("#prodForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#pName").value.trim();
      var mrp = Number($("#pMrp").value), price = Number($("#pPrice").value);
      if (!name || !mrp || !price) { $("#pHint").textContent = "Name, original price and offer price are required."; return; }
      var data = {
        name: name, cat: $("#pCat").value, img: $("#pImg").value.trim(),
        mrp: mrp, price: price, desc: $("#pDesc").value.trim()
      };
      if (editingId) {
        products = products.map(function (p) { return p.id === editingId ? Object.assign({}, p, data) : p; });
        toast("Product updated");
      } else {
        data.id = "p" + Date.now();
        products.unshift(data);
        toast("Product added");
      }
      save(LS_P, products);
      fillForm(null);
      $("#prodForm").reset();
      $("#pHint").textContent = "Saved to this browser.";
      renderProducts(); renderManage();
    });

    $("#cancelEdit").addEventListener("click", function () { fillForm(null); $("#prodForm").reset(); $("#pHint").textContent = ""; });

    $("#resetAll").addEventListener("click", function () {
      if (!confirm("Reset the product list to the default catalogue?")) return;
      products = DEFAULT_PRODUCTS.slice();
      save(LS_P, products);
      fillForm(null); $("#prodForm").reset();
      renderProducts(); renderManage();
      toast("Catalogue reset");
    });

    $("#manageList").addEventListener("click", function (e) {
      var ed = e.target.closest("[data-edit]"), dl = e.target.closest("[data-del]");
      if (ed) {
        var p = products.filter(function (x) { return x.id === ed.dataset.edit; })[0];
        if (p) { fillForm(p); $("#prodForm").scrollIntoView({ behavior: "smooth", block: "center" }); }
      }
      if (dl) {
        if (!confirm("Delete this product?")) return;
        products = products.filter(function (x) { return x.id !== dl.dataset.del; });
        save(LS_P, products);
        if (editingId === dl.dataset.del) { fillForm(null); $("#prodForm").reset(); }
        renderProducts(); renderManage();
        toast("Product deleted");
      }
    });
  });
})();
