<script setup>
</script>

<template>
  <section class="services-overview section" id="services-overview">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">O que ofereço</span>
        <h2 class="section-title">Conheça os Meus Serviços</h2>
        <p class="section-subtitle">
          Soluções estratégicas em monitoria, avaliação e análise de dados para transformar o impacto da sua organização.
        </p>
      </div>

      <div class="services-overview-grid reveal-container">
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-search-location"></i>
          </div>
          <h3>Monitoria e Avaliação (M&E)</h3>
          <p>
            Desenho e implementação de sistemas de M&E, matrizes de indicadores e planos de prestação de contas (MEAL).
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-chart-pie"></i>
          </div>
          <h3>Análise de Dados e BI</h3>
          <p>
            Criação de dashboards dinâmicos no Power BI, análises estatísticas no SPSS e Excel para suporte à tomada de decisão.
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <h3>Gestão de Projectos</h3>
          <p>
            Liderança e apoio estratégico na implementação de projectos de assistência humanitária e desenvolvimento.
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-file-invoice"></i>
          </div>
          <h3>Desenho de Formulários</h3>
          <p>
            Desenvolvimento de formulários digitais avançados no KoboToolbox com lógica de salto e validações complexas.
          </p>
        </div>
      </div>

      <div class="services-action text-center reveal">
        <a href="#services" class="btn btn-primary">
          <span>Ver Planos e Preços</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-overview {
  background-color: var(--bg-secondary);
}

.section-subtitle {
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
  color: var(--text-secondary);
}

.services-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.overview-card {
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-md);
}

.overview-icon {
  width: 70px;
  height: 70px;
  background: var(--gradient-1);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 20px rgba(var(--primary-hue), 90%, 50%, 0.2);
}

.overview-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-family: var(--font-accent);
}

.overview-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.services-action {
  margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .services-overview-grid {
    grid-template-columns: 1fr;
    max-width: 450px;
    margin: 0 auto var(--spacing-lg);
  }
}
</style>
