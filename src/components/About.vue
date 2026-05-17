<script setup>
import { useLanguage } from '../store/language';

const { t } = useLanguage();
</script>

<template>
  <section class="about section" id="about">
    <div class="container">
      <div class="section-header reveal">
        <h2 class="section-title">{{ t('Sobre Mim', 'About Me') }}</h2>
      </div>

      <div class="about-content">
        <div class="about-text reveal">
          <p class="about-paragraph" style="margin-bottom: 1.5rem;">
            {{ t('Sou consultor independente especializado em Fortalecimento Institucional, Monitoria, Avaliação, Accountability e Aprendizagem (MEAL), Investigação Aplicada e Comunicação Estratégica, com experiência no apoio a organizações de desenvolvimento e resposta humanitária. Apoio organizações a transformar dados, evidências e experiências em sistemas de aprendizagem institucional, tomada de decisão e posicionamento estratégico, fortalecendo a capacidade de demonstrar impacto, responder às exigências de accountability e aumentar a credibilidade junto de parceiros e financiadores.', 'I am an independent consultant specializing in Institutional Strengthening, Monitoring, Evaluation, Accountability, and Learning (MEAL), Applied Research, and Strategic Communication, with experience in supporting development and humanitarian response organizations. I support organizations to transform data, evidence, and experiences into institutional learning, decision-making, and strategic positioning systems, strengthening the capacity to demonstrate impact, respond to accountability requirements, and increase credibility with partners and donors.') }}
          </p>
          <p class="about-paragraph" style="margin-bottom: 2rem;">
            {{ t('Tenho experiência no desenho e implementação de sistemas de MEAL, incluindo processos de recolha, gestão, validação e análise de dados, desenvolvimento de avaliações, dashboards estratégicos e mecanismos de aprendizagem orientados por evidências. A minha abordagem combina análise técnica, investigação aplicada e compreensão das dinâmicas comunitárias, permitindo desenvolver soluções participativas, eficientes e alinhadas aos desafios reais das organizações.', 'I have experience in the design and implementation of MEAL systems, including data collection, management, validation, and analysis processes, development of evaluations, strategic dashboards, and evidence-oriented learning mechanisms. My approach combines technical analysis, applied research, and understanding of community dynamics, allowing me to develop participatory, efficient, and aligned solutions to the real challenges of organizations.') }}
          </p>

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
