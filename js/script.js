/* ══════════════════════════════════════════════════════════
   AURA HORIZON — script.js
   Language Toggle | Calculator | Dual Booking Engine
══════════════════════════════════════════════════════════ */

/* ─── STATE ─────────────────────────────────────────────── */
let currentLang = 'en';
let lightingMode = 'day';

/* ─── ON LOAD ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
  initLangToggle();
  initCalculator();
  setLighting('day');
});

/* ─── NAVBAR SCROLL ─────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ─── HAMBURGER ─────────────────────────────────────────── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ─── LANGUAGE TOGGLE ───────────────────────────────────── */
function initLangToggle() {
  document.getElementById('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(currentLang);
  });
}

function applyLanguage(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  // Toggle button labels
  document.querySelector('.lang-en').style.display = lang === 'en' ? 'inline' : 'none';
  document.querySelector('.lang-ar').style.display = lang === 'ar' ? 'inline' : 'none';

  // Translate all [data-en] / [data-ar] elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });

  // Translate placeholders
  document.querySelectorAll('[data-ph-en]').forEach(el => {
    const ph = el.getAttribute(`data-ph-${lang}`);
    if (ph) el.placeholder = ph;
  });

  // Translate <option> elements
  document.querySelectorAll('option[data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Re-run calculator to update labels
  updateCalculator();
}

/* ─── LIGHTING TOGGLE ───────────────────────────────────── */
const hallImages = {
  day: {
    main: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85',
    thumbs: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
      'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&q=80',
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&q=80',
    ]
  },
  evening: {
    main: 'https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=1200&q=85',
    thumbs: [
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
      'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
    ]
  }
};

function setLighting(mode) {
  lightingMode = mode;
  const track = document.querySelector('.toggle-track');
  const btnDay = document.getElementById('btn-day');
  const btnEve = document.getElementById('btn-eve');

  if (mode === 'day') {
    track.classList.remove('evening');
    btnDay.classList.add('active');
    btnEve.classList.remove('active');
  } else {
    track.classList.add('evening');
    btnEve.classList.add('active');
    btnDay.classList.remove('active');
  }

  const imgs  = hallImages[mode];
  const mainEl = document.getElementById('hall-main-img');
  if (mainEl) {
    mainEl.style.opacity = '0';
    setTimeout(() => {
      mainEl.src = imgs.main;
      mainEl.style.opacity = '1';
      mainEl.style.transition = 'opacity 0.5s ease';
    }, 250);
  }

  const thumbEls = document.querySelectorAll('.hall-thumb img');
  thumbEls.forEach((img, i) => {
    if (imgs.thumbs[i]) img.src = imgs.thumbs[i];
  });
}

function toggleLighting() {
  setLighting(lightingMode === 'day' ? 'evening' : 'day');
}

/* ─── SWAP HALL MAIN IMAGE ──────────────────────────────── */
function swapMain(thumb, src) {
  const mainEl = document.getElementById('hall-main-img');
  mainEl.style.opacity = '0';
  setTimeout(() => {
    mainEl.src = src;
    mainEl.style.opacity = '1';
    mainEl.style.transition = 'opacity 0.4s ease';
  }, 200);
}

/* ─── GUEST CALCULATOR ──────────────────────────────────── */
function initCalculator() {
  const slider = document.getElementById('guest-slider');
  if (!slider) return;
  slider.addEventListener('input', updateCalculator);
  updateCalculator();
}

