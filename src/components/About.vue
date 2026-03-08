<script setup>
import { ref } from 'vue';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <section class="about section" id="about">
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">{{ t('Sobre Mim', 'About Me') }}</h2>
      </div>

      <div class="about-content">
        <div class="about-text reveal">
          <p class="about-intro">
            {{ t('Sou Especialista em Monitoria, Avaliação, Prestação de Contas e Aprendizagem (MEAL), Analista de Dados e Psicólogo, com mais de 5 anos de experiência no sector de desenvolvimento, educação e resposta humanitária, actuando em organizações nacionais e internacionais.', 'I am an expert in Monitoring, Evaluation, Accountability and Learning (MEAL), Data Analyst and Psychologist, with more than 5 years of experience in the development, education and humanitarian response sectors, working in national and international organizations.') }}
          </p>
          
          <div class="expandable-content" :class="{ 'expanded': isExpanded }">
            <p>
              {{ t('Possuo sólida experiência no desenho, implementação e fortalecimento de sistemas de M&A orientados para resultados, assegurando qualidade de dados, tomada de decisão baseada em evidências e alinhamento estratégico com requisitos de doadores e parceiros institucionais.', 'I have solid experience in the design, implementation and strengthening of result-oriented M&E systems, ensuring data quality, evidence-based decision-making and strategic alignment with donor and institutional partner requirements.') }}
            </p>
            <p>
              {{ t('Sou Licenciado em Psicologia Social e Comunitária pela Universidade Eduardo Mondlane e possuo Extensão Universitária em Gênero, Diversidade e Inclusão Social em Direitos Humanos pela Universidade de São Paulo. Essa formação fortalece minha capacidade de integrar abordagens sensíveis ao género, inclusão e proteção em contextos complexos e humanitários.', 'I have a degree in Social and Community Psychology from Eduardo Mondlane University and a University Extension in Gender, Diversity and Social Inclusion in Human Rights from the University of São Paulo. This training strengthens my ability to integrate gender-sensitive, inclusion and protection approaches in complex and humanitarian contexts.') }}
            </p>
            <p>
              {{ t('Ao longo da minha trajetória, tenho liderado e apoiado avaliações de projectos, estudos de linha de base e finais, desenvolvimento de matrizes de indicadores, realização de estudos Sociais, Desenho de Formulários no Excel para o Kobotoolbox, Excel Avançado, Power BI, SPSS e criação de dashboards estratégicos e relatórios analíticos para diferentes stakeholders.', 'Throughout my career, I have led and supported project evaluations, baseline and endline studies, development of indicator matrices, conducting social studies, designing Excel forms for KoboToolbox, Advanced Excel, Power BI, SPSS and creation of strategic dashboards and analytical reports for different stakeholders.') }}
            </p>
            <p>
              {{ t('Actuei em posições de liderança como Diretor de Auditoria Interna, Coordenador de Projetos, Especialista em M&A e Consultor Sénior de Pesquisa, sempre com foco na melhoria contínua, aprendizagem organizacional e fortalecimento institucional. Tambem actuo como consultor e mentor, capacitando equipas técnicas e desenvolvendo cursos avançados em análise de dados.', 'I have worked in leadership positions such as Internal Audit Director, Project Coordinator, M&E Specialist and Senior Research Consultant, always focusing on continuous improvement, organizational learning and institutional strengthening. I also work as a consultant and mentor, training technical teams and developing advanced data analysis courses.') }}
            </p>
          </div>

          <button @click="toggleExpand" class="read-more-btn">
            <span>{{ isExpanded ? t('Ler menos', 'Read less') : t('Ler mais', 'Read more') }}</span>
            <i class="fas" :class="isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <div class="about-education">
            <h3><i class="fas fa-graduation-cap"></i> {{ t('Formação Académica', 'Academic Education') }}</h3>
            <ul>
              <li>
                <strong>{{ t('Licenciatura em Psicologia Social e Comunitária', 'Bachelor in Social and Community Psychology') }}</strong>
                <span>{{ t('Universidade Eduardo Mondlane', 'Eduardo Mondlane University') }}</span>
              </li>
              <li>
                <strong>{{ t('Extensão Universitária em Gênero, Diversidade e Inclusão Social', 'University Extension in Gender, Diversity and Social Inclusion') }}</strong>
                <span>{{ t('Universidade de São Paulo (USP)', 'University of São Paulo (USP)') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
    background: var(--bg-secondary);
}

.about-content {
    display: block;
    max-width: 900px;
    margin: 0 auto;
}

.about-text {
    font-size: 1.1rem;
    line-height: 1.8;
}

.about-intro {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    font-weight: 500;
}

.about-text p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
}

/* Expandable Content functionality */
.expandable-content {
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateY(-10px);
}

.expandable-content.expanded {
    max-height: 1500px; /* Valor alto o suficiente */
    opacity: 1;
    transform: translateY(0);
    margin-bottom: var(--spacing-md);
}

.read-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1.8rem;
    background: white;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: var(--radius-md);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all var(--transition-normal);
    margin: var(--spacing-sm) 0 var(--spacing-md);
    box-shadow: var(--shadow-sm);
}

.read-more-btn i {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
}

.read-more-btn:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 123, 26, 0.25);
}

.read-more-btn:active {
    transform: translateY(-1px);
}

.about-education {
    margin: var(--spacing-md) 0;
    padding: var(--spacing-md);
    background: rgba(255, 123, 26, 0.05);
    border-left: 4px solid var(--primary-color);
    border-radius: var(--radius-sm);
}

.about-education h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: var(--spacing-sm);
    color: var(--primary-color);
}

.about-education ul li {
    margin-bottom: var(--spacing-sm);
}

.about-education strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 1rem;
}

.about-highlights {
    display: grid;
    gap: var(--spacing-md);
}

.highlight-card {
    transition: all var(--transition-normal);
}

.highlight-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}

.highlight-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-1);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-sm);
    font-size: 1.5rem;
    color: white;
}

@media (max-width: 968px) {
    .about-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .about-text {
        text-align: left;
    }
    
    .about-intro {
        text-align: center;
        margin-bottom: var(--spacing-md);
    }
    
    .about-education h3 {
        justify-content: flex-start;
    }
    
    .about-education ul {
        text-align: left;
        max-width: 500px;
        margin: 0 auto;
    }
}
</style>
