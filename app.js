/* =========================================================
   CONCERT GALA 2026 — RHYTHM OF HOPES
   Interactive JavaScript Controller
   Developed by DewX
   ========================================================= */

'use strict';

/* ─── HEADER SCROLL ─────────────────────────────────────── */
const header = document.getElementById('site-header');
const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── MOBILE DRAWER ──────────────────────────────────────── */
const hamburger    = document.getElementById('hamburger');
const drawer       = document.getElementById('mobile-drawer');
const drawerClose  = document.getElementById('drawer-close');
const drawerOv     = document.getElementById('drawer-overlay');

function openDrawer()  { drawer.classList.add('open'); drawerOv.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { drawer.classList.remove('open'); drawerOv.classList.remove('open'); document.body.style.overflow = ''; }

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOv?.addEventListener('click', closeDrawer);

drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ─── COUNTDOWN TIMER ────────────────────────────────────── */
const EVENT_TARGET = new Date('2026-07-19T14:00:00+08:00').getTime();

function pad(n) { return String(n).padStart(2, '0'); }

/* Helper: update a span element with flip animation when value changes */
function setNum(el, val) {
    if (!el) return;
    const str = pad(val);
    if (el.textContent === str) return;          // no change → skip
    el.classList.remove('flip');
    // Force reflow so animation re-triggers
    void el.offsetWidth;
    el.textContent = str;
    el.classList.add('flip');
}

/* Hero inline IDs */
const hcdDays    = document.getElementById('hcd-days');
const hcdHours   = document.getElementById('hcd-hours');
const hcdMinutes = document.getElementById('hcd-minutes');
const hcdSeconds = document.getElementById('hcd-seconds');

function tickCountdown() {
    const remaining = EVENT_TARGET - Date.now();
    if (remaining <= 0) {
        if (hcdDays) hcdDays.textContent = '00';
        if (hcdHours) hcdHours.textContent = '00';
        if (hcdMinutes) hcdMinutes.textContent = '00';
        if (hcdSeconds) hcdSeconds.textContent = '00';
        return;
    }
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor((remaining % 86400000) / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);

    /* Hero inline (with flip animation) */
    setNum(hcdDays,    d);
    setNum(hcdHours,   h);
    setNum(hcdMinutes, m);
    setNum(hcdSeconds, s);
}

tickCountdown();
setInterval(tickCountdown, 1000);

/* ─── DJ PARTICLES EFFECT ────────────────────────────────── */
const particlesContainer = document.getElementById('particles-container');
if (particlesContainer) {
    const particleCount = 40; // Number of particles to spawn
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'dust-particle';
        
        // Randomize size, position, and animation duration/delay
        const size = Math.random() * 4 + 2; // 2px to 6px
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        p.style.left = `${Math.random() * 100}%`;
        
        // Duration between 4s and 12s
        const duration = Math.random() * 8 + 4;
        p.style.animationDuration = `${duration}s`;
        
        // Delay between 0s and -12s (negative so they start already on screen)
        const delay = Math.random() * -12;
        p.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(p);
    }
}

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.scroll-reveal');
const observer  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ─── COUNT-UP NUMBERS ───────────────────────────────────── */
const countNums = document.querySelectorAll('.count-num');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1600;
        const start = performance.now();

        const step = (ts) => {
            const progress = Math.min((ts - start) / dur, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * end);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
countNums.forEach(n => countObserver.observe(n));

/* ─── CHARITY PROGRESS BAR ───────────────────────────────── */
const progFill = document.getElementById('prog-fill');
const progPct  = document.getElementById('prog-pct');
const charityPct = 75; // 75% of goal reached

const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (progFill) progFill.style.width = charityPct + '%';
        if (progPct) {
            let count = 0;
            const interval = setInterval(() => {
                count++;
                progPct.textContent = count + '%';
                if (count >= charityPct) clearInterval(interval);
            }, 20);
        }
        progObserver.unobserve(e.target);
    });
}, { threshold: 0.4 });
if (progFill) progObserver.observe(progFill);

/* ─── GALLERY LIGHTBOX ───────────────────────────────────── */
const galleryGrid = document.getElementById('gallery-grid');
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lb-img');
const lbClose     = document.getElementById('lb-close');
const lbPrev      = document.getElementById('lb-prev');
const lbNext      = document.getElementById('lb-next');

let galleryImages = [];
let currentIdx    = 0;

if (galleryGrid) {
    const gItems = galleryGrid.querySelectorAll('.g-item img');
    gItems.forEach(img => galleryImages.push(img.src));

    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.g-item');
        if (!item) return;
        currentIdx = parseInt(item.dataset.index, 10);
        openLightbox(currentIdx);
    });
}

function openLightbox(idx) {
    if (!lightbox) return;
    currentIdx = idx;
    lbImg.src  = galleryImages[idx];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}
function showPrev() { currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length; lbImg.src = galleryImages[currentIdx]; }
function showNext() { currentIdx = (currentIdx + 1) % galleryImages.length; lbImg.src = galleryImages[currentIdx]; }

lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', showPrev);
lbNext?.addEventListener('click', showNext);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
});

/* ─── FAQ ACCORDION ──────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all others
        document.querySelectorAll('.faq-item.open').forEach(el => {
            el.classList.remove('open');
            el.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!isOpen) {
            item.classList.add('open');
            ans.style.maxHeight = ans.scrollHeight + 'px';
        }
    });
});

/* ─── WAITLIST FORM ──────────────────────────────────────── */
const waitlistForm = document.getElementById('waitlist-form');
const wlSuccess    = document.getElementById('wl-success');

waitlistForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('wl-name')?.value?.trim();
    const email = document.getElementById('wl-email')?.value?.trim();
    if (!name || !email) return;

    // Simulate submission
    waitlistForm.style.display = 'none';
    if (wlSuccess) {
        wlSuccess.style.display = 'flex';
    }
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

/* ─── ACTIVE NAV LINK ─────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navItems   = document.querySelectorAll('.nav-item');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navItems.forEach(a => a.classList.remove('active'));
            const matching = document.querySelector(`.nav-item[href="#${e.target.id}"]`);
            matching?.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ─── VIDEO FALLBACK ─────────────────────────────────────── */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        const bg = document.querySelector('.hero-bg');
        if (bg) {
            bg.style.backgroundImage = 'url(./assets/hero_fallback.png)';
            bg.style.backgroundSize  = 'cover';
            bg.style.backgroundPosition = 'center top';
        }
    });
}
