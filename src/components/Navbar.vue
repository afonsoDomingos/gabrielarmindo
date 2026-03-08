<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

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
        <div class="logo-icon">G</div>
        <div class="logo-text-group">
          <span class="logo-text">Gabriel</span>
          <span class="logo-accent">Armindo</span>
        </div>
      </a>

      <div class="nav-menu" :class="{ 'active': isMenuActive }" id="nav-menu">
        <ul class="nav-list">
          <li class="nav-item"><a href="#home" class="nav-link" @click="closeMenu">Início</a></li>
          <li class="nav-item"><a href="#about" class="nav-link" @click="closeMenu">Sobre</a></li>
          <li class="nav-item"><a href="#services-overview" class="nav-link" @click="closeMenu">Serviços</a></li>
          <li class="nav-item"><a href="#resume" class="nav-link" @click="closeMenu">Portfólio</a></li>
          <li class="nav-item"><a href="#testimonials" class="nav-link" @click="closeMenu">Testemunhos</a></li>
          <li class="nav-item"><a href="#services" class="nav-link" @click="closeMenu">Investimento</a></li>
          <li class="nav-item"><a href="#contacto" class="nav-link" @click="closeMenu">Contacto</a></li>
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
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: var(--transition-normal);
}

.nav.scrolled {
    background: rgba(255, 255, 255, 0.98);
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

.logo-icon {
    width: 40px;
    height: 40px;
    background: var(--gradient-1);
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
    box-shadow: 0 4px 10px rgba(44, 82, 130, 0.3);
    transition: var(--transition-normal);
}

.nav-logo:hover .logo-icon {
    transform: rotate(-10deg) scale(1.1);
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
    gap: 2rem;
    align-items: center;
}

.nav-list {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
    padding: 0.5rem 0;
    transition: var(--transition-fast);
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
    color: var(--text-primary);
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
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(15px);
        padding: var(--spacing-xl) var(--spacing-md);
        gap: 1rem;
        transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
        z-index: 1001;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-list {
        flex-direction: column;
        width: 100%;
        align-items: center;
        gap: 1.5rem;
    }

    .nav-item {
        width: 100%;
        text-align: center;
    }

    .nav-link {
        font-size: 1.25rem;
        display: block;
        padding: 1rem;
    }

    .nav-toggle {
        display: block;
        z-index: 1002;
    }
}
</style>
