<script setup>
import { useLanguage } from '../store/language';
const { t } = useLanguage();
</script>

<template>
  <section class="services-overview section" id="services-overview">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">{{ t('O que ofereço', 'What I offer') }}</span>
        <h2 class="section-title">{{ t('Conheça os Meus Serviços', 'Meet My Services') }}</h2>
        <p class="section-subtitle">
          {{ t('Soluções estratégicas em monitoria, avaliação e análise de dados para transformar o impacto da sua organização.', 'Strategic solutions in monitoring, evaluation and data analysis to transform your organization\'s impact.') }}
        </p>
      </div>

      <div class="services-overview-grid reveal-container">
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-search-location"></i>
          </div>
          <h3>{{ t('Monitoria e Avaliação (M&E)', 'Monitoring and Evaluation (M&E)') }}</h3>
          <p>
            {{ t('Desenho e implementação de sistemas de M&E, matrizes de indicadores e planos de prestação de contas (MEAL).', 'Design and implementation of M&E systems, indicator matrices and accountability plans (MEAL).') }}
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-chart-pie"></i>
          </div>
          <h3>{{ t('Análise de Dados e BI', 'Data Analysis and BI') }}</h3>
          <p>
            {{ t('Criação de dashboards dinâmicos no Power BI, análises estatísticas no SPSS e Excel para suporte à tomada de decisão.', 'Creation of dynamic dashboards in Power BI, statistical analysis in SPSS and Excel for decision support.') }}
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <h3>{{ t('Gestão de Projectos', 'Project Management') }}</h3>
          <p>
            {{ t('Liderança e apoio estratégico na implementação de projectos de assistência humanitária e desenvolvimento.', 'Leadership and strategic support in the implementation of humanitarian assistance and development projects.') }}
          </p>
        </div>

        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon">
            <i class="fas fa-file-invoice"></i>
          </div>
          <h3>{{ t('Desenho de Formulários', 'Form Design') }}</h3>
          <p>
            {{ t('Desenvolvimento de formulários digitais avançados no KoboToolbox com lógica de salto e validações complexas.', 'Development of advanced digital forms in KoboToolbox with skip logic and complex validations.') }}
          </p>
        </div>
      </div>

      <div class="services-action text-center reveal">
        <a href="#services" class="btn btn-primary">
          <span>{{ t('Ver Planos e Preços', 'View Plans and Pricing') }}</span>
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
