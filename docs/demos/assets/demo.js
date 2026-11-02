// Shared behaviour for the demo sites. Everything runs in the browser, nothing is sent anywhere.
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null');
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }

  // Mobile menu
  var burger = $('.burger'), nav = $('.nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Toast
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }
  window.demoToast = toast;
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-soon') || 'Lien officiel à fournir par l\'équipe.'); });
  });

  // Demo forms: validate, then show a confirmation in place
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var msg = document.createElement('div');
      msg.className = 'ok-msg'; msg.setAttribute('role', 'status');
      msg.textContent = f.getAttribute('data-demo');
      f.replaceWith(msg);
    });
  });

  // Cart counter (shop)
  var cartN = $('#cart-n');
  function renderCart() { if (cartN) cartN.textContent = String(store('ybog-cart') || 0); }
  renderCart();
  $$('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      store('ybog-cart', (store('ybog-cart') || 0) + 1); renderCart();
      toast(b.getAttribute('data-add') + ' ajouté au panier.');
    });
  });
  var checkout = $('#checkout');
  if (checkout) checkout.addEventListener('click', function () {
    var n = store('ybog-cart') || 0;
    if (!n) { toast('Votre panier est vide.'); return; }
    store('ybog-cart', 0); renderCart();
    toast('Démo : la commande serait payée par mobile money et livrée à Bamako.');
  });

  // Countdown (demo target: 100 days after first visit, kept for the session)
  var cd = $('[data-countdown]');
  if (cd) {
    var target = store('e26-target');
    if (!target) { target = Date.now() + 100 * 86400000; store('e26-target', target); }
    var parts = { d: $('[data-cd=d]', cd), h: $('[data-cd=h]', cd), m: $('[data-cd=m]', cd), s: $('[data-cd=s]', cd) };
    var pad = function (v) { return v < 10 ? '0' + v : String(v); };
    var tick = function () {
      var t = Math.max(0, Math.floor((target - Date.now()) / 1000));
      parts.d.textContent = Math.floor(t / 86400);
      parts.h.textContent = pad(Math.floor(t % 86400 / 3600));
      parts.m.textContent = pad(Math.floor(t % 3600 / 60));
      parts.s.textContent = pad(t % 60);
    };
    tick(); setInterval(tick, 1000);
  }

  // Pseudo QR code drawn from a ticket number (illustration only)
  function drawQR(canvas, code) {
    var n = 29, x = canvas.getContext('2d'), seed = 0;
    for (var k = 0; k < code.length; k++) seed = (seed * 31 + code.charCodeAt(k)) % 2147483647;
    seed = seed || 2603;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    canvas.width = n; canvas.height = n;
    x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, n, n); x.fillStyle = '#111010';
    function inF(i, j) { return (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9); }
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) if (!inF(i, j) && rnd() > .52) x.fillRect(i, j, 1, 1);
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (p) {
      x.fillStyle = '#111010'; x.fillRect(p[0], p[1], 7, 7);
      x.fillStyle = '#FFFFFF'; x.fillRect(p[0] + 1, p[1] + 1, 5, 5);
      x.fillStyle = '#111010'; x.fillRect(p[0] + 2, p[1] + 2, 3, 3);
    });
  }
  $$('canvas[data-qr]').forEach(function (c) { drawQR(c, c.getAttribute('data-qr')); });

  // Ticket purchase flow
  var shop = $('#ticket-flow');
  if (shop) {
    var PRICES = { Pelouse: 5000, Tribune: 10000, VIP: 25000 };
    var fmt = function (v) { return v.toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA'; };
    var state = { cat: 'Tribune', qty: 1, pay: 'Orange Money' };
    var steps = $$('.step', shop);
    function go(i) {
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      $$('.steps-nav li', shop).forEach(function (li, k) { li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
      shop.scrollIntoView({ block: 'start' });
    }
    function total() { return PRICES[state.cat] * state.qty; }
    function renderSum() {
      $$('[data-sum]', shop).forEach(function (el) {
        el.textContent = state.qty + ' × ' + state.cat + ' · ' + fmt(total());
      });
    }
    $$('input[name=cat]', shop).forEach(function (r) {
      r.addEventListener('change', function () { state.cat = r.value; renderSum(); });
    });
    var qty = $('#qty', shop);
    $('#qty-minus', shop).addEventListener('click', function () { state.qty = Math.max(1, state.qty - 1); qty.textContent = state.qty; renderSum(); });
    $('#qty-plus', shop).addEventListener('click', function () { state.qty = Math.min(10, state.qty + 1); qty.textContent = state.qty; renderSum(); });
    $$('input[name=pay]', shop).forEach(function (r) {
      r.addEventListener('change', function () { state.pay = r.value; });
    });
    $('#to-2', shop).addEventListener('click', function () { go(1); });
    $('#back-1', shop).addEventListener('click', function () { go(0); });
    $('#form-info', shop).addEventListener('submit', function (e) { e.preventDefault(); if (this.reportValidity()) go(2); });
    $('#back-2', shop).addEventListener('click', function () { go(1); });
    $('#pay-btn', shop).addEventListener('click', function () {
      var btn = this; btn.disabled = true; btn.textContent = 'Confirmation sur votre téléphone…';
      setTimeout(function () {
        var name = $('#buyer-name').value.trim(), phone = $('#buyer-phone').value.trim();
        var list = $('#tickets-out'); list.innerHTML = '';
        var issued = store('e26-tickets') || [];
        for (var i = 0; i < state.qty; i++) {
          var code = 'E26-' + Math.random().toString(36).slice(2, 8).toUpperCase();
          issued.push({ code: code, cat: state.cat, used: false });
          var t = document.createElement('div'); t.className = 'eticket';
          t.innerHTML = '<div class="kicker">Billet électronique</div><b>Yacou B OG<br>Stade du 26 Mars</b>' +
            '<canvas data-qr="' + code + '" aria-hidden="true"></canvas>' +
            '<div class="rows"><div><span>Catégorie</span>' + state.cat + '</div><div><span>N°</span>' + code + '</div>' +
            '<div><span>Titulaire</span></div><div><span>Paiement</span>' + state.pay + '</div></div>';
          t.querySelector('.rows div:nth-child(3)').appendChild(document.createTextNode(name));
          list.appendChild(t);
          drawQR(t.querySelector('canvas'), code);
        }
        store('e26-tickets', issued);
        $('#sent-to').textContent = phone;
        btn.disabled = false; btn.textContent = 'Payer';
        go(3);
      }, 1400);
    });
    renderSum(); go(0);
  }

  // Gate control demo
  var gate = $('#gate-form');
  if (gate) {
    var out = $('#gate-out');
    function listTickets() {
      var l = store('e26-tickets') || [], box = $('#gate-list');
      box.innerHTML = '';
      if (!l.length) { box.innerHTML = '<p class="note">Aucun billet acheté dans cette démo. Achetez-en un sur la page Billets pour le tester ici.</p>'; return; }
      l.slice(-8).reverse().forEach(function (t) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'btn line sm';
        b.textContent = t.code; b.addEventListener('click', function () { $('#gate-code').value = t.code; });
        box.appendChild(b);
      });
    }
    listTickets();
    gate.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = $('#gate-code').value.trim().toUpperCase(), l = store('e26-tickets') || [];
      var t = l.filter(function (x) { return x.code === code; })[0];
      out.className = 'gate-out';
      if (!t) { out.classList.add('bad'); out.textContent = 'Billet inconnu : entrée refusée.'; }
      else if (t.used) { out.classList.add('warn'); out.textContent = 'Billet déjà scanné : entrée refusée.'; }
      else { t.used = true; store('e26-tickets', l); out.classList.add('good'); out.textContent = 'Billet valide · ' + t.cat + ' · entrée autorisée.'; }
    });
  }
})();
