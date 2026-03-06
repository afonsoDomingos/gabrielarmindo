<template>

  <section class="skills section" id="skills">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Competências</span>
        <h2 class="section-title">Habilidades Técnicas</h2>
      </div>

      <div class="skills-grid reveal-container">
        <div class="skill-category">
          <h3><i class="fas fa-tools"></i> Ferramentas</h3>
          <div class="tech-grid">
            <div class="tech-item glass-card reveal-item"><i class="fas fa-database"></i><span>Power BI</span></div>
            <div class="tech-item glass-card reveal-item"><i class="fas fa-chart-bar"></i><span>SPSS</span></div>
            <div class="tech-item glass-card reveal-item"><i class="fas fa-file-excel"></i><span>Excel Avançado</span></div>
            <div class="tech-item glass-card reveal-item"><i class="fas fa-project-diagram"></i><span>KoboToolbox</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.experience-card {
    padding: var(--spacing-md);
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
}

.exp-icon {
    font-size: 2rem;
    color: var(--primary-color);
}

.skills { background: var(--bg-secondary); }
.tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.tech-item {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    transition: 0.3s;
}

.tech-item:hover { color: var(--primary-color); transform: translateY(-3px); }
.tech-item i { font-size: 2rem; }

@media (max-width: 768px) {
    .experience-grid {
        grid-template-columns: 1fr;
    }
    
    .experience-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
}
</style>
