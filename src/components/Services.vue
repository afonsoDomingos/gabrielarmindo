<script setup>
import { ref } from 'vue';

const isMZN = ref(false);
const EXCHANGE_RATE = 64;

const investmentPlans = ref([
  {
    title: 'Consultoria M&E',
    priceMin: 200,
    priceMax: 300,
    frequency: 'Por dia / Consultoria',
    features: [
      'Desenho e condução de avaliações',
      'Propostas técnicas e financeiras',
      'Treinamento de inquiridores',
      'Análise de dados',
      'Produção de relatórios'
    ],
    cta: 'Solicitar Orçamento',
    popular: false
  },
  {
    title: 'Sistema M&E Completo',
    priceMin: 94,
    priceMax: null,
    frequency: 'Por projeto / 2-3 meses',
    features: [
      'Sistema M&E personalizado',
      'Formulários KoboToolbox',
      'Dashboard Power BI/Excel',
      'Treinamento da equipe',
      'Suporte por 3 meses'
    ],
    cta: 'Começar Projeto',
    popular: true
  },
  {
    title: 'M&E Mentorship',
    priceMin: 31,
    priceMax: null,
    frequency: 'Por mês / Mínimo 4 sessões',
    features: [
      '4+ sessões mensais',
      'Desenvolvimento de capacidades',
      'Suporte via WhatsApp',
      'Templates M&E e ferramentas',
      'Revisão de documentos'
    ],
    cta: 'Começar Mentoria',
    popular: false
  },
  {
    title: 'Esclarecimentos M&E',
    priceMin: 8,
    priceMax: null,
    frequency: 'Por hora / Sessão',
    features: [
      'Dúvidas sobre metodologias M&E',
      'Orientação em projetos',
      'Suporte técnico pontual',
      'Consulta via chamada/video'
    ],
    cta: 'Agendar Sessão',
    popular: false
  },
  {
    title: 'Revisão de CVs',
    priceMin: 8,
    priceMax: null,
    frequency: 'Por CV / Entrega em 72h',
    features: [
      'Revisão completa do CV',
      'Otimização para área M&E',
      'Sugestões de melhorias',
      'Formatação profissional'
    ],
    cta: 'Enviar CV',
    popular: false
  },
  {
    title: 'Criação de Dashboards com efeito UAU',
    priceMin: 100,
    priceMax: 1000,
    frequency: 'Por projeto / escopo sob medida',
    features: [
      'Design profissional em Power BI e Excel',
      'Integração de fontes de dados',
      'KPIs claros e interatividade',
      'Suporte opcional de ajustes'
    ],
    cta: 'Começar Projeto',
    popular: false
  }
]);

const formatValue = (val) => {
  if (!val) return '';
  const converted = isMZN.value ? val * EXCHANGE_RATE : val;
  return new Intl.NumberFormat('pt-MZ').format(converted);
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
        <span class="section-tag">Investimento</span>
        <h2 class="section-title">Pacotes personalizados para suas necessidades</h2>
        <p class="section-subtitle">Escolha o plano ideal para transformar seus dados em decisões inteligentes.</p>
        
        <div class="currency-toggle">
          <button @click="isMZN = false" :class="{ 'active': !isMZN }">USD ($)</button>
          <button @click="isMZN = true" :class="{ 'active': isMZN }">MZN (MT)</button>
        </div>
      </div>

      <div class="services-grid reveal-container">
        <div 
          v-for="(plan, index) in investmentPlans" 
          :key="index" 
          class="service-card glass-card reveal-item"
          :class="{ 'popular-card': plan.popular }"
        >
          <div v-if="plan.popular" class="popular-badge">Mais Popular</div>
          
          <div class="card-head">
            <h3 class="service-title">{{ plan.title }}</h3>
            <div class="price-container">
              <span class="currency">{{ isMZN ? 'MT' : '$' }}</span>
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
