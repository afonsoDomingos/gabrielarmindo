<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <section class="about section" id="about">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Minha Jornada</span>
        <h2 class="section-title">Sobre Mim</h2>
      </div>

      <div class="about-content">
        <div class="about-text reveal-left">
          <p class="about-intro">
            Sou Especialista em Monitoria, Avaliação, Prestação de Contas e Aprendizagem (MEAL), Analista de Dados e Psicólogo, com mais de 5 anos de experiência no sector de desenvolvimento, educação e resposta humanitária, actuando em organizações nacionais e internacionais.
          </p>
          
          <div class="expandable-content" :class="{ 'expanded': isExpanded }">
            <p>
              Possuo sólida experiência no desenho, implementação e fortalecimento de sistemas de M&A orientados para resultados, assegurando qualidade de dados, tomada de decisão baseada em evidências e alinhamento estratégico com requisitos de doadores e parceiros institucionais.
            </p>
            <p>
              Sou Licenciado em Psicologia Social e Comunitária pela Universidade Eduardo Mondlane e possuo Extensão Universitária em Gênero, Diversidade e Inclusão Social em Direitos Humanos pela Universidade de São Paulo. Essa formação fortalece minha capacidade de integrar abordagens sensíveis ao género, inclusão e proteção em contextos complexos e humanitários.
            </p>
            <p>
              Ao longo da minha trajetória, tenho liderado e apoiado avaliações de projectos, estudos de linha de base e finais, desenvolvimento de matrizes de indicadores, realização de estudos Sociais, Desenho de Formulários no Excel para o Kobotoolbox, Excel Avançado, Power BI, SPSS e criação de dashboards estratégicos e relatórios analíticos para diferentes stakeholders.
            </p>
            <p>
              Actuei em posições de liderança como Diretor de Auditoria Interna, Coordenador de Projetos, Especialista em M&A e Consultor Sénior de Pesquisa, sempre com foco na melhoria contínua, aprendizagem organizacional e fortalecimento institucional. Tambem actuo como consultor e mentor, capacitando equipas técnicas e desenvolvendo cursos avançados em análise de dados.
            </p>
          </div>

          <button @click="toggleExpand" class="read-more-btn">
            <span>{{ isExpanded ? 'Ler menos' : 'Ler mais' }}</span>
            <i class="fas" :class="isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <div class="about-education">
            <h3><i class="fas fa-graduation-cap"></i> Formação Académica</h3>
            <ul>
              <li>
                <strong>Licenciatura em Psicologia Social e Comunitária</strong>
                <span>Universidade Eduardo Mondlane</span>
              </li>
              <li>
                <strong>Extensão Universitária em Gênero, Diversidade e Inclusão Social</strong>
                <span>Universidade de São Paulo (USP)</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="about-highlights reveal-right">
          <div class="highlight-card">
            <div class="highlight-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4>Direitos Humanos</h4>
            <p>Especialista em integrar inclusão e proteção em projetos humanitários.</p>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon">
              <i class="fas fa-chess-knight"></i>
            </div>
            <h4>Liderança Estratégica</h4>
            <p>Experiência como Diretor de Auditoria e Coordenador de Projetos.</p>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon">
              <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <h4>Mentoria & Consultoria</h4>
            <p>Capacitação de equipas técnicas e desenho de sistemas sob medida.</p>
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
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--spacing-lg);
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
}

.about-highlights {
    display: grid;
    gap: var(--spacing-md);
}

.highlight-card {
    padding: var(--spacing-md);
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: var(--radius-lg);
    transition: all var(--transition-normal);
}

.highlight-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
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
        text-align: center;
    }
    
    .about-education h3 {
        justify-content: center;
    }
    
    .about-education ul {
        text-align: left;
        max-width: 500px;
        margin: 0 auto;
    }
}
</style>
