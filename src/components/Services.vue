<script setup>
import { ref, computed } from 'vue';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const selectedCurrency = ref('USD'); // 'USD', 'MZN', 'EUR'

const RATES = {
  USD: 1,
  MZN: 64,
  EUR: 0.95
};

const SYMBOLS = {
  USD: '$',
  MZN: 'MT',
  EUR: '€'
};

const investmentPlans = computed(() => [
  {
    title: t('Consultoria M&E', 'M&E Consultancy'),
    priceMin: 200,
    priceMax: 300,
    frequency: t('Por dia / Consultoria', 'Per day / Consultancy'),
    features: [
      t('Desenho e condução de avaliações', 'Assessment design and conduct'),
      t('Propostas técnicas e financeiras', 'Technical and financial proposals'),
      t('Treinamento de inquiridores', 'Enumerator training'),
      t('Análise de dados', 'Data analysis'),
      t('Produção de relatórios', 'Report generation')
    ],
    cta: t('Solicitar Orçamento', 'Request Quote'),
    popular: false
  },
  {
    title: t('Sistema M&E Completo', 'Complete M&E System'),
    priceMin: 94,
    priceMax: null,
    frequency: t('Por projeto / 2-3 meses', 'Per project / 2-3 months'),
    features: [
      t('Sistema M&E personalizado', 'Custom M&E system'),
      t('Formulários KoboToolbox', 'KoboToolbox forms'),
      t('Dashboard Power BI/Excel', 'Power BI/Excel Dashboard'),
      t('Treinamento da equipe', 'Team training'),
      t('Suporte por 3 meses', '3-month support')
    ],
    cta: t('Começar Projeto', 'Start Project'),
    popular: true
  },
  {
    title: t('M&E Mentorship', 'M&E Mentorship'),
    priceMin: 31,
    priceMax: null,
    frequency: t('Por mês / Mínimo 4 sessões', 'Per month / Min. 4 sessions'),
    features: [
      t('4+ sessões mensais', '4+ monthly sessions'),
      t('Desenvolvimento de capacidades', 'Capacity building'),
      t('Suporte via WhatsApp', 'WhatsApp support'),
      t('Templates M&E e ferramentas', 'M&E templates and tools'),
      t('Revisão de documentos', 'Document review')
    ],
    cta: t('Começar Mentoria', 'Start Mentorship'),
    popular: false
  },
  {
    title: t('Esclarecimentos M&E', 'M&E Clarifications'),
    priceMin: 8,
    priceMax: null,
    frequency: t('Por hora / Sessão', 'Per hour / Session'),
    features: [
      t('Dúvidas sobre metodologias M&E', 'M&E methodology doubts'),
      t('Orientação em projetos', 'Project guidance'),
      t('Suporte técnico pontual', 'Ad-hoc technical support'),
      t('Consulta via chamada/video', 'Consultation via call/video')
    ],
    cta: t('Agendar Sessão', 'Schedule Session'),
    popular: false
  },
  {
    title: t('Revisão de CVs', 'CV Review'),
    priceMin: 8,
    priceMax: null,
    frequency: t('Por CV / Entrega em 72h', 'Per CV / 72h delivery'),
    features: [
      t('Revisão completa do CV', 'Complete CV review'),
      t('Otimização para área M&E', 'M&E optimization'),
      t('Sugestões de melhorias', 'Improvement suggestions'),
      t('Formatação profissional', 'Professional formatting')
    ],
    cta: t('Enviar CV', 'Send CV'),
    popular: false
  },
  {
    title: t('Criação de Dashboards com efeito UAU', 'Create UAU Effect Dashboards'),
    priceMin: 100,
    priceMax: 1000,
    frequency: t('Por projeto / escopo sob medida', 'Per project / tailor-made scope'),
    features: [
      t('Design profissional em Power BI e Excel', 'Professional Power BI and Excel design'),
      t('Integração de fontes de dados', 'Data source integration'),
      t('KPIs claros e interatividade', 'Clear KPIs and interactivity'),
      t('Suporte opcional de ajustes', 'Optional adjustment support')
    ],
    cta: t('Começar Projeto', 'Start Project'),
    popular: false
  }
]);

