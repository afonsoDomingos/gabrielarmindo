<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const statsRef = ref(null);
const counts = ref({
  experience: 0,
  projects: 0,
  orgs: 0,
  mentored: 0
});

const targets = {
  experience: 5,
  projects: 6,
  orgs: 5,
  mentored: 100
};

let animationFrameId = null;

const animateCount = () => {
  const duration = 1600; // ms
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutCubic curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    counts.value.experience = Math.floor(easeProgress * targets.experience);
    counts.value.projects = Math.floor(easeProgress * targets.projects);
    counts.value.orgs = Math.floor(easeProgress * targets.orgs);
    counts.value.mentored = Math.floor(easeProgress * targets.mentored);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      counts.value.experience = targets.experience;
      counts.value.projects = targets.projects;
      counts.value.orgs = targets.orgs;
      counts.value.mentored = targets.mentored;
    }
  };

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(step);
};

let observer = null;

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && statsRef.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount();
        } else {
          // Reset when out of view so it animates again when scrolling back
          counts.value.experience = 0;
          counts.value.projects = 0;
          counts.value.orgs = 0;
          counts.value.mentored = 0;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(statsRef.value);
  } else {
    counts.value = { ...targets };
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <section class="hero" id="home">
    <div class="hero-bg"></div>
    <div class="container hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-greeting reveal-text">{{ t('Olá, sou', "Hello, I'm") }}</span> <br />
          <span class="gradient-text hero-name animated-name">Gabriel Armindo</span>
        </h1>
        <p class="hero-subtitle">{{ t('Fortalecimento Institucional · MEAL · Investigação · Comunicação Estratégica', 'Institutional Strengthening · MEAL · Research · Strategic Communication') }}</p>
        <p class="hero-description">
          {{ t('Transformo dados, evidências e experiências em sistemas de aprendizagem, tomada de decisão e posicionamento institucional.', 'I transform data, evidence, and experiences into systems of learning, decision-making, and institutional positioning.') }}
        </p>

        <div class="hero-stats" ref="statsRef">
          <div class="stat-item reveal">
            <div class="stat-number">{{ counts.experience }}</div>
            <div class="stat-label">{{ t('Anos de experiência', 'Years of experience') }}</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.1s">
            <div class="stat-number">{{ counts.projects }}</div>
            <div class="stat-label">{{ t('Projectos implementados', 'Implemented projects') }}</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.2s">
            <div class="stat-number">{{ counts.orgs }}</div>
            <div class="stat-label">{{ t('Organizações apoiadas', 'Supported organizations') }}</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.3s">
            <div class="stat-number">{{ counts.mentored }}</div>
            <div class="stat-label">{{ t('Pessoas mentoradas', 'People mentored') }}</div>
          </div>
        </div>

        <div class="hero-buttons">
          <a href="#contacto" class="btn btn-primary">
            <span>{{ t('Contacto', 'Contact') }}</span>
            <i class="fas fa-paper-plane"></i>
          </a>
          <a href="#services" class="btn btn-primary">
            <span>{{ t('Veja os Meus Serviços', 'See My Services') }}</span>
            <i class="fas fa-concierge-bell"></i>
          </a>
          <a href="#resume" class="btn btn-outline">
            <span>{{ t('Ver Portfólio', 'View Portfolio') }}</span>
            <i class="fas fa-file-alt"></i>
          </a>
          <a href="#blog" class="btn btn-outline">
            <span>{{ t('Ver Blog', 'View Blog') }}</span>
            <i class="fas fa-blog"></i>
          </a>
        </div>

        <div class="hero-social">
          <a href="https://www.linkedin.com/in/gabriel-armindo/" target="_blank" class="social-link" title="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="https://www.facebook.com/gabrielarmindo.armindo.9" target="_blank" class="social-link" title="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="mailto:gabrielarmindo32@gmail.com" class="social-link" title="Email">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>

      <div class="hero-image">
        <div class="image-wrapper">
          <div class="profile-frame">
            <div class="inner-border"></div>
            <img src="/images/perfil1.png" alt="Gabriel Armindo" class="profile-img" />
          </div>
          <div class="image-glow"></div>

          <!-- Cards flutuantes -->
          <div class="floating-card card-1">
            <i class="fas fa-database"></i>
            <span>Power BI</span>
          </div>
          <div class="floating-card card-2">
            <i class="fas fa-chart-bar"></i>
            <span>SPSS</span>
          </div>
          <div class="floating-card card-3">
            <i class="fas fa-file-excel"></i>
            <span>Excel</span>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <span>{{ t('Role para explorar', 'Scroll to explore') }}</span>
      <div class="mouse"></div>
    </div>
  </section>
</template>

<style scoped>
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    padding-top: 100px;
    padding-bottom: 60px;
    overflow: hidden;
    background-color: #0B132B;
    color: #f8fafc;
}

.hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 18% 25%, rgba(255, 123, 26, 0.16) 0%, transparent 45%),
        radial-gradient(circle at 82% 60%, rgba(30, 58, 138, 0.45) 0%, transparent 55%),
        radial-gradient(circle at 50% 95%, rgba(255, 123, 26, 0.08) 0%, transparent 40%),
        linear-gradient(180deg, #070D1E 0%, #0B132B 50%, #080F24 100%);
    z-index: 0;
}

/* Subtle ambient tech grid texture */
.hero-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.3;
    pointer-events: none;
}

.hero-container {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: var(--spacing-lg);
    align-items: center;
}

.hero-content {
    animation: fadeInUp 1s ease;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4.2rem);
    font-family: var(--font-accent);
    font-weight: 800;
    line-height: 1.18;
    margin-bottom: var(--spacing-sm);
    color: #ffffff;
}

.hero-greeting {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards 0.2s;
    font-weight: 500;
    color: #cbd5e1;
    font-size: clamp(1.4rem, 2.5vw, 2rem);
}

.animated-name {
    display: inline-block;
    background: linear-gradient(90deg, 
        #FF7B1A 0%, 
        #FFA454 25%, 
        #FFD1A9 50%, 
        #FFA454 75%, 
        #FF7B1A 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite, fadeInUp 0.8s ease forwards 0.4s;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.animated-name:hover {
    transform: scale(1.06) translateY(-4px);
    filter: drop-shadow(0 0 16px rgba(255, 123, 26, 0.55));
    cursor: pointer;
}

@keyframes shimmer {
    to { background-position: 200% center; }
}

.hero-subtitle {
    font-size: 1.2rem;
    color: #93c5fd;
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    letter-spacing: -0.2px;
}

.hero-description {
    font-size: 1.08rem;
    color: #94a3b8;
    margin-bottom: var(--spacing-md);
    max-width: 600px;
    line-height: 1.7;
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.85rem;
    margin: var(--spacing-md) 0;
    padding: 0;
}

.stat-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-md);
    padding: 1rem 0.8rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    text-align: center;
    transition: all var(--transition-normal);
}

.stat-item:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 123, 26, 0.35);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.stat-number {
    font-size: 2.2rem;
    font-weight: 800;
    font-family: var(--font-accent);
    background: linear-gradient(135deg, #FFA454 0%, #FF7B1A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
    font-variant-numeric: tabular-nums;
    display: inline-block;
    line-height: 1.1;
}

.stat-number::after { content: '+'; }
.stat-label { 
    font-size: 0.8rem; 
    color: #cbd5e1; 
    line-height: 1.35;
}

.hero-buttons {
    display: flex;
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
    flex-wrap: wrap;
}

.hero-buttons .btn-primary {
    background: var(--gradient-1);
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(255, 123, 26, 0.4);
}

.hero-buttons .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 123, 26, 0.6);
}

.hero-buttons .btn-outline {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
}

.hero-buttons .btn-outline:hover {
    background: rgba(255, 123, 26, 0.15);
    border-color: var(--primary-color);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 123, 26, 0.25);
}

.hero-social {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.social-link {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
    transition: all var(--transition-fast);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.social-link:hover {
    background: var(--gradient-1);
    color: white;
    border-color: transparent;
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(255, 123, 26, 0.45);
}

.hero-name {
    display: inline-block;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
}

.hero-name:hover {
    transform: scale(1.05) translateY(-5px);
    text-shadow: 0 10px 20px rgba(255, 123, 26, 0.2);
    filter: drop-shadow(0 0 8px rgba(255, 123, 26, 0.4));
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-frame {
    position: relative;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    padding: 10px;
    background: var(--gradient-1);
    box-shadow: 0 0 60px rgba(255, 123, 26, 0.45), 0 20px 40px rgba(0, 0, 0, 0.4);
    z-index: 2;
    transition: all 0.6s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-frame:hover {
    transform: scale(1.02) rotate(2deg);
    box-shadow: 0 0 80px rgba(255, 123, 26, 0.65), 0 25px 50px rgba(0, 0, 0, 0.5);
}

.inner-border {
    position: absolute;
    top: 5px; left: 5px; right: 5px; bottom: 5px;
    border: 3px dashed rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    z-index: 1;
    animation: rotateInner 20s linear infinite;
}

@keyframes rotateInner {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #0B132B;
    position: relative;
    z-index: 3;
    animation: grayscaleCycle 7s ease-in-out infinite, floatProfile 6s ease-in-out infinite;
    transition: filter 0.6s ease;
}

@keyframes grayscaleCycle {
    0%, 20% {
        filter: grayscale(0%) contrast(100%) brightness(100%);
    }
    45%, 65% {
        filter: grayscale(100%) contrast(110%) brightness(98%);
    }
    90%, 100% {
        filter: grayscale(0%) contrast(100%) brightness(100%);
    }
}

@keyframes floatProfile {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

.image-glow {
    position: absolute;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(255, 123, 26, 0.4) 0%, rgba(30, 58, 138, 0.3) 50%, transparent 75%);
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.5;
    z-index: 1;
    animation: pulse 4s ease-in-out infinite;
}

.floating-card {
    position: absolute;
    padding: 0.85rem 1.35rem;
    background: rgba(11, 19, 43, 0.85);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: #ffffff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
    animation: float 3s ease-in-out infinite;
    z-index: 4;
}

.floating-card i {
    font-size: 1.25rem;
    color: var(--primary-color);
}

.card-1 { top: 10%; right: 5%; animation-delay: 0s; }
.card-2 { top: 50%; left: -2%; animation-delay: 1s; }
.card-3 { bottom: 8%; right: 18%; animation-delay: 2s; }

.scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
    z-index: 2;
}

.mouse {
    width: 24px;
    height: 36px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-radius: 12px;
    position: relative;
}

.mouse::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 6px;
    background: var(--primary-color);
    border-radius: 2px;
    animation: scrollMouse 2s infinite;
}

@keyframes scrollMouse {
    0% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 14px); }
}

