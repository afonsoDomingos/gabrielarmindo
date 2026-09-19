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

// 3. Scroll Pill Widget (Up Arrow, Live Percentage, Down Arrow)
const createScrollWidget = () => {
    const widget = document.createElement('div');
    widget.className = 'scroll-pill-widget';
    widget.innerHTML = `
        <button class="scroll-pill-btn scroll-pill-up" aria-label="Rolar para o topo" title="Ir para o topo">
            <i class="fas fa-chevron-up"></i>
        </button>
        <span class="scroll-pill-percent">0%</span>
        <button class="scroll-pill-btn scroll-pill-down" aria-label="Rolar para o fim" title="Ir para o fim">
            <div class="scroll-pill-icon-circle">
                <i class="fas fa-chevron-down"></i>
            </div>
        </button>
    `;
    document.body.appendChild(widget);

    const percentEl = widget.querySelector('.scroll-pill-percent');
    const upBtn = widget.querySelector('.scroll-pill-up');
    const downBtn = widget.querySelector('.scroll-pill-down');

    const updateScroll = () => {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? Math.min(Math.max(Math.round((winScroll / height) * 100), 0), 100) : 0;
        
        if (percentEl) {
            percentEl.textContent = `${scrolled}%`;
        }

        if (winScroll > 100) {
            widget.classList.add('visible');
        } else {
            widget.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    upBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    downBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
};

// Initial check & setup
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();

    // Reveal initial elements
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-blur, .reveal-container');
    reveals.forEach(el => revealObserver.observe(el));

    // Create Scroll Pill Widget
    createScrollWidget();

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
