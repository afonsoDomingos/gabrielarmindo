<template>
  <section class="experience section" id="experience">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Trajetória</span>
        <h2 class="section-title">Experiência Profissional</h2>
      </div>

      <div class="experience-grid">
        <div class="experience-card reveal-left">
          <div class="exp-icon"><i class="fas fa-briefcase"></i></div>
          <h3>MEAL Officer</h3>
          <p>Liderança em sistemas de monitoria e avaliação para projetos de impacto social e desenvolvimento comunitário.</p>
        </div>
        <div class="experience-card reveal-right">
          <div class="exp-icon"><i class="fas fa-chart-line"></i></div>
          <h3>Analista de Dados</h3>
          <p>Transformação de dados complexos em insights acionáveis para tomada de decisão estratégica.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="skills section" id="skills">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Competências</span>
        <h2 class="section-title">Habilidades Técnicas</h2>
      </div>

      <div class="skills-grid reveal">
        <div class="skill-category">
          <h3><i class="fas fa-tools"></i> Ferramentas</h3>
          <div class="tech-grid">
            <div class="tech-item reveal-item"><i class="fas fa-database"></i><span>Power BI</span></div>
            <div class="tech-item reveal-item"><i class="fas fa-chart-bar"></i><span>SPSS</span></div>
            <div class="tech-item reveal-item"><i class="fas fa-file-excel"></i><span>Excel Avançado</span></div>
            <div class="tech-item reveal-item"><i class="fas fa-project-diagram"></i><span>KoboToolbox</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills { background: var(--bg-secondary); }
.tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.tech-item {
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    transition: 0.3s;
}

.tech-item:hover { color: var(--primary-color); transform: translateY(-3px); }
.tech-item i { font-size: 2rem; }
</style>
