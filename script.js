/* =============================================
   KAE-NTT MATARAM — script.js
   Fitur: Dark Mode, Scroll Reveal, Countdown, Form Kontak
   ============================================= */

/* ===== 1. DARK MODE TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('kae-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('kae-theme', next);
});


/* ===== 2. NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ===== 3. HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});


/* ===== 4. SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger animation for sibling elements
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ===== 5. KETUA SLIDER ===== */
const slider = document.getElementById('ketuaSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');
const cards = slider.querySelectorAll('.ketua-card');

// Detect cards per view
function getCardsPerView() {
  if (window.innerWidth < 600) return 1;
  if (window.innerWidth < 900) return 2;
  return 3;
}

let currentIndex = 0;
const totalCards = cards.length;

// Build dots
const totalDots = Math.ceil(totalCards / getCardsPerView());
function buildDots() {
  dotsContainer.innerHTML = '';
  const n = Math.ceil(totalCards / getCardsPerView());
  for (let i = 0; i < n; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(index) {
  const perView = getCardsPerView();
  const maxIndex = Math.ceil(totalCards / perView) - 1;
  currentIndex = Math.max(0, Math.min(index, maxIndex));

  const cardWidth = cards[0].offsetWidth + 24; // card + gap
  slider.scrollLeft = currentIndex * cardWidth * perView;

  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

// Scroll to last (active) card on load
window.addEventListener('load', () => {
  buildDots();
  // Scroll to the active (current chairman) card
  const activeCard = slider.querySelector('.ketua-card.active');
  if (activeCard) {
    setTimeout(() => {
      activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 500);
  }
});

window.addEventListener('resize', buildDots);


/* ===== 6. LIGHTBOX GALERI ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(el) {
  const src = el.getAttribute('data-src');
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

// Close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


/* ===== 7. COUNTDOWN KEGIATAN ===== */
let countdownTarget = null;
let countdownInterval = null;

function setCountdown() {
  const dateInput = document.getElementById('inputEventDate').value;
  const nameInput = document.getElementById('inputEventName').value.trim();
  const descInput = document.getElementById('inputEventDesc').value.trim();

  if (!dateInput) {
    alert('Mohon masukkan tanggal acara.');
    return;
  }

  countdownTarget = new Date(dateInput).getTime();

  if (nameInput) document.getElementById('eventName').textContent = nameInput;
  if (descInput) document.getElementById('eventDesc').textContent = descInput;

  // Format date display
  const dateObj = new Date(dateInput);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('eventDateDisplay').textContent = 'Tanggal: ' + dateObj.toLocaleDateString('id-ID', options);

  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (!countdownTarget) return;

  const now = new Date().getTime();
  const distance = countdownTarget - now;

  if (distance <= 0) {
    document.getElementById('cdDays').textContent = '00';
    document.getElementById('cdHours').textContent = '00';
    document.getElementById('cdMinutes').textContent = '00';
    document.getElementById('cdSeconds').textContent = '00';
    clearInterval(countdownInterval);
    document.getElementById('eventDesc').textContent = '🎉 Acara telah dimulai!';
    return;
  }

  const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('cdDays').textContent    = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
}

// Set default countdown (Milad KAE 2026)
window.addEventListener('DOMContentLoaded', () => {
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 2);
  defaultDate.setDate(1);
  defaultDate.setHours(8, 0, 0, 0);

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${defaultDate.getFullYear()}-${pad(defaultDate.getMonth()+1)}-${pad(defaultDate.getDate())}T${pad(defaultDate.getHours())}:${pad(defaultDate.getMinutes())}`;
  document.getElementById('inputEventDate').value = formatted;
  setCountdown();
});


/* ===== 8. FORM KONTAK FUNGSIONAL ===== */
const kontakForm = document.getElementById('kontakForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');

function validateField(id, errorId, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!field.value.trim()) {
    field.classList.add('error');
    error.textContent = message;
    return false;
  }
  if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
    field.classList.add('error');
    error.textContent = 'Format email tidak valid.';
    return false;
  }
  field.classList.remove('error');
  error.textContent = '';
  return true;
}

// Live validation
['nama', 'email', 'pesan'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    el.classList.remove('error');
    document.getElementById(id + 'Error').textContent = '';
  });
});

kontakForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate
  const v1 = validateField('nama', 'namaError', 'Nama tidak boleh kosong.');
  const v2 = validateField('email', 'emailError', 'Email tidak boleh kosong.');
  const v3 = validateField('pesan', 'pesanError', 'Pesan tidak boleh kosong.');
  if (!v1 || !v2 || !v3) return;

  // Show loading
  formSuccess.style.display = 'none';
  formError.style.display = 'none';
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  // Collect data
  const formData = {
    nama: document.getElementById('nama').value.trim(),
    email: document.getElementById('email').value.trim(),
    subjek: document.getElementById('subjek').value.trim() || 'Pesan dari Website KAE',
    pesan: document.getElementById('pesan').value.trim(),
  };

  // Try Formspree (replace YOUR_FORMSPREE_ID with real ID from formspree.io)
  // For now, simulate success after 1.5s
  try {
    // Using Formspree endpoint — ganti YOUR_FORM_ID dengan ID kamu dari formspree.io
    const FORMSPREE_ID = 'YOUR_FORM_ID';
    let success = false;

    if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
      // Real submission
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.nama,
          email: formData.email,
          subject: formData.subjek,
          message: formData.pesan,
        }),
      });
      success = response.ok;
    } else {
      // Demo mode: simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      success = true;
    }

    if (success) {
      formSuccess.style.display = 'block';
      kontakForm.reset();
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    formError.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});


/* ===== 9. SMOOTH SCROLL TO SECTION ===== */
function scrollSejarah() {
  document.getElementById('sejarah').scrollIntoView({ behavior: 'smooth' });
}
