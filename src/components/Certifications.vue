<script setup>
import { ref, onMounted } from 'vue';

const certifications = ref([
  {
    category: 'Gestão de Projectos & M&A',
    items: [
      { title: 'MEAL para Desenvolvimento', issuer: 'Humanitarian Leadership Academy' },
      { title: 'Monitoria e Avaliacao de projectos', issuer: 'SentiPensar' },
      { title: 'Teoria de Mudanca', issuer: 'SentiPensar' }
    ]
  },
  {
    category: 'Análise de dados & BI',
    items: [
      { title: 'Data Analytics Essentials Course', issuer: 'CISCO Networking Academy' },
      { title: 'Gestao e Analise de Dados (Kobotoolbox, Excel, Power Bi, SPSS, R)', issuer: 'CBS (Extensão Univ.)' },
      { title: 'Power BI - Business Intelligence', issuer: 'Expert Cursos' },
      { title: 'Excel: Do Zero ao Avançado', issuer: 'EvolutionTech Training' },
      { title: 'Análise de dados com Excel', issuer: 'Excel BlackBelt' }
    ]
  }
]);
</script>

<template>
  <section class="certifications section" id="certifications">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Qualificações</span>
        <h2 class="section-title">Certificações & Treinamentos</h2>
      </div>

      <div class="cert-grid">
        <div v-for="(cat, index) in certifications" :key="index" class="cert-category reveal" :style="{ transitionDelay: (index * 0.2) + 's' }">
          <h3 class="cat-title">
            <i :class="index === 0 ? 'fas fa-tasks' : 'fas fa-chart-pie'"></i>
            {{ cat.category }}
          </h3>
          <div class="cert-list">
            <div v-for="(cert, i) in cat.items" :key="i" class="cert-item">
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
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.cert-item:hover {
  transform: translateX(10px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
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
