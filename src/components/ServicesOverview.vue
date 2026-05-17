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
        <!-- Service 1: KoboToolbox -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
          </div>
          <h3>{{ t('Design de Formulários para KoboToolbox', 'Form Design for KoboToolbox') }}</h3>
          <p class="service-desc">
            {{ t('Especialista no desenho de formulários avançados em KoboToolbox/XLSForm para recolha de dados de alta qualidade em contextos de pesquisa, monitoria e avaliação.', 'Expert in designing advanced forms in KoboToolbox/XLSForm for high-quality data collection in research, monitoring, and evaluation contexts.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Criação de formulários inteligentes com XLSForm', 'Smart form creation with XLSForm') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Desenvolvimento de lógica condicional e validações automatizadas', 'Development of conditional logic and automated validations') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Estruturação de instrumentos complexos para estudos, avaliações e projectos humanitários', 'Structuring complex instruments for studies, evaluations, and humanitarian projects') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Integração de sistemas de recolha de dados com sistemas de MEAL', 'Integration of data collection systems with MEAL systems') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Formação e supervisão de enumeradores em recolha digital, ética e controlo de qualidade', 'Training and supervision of enumerators in digital collection, ethics, and quality control') }}</li>
          </ul>
        </div>

        <!-- Service 2: M&E Systems -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-chart-line"></i>
            </div>
          </div>
          <h3>{{ t('Sistemas de Monitoria & Avaliação (M&E)', 'Monitoring & Evaluation Systems (M&E)') }}</h3>
          <p class="service-desc">
            {{ t('Desenvolvimento e implementação de sistemas integrados de MEAL para monitorar desempenho, gerar evidências e apoiar decisões estratégicas.', 'Development and implementation of integrated MEAL systems to monitor performance, generate evidence, and support strategic decisions.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Desenvolvimento de KPIs e frameworks de desempenho', 'Development of KPIs and performance frameworks') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Sistemas digitais de recolha, gestão e validação de dados', 'Digital systems for data collection, management, and validation') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Automatização de dashboards e relatórios analíticos', 'Automation of dashboards and analytical reports') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Configuração de mecanismos de alerta e acompanhamento em tempo real', 'Configuration of alert mechanisms and real-time monitoring') }}</li>
          </ul>
        </div>

        <!-- Service 3: Data Analysis & BI -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-laptop-code"></i>
            </div>
          </div>
          <h3>Data Analysis & Business Intelligence</h3>
          <p class="service-desc">
            {{ t('Análise avançada de dados e criação de dashboards interactivos para geração de insights estratégicos.', 'Advanced data analysis and creation of interactive dashboards to generate strategic insights.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Dashboards avançados em Excel', 'Advanced Excel Dashboards') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Relatórios interactivos em Power BI', 'Interactive Power BI Reports') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Análise estatística', 'Statistical analysis') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Visualização estratégica de dados', 'Strategic data visualization') }}</li>
          </ul>
        </div>

        <!-- Service 4: Mentorship -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-user-friends"></i>
            </div>
          </div>
          <h3>{{ t('Mentoria em MEAL', 'MEAL Mentorship') }}</h3>
          <p class="service-desc">
            {{ t('Mentoria técnica especializada para profissionais e organizações que procuram fortalecer competências em Monitoria, Avaliação, Accountability e Aprendizagem.', 'Specialized technical mentorship for professionals and organizations seeking to strengthen skills in Monitoring, Evaluation, Accountability, and Learning.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Mentoria individual', 'Individual mentorship') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Capacitação prática de equipas', 'Practical team training') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Apoio no desenho e fortalecimento de sistemas de MEAL', 'Support in the design and strengthening of MEAL systems') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Acompanhamento técnico contínuo', 'Continuous technical guidance') }}</li>
          </ul>
        </div>

        <!-- Service 5: Specialized Consultancies -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-briefcase"></i>
            </div>
          </div>
          <h3>{{ t('Consultorias Especializadas', 'Specialized Consultancies') }}</h3>
          <p class="service-desc">
            {{ t('Serviços completos de consultoria em Monitoria & Avaliação, investigação aplicada e resposta humanitária.', 'Full consulting services in Monitoring & Evaluation, applied research, and humanitarian response.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Desenho e condução de avaliações', 'Assessment design and conduct') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Desenvolvimento de ferramentas de recolha de dados', 'Development of data collection tools') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Formação de inquiridores', 'Enumerator training') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Análise de dados e elaboração de relatórios técnicos', 'Data analysis and preparation of technical reports') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Apoio a projectos de assistência humanitária', 'Support for humanitarian assistance projects') }}</li>
          </ul>
        </div>

        <!-- Service 6: Project Management -->
        <div class="overview-card glass-card reveal-item">
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i class="fas fa-tasks"></i>
            </div>
          </div>
          <h3>{{ t('Gestão de Programas e Projectos', 'Program & Project Management') }}</h3>
          <p class="service-desc">
            {{ t('Coordenação estratégica e operacional de programas e projectos com foco em impacto, eficiência e sustentabilidade.', 'Strategic and operational coordination of programs and projects with a focus on impact, efficiency, and sustainability.') }}
          </p>
          <ul class="service-bullets">
            <li><i class="fas fa-check-circle"></i> {{ t('Liderança de equipas multidisciplinares', 'Leadership of multidisciplinary teams') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Planeamento estratégico e operacional', 'Strategic and operational planning') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Coordenação e acompanhamento de resultados', 'Coordination and monitoring of results') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Gestão de parcerias e articulação institucional', 'Partnership management and institutional coordination') }}</li>
            <li><i class="fas fa-check-circle"></i> {{ t('Produção de relatórios institucionais e suporte à tomada de decisão estratégica', 'Production of institutional reports and strategic decision-making support') }}</li>
          </ul>
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: var(--spacing-lg);
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 2.5rem 2rem;
  transition: all 0.4s ease;
  height: 100%;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(43, 108, 176, 0.2);
}

.overview-icon-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.overview-icon {
  width: 64px;
  height: 64px;
  background: var(--gradient-1);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 8px 16px rgba(43, 108, 176, 0.2);
}

.overview-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  width: 100%;
  text-align: center;
}

.service-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
  width: 100%;
}

.service-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  width: 100%;
}

.service-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.service-bullets li i {
  color: var(--primary-color);
  margin-top: 0.2rem;
  font-size: 0.9rem;
  flex-shrink: 0;
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
