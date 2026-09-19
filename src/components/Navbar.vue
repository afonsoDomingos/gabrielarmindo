<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLanguage } from '../store/language';
import { useTheme } from '../store/theme';

const { lang, toggleLanguage, t } = useLanguage();
const { isDark, toggleTheme } = useTheme();
const isScrolled = ref(false);
const isMenuActive = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};

const closeMenu = () => {
  isMenuActive.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav class="nav" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container container">
      <a href="/" class="nav-logo">
        <img src="/images/perfil1.png" alt="Gabriel Armindo" class="logo-photo" />
        <div class="logo-text-group">
          <span class="logo-text">Gabriel</span>
          <span class="logo-accent">Armindo</span>
        </div>
      </a>

      <div class="nav-menu" :class="{ 'active': isMenuActive }" id="nav-menu">
        <ul class="nav-list">
          <li class="nav-item"><a href="#home" class="nav-link" @click="closeMenu">{{ t('Início', 'Home') }}</a></li>
          <li class="nav-item"><a href="#about" class="nav-link" @click="closeMenu">{{ t('Sobre', 'About') }}</a></li>
          <li class="nav-item"><a href="#services-overview" class="nav-link" @click="closeMenu">{{ t('Serviços', 'Services') }}</a></li>
          <li class="nav-item"><a href="#resume" class="nav-link" @click="closeMenu">{{ t('Portfólio', 'Portfolio') }}</a></li>
          <li class="nav-item"><a href="#blog" class="nav-link" @click="closeMenu">{{ t('Artigos', 'Articles') }}</a></li>
          <li class="nav-item"><a href="#testimonials" class="nav-link" @click="closeMenu">{{ t('Testemunhos', 'Testimonials') }}</a></li>
          <li class="nav-item"><a href="#services" class="nav-link" @click="closeMenu">{{ t('Investimento', 'Investment') }}</a></li>
          <li class="nav-item"><a href="#contacto" class="nav-link" @click="closeMenu">{{ t('Contacto', 'Contact') }}</a></li>
          <li class="nav-item lang-switcher">
            <button @click="toggleLanguage" class="lang-btn" title="Alterar Idioma / Change Language">
              <span v-if="lang === 'pt'">PT / <b>EN</b></span>
              <span v-else><b>PT</b> / EN</span>
            </button>
          </li>
          <li class="nav-item theme-switcher">
            <button @click="toggleTheme" class="theme-btn" :title="isDark ? t('Mudar para Modo Claro', 'Switch to Light Mode') : t('Mudar para Modo Escuro', 'Switch to Dark Mode')" :aria-label="isDark ? 'Modo Claro' : 'Modo Escuro'">
              <i class="fas fa-sun theme-icon-sun" v-if="isDark"></i>
              <i class="fas fa-moon theme-icon-moon" v-else></i>
            </button>
          </li>
        </ul>
      </div>

      <div class="nav-toggle" id="nav-toggle" @click="toggleMenu">
        <i class="fas" :class="isMenuActive ? 'fa-times' : 'fa-bars'"></i>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--nav-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    z-index: 1000;
    border-bottom: 1px solid var(--nav-border);
    transition: var(--transition-normal), background-color 0.3s ease, border-color 0.3s ease;
}

.nav.scrolled {
    background: var(--nav-bg-scrolled);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--nav-border);
    box-shadow: var(--shadow-md);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem var(--spacing-md);
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-accent);
}

.logo-photo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top center;
    border: 2px solid var(--primary-color);
    box-shadow: 0 4px 12px rgba(255, 123, 26, 0.35);
    transition: all var(--transition-normal);
}

.nav-logo:hover .logo-photo {
    transform: scale(1.08);
    border-color: var(--secondary-color);
    box-shadow: 0 6px 16px rgba(255, 123, 26, 0.5);
}

.logo-text-group {
    display: flex;
    flex-direction: column;
    line-height: 1;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    transition: color 0.3s ease;
}

.logo-accent {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.nav-menu {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav-list {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav-link {
    color: var(--nav-text);
    font-weight: 500;
    position: relative;
    padding: 0.5rem 0;
    transition: var(--transition-fast), color 0.3s ease;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient-1);
    transition: var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
    color: var(--nav-text-active);
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

.nav-toggle {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-primary);
}

@media (max-width: 968px) {
    .nav-list {
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .nav-container {
        padding: 1rem var(--spacing-md);
    }

    .nav-menu {
        position: fixed;
        top: 0;
        left: -100%;
        width: 80%;
        height: 100vh;
        flex-direction: column;
        justify-content: center;
        background: var(--nav-bg-scrolled);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-right: 1px solid var(--nav-border);
        padding: var(--spacing-xl) var(--spacing-md);
        gap: 1rem;
        transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-list {
        flex-direction: column;
        width: 100%;
        align-items: center;
        gap: 1.25rem;
    }

    .nav-item {
        width: 100%;
        text-align: center;
    }

    .nav-link {
        font-size: 1.2rem;
        display: block;
        padding: 0.8rem;
        color: var(--nav-text-active);
    }

    .nav-toggle {
        display: block;
        z-index: 1002;
    }
}

/* Language Switcher Styles */
.lang-switcher,
.theme-switcher {
  display: flex;
  align-items: center;
}

.lang-btn {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #ffffff;
  transform: scale(1.05);
}

.lang-btn b {
  font-weight: 800;
  margin-left: 2px;
}

/* Theme Switcher Styles */
.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #ffffff;
  transform: rotate(20deg) scale(1.08);
  box-shadow: 0 4px 14px rgba(255, 123, 26, 0.4);
}

.theme-icon-sun {
  color: #FDBA74;
}

.theme-btn:hover .theme-icon-sun {
  color: #ffffff;
}

.theme-icon-moon {
  color: #6366f1;
}

.theme-btn:hover .theme-icon-moon {
  color: #ffffff;
}

@media (max-width: 768px) {
  .lang-switcher,
  .theme-switcher {
    margin-top: 0.5rem;
    justify-content: center;
  }
}
</style>
