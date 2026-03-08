<script setup>
import { ref } from 'vue';

const activeTab = ref('description');

const tabs = [
  { id: 'description', label: 'Descrição' },
  { id: 'education', label: 'Formação e Certificação' },
  { id: 'skills', label: 'Competências' },
  { id: 'experience', label: 'Experiência' },
  { id: 'studies', label: 'Estudos' }
];

const certifications = [
  { title: 'MEAL para Desenvolvimento', issuer: 'Humanitarian Leadership Academy' },
  { title: 'Monitoria e Avaliação de projectos', issuer: 'SentiPensar' },
  { title: 'Teoria de Mudança', issuer: 'SentiPensar' },
  { title: 'Data Analytics Essentials Course', issuer: 'CISCO Networking Academy' },
  { title: 'Gestão e Análise de Dados', issuer: 'CBS (Extensão Univ.)' },
  { title: 'Power BI - Business Intelligence', issuer: 'Expert Cursos' },
  { title: 'Excel: Do Zero ao Avançado', issuer: 'EvolutionTech Training' }
];

const experiences = ref([
  {
    role: 'Director de Programas',
    company: 'Innovation and Solutions, Moçambique',
    period: '05/2025 - Presente',
    desc: 'Gestão estratégica de programas, coordenação de equipas, elaboração de propostas técnicas, garantia de qualidade e supervisão de relatórios, Monitoria e Avaliação.'
  },
  {
    role: 'Consultor de M&E',
    company: 'CCA - Consulting and Coaching Agency',
    period: '09/2025 - Presente',
    desc: 'Criação de cursos em M&E, Excel, Análise de Dados, KoboToolbox. Desenvolvimento de dashboards profissionais e formações especializadas.'
  },
  {
    role: 'Docente',
    company: 'Instituto Superior de Ciências Empresariais e Tecnológicas, Moçambique',
    period: '11/2025 - Actualmente',
    tag: 'TEMPO PARCIAL',
    desc: 'Docente no curso de Monitoria e Avaliação & Análise de Dados.'
  }
]);
</script>

