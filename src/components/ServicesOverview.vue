<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Services loaded from API (MongoDB)
const apiServices = ref([]);
const isLoading = ref(false);

// Fallback local data in case API fails
const fallbackServices = [
  {
    title: 'Design de Formulários para KoboToolbox',
    titleEn: 'Form Design for KoboToolbox',
    icon: 'fas fa-clipboard-list',
    description: 'Especialista no desenho de formulários avançados em KoboToolbox/XLSForm para recolha de dados de alta qualidade em contextos de pesquisa, monitoria e avaliação.',
    descriptionEn: 'Expert in designing advanced forms in KoboToolbox/XLSForm for high-quality data collection in research, monitoring, and evaluation contexts.',
    features: [
      'Criação de formulários inteligentes com XLSForm',
      'Desenvolvimento de lógica condicional e validações automatizadas',
      'Estruturação de instrumentos complexos para estudos, avaliações e projectos humanitários',
      'Integração de sistemas de recolha de dados com sistemas de MEAL',
      'Formação e supervisão de enumeradores em recolha digital, ética e controlo de qualidade'
    ],
    featuresEn: [
      'Smart form creation with XLSForm',
      'Development of conditional logic and automated validations',
      'Structuring complex instruments for studies, evaluations, and humanitarian projects',
      'Integration of data collection systems with MEAL systems',
      'Training and supervision of enumerators in digital collection, ethics, and quality control'
    ]
  },
  {
    title: 'Sistemas de Monitoria & Avaliação (M&E)',
    titleEn: 'Monitoring & Evaluation Systems (M&E)',
    icon: 'fas fa-chart-line',
    description: 'Desenvolvimento e implementação de sistemas integrados de MEAL para monitorar desempenho, gerar evidências e apoiar decisões estratégicas.',
    descriptionEn: 'Development and implementation of integrated MEAL systems to monitor performance, generate evidence, and support strategic decisions.',
    features: [
      'Desenvolvimento de KPIs e frameworks de desempenho',
      'Sistemas digitais de recolha, gestão e validação de dados',
      'Automatização de dashboards e relatórios analíticos',
      'Configuração de mecanismos de alerta e acompanhamento em tempo real'
    ],
    featuresEn: [
      'Development of KPIs and performance frameworks',
      'Digital systems for data collection, management, and validation',
      'Automation of dashboards and analytical reports',
      'Configuration of alert mechanisms and real-time monitoring'
    ]
  },
  {
    title: 'Data Analysis & Business Intelligence',
    titleEn: 'Data Analysis & Business Intelligence',
    icon: 'fas fa-laptop-code',
    description: 'Análise avançada de dados e criação de dashboards interactivos para geração de insights estratégicos.',
    descriptionEn: 'Advanced data analysis and creation of interactive dashboards to generate strategic insights.',
    features: [
      'Dashboards avançados em Excel',
      'Relatórios interactivos em Power BI',
      'Análise estatística',
      'Visualização estratégica de dados'
    ],
    featuresEn: [
      'Advanced Excel Dashboards',
      'Interactive Power BI Reports',
      'Statistical analysis',
      'Strategic data visualization'
    ]
  },
  {
    title: 'Mentoria em MEAL',
    titleEn: 'MEAL Mentorship',
    icon: 'fas fa-user-friends',
    description: 'Mentoria técnica especializada para profissionais e organizações que procuram fortalecer competências em Monitoria, Avaliação, Accountability e Aprendizagem.',
    descriptionEn: 'Specialized technical mentorship for professionals and organizations seeking to strengthen skills in Monitoring, Evaluation, Accountability, and Learning.',
    features: [
      'Mentoria individual',
      'Capacitação prática de equipas',
      'Apoio no desenho e fortalecimento de sistemas de MEAL',
      'Acompanhamento técnico contínuo'
    ],
    featuresEn: [
      'Individual mentorship',
      'Practical team training',
      'Support in the design and strengthening of MEAL systems',
      'Continuous technical guidance'
    ]
  },
  {
    title: 'Consultorias Especializadas',
    titleEn: 'Specialized Consultancies',
    icon: 'fas fa-briefcase',
    description: 'Serviços completos de consultoria em Monitoria & Avaliação, investigação aplicada e resposta humanitária.',
    descriptionEn: 'Full consulting services in Monitoring & Evaluation, applied research, and humanitarian response.',
    features: [
      'Desenho e condução de avaliações',
      'Desenvolvimento de ferramentas de recolha de dados',
      'Formação de inquiridores',
      'Análise de dados e elaboração de relatórios técnicos',
      'Apoio a projectos de assistência humanitária'
    ],
    featuresEn: [
      'Assessment design and conduct',
      'Development of data collection tools',
      'Enumerator training',
      'Data analysis and preparation of technical reports',
      'Support for humanitarian assistance projects'
    ]
  },
  {
    title: 'Gestão de Programas e Projectos',
    titleEn: 'Program & Project Management',
    icon: 'fas fa-tasks',
    description: 'Coordenação estratégica e operacional de programas e projectos com foco em impacto, eficiência e sustentabilidade.',
    descriptionEn: 'Strategic and operational coordination of programs and projects with a focus on impact, efficiency, and sustainability.',
    features: [
      'Liderança de equipas multidisciplinares',
      'Planeamento estratégico e operacional',
      'Coordenação e acompanhamento de resultados',
      'Gestão de parcerias e articulação institucional',
      'Produção de relatórios institucionais e suporte à tomada de decisão estratégica'
    ],
    featuresEn: [
      'Leadership of multidisciplinary teams',
      'Strategic and operational planning',
      'Coordination and monitoring of results',
      'Partnership management and institutional coordination',
      'Production of institutional reports and strategic decision-making support'
    ]
  }
];

