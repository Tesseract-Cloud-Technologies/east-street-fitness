/* main.js */
(function() {
  'use strict';

  // --- Demo bar dismiss ---
  const demoBar = document.getElementById('demoBar');
  const dismissBtn = document.getElementById('dismissDemoBar');
  if (dismissBtn && demoBar) {
    if (localStorage.getItem('esfDemoDismissed') === 'true') demoBar.style.display = 'none';
    dismissBtn.addEventListener('click', () => {
      demoBar.style.display = 'none';
      localStorage.setItem('esfDemoDismissed', 'true');
    });
  }

  // --- Counters & plate gauges ---
  const counters = document.querySelectorAll('.counter-value');
  const gauges = document.querySelectorAll('.plate-gauge');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString();
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  // Fill plate gauges
  const gaugeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const gauge = entry.target;
        const target = parseInt(gauge.dataset.target, 10);
        const fill = gauge.querySelector('.gauge-fill');
        if (fill) {
          const pct = Math.min(1, target / 2017);
          fill.style.strokeDashoffset = String(327 - (327 * pct));
        }
        gaugeObserver.unobserve(gauge);
      }
    });
  }, { threshold: 0.4 });
  gauges.forEach(g => gaugeObserver.observe(g));

  // --- Live gym status busy meter ---
  const busyFill = document.getElementById('busyFill');
  const busyLabel = document.getElementById('busyLabel');
  function updateBusyMeter() {
    if (!busyFill) return;
    const hour = new Date().getHours();
    let level = 30;
    if (hour >= 6 && hour < 9) level = 70;
    else if (hour >= 9 && hour < 12) level = 40;
    else if (hour >= 12 && hour < 14) level = 80;
    else if (hour >= 14 && hour < 17) level = 45;
    else if (hour >= 17 && hour < 20) level = 95;
    else if (hour >= 20 || hour < 6) level = 20;
    busyFill.style.width = level + '%';
    if (busyLabel) busyLabel.textContent = level > 75 ? 'Busy' : level > 45 ? 'Moderate' : 'Quiet';
  }
  updateBusyMeter();
  setInterval(updateBusyMeter, 60000);

  // --- Membership estimator ---
  const estimatorSessions = document.getElementById('estimatorSessions');
  const sessionsCount = document.getElementById('sessionsCount');
  const estimatorTotal = document.getElementById('estimatorTotal');
  const typeBtns = document.querySelectorAll('[data-type]');
  let currentTypePrice = 900;

  function updateEstimator() {
    if (!estimatorTotal) return;
    const sessions = parseInt(estimatorSessions.value, 10);
    const total = currentTypePrice + (sessions - 1) * 100;
    estimatorTotal.textContent = 'K' + total.toLocaleString();
  }

  if (estimatorSessions) {
    estimatorSessions.addEventListener('input', () => {
      sessionsCount.textContent = estimatorSessions.value;
      updateEstimator();
    });
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        typeBtns.forEach(b => { if (b.dataset.type) b.classList.remove('active'); });
        btn.classList.add('active');
        currentTypePrice = btn.dataset.type === 'inhouse' ? 900 : 1500;
        updateEstimator();
      });
    });
    updateEstimator();
  }

  // --- Schedule mobile day picker ---
  const scheduleData = {
    mon: [['6:00', 'Boxercise'], ['9:00', 'Weights'], ['12:00', 'Circuit'], ['17:00', 'TRX'], ['19:00', 'Weights']],
    tue: [['6:00', 'Weights'], ['9:00', 'TRX'], ['12:00', 'Boxercise'], ['17:00', 'Weights'], ['19:00', 'Circuit']],
    wed: [['6:00', 'Circuit'], ['9:00', 'Weights'], ['12:00', 'TRX'], ['17:00', 'Boxercise'], ['19:00', 'Weights']],
    thu: [['6:00', 'Boxercise'], ['9:00', 'Circuit'], ['12:00', 'Weights'], ['17:00', 'TRX'], ['19:00', 'Boxercise']],
    fri: [['6:00', 'TRX'], ['9:00', 'Weights'], ['12:00', 'Circuit'], ['17:00', 'Weights'], ['19:00', 'TRX']],
    sat: [['6:00', 'Open'], ['9:00', 'Boxercise'], ['12:00', 'Open'], ['17:00', 'Open'], ['19:00', 'Open']]
  };
  const dayBtns = document.querySelectorAll('.day-btn');
  const mobileSchedule = document.getElementById('mobileSchedule');

  function renderMobileSchedule(day) {
    if (!mobileSchedule) return;
    const items = scheduleData[day] || [];
    mobileSchedule.innerHTML = items.map(([time, prog]) =>
      `<div class="day-schedule-card d-flex justify-content-between align-items-center">
        <strong>${time}</strong> <span class="text-steel">${prog}</span>
      </div>`
    ).join('');
  }

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMobileSchedule(btn.dataset.day);
    });
  });
  if (dayBtns.length) renderMobileSchedule('mon');

  // --- Shop products & cart ---
  const products = [
    { id: 1, name: 'ESF Training Tee', price: 65, icon: 'fa-shirt' },
    { id: 2, name: 'ESF Hoodie', price: 120, icon: 'fa-shirt' },
    { id: 3, name: 'Lifting Straps', price: 45, icon: 'fa-hand-fist' },
    { id: 4, name: 'Shaker Bottle', price: 35, icon: 'fa-bottle-water' },
    { id: 5, name: 'ESF Cap', price: 50, icon: 'fa-hat-cowboy' },
    { id: 6, name: 'Gym Towel', price: 30, icon: 'fa-towel' }
  ];

  const shopGrid = document.getElementById('shopGrid');
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  let cart = [];

  function renderShop() {
    if (!shopGrid) return;
    shopGrid.innerHTML = products.map(p => `
      <div class="col-6 col-md-4">
        <div class="product-card h-100">
          <div class="product-image"><i class="fa-solid ${p.icon}"></i></div>
          <div class="product-body">
            <h3 class="h6 text-steel mb-1">${p.name}</h3>
            <p class="text-red fw-bold mb-2">K${p.price}</p>
            <button class="btn btn-signal btn-sm w-100 rounded-pill add-to-cart" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `).join('');
    shopGrid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id, 10)));
    });
  }

  function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    updateCart();
    openCart();
  }

  function updateCart() {
    const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
    if (cartCount) cartCount.textContent = totalQty;
    if (cartItems) {
      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-steel-muted small">Your cart is empty.</p>';
      } else {
        cartItems.innerHTML = cart.map(c => `
          <div class="cart-line">
            <span>${c.name} × ${c.qty}</span>
            <span>K${c.price * c.qty}</span>
            <button class="remove-btn" data-id="${c.id}" aria-label="Remove ${c.name}"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('');
        cartItems.querySelectorAll('.remove-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            cart = cart.filter(c => c.id !== parseInt(btn.dataset.id, 10));
            updateCart();
          });
        });
      }
    }
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    if (cartSubtotal) cartSubtotal.textContent = 'K' + subtotal;
  }

  function openCart() { cartDrawer.classList.add('open'); cartOverlay.classList.add('show'); cartDrawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('show'); cartDrawer.setAttribute('aria-hidden', 'true'); }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (shopGrid) renderShop();

  // --- Booking wizard ---
  const wizardState = { programme: null, type: null, day: null, time: null, payMethod: 'card' };
  const step1 = document.getElementById('wizardStep1');
  const step2 = document.getElementById('wizardStep2');
  const step3 = document.getElementById('wizardStep3');
  const stepConfirm = document.getElementById('wizardConfirmation');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const next1 = document.getElementById('wizardNext1');
  const next2 = document.getElementById('wizardNext2');
  const back2 = document.getElementById('wizardBack2');
  const back3 = document.getElementById('wizardBack3');
  const confirmBtn = document.getElementById('wizardConfirm');

  function setStep(n) {
    [step1, step2, step3, stepConfirm].forEach(p => p && p.classList.add('d-none'));
    wizardSteps.forEach(s => s.classList.remove('active'));
    const target = { 1: step1, 2: step2, 3: step3, 4: stepConfirm }[n];
    if (target) target.classList.remove('d-none');
    const activeStep = document.querySelector(`.wizard-step[data-step="${n}"]`);
    if (activeStep) activeStep.classList.add('active');
  }

  // Step 1 programme & type
  document.querySelectorAll('[data-programme]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-programme]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.programme = btn.dataset.programme;
      checkStep1();
    });
  });
  document.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.type = btn.dataset.type;
      checkStep1();
    });
  });
  function checkStep1() {
    if (next1) next1.disabled = !(wizardState.programme && wizardState.type);
  }

  if (next1) next1.addEventListener('click', () => setStep(2));

  // Step 2 day & time
  document.querySelectorAll('.day-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.day = btn.dataset.day;
      checkStep2();
    });
  });
  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.time = btn.dataset.time;
      checkStep2();
    });
  });
  function checkStep2() {
    if (next2) next2.disabled = !(wizardState.day && wizardState.time);
  }

  if (back2) back2.addEventListener('click', () => setStep(1));
  if (next2) next2.addEventListener('click', () => {
    const rp = document.getElementById('reviewProgramme');
    const rt = document.getElementById('reviewType');
    const rd = document.getElementById('reviewDay');
    const rti = document.getElementById('reviewTime');
    if (rp) rp.textContent = wizardState.programme;
    if (rt) rt.textContent = wizardState.type === 'inhouse' ? 'In-house' : 'Out-of-house';
    if (rd) rd.textContent = wizardState.day;
    if (rti) rti.textContent = wizardState.time;
    setStep(3);
  });

  // Step 3 payment
  document.querySelectorAll('[data-pay]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-pay]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      wizardState.payMethod = btn.dataset.pay;
      const cardFields = document.getElementById('cardFields');
      const mobileFields = document.getElementById('mobileFields');
      if (cardFields && mobileFields) {
        cardFields.classList.toggle('d-none', btn.dataset.pay !== 'card');
        mobileFields.classList.toggle('d-none', btn.dataset.pay !== 'mobile');
      }
    });
  });

  if (back3) back3.addEventListener('click', () => setStep(2));
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    const ref = 'ESF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const refEl = document.getElementById('bookingRef');
    if (refEl) refEl.textContent = ref;
    setStep(4);
    // Confetti
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '20vh';
        piece.style.background = ['#E5262B', '#F4F4F5', '#8E8E93'][Math.floor(Math.random() * 3)];
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 3000);
      }
    }
  });

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactWhatsapp = document.getElementById('contactWhatsapp');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('contactName')?.value || 'Friend';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const text = `Hello East Street Fitness! My name is ${name}. Email: ${email}. Message: ${message} (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (contactWhatsapp) contactWhatsapp.href = url;
      contactForm.classList.add('d-none');
      if (contactSuccess) contactSuccess.classList.remove('d-none');
    });
  }

})();