function updateCalculator() {
  const slider = document.getElementById('guest-slider');
  if (!slider) return;
  const count = parseInt(slider.value);
  document.getElementById('guest-count').textContent = count;

  const isAr = currentLang === 'ar';
  const result = document.getElementById('calc-result');

  let rec, alt;

  if (count <= 100) {
    rec = {
      name: isAr ? 'طاولات مستديرة — أجواء حميمة' : 'Round Tables — Intimate',
      desc: isAr ? 'إعداد كلاسيكي بطاولات تستوعب ٨–١٠ ضيوف لكل منها، مثالي لحفلات الكوكتيل والحفلات الصغيرة.' : 'Classic round-table arrangement seating 8–10 per table, ideal for cocktail receptions and intimate gatherings.',
      cap: isAr ? `سعة: ٨٠–١٠٠ ضيف` : `Capacity: 80–100 Guests`,
      badge: isAr ? 'موصى به' : 'Recommended'
    };
    alt = {
      name: isAr ? 'طاولة طويلة ملكية' : 'Royal Long Table',
      desc: isAr ? 'طاولة طويلة مركزية مثالية للعشاء الرسمي وإطار احتفالي.' : 'A single grand long table for formal dining and a ceremonial feel.',
      cap: isAr ? 'سعة: حتى ٨٠ ضيفاً' : 'Capacity: Up to 80 Guests',
      badge: isAr ? 'بديل' : 'Alternative'
    };
  } else if (count <= 250) {
    rec = {
      name: isAr ? 'مزيج من الطاولات' : 'Mixed Table Formation',
      desc: isAr ? 'مزيج من الطاولات المستديرة والمستطيلة يحقق التوازن بين المناخ الاجتماعي وكفاءة المساحة.' : 'A blend of round and rectangular tables balancing social atmosphere with space efficiency.',
      cap: isAr ? `سعة: ١٥٠–٢٥٠ ضيف` : `Capacity: 150–250 Guests`,
      badge: isAr ? 'موصى به' : 'Recommended'
    };
    alt = {
      name: isAr ? 'طاولات مستديرة — فاخرة' : 'Round Tables — Premium',
      desc: isAr ? 'طاولات مستديرة بأقطار أكبر (١٢ ضيفاً) مع مساحة راقصين مركزية.' : 'Larger round tables (12 guests each) with a central dance floor arrangement.',
      cap: isAr ? `سعة: ٢٠٠–٢٤٠ ضيف` : `Capacity: 200–240 Guests`,
      badge: isAr ? 'بديل' : 'Alternative'
    };
  } else {
    rec = {
      name: isAr ? 'تشكيل القاعة الكاملة' : 'Full Hall Formation',
      desc: isAr ? 'يستخدم القاعة بكاملها بما في ذلك الأجنحة الجانبية والمسرح المخصص ومنطقة العرض.' : 'Utilizes the full hall including side wings, dedicated stage, and display area.',
      cap: isAr ? `سعة: ٣٠٠–٥٠٠ ضيف` : `Capacity: 300–500 Guests`,
      badge: isAr ? 'موصى به' : 'Recommended'
    };
    alt = {
      name: isAr ? 'تشكيل قاعة الاحتفالات الكبرى' : 'Grand Ballroom Style',
      desc: isAr ? 'أسلوب قاعة الرقص التقليدي مع طاولات دائرية وكتل تنويرية مركزية.' : 'Traditional ballroom style with circular tables and central chandelier groupings.',
      cap: isAr ? `سعة: ٣٠٠–٤٥٠ ضيف` : `Capacity: 300–450 Guests`,
      badge: isAr ? 'بديل' : 'Alternative'
    };
  }

  result.innerHTML = `
    <div class="calc-card recommended" data-badge="${rec.badge}">
      <h4>${rec.name}</h4>
      <p>${rec.desc}</p>
      <div class="calc-stat">${rec.cap}</div>
    </div>
    <div class="calc-card" data-badge="${alt.badge}">
      <h4>${alt.name}</h4>
      <p>${alt.desc}</p>
      <div class="calc-stat">${alt.cap}</div>
    </div>
  `;
}

