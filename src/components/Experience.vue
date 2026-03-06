<template>
  <section class="experience section" id="experience">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Trajetória</span>
        <h2 class="section-title">Experiência Profissional</h2>
      </div>

      <div class="experience-grid">
        <div class="experience-card glass-card reveal-left">
          <div class="exp-icon"><i class="fas fa-briefcase"></i></div>
          <h3>MEAL Officer</h3>
          <p>Liderança em sistemas de monitoria e avaliação para projetos de impacto social e desenvolvimento comunitário.</p>
        </div>
        <div class="experience-card glass-card reveal-right">
          <div class="exp-icon"><i class="fas fa-chart-line"></i></div>
          <h3>Analista de Dados</h3>
          <p>Transformação de dados complexos em insights acionáveis para tomada de decisão estratégica.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-md);
}

.experience-card {
    transition: 0.3s;
}

.experience-card:hover {
    transform: translateY(-5px);
}

.exp-icon {
    width: 64px; height: 64px;
    background: var(--gradient-1);
    color: white;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; margin-bottom: 1.5rem;
}
</style>
