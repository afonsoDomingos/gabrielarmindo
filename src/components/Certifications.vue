<script setup>
import { computed } from 'vue';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const certifications = computed(() => [
  {
    category: t('Gestão de Projectos & M&A', 'Project Management & M&E'),
    items: [
      { title: t('Certificação em MEAL para Desenvolvimento', 'Certification in MEAL for Development'), issuer: 'Humanitarian Leadership Academy' },
      { title: t('Certificação em Monitoria e Avaliação de Projectos', 'Certification in Project Monitoring and Evaluation'), issuer: 'SentiPensar' },
      { title: t('Certificação em Teoria da Mudança', 'Certification in Theory of Change'), issuer: 'SentiPensar' }
    ]
  },
  {
    category: t('Análise de dados & BI', 'Data Analysis & BI'),
    items: [
      { title: t('Certificação em Data Analytics Essentials', 'Certification in Data Analytics Essentials'), issuer: 'Cisco Networking Academy' },
      { title: t('Extensão Universitária em Gestão e Análise de Dados com KoboToolbox, Excel, Power BI, SPSS e R', 'University Extension in Data Management and Analysis with KoboToolbox, Excel, Power BI, SPSS and R'), issuer: 'Corporate Business School' },
      { title: t('Certificação em Power BI – Business Intelligence', 'Certification in Power BI – Business Intelligence'), issuer: 'Expert Cursos' },
      { title: t('Certificação em Excel: Do Zero ao Avançado', 'Certification in Excel: Zero to Advanced'), issuer: 'EvolutionTech Training' },
      { title: t('Certificação em Análise de Dados com Excel', 'Certification in Data Analysis with Excel'), issuer: 'EvolutionTech Training' }
    ]
  }
]);
</script>

<template>
  <section class="certifications section" id="certifications">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">{{ t('Qualificações', 'Qualifications') }}</span>
        <h2 class="section-title">{{ t('Certificações & Treinamentos', 'Certifications & Training') }}</h2>
      </div>

      <div class="cert-grid">
        <div v-for="(cat, index) in certifications" :key="index" class="cert-category reveal" :style="{ transitionDelay: (index * 0.2) + 's' }">
          <h3 class="cat-title">
            <i :class="index === 0 ? 'fas fa-tasks' : 'fas fa-chart-pie'"></i>
            {{ cat.category }}
          </h3>
          <div class="cert-list">
            <div v-for="(cert, i) in cat.items" :key="i" class="cert-item glass-card reveal-item">
              <div class="cert-thumb">
                <i class="fas fa-certificate"></i>
              </div>
              <div class="cert-info">
                <h4>{{ cert.title }}</h4>
                <span>{{ cert.issuer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.certifications {
  background: var(--bg-primary);
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: var(--spacing-lg);
}

.cat-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-family: var(--font-accent);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.cat-title i {
  color: var(--primary-color);
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all var(--transition-normal);
}

.cert-item:hover {
  transform: translateX(10px);
}

.cert-thumb {
  width: 50px;
  height: 50px;
  background: rgba(255, 123, 26, 0.1);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.cert-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.cert-info span {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: var(--text-muted);
  font-weight: 500;
}

@media (max-width: 768px) {
  .cert-grid {
    grid-template-columns: 1fr;
  }
}
</style>