const formatValue = (val) => {
  if (!val) return '';
  const converted = val * RATES[selectedCurrency.value];
  
  const locale = selectedCurrency.value === 'MZN' ? 'pt-MZ' : 
                 selectedCurrency.value === 'EUR' ? 'de-DE' : 'en-US';
                 
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(converted);
};

const getDisplayPrice = (plan) => {
  const min = formatValue(plan.priceMin);
  const max = plan.priceMax ? formatValue(plan.priceMax) : null;
  return max ? `${min}-${max}` : min;
};
</script>

<template>
  <section class="services section" id="services">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">{{ t('Investimento', 'Investment') }}</span>
        <h2 class="section-title">{{ t('Pacotes personalizados para suas necessidades', 'Custom packages for your needs') }}</h2>
        <p class="section-subtitle">{{ t('Escolha o plano ideal para transformar seus dados em decisões inteligentes.', 'Choose the ideal plan to transform your data into smart decisions.') }}</p>
        
        <div class="currency-toggle">
          <button @click="selectedCurrency = 'USD'" :class="{ 'active': selectedCurrency === 'USD' }">USD ($)</button>
          <button @click="selectedCurrency = 'MZN'" :class="{ 'active': selectedCurrency === 'MZN' }">MZN (MT)</button>
          <button @click="selectedCurrency = 'EUR'" :class="{ 'active': selectedCurrency === 'EUR' }">EUR (€)</button>
        </div>
      </div>

      <div class="services-grid reveal-container">
        <div 
          v-for="(plan, index) in investmentPlans" 
          :key="index" 
          class="service-card glass-card reveal-item"
          :class="{ 'popular-card': plan.popular }"
        >
          <div v-if="plan.popular" class="popular-badge">{{ t('Mais Popular', 'Most Popular') }}</div>
          
          <div class="card-head">
            <h3 class="service-title">{{ plan.title }}</h3>
            <div class="price-container">
              <span class="currency">{{ SYMBOLS[selectedCurrency] }}</span>
              <span class="price-value" :class="{ 'range': plan.priceMax }">{{ getDisplayPrice(plan) }}</span>
            </div>
            <p class="frequency">{{ plan.frequency }}</p>
          </div>
          
          <ul class="service-features">
            <li v-for="(feature, idx) in plan.features" :key="idx">
              <i class="fas fa-check-circle"></i> {{ feature }}
            </li>
          </ul>
          
          <a href="#contacto" class="btn" :class="plan.popular ? 'btn-primary' : 'btn-outline'">
            {{ plan.cta }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background-color: var(--bg-primary);
}

.section-subtitle {
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
  color: var(--text-secondary);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding-top: 2rem;
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: white;
  border: 1px solid rgba(0,0,0,0.05);
}

.popular-card {
  border: 2px solid var(--primary-color);
  transform: scale(1.05);
  z-index: 2;
  box-shadow: 0 20px 40px rgba(44, 82, 130, 0.15);
}

.popular-badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--gradient-1);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 10px 20px rgba(44, 82, 130, 0.3);
}

.card-head {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #edf2f7;
}

.service-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.price-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
  margin-right: 0.2rem;
}

.price-value {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
}

.frequency {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.service-features {
  margin-bottom: 2.5rem;
  flex: 1;
  list-style: none;
  padding: 0;
}

.service-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4a5568;
}

.service-features li i {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.btn {
  width: 100%;
  justify-content: center;
  padding: 1.25rem;
  font-weight: 700;
  border-radius: var(--radius-md);
}

.btn-outline {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 968px) {
  .popular-card {
    transform: none;
    margin: 1rem 0;
  }
}

@media (max-width: 480px) {
  .price-value {
    font-size: 2.22rem;
  }
  .service-card {
    padding: 2rem 1.5rem;
  }
}

/* Currency Toggle Styles */
.currency-toggle {
  display: inline-flex;
  background: var(--bg-tertiary);
  padding: 4px;
  border-radius: 50px;
  margin-top: 1rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.currency-toggle button {
  padding: 0.6rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.currency-toggle button.active {
  background: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.price-value.range {
  font-size: 2.2rem;
}
</style>