/* Light Theme Overrides for Hero */
:global([data-theme="light"]) .hero {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

:global([data-theme="light"]) .hero-bg {
    background: 
        radial-gradient(circle at 20% 20%, rgba(255, 123, 26, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.05) 0%, transparent 50%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

:global([data-theme="light"]) .hero-bg::after {
    background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px);
    opacity: 0.5;
}

:global([data-theme="light"]) .hero-title {
    color: var(--text-primary);
}

:global([data-theme="light"]) .hero-greeting {
    color: var(--text-secondary);
}

:global([data-theme="light"]) .hero-subtitle {
    color: var(--text-secondary);
}

:global([data-theme="light"]) .hero-description {
    color: var(--text-muted);
}

:global([data-theme="light"]) .stat-item {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:global([data-theme="light"]) .stat-item:hover {
    background: #ffffff;
    border-color: rgba(255, 123, 26, 0.4);
    box-shadow: 0 6px 18px rgba(255, 123, 26, 0.15);
}

:global([data-theme="light"]) .stat-label {
    color: var(--text-muted);
}

:global([data-theme="light"]) .hero-buttons .btn-outline {
    background: #ffffff;
    color: var(--text-primary);
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

:global([data-theme="light"]) .hero-buttons .btn-outline:hover {
    background: rgba(255, 123, 26, 0.08);
    border-color: var(--primary-color);
    color: var(--primary-color);
}

:global([data-theme="light"]) .social-link {
    background: #ffffff;
    color: var(--text-secondary);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

:global([data-theme="light"]) .profile-img {
    border-color: #ffffff;
}

:global([data-theme="light"]) .floating-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: var(--text-primary);
    box-shadow: var(--shadow-lg);
}

:global([data-theme="light"]) .scroll-indicator {
    color: var(--text-muted);
}

:global([data-theme="light"]) .mouse {
    border-color: var(--text-muted);
}

@media (max-width: 968px) {
    .hero { padding-top: 90px; padding-bottom: 80px; min-height: 100vh; }
    .hero-container { grid-template-columns: 1fr; text-align: center; gap: var(--spacing-md); }
    .hero-image { order: -1; margin-bottom: var(--spacing-md); }
    .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; margin: 1.5rem 0; width: 100%; }
    .hero-buttons { justify-content: center; gap: 0.85rem; margin-bottom: 1.5rem; }
    .hero-social { justify-content: center; margin-top: 1.25rem; }
    .hero-description { margin-left: auto; margin-right: auto; max-width: 90%; text-align: center; }
    .scroll-indicator { bottom: 1rem; }
    
    .profile-frame {
        width: 280px;
        height: 280px;
    }
    .image-wrapper {
        height: 340px;
    }
    .image-glow {
        width: 300px;
        height: 300px;
    }
}

@media (max-width: 480px) {
    .hero-title { font-size: 2.25rem; }
    .hero-subtitle { font-size: 1.05rem; }
    .stat-number { font-size: 1.75rem; }
    .floating-card { display: none; }
    .hero-buttons { flex-direction: column; width: 100%; max-width: 300px; margin-left: auto; margin-right: auto; }
    .hero-buttons .btn { width: 100%; justify-content: center; }
    .profile-frame {
        width: 220px;
        height: 220px;
    }
    .image-wrapper {
        height: 270px;
    }
}
</style>