<template>
  <section class="resume-tabs section" id="resume">
    <div class="container">
      <div class="tabs-container reveal">
        <div class="tabs-header glass-card">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="tab-btn"
            :class="{ 'active': activeTab === tab.id }"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tabs-content">
          <!-- Descrição -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeTab === 'description'" class="tab-pane" key="desc">
              <div class="description-grid">
                <div class="desc-text text-left">
                  <p>
                    Sou um profissional dedicado à área de Pesquisa e Análise de Dados, com sólida experiência em Monitoria e Avaliação (M&E) e Gestão de Projectos. Minha abordagem combina rigor metodológico com inovação tecnológica para impulsionar a eficiência e o impacto organizacional.
                  </p>
                  <p>
                    Especialista em integrar abordagens sensíveis ao género, inclusão e proteção em contextos complexos e humanitários, garantindo que a tomada de decisão seja sempre baseada em evidências robustas.
                  </p>
                </div>
              </div>
            </div>

            <!-- Formação e Certificação -->
            <div v-else-if="activeTab === 'education'" class="tab-pane" key="edu">
              <div class="education-section">
                <h3 class="pane-title">Certificações & Formações</h3>
                <p class="pane-subtitle">Minha trajetória acadêmica e técnica em M&E e Análise de Dados.</p>
                
                <div class="cert-category-grid">
                  <!-- Gestao de projectos & M&A -->
                  <div class="cert-category">
                    <h4 class="category-title"><i class="fas fa-tasks"></i> Gestão de Projectos & M&A</h4>
                    <div class="cert-list">
                      <div class="cert-item glass-card">
                        <h5>MEAL para Desenvolvimento</h5>
                        <p class="issuer">Humanitarian Leadership Academy</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Monitoria e Avaliação de projectos</h5>
                        <p class="issuer">SentiPensar</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Teoria de Mudança</h5>
                        <p class="issuer">SentiPensar</p>
                      </div>
                    </div>
                  </div>

                  <!-- Analise de dados & BI -->
                  <div class="cert-category">
                    <h4 class="category-title"><i class="fas fa-chart-line"></i> Análise de Dados & BI</h4>
                    <div class="cert-list">
                      <div class="cert-item glass-card">
                        <h5>Data Analytics Essentials Course</h5>
                        <p class="issuer">CISCO Networking Academy</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Extensão Universitária em Gestão e Análise de Dados com Kobotoolbox, Excel, Power Bi, SPSS e R</h5>
                        <p class="issuer">CBS</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Power BI - Business Intelligence</h5>
                        <p class="issuer">Expert Cursos</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Excel: Do Zero ao Avançado</h5>
                        <p class="issuer">EvolutionTech Training</p>
                      </div>
                      <div class="cert-item glass-card">
                        <h5>Análise de dados com Excel</h5>
                        <p class="issuer">Excel BlackBelt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Competências -->
            <div v-else-if="activeTab === 'skills'" class="tab-pane" key="skills">
              <div class="skills-split-grid">
                <!-- Coluna Esquerda: Progress Bars -->
                <div class="skills-progress-col">
                  <h3>Especialista em M&E,<br>KoboToolbox e Análise de Dados</h3>
                  <p class="skills-intro-text">
                    Mais de 10 anos de experiência em Monitoria e Avaliação, com expertise comprovada em KoboToolbox, Excel Avançado, Power BI e gestão de programas.
                  </p>
                  
                  <div class="progress-list">
                    <div class="progress-item">
                      <div class="progress-info">
                        <span>KoboToolbox Design</span>
                        <span>95%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 95%"></div>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-info">
                        <span>Excel Avançado</span>
                        <span>90%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 90%"></div>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-info">
                        <span>Sistemas M&E</span>
                        <span>95%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 95%"></div>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-info">
                        <span>Power BI & Data Analysis</span>
                        <span>85%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="progress-item">
                      <div class="progress-info">
                        <span>Program Management</span>
                        <span>88%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 88%"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Coluna Direita: Cards Detalhados -->
                <div class="skills-cards-col">
                  <div class="skill-detail-card">
                    <div class="card-border-left"></div>
                    <div class="card-content">
                      <div class="card-header-mini">
                        <h4>KoboToolbox Expert</h4>
                        <span class="years">10+ Anos</span>
                      </div>
                      <p class="subtitle">Design e Implementação</p>
                      <p class="description">Especialista em desenho de formulários Excel para KoboToolbox, validação, lógica condicional e integração com sistemas M&E.</p>
                    </div>
                  </div>

                  <div class="skill-detail-card">
                    <div class="card-border-left"></div>
                    <div class="card-content">
                      <div class="card-header-mini">
                        <h4>M&E Specialist</h4>
                        <span class="years">10+ Anos</span>
                      </div>
                      <p class="subtitle">Monitoria e Avaliação</p>
                      <p class="description">Implementação de sistemas M&E completos, desde desenho até relatórios, incluindo baseline, endline e avaliações de impacto.</p>
                    </div>
                  </div>

                  <div class="skill-detail-card">
                    <div class="card-border-left"></div>
                    <div class="card-content">
                      <div class="card-header-mini">
                        <h4>Data Analysis Expert</h4>
                        <span class="years">8+ Anos</span>
                      </div>
                      <p class="subtitle">Excel & Power BI</p>
                      <p class="description">Criação de dashboards avançados em Excel e Power BI para análise de dados, KPIs e tomada de decisão baseada em evidências.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experiência -->
            <div v-else-if="activeTab === 'experience'" class="tab-pane" key="exp">
              <div class="experience-timeline">
                <div v-for="(exp, i) in experiences" :key="i" class="timeline-item-wrapper">
                  <div class="timeline-dot"></div>
                  <div class="timeline-card glass-card">
                    <div class="card-header">
                      <div class="role-company">
                        <h5>{{ exp.role }}</h5>
                        <p class="company">{{ exp.company }}</p>
                      </div>
                      <div class="period-tag">
                        <span class="period">{{ exp.period }}</span>
                        <span v-if="exp.tag" class="tag">{{ exp.tag }}</span>
                      </div>
                    </div>
                    <p class="desc">{{ exp.desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estudos -->
            <div v-else-if="activeTab === 'studies'" class="tab-pane" key="studies">
              <div class="studies-grid">
                <!-- Card 1 -->
                <div class="study-item glass-card">
                  <div class="study-icon"><i class="fas fa-search"></i></div>
                  <h5>Concepção e Realização de Avaliações</h5>
                  <p>Especialista na concepção e realização de avaliações completas incluindo baseline, endline, outcome e avaliações de impacto para organizações.</p>
                  <div class="study-tags">
                    <span class="tag tag-blue">Baseline</span>
                    <span class="tag tag-green">Endline</span>
                    <span class="tag tag-indigo">PDM</span>
                  </div>
                </div>

                <!-- Card 2 -->
                <div class="study-item glass-card">
                  <div class="study-icon"><i class="fas fa-users-cog"></i></div>
                  <h5>Pesquisas Antropológicas</h5>
                  <p>Pesquisas sociais e antropológicas incluindo estudos sobre prostituição, governação local, migração e integração social em Maputo.</p>
                  <div class="study-tags">
                    <span class="tag tag-darkblue">Antropologia</span>
                    <span class="tag tag-emerald">Qualitativo</span>
                  </div>
                </div>

                <!-- Card 3 -->
                <div class="study-item glass-card">
                  <div class="study-icon"><i class="fas fa-clipboard-check"></i></div>
                  <h5>Avaliações de Necessidades</h5>
                  <p>Avaliações de necessidades para resposta humanitária e desenvolvimento comunitário em contextos de emergência e pós-conflito.</p>
                  <div class="study-tags">
                    <span class="tag tag-red">Emergência</span>
                    <span class="tag tag-yellow">Humanitário</span>
                  </div>
                </div>

                <!-- Card 4 -->
                <div class="study-item glass-card">
                  <div class="study-icon"><i class="fas fa-poll"></i></div>
                  <h5>Estudos de Mercado & DQA</h5>
                  <p>Análises de mercado e auditorias de qualidade de dados (DQA) para garantir integridade e precisão dos sistemas M&E.</p>
                  <div class="study-tags">
                    <span class="tag tag-emerald">Análise de Mercado</span>
                    <span class="tag tag-darkblue">DQA</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tabs-container {
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

.tabs-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  white-space: nowrap;
}

.tabs-header::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex: 1;
  padding: 1.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.tab-btn:hover {
  color: var(--primary-color);
  background: rgba(var(--primary-hue), 90%, 50%, 0.03);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.tabs-content {
  padding: var(--spacing-lg);
  min-height: 400px;
  background: white;
}

.tab-pane {
  width: 100%;
}

/* Grids & Columns */
.resume-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.resume-item {
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--primary-light-color);
}

.column-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 1.25rem;
}

.period {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

/* Mini Lists */
.cert-mini-list {
  display: grid;
  gap: 1.25rem;
}

.cert-mini-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.cert-mini-item i {
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.cert-mini-item strong {
  display: block;
  font-size: 0.95rem;
  line-height: 1.3;
}

.cert-mini-item span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Experience Timeline - Accurate to Screenshot */
.experience-timeline {
  position: relative;
  padding-left: 2rem;
  margin-top: 1rem;
}

.experience-timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary-light-color);
  opacity: 0.5;
}

.timeline-item-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 1.5rem;
  width: 1rem;
  height: 1rem;
  background: var(--primary-dark);
  border-radius: 50%;
  border: 4px solid white;
  z-index: 2;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.timeline-card {
  padding: 1.5rem 2rem;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateX(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.role-company h5 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1a202c;
}

.role-company .company {
  color: var(--primary-dark);
  font-weight: 600;
  font-size: 1rem;
}

.period-tag {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.period-tag .period {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 400;
}

.period-tag .tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ebf8ff;
  color: #2b6cb0;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.timeline-card .desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

/* Tabs Header Specifics */
.tabs-header {
  display: flex;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 1.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: var(--primary-dark);
  color: white;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Competências Split Grid */
.skills-split-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
}

.skills-progress-col h3 {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.skills-intro-text {
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
  line-height: 1.6;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-item {
  width: 100%;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.progress-bar-bg {
  height: 8px;
  background: #edf2f7;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-dark);
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

/* Detailed Skill Cards (Right Column) */
.skills-cards-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-detail-card {
  position: relative;
  padding: 1.5rem 2rem;
  background: #f8fbff;
  border: 1px solid rgba(43, 108, 176, 0.1);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  display: flex;
}

.card-border-left {
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 4px;
  background: var(--primary-dark);
  border-radius: 0 4px 4px 0;
}

.card-content {
  width: 100%;
}

.card-header-mini {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.card-header-mini h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.card-header-mini .years {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.skill-detail-card .subtitle {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.skill-detail-card .description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Certificações & Recomendações Grid */
.education-section .pane-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.education-section .pane-subtitle {
  color: var(--text-muted);
  margin-bottom: 2.5rem;
}

.cert-work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.cert-work-card {
  padding: 1.75rem;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0,0,0,0.04);
}

.cert-work-card .card-type {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.cert-work-card h5 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
  line-height: 1.4;
}

.cert-work-card .issuer {
  color: var(--text-secondary);
  font-weight: 500;
}

.cert-work-card .details {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 968px) {
  .skills-split-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .cert-work-grid {
    grid-template-columns: 1fr;
  }
}

/* Certificações Categorizadas */
.cert-category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--bg-tertiary);
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cert-item {
  padding: 1.25rem 1.5rem;
  border-left: 4px solid var(--primary-color);
}

.cert-item h5 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: #1a202c;
  line-height: 1.3;
}

.cert-item .issuer {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
}

@media (max-width: 850px) {
  .cert-category-grid {
    grid-template-columns: 1fr;
  }
}

/* Estudos Section Styles */
.studies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.study-item {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.study-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(43, 108, 176, 0.05);
  border-radius: 50%;
  color: var(--primary-dark);
  font-size: 1.5rem;
}

.study-item h5 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.study-item p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.study-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.study-tags .tag {
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.tag-blue { background-color: #2b6cb0; }
.tag-green { background-color: #38a169; }
.tag-indigo { background-color: #667eea; }
.tag-darkblue { background-color: #2c5282; }
.tag-emerald { background-color: #48bb78; }
.tag-red { background-color: #e53e3e; }
.tag-yellow { background-color: #d69e2e; }
</style>
