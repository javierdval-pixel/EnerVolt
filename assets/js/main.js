// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Mobile menu toggle =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
);

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Animated counters (stats hero) =====
const counters = document.querySelectorAll('[data-count]');
let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString('es-ES');
    }, 25);
  });
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
}, { threshold: 0.4 });
const statsBox = document.getElementById('statsBox');
if (statsBox) statsObserver.observe(statsBox);

// ===== Mini recibo animado del Hero (contador de total) =====
const receiptTotalEl = document.getElementById('receiptTotal');
let receiptStarted = false;
function animateReceiptTotal() {
  if (receiptStarted || !receiptTotalEl) return;
  receiptStarted = true;
  const target = parseFloat(receiptTotalEl.dataset.target); // 45.60
  let current = 0;
  const steps = 40;
  const increment = target / steps;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    receiptTotalEl.textContent = current.toFixed(2).replace('.', ',') + '€';
  }, 30);
}
const receiptCard = document.getElementById('receiptCard');
if (receiptCard) {
  const receiptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateReceiptTotal, 900);
      }
    });
  }, { threshold: 0.3 });
  receiptObserver.observe(receiptCard);
}

// ===== Calculadora de ahorro =====
const billRange = document.getElementById('billRange');
const billValue = document.getElementById('billValue');
const saveMonth = document.getElementById('saveMonth');
const saveYear = document.getElementById('saveYear');
const solucionSection = document.getElementById('solucionSection');
const RATE = 0.22;

// Colores para el texto de ahorro (verde oscuro -> verde claro)
const TEXT_START = { r: 15, g: 118, b: 90 };
const TEXT_END   = { r: 134, g: 239, b: 172 };

// Colores para el fondo de TODA la sección (azul oscuro -> verde oscuro)
const SECTION_START = { r: 18, g: 34, b: 54 };  // #122236 (ink2)
const SECTION_END   = { r: 12, g: 60, b: 46 };  // verde oscuro

function lerpColor(start, end, t) {
  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function updateCalc() {
  const bill = parseInt(billRange.value, 10);
  const min = parseInt(billRange.min, 10);
  const max = parseInt(billRange.max, 10);
  const percent = (bill - min) / (max - min);

  const monthly = bill * RATE;
  billValue.textContent = bill + '€ / mes';
  saveMonth.textContent = monthly.toFixed(2).replace('.', ',') + '€';
  saveYear.textContent = (monthly * 12).toFixed(2).replace('.', ',') + '€';

  // Color del texto de ahorro
  const textColor = lerpColor(TEXT_START, TEXT_END, percent);
  saveMonth.style.color = textColor;
  saveYear.style.color = textColor;

  // Color de fondo de toda la sección
  if (solucionSection) {
    solucionSection.style.backgroundColor = lerpColor(SECTION_START, SECTION_END, percent);
  }
}

if (billRange) {
  billRange.addEventListener('input', updateCalc);
  updateCalc();
}


// ===== FAQ accordion =====
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const panel = item.querySelector('.faq-panel');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-panel').style.maxHeight = '0px';
    });

    if (!isOpen) {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ===== Validación de formulario de contacto =====
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const errEl = field.parentElement.querySelector('.err');
      let fieldValid = field.checkValidity();

      if (field.name === 'telefono') {
        fieldValid = /^[0-9]{9}$/.test(field.value.trim());
      }

      field.classList.toggle('border-red-400', !fieldValid);
      if (errEl) errEl.classList.toggle('hidden', fieldValid);
      if (!fieldValid) valid = false;
    });

    if (valid) {
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');

      setTimeout(() => {
        form.reset();
        form.classList.remove('hidden');
        successMsg.classList.add('hidden');
      }, 4000);
    }
  });
}