/* ─── FORM VALIDATION ───────────────────────────────────── */
function clearErrors() {
  ['err-name','err-phone','err-date','err-guests','err-type'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function getT(enText, arText) {
  return currentLang === 'ar' ? arText : enText;
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name   = document.getElementById('f-name').value.trim();
  const phone  = document.getElementById('f-phone').value.trim();
  const date   = document.getElementById('f-date').value;
  const guests = document.getElementById('f-guests').value;
  const type   = document.getElementById('f-type').value;

  if (!name || name.length < 2) {
    document.getElementById('err-name').textContent = getT('Please enter your full name.', 'الرجاء إدخال اسمك الكامل.');
    valid = false;
  }
  if (!phone || !/^[\d\s\+\-\(\)]{7,20}$/.test(phone)) {
    document.getElementById('err-phone').textContent = getT('Please enter a valid phone number.', 'الرجاء إدخال رقم هاتف صحيح.');
    valid = false;
  }
  if (!date) {
    document.getElementById('err-date').textContent = getT('Please select an event date.', 'الرجاء اختيار تاريخ الفعالية.');
    valid = false;
  } else {
    const today = new Date(); today.setHours(0,0,0,0);
    if (new Date(date) <= today) {
      document.getElementById('err-date').textContent = getT('Please select a future date.', 'الرجاء اختيار تاريخ مستقبلي.');
      valid = false;
    }
  }
  if (!guests || parseInt(guests) < 10 || parseInt(guests) > 500) {
    document.getElementById('err-guests').textContent = getT('Enter between 10 and 500 guests.', 'أدخل عدداً بين ١٠ و٥٠٠ ضيف.');
    valid = false;
  }
  if (!type) {
    document.getElementById('err-type').textContent = getT('Please select an event type.', 'الرجاء اختيار نوع الفعالية.');
    valid = false;
  }

  return valid;
}

/* ─── DUAL BOOKING SUBMISSION ───────────────────────────── */
async function submitBooking() {
  if (!validateForm()) return;

  const btn  = document.getElementById('btn-submit');
  const name   = document.getElementById('f-name').value.trim();
  const phone  = document.getElementById('f-phone').value.trim();
  const date   = document.getElementById('f-date').value;
  const guests = document.getElementById('f-guests').value;
  const type   = document.getElementById('f-type').value;
  const notes  = document.getElementById('f-notes').value.trim();

  // Disable button during submission
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = getT('Sending...', 'جارٍ الإرسال...');

  const sheetsUrl = document.getElementById('sheets-url').value;
  const waPhone   = document.getElementById('wa-phone').value;

  // ── 1. Background: Google Sheets via Apps Script ──────────
  const payload = { name, phone, date, guests, eventType: type, notes, timestamp: new Date().toISOString() };
  try {
    await fetch(sheetsUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // no-cors swallows errors silently — continue to WhatsApp regardless
    console.warn('Sheets submission note:', err);
  }

  // ── 2. Foreground: WhatsApp Redirect ─────────────────────
  const formattedDate = new Date(date).toLocaleDateString(
    currentLang === 'ar' ? 'ar-SA' : 'en-GB',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  const waMsg = currentLang === 'ar'
    ? `✨ *طلب حجز جديد — أورا هورايزون* ✨\n\n` +
      `👤 *الاسم:* ${name}\n` +
      `📞 *الهاتف:* ${phone}\n` +
      `📅 *تاريخ الفعالية:* ${formattedDate}\n` +
      `👥 *عدد الضيوف:* ${guests}\n` +
      `🎉 *نوع الفعالية:* ${type}\n` +
      `📝 *ملاحظات:* ${notes || 'لا توجد'}\n\n` +
      `أتمنى الاستفسار عن توفر هذا الموعد.`
    : `✨ *New Booking Inquiry — Aura Horizon* ✨\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📅 *Event Date:* ${formattedDate}\n` +
      `👥 *Guests:* ${guests}\n` +
      `🎉 *Event Type:* ${type}\n` +
      `📝 *Notes:* ${notes || 'None'}\n\n` +
      `I would like to inquire about availability for this date.`;

  // Show success state
  document.getElementById('form-success').style.display = 'flex';
  btn.querySelector('.btn-text').textContent = getT('Sent! ✓', 'تم الإرسال! ✓');

  // Redirect to WhatsApp after short delay
  setTimeout(() => {
    const encoded = encodeURIComponent(waMsg);
    window.open(`https://wa.me/${waPhone}?text=${encoded}`, '_blank');

    // Reset form
    setTimeout(() => {
      ['f-name','f-phone','f-date','f-guests','f-notes'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('f-type').value = '';
      document.getElementById('form-success').style.display = 'none';
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = getT('Send Reservation', 'إرسال الحجز');
    }, 3000);
  }, 1200);
}
