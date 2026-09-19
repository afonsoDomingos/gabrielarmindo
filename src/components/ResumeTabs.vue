<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const activeTab = ref('education');

const tabs = computed(() => [
  { id: 'education', label: t('Formação e Certificação', 'Education & Certification') },
  { id: 'skills', label: t('Competências', 'Skills') },
  { id: 'experience', label: t('Experiência', 'Experience') },
  { id: 'studies', label: t('Estudos', 'Studies') },
  { id: 'consultancies', label: t('Consultorias', 'Consultancies') },
  { id: 'partners', label: t('Parceiros', 'Partners') }
]);

const resumeData = ref({
  skillsIntro: {
    title: 'Especialista em M&E,\nKoboToolbox e Análise de Dados',
    description: 'Mais de 10 anos de experiência em Monitoria e Avaliação, com expertise comprovada em KoboToolbox, Excel Avançado, Power BI e gestão de programas.'
  },
  education: [
    { category: 'Formação Académica', title: 'Licenciatura em Psicologia Social e das Organizações', issuer: 'Universidade Eduardo Mondlane (2018 - 2022)' },
    { category: 'Formação Académica', title: 'Técnico Médio de Agro-Pecuária', issuer: 'Instituto Agrário de Chimoio (2013 - 2015)' },
    { category: 'Gestão de Projectos & M&A', title: 'Certificação em MEAL para Desenvolvimento', issuer: 'Humanitarian Leadership Academy' },
    { category: 'Gestão de Projectos & M&A', title: 'Certificação em Monitoria e Avaliação de Projectos', issuer: 'SentiPensar' },
    { category: 'Gestão de Projectos & M&A', title: 'Certificação em Teoria da Mudança', issuer: 'SentiPensar' },
    { category: 'Análise de Dados & BI', title: 'Certificação em Data Analytics Essentials', issuer: 'Cisco Networking Academy' },
    { category: 'Análise de Dados & BI', title: 'Extensão Universitária em Gestão e Análise de Dados com KoboToolbox, Excel, Power BI, SPSS e R', issuer: 'Corporate Business School' },
    { category: 'Análise de Dados & BI', title: 'Certificação em Power BI – Business Intelligence', issuer: 'Expert Cursos' },
    { category: 'Análise de Dados & BI', title: 'Certificação em Excel: Do Zero ao Avançado', issuer: 'EvolutionTech Training' },
    { category: 'Análise de Dados & BI', title: 'Certificação em Análise de Dados com Excel', issuer: 'EvolutionTech Training' }
  ],
  skillBars: [
    { name: 'KoboToolbox Design', percentage: 95 },
    { name: 'Excel Avançado', percentage: 90 },
    { name: 'Sistemas M&E', percentage: 95 },
    { name: 'Power BI & Data Analysis', percentage: 85 },
    { name: 'Program Management', percentage: 88 }
  ],
  skillCards: [
    {
      title: 'KoboToolbox Expert',
      years: '10+ Anos',
      subtitle: 'Design e Implementação',
      description: 'Especialista em desenho de formulários Excel para KoboToolbox, validação, lógica condicional e integração com sistemas M&E.'
    },
    {
      title: 'M&E Specialist',
      years: '10+ Anos',
      subtitle: 'Monitoria e Avaliação',
      description: 'Implementação de sistemas M&E completos, desde desenho até relatórios, incluindo baseline, endline e avaliações de impacto.'
    },
    {
      title: 'Data Analysis Expert',
      years: '8+ Anos',
      subtitle: 'Excel & Power BI',
      description: 'Criação de dashboards avançados em Excel e Power BI para análise de dados, KPIs e tomada de decisão baseada em evidências.'
    }
  ],
  experiences: [
    {
      role: 'Consultor de Monitoria, Avaliação e Pesquisa',
      company: 'Consulting And Coaching Agency',
      period: '09/2025 - Presente',
      tag: '',
      desc: '• Desenvolvimento de cursos em Monitoria & Avaliação, Excel, Análise de Dados e KoboToolbox\n• Capacitação de equipas e parceiros através de formações técnicas e mentorias\n• Desenho de formulários em XLSForm/KoboToolbox, integração com ODK e Power BI\n• Desenvolvimento de planos de M&A, estudos de base, avaliações de impacto e relatórios técnicos\n• Garantia da qualidade de dados (DQA) e apoio à tomada de decisão baseada em evidências'
    },
    {
      role: 'Especialista em Monitoria e Avaliação',
      company: 'ODEI',
      period: '2023 - 2025',
      tag: '',
      desc: '• Coordenação e implementação de sistemas de MEAL\n• Monitoria de projectos e avaliações (baseline, PDM e outcome monitoring)\n• Gestão da qualidade de dados e mechanisms de accountability comunitária\n• Desenvolvimento de ferramentas digitais de recolha de dados\n• Formação e supervisão de inquiridores\n• Produção de relatórios técnicos e acompanhamento de campo com foco em qualidade e conformidade humanitária'
    },
    {
      role: 'Docente',
      company: 'Escola de Desenho, Monitoria e Avaliação',
      period: '11/2025 - Actualmente',
      tag: 'TEMPO PARCIAL',
      desc: 'Docente dos módulos de Monitoria & Avaliação e Análise de Dados.'
    },
    {
      role: 'Consultor de Pesquisa',
      company: 'Prátiq Consultoria',
      period: '2021 - 2023',
      tag: '',
      desc: '• Desenvolvimento de propostas técnicas e financeiras\n• Elaboração de protocolos de pesquisa\n• Gestão da qualidade e integridade de dados\n• Análise de evidências e produção de relatórios analíticos para apoio à tomada de decisão'
    },
    {
      role: 'Técnico de Apoio Psicossocial',
      company: 'Helen Keller International',
      period: '2019 - 2021',
      tag: '',
      desc: '• Implementação de intervenções psicossociais inclusivas para jovens com deficiência visual\n• Apoio em direitos humanos, protecção, inclusão social e fortalecimento comunitário\n• Gestão de casos de VBG e apoio psicossocial individual e familiar\n• Mobilização comunitária e articulação multissectorial com autoridades locais e unidades sanitárias'
    }
  ],
  studies: [
    {
      title: 'Concepção e Realização de Avaliações',
      description: 'Especialista na concepção e realização de avaliações completas incluindo baseline, endline, outcome e avaliações de impacto para organizações.',
      tags: ['Baseline', 'Endline', 'PDM']
    },
    {
      title: 'Pesquisas Sociais & Psicológicas',
      description: 'Pesquisas sociais e antropológicas incluindo estudos sobre intervenção psicológica em situações de crise.',
      tags: ['Psicologia', 'Qualitativo']
    },
    {
      title: 'Avaliações de Necessidades',
      description: 'Avaliações de necessidades para resposta humanitária e desenvolvimento comunitário em contextos de emergência e pós-conflito.',
      tags: ['Emergência', 'Humanitário']
    },
    {
      title: 'Pesquisa de Mercado',
      description: 'Análises de mercado e auditorias de qualidade de dados (DQA) para garantir integridade e precisão dos sistemas M&E.',
      tags: ['Análise de Mercado', 'DQA']
    }
  ],
  consultancies: [
    {
      title: 'Consultoria de Monitoria, Avaliação e Pesquisa',
      client: 'Consulting And Coaching Agency',
      period: '09/2025 - Presente',
      location: 'Moçambique',
      type: 'Consultoria M&E',
      description: 'Desenvolvimento de cursos práticos e capacitação institucional em Monitoria & Avaliação, Excel Avançado e KoboToolbox. Desenho de formulários em XLSForm/ODK e integração com dashboards analíticos em Power BI.',
      tags: ['M&E', 'KoboToolbox', 'Power BI', 'Capacitação']
    },
    {
      title: 'Consultoria de Pesquisa e Avaliações Técnicas',
      client: 'Prátiq Consultoria',
      period: '2021 - 2023',
      location: 'Moçambique',
      type: 'Pesquisa Aplicada',
      description: 'Desenvolvimento de propostas técnicas e financeiras, elaboração de protocolos de pesquisa de campo, supervisão de colecta e garantia da integridade e qualidade de dados analíticos.',
      tags: ['Pesquisa', 'Protocolos', 'DQA', 'Análise']
    }
  ],
  partners: [
    {
      name: 'ODEI',
      description: 'Coordenação técnica de sistemas de MEAL, DQA e gestão de qualidade de dados em projectos humanitários.',
      icon: 'fas fa-university'
    },
    {
      name: 'Consulting And Coaching Agency',
      description: 'Consultoria especializada em capacitação de equipas, dashboards estratégicos e recolha digital (KoboToolbox).',
      icon: 'fas fa-brain'
    }
  ]
});

