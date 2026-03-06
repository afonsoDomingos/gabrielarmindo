import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.mount('#app');

// --- Global Interactivity ---

// --- Global Interactivity ---

// 1. Scroll Progress Bar
const createScrollProgress = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
};

// 2. Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Handle staggered children if it's a reveal-container
            if (entry.target.classList.contains('reveal-container')) {
                const items = entry.target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${(index + 1) * 0.1}s`;
                    item.classList.add('active');
                });
            }
        }
    });
}, {
    threshold: 0.15
});

// Watch for DOM changes to observe new elements
const domObserver = new MutationObserver(() => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-blur, .reveal-container');
    reveals.forEach(el => revealObserver.observe(el));
});

domObserver.observe(document.body, { childList: true, subtree: true });

// 3. Scroll to Top Logic
const createScrollTopButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Initial check & setup
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();

    // Reveal initial elements
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-blur, .reveal-container');
    reveals.forEach(el => revealObserver.observe(el));

    // Create Scroll button
    createScrollTopButton();

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