// Fetch services from API
const fetchServices = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get('/api/services');
    if (res.data && res.data.length > 0) {
      apiServices.value = res.data;
    }
  } catch (err) {
    console.warn('Não foi possível carregar serviços da API, usando dados locais.', err.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchServices);

// Use API data if available, otherwise use fallback
const services = computed(() => {
  if (apiServices.value.length > 0) {
    return apiServices.value;
  }
  return fallbackServices;
});

// Helper to get the right text based on language
const getServiceText = (service, field) => {
  const currentLang = localStorage.getItem('language') || 'pt';
  if (currentLang === 'en' && service[field + 'En']) {
    return service[field + 'En'];
  }
  return service[field];
};

const getServiceFeatures = (service) => {
  const currentLang = localStorage.getItem('language') || 'pt';
  if (currentLang === 'en' && service.featuresEn && service.featuresEn.length > 0) {
    return service.featuresEn;
  }
  return service.features || [];
};
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
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>A carregar serviços...</p>
        </div>

        <div
          v-for="(service, index) in services"
          :key="index"
          class="overview-card glass-card reveal-item"
        >
          <div class="overview-icon-container">
            <div class="overview-icon">
              <i :class="service.icon || 'fas fa-chart-line'"></i>
            </div>
          </div>
          <h3>{{ getServiceText(service, 'title') }}</h3>
          <p class="service-desc">
            {{ getServiceText(service, 'description') }}
          </p>
          <ul class="service-bullets">
            <li v-for="(feature, idx) in getServiceFeatures(service)" :key="idx">
              <i class="fas fa-check-circle"></i> {{ feature }}
            </li>
          </ul>
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: var(--spacing-lg);
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 1.75rem 1.5rem;
  transition: all 0.4s ease;
  height: 100%;
}

.overview-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(255, 123, 26, 0.25);
}

.overview-icon-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1rem;
}

.overview-icon {
  width: 52px;
  height: 52px;
  background: var(--gradient-1);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 8px 16px rgba(255, 123, 26, 0.25);
}

.overview-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  width: 100%;
  text-align: center;
}

.service-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
}

.service-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  width: 100%;
}

.service-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.service-bullets li i {
  color: var(--primary-color);
  margin-top: 0.15rem;
  font-size: 0.8rem;
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

.loading-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-subtle);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
