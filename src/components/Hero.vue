<template>
  <section class="hero" id="home">
    <div class="hero-bg"></div>
    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="fas fa-chart-line"></i>
          <span>Especialista em M&A e MEAL</span>
        </div>
        <h1 class="hero-title">
          Olá, Eu sou <br />
          <span class="gradient-text hero-name">Gabriel Armindo</span>
        </h1>
        <p class="hero-subtitle">M&E Specialist | MEAL & Data Analysis Expert</p>
        <p class="hero-description">
          Com mais de 5 anos de experiência em gestão de projetos, monitoria e avaliação orientada para resultados nas áreas de desenvolvimento, assistência humanitária e resiliência.
        </p>

        <div class="hero-stats">
          <div class="stat-item reveal">
            <div class="stat-number">5</div>
            <div class="stat-label">Anos Exp</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.1s">
            <div class="stat-number">5</div>
            <div class="stat-label">Projectos</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.2s">
            <div class="stat-number">10</div>
            <div class="stat-label">Organizações</div>
          </div>
          <div class="stat-item reveal" style="transition-delay: 0.3s">
            <div class="stat-number">300</div>
            <div class="stat-label">Estudantes</div>
          </div>
        </div>

        <div class="hero-buttons">
          <a href="#contacto" class="btn btn-primary">
            <span>Contacto</span>
            <i class="fas fa-paper-plane"></i>
          </a>
          <a href="#blog" class="btn btn-outline">
            <span>Ver Blog</span>
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
      <span>Role para explorar</span>
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
    padding-top: 80px;
    overflow: hidden;
}

.hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 20%, rgba(255, 123, 26, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%);
    z-index: -1;
}

.hero-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    align-items: center;
}

.hero-content {
    animation: fadeInUp 1s ease;
}

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 123, 26, 0.1);
    border: 1px solid rgba(255, 123, 26, 0.2);
    border-radius: 50px;
    color: var(--primary-color);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-family: var(--font-accent);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: var(--spacing-sm);
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
}

.hero-description {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-md);
    max-width: 600px;
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
    margin: var(--spacing-md) 0;
    padding: var(--spacing-md) 0;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    font-family: var(--font-accent);
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
}

.stat-number::after { content: '+'; }
.stat-label { font-size: 0.875rem; color: var(--text-muted); }

.hero-buttons {
    display: flex;
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
    flex-wrap: wrap;
}

.hero-social {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.social-link {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: white;
    color: var(--text-secondary);
    transition: all var(--transition-fast);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: var(--shadow-sm);
}

.social-link:hover {
    background: var(--gradient-1);
    color: white;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(255, 123, 26, 0.3);
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
    box-shadow: 0 0 50px rgba(255, 123, 26, 0.4);
    z-index: 2;
    transition: all 0.6s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-frame:hover {
    transform: scale(1.02) rotate(2deg);
    box-shadow: 0 0 70px rgba(255, 123, 26, 0.6);
}

.inner-border {
    position: absolute;
    top: 5px; left: 5px; right: 5px; bottom: 5px;
    border: 3px dashed rgba(255, 255, 255, 0.6);
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
    border: 4px solid var(--bg-primary);
    position: relative;
    z-index: 3;
}

@keyframes floatProfile {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.image-glow {
    position: absolute;
    width: 400px;
    height: 400px;
    background: var(--gradient-1);
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    z-index: 1;
    animation: pulse 4s ease-in-out infinite;
}

.floating-card {
    position: absolute;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 123, 26, 0.1);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    box-shadow: var(--shadow-lg);
    animation: float 3s ease-in-out infinite;
}

.card-1 { top: 10%; right: 10%; animation-delay: 0s; }
.card-2 { top: 50%; left: 0; animation-delay: 1s; }
.card-3 { bottom: 10%; right: 20%; animation-delay: 2s; }

.scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
}

.mouse {
    width: 24px;
    height: 36px;
    border: 2px solid var(--text-muted);
    border-radius: 12px;
}

@media (max-width: 968px) {
    .hero { padding-top: 60px; }
    .hero-container { grid-template-columns: 1fr; text-align: center; gap: var(--spacing-md); }
    .hero-image { order: -1; margin-bottom: var(--spacing-md); }
    .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0; width: 100%; }
    .hero-buttons, .hero-social { justify-content: center; }
    .hero-description { margin-left: auto; margin-right: auto; max-width: 90%; text-align: center; }
    
    .profile-frame {
        width: 280px;
        height: 280px;
    }
    .image-wrapper {
        height: 350px;
    }
    .image-glow {
        width: 300px;
        height: 300px;
    }
}

@media (max-width: 480px) {
    .hero-title { font-size: 2.5rem; }
    .stat-number { font-size: 2rem; }
    .floating-card { display: none; }
    .profile-frame {
        width: 220px;
        height: 220px;
    }
    .image-wrapper {
        height: 280px;
    }
}
</style>