// Category Icon Helper
const getCategoryIcon = (category) => {
  if (category?.includes('Académica') || category?.includes('Academic')) return 'fas fa-graduation-cap';
  if (category?.includes('Gestão') || category?.includes('Project') || category?.includes('M&A')) return 'fas fa-tasks';
  if (category?.includes('Dados') || category?.includes('Data') || category?.includes('BI')) return 'fas fa-chart-line';
  return 'fas fa-certificate';
};

// Grouped Education
const groupedEducation = computed(() => {
  const groups = {};
  const list = resumeData.value.education || [];
  list.forEach(item => {
    const cat = item.category || 'Outras';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return groups;
});

const fetchResume = async () => {
  try {
    const res = await axios.get('/api/resume');
    if (res.data) {
      resumeData.value = {
        skillsIntro: res.data.skillsIntro || resumeData.value.skillsIntro,
        education: res.data.education?.length ? res.data.education : resumeData.value.education,
        skillBars: res.data.skillBars?.length ? res.data.skillBars : resumeData.value.skillBars,
        skillCards: res.data.skillCards?.length ? res.data.skillCards : resumeData.value.skillCards,
        experiences: res.data.experiences?.length ? res.data.experiences : resumeData.value.experiences,
        studies: res.data.studies?.length ? res.data.studies : resumeData.value.studies,
        consultancies: res.data.consultancies?.length ? res.data.consultancies : resumeData.value.consultancies,
        partners: res.data.partners?.length ? res.data.partners : resumeData.value.partners
      };
    }
  } catch (err) {
    console.warn('Usando dados de currículo locais/fallback:', err.message);
  }
};

onMounted(fetchResume);
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
          <transition name="fade-slide" mode="out-in">
            <!-- Formação e Certificação -->
            <div v-if="activeTab === 'education'" class="tab-pane" key="edu">
              <div class="education-section">
                <h3 class="pane-title">{{ t('Formação & Certificações', 'Education & Certifications') }}</h3>
                <p class="pane-subtitle">{{ t('Formação académica, certificações profissionais e qualificações técnicas obtidas ao longo da trajectória.', 'Academic education, professional certifications, and technical qualifications obtained throughout my career.') }}</p>
                
                <div class="cert-category-grid">
                  <div v-for="(items, categoryName) in groupedEducation" :key="categoryName" class="cert-category">
                    <h4 class="category-title"><i :class="getCategoryIcon(categoryName)"></i> {{ t(categoryName, categoryName) }}</h4>
                    <div class="cert-list">
                      <div v-for="(cert, idx) in items" :key="idx" class="cert-item glass-card">
                        <h5>{{ t(cert.title, cert.title) }}</h5>
                        <p class="issuer">{{ cert.issuer }}</p>
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
                  <h3 style="white-space: pre-line;">{{ resumeData.skillsIntro?.title || 'Especialista em M&E,\nKoboToolbox e Análise de Dados' }}</h3>
                  <p class="skills-intro-text">
                    {{ resumeData.skillsIntro?.description }}
                  </p>
                  
                  <div class="progress-list">
                    <div v-for="(bar, idx) in resumeData.skillBars" :key="idx" class="progress-item">
                      <div class="progress-info">
                        <span>{{ bar.name }}</span>
                        <span>{{ bar.percentage }}%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" :style="{ width: bar.percentage + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Coluna Direita: Cards Detalhados -->
                <div class="skills-cards-col">
                  <div v-for="(card, idx) in resumeData.skillCards" :key="idx" class="skill-detail-card">
                    <div class="card-border-left"></div>
                    <div class="card-content">
                      <div class="card-header-mini">
                        <h4>{{ card.title }}</h4>
                        <span class="years">{{ card.years }}</span>
                      </div>
                      <p v-if="card.subtitle" class="subtitle">{{ card.subtitle }}</p>
                      <p class="description">{{ card.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experiência -->
            <div v-else-if="activeTab === 'experience'" class="tab-pane" key="exp">
              <div class="experience-timeline">
                <div v-for="(exp, i) in resumeData.experiences" :key="i" class="timeline-item-wrapper">
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
                <div v-for="(study, idx) in resumeData.studies" :key="idx" class="study-item glass-card">
                  <div class="study-icon"><i class="fas fa-search"></i></div>
                  <h5>{{ study.title }}</h5>
                  <p>{{ study.description }}</p>
                  <div class="study-tags" v-if="study.tags && study.tags.length">
                    <span v-for="(tag, tIdx) in study.tags" :key="tIdx" class="tag" :class="'tag-' + ['blue', 'green', 'indigo', 'emerald', 'darkblue', 'red', 'yellow'][tIdx % 7]">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Consultorias -->
            <div v-else-if="activeTab === 'consultancies'" class="tab-pane" key="consultancies">
              <div class="consultancies-section">
                <h3 class="pane-title">{{ t('Consultorias & Serviços Prestados', 'Consultancies & Contracted Services') }}</h3>
                <p class="pane-subtitle">{{ t('Experiência prática como consultor técnico em sistemas MEAL, capacitações institucionais, desenho de inquéritos KoboToolbox e produção de evidências analíticas.', 'Practical experience as a technical consultant in MEAL systems, institutional training, KoboToolbox survey design, and analytical evidence generation.') }}</p>

                <div class="consultancies-public-grid">
                  <div v-for="(item, idx) in resumeData.consultancies" :key="idx" class="consultancy-public-card glass-card">
                    <div class="consultancy-card-header">
                      <div class="consultancy-pills-row">
                        <span class="badge-type" v-if="item.type">{{ item.type }}</span>
                        <span class="badge-period"><i class="fas fa-calendar-alt"></i> {{ item.period }}</span>
                        <span class="badge-loc" v-if="item.location"><i class="fas fa-map-marker-alt"></i> {{ item.location }}</span>
                      </div>
                      <h4 class="consultancy-card-title">{{ item.title }}</h4>
                      <div class="consultancy-client-row">
                        <i class="fas fa-building"></i>
                        <span>{{ item.client }}</span>
                      </div>
                    </div>
                    <p class="consultancy-card-desc">{{ item.description }}</p>
                    <div class="study-tags" v-if="item.tags && item.tags.length">
                      <span v-for="(tag, tIdx) in item.tags" :key="tIdx" class="tag" :class="'tag-' + ['blue', 'green', 'indigo', 'emerald', 'darkblue', 'red', 'yellow'][tIdx % 7]">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Parceiros -->
            <div v-else-if="activeTab === 'partners'" class="tab-pane" key="partners">
              <div class="partners-section">
                <h3 class="pane-title">{{ t('Parceiros & Colaborações', 'Partners & Collaborations') }}</h3>
                <p class="pane-subtitle">{{ t('Organizações, ONGs e parceiros com os quais colaborei para a implementação de projectos de desenvolvimento e acção humanitária.', 'Organizations, NGOs, and partners with whom I collaborated to implement development and humanitarian action projects.') }}</p>
                
                <div class="partners-grid">
                  <div v-for="(partner, idx) in resumeData.partners" :key="idx" class="partner-card glass-card">
                    <div class="partner-icon"><i :class="partner.icon || 'fas fa-handshake'"></i></div>
                    <h5>{{ partner.name }}</h5>
                    <p>{{ partner.description }}</p>
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
  background: var(--card-bg);
  color: var(--text-primary);
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
  border: 4px solid var(--card-bg);
  z-index: 2;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.timeline-card {
  padding: 1.5rem 2rem;
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--radius-md);
  box-shadow: var(--card-shadow);
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
  color: var(--text-primary);
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
  white-space: pre-line;
}

/* Tabs Header Specifics */
.tabs-header {
  display: flex;
  background: var(--card-bg);
  border: var(--card-border);
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
  background: #fffaf5;
  border: 1px solid rgba(255, 123, 26, 0.15);
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
  background: var(--card-bg);
  border-radius: var(--radius-md);
  border: var(--card-border);
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
  color: var(--text-primary);
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  background: rgba(255, 123, 26, 0.08);
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

/* Partners Section Styles */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.partner-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
}

.partner-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 123, 26, 0.25);
}

.partner-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 123, 26, 0.08);
  border-radius: 50%;
  color: var(--primary-dark);
  font-size: 1.5rem;
}

.partner-card h5 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
}

.partner-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Consultorias Section Styles */
.consultancies-public-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.consultancy-public-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid var(--primary-color, #FF7B1A);
}

.consultancy-public-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.consultancy-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 0.75rem;
}

.badge-type {
  background: rgba(255, 123, 26, 0.12);
  color: #c2410c;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.badge-period, .badge-loc {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.badge-loc {
  background: #e0f2fe;
  color: #0369a1;
}

.consultancy-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.35rem;
  line-height: 1.35;
}

.consultancy-client-row {
  font-size: 0.92rem;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.5rem;
}

.consultancy-client-row i {
  color: var(--primary-color, #FF7B1A);
}

.consultancy-card-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  white-space: pre-line;
  flex-grow: 1;
}
</style>
