<script setup>
import { ref } from 'vue';

const testimonials = ref([
  {
    text: "Participar da mentoria em Monitoria e Avaliação com Gabriel Armindo foi uma experiência transformadora para a minha carreira. Os conteúdos práticos e bem estruturados ajudaram-me a aplicar os conceitos no dia a dia, dando-me confiança para atuar como Consultor e Oficial de MEAL. Sou muito grato pelo profissionalismo e dedicação do mentor e recomendo esta mentoria a todos que desejam crescer na área de Monitoria, Avaliação, Prestação de Contas e Aprendizagem.",
    name: "Samuel Matola",
    role: "Consultor de Pesquisa | Oficial de MEAL"
  }
]);

const currentIndex = ref(0);

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.value.length;
};

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + testimonials.value.length) % testimonials.value.length;
};
</script>

<template>
  <section class="testimonials section" id="testimonials">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Testemunhos</span>
        <h2 class="section-title">O que dizem sobre o meu trabalho</h2>
      </div>

      <div class="testimonials-slider reveal">
        <button @click="prev" class="slider-btn prev">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="testimonial-content glass-card">
          <div class="rating">
            <i class="fas fa-star" v-for="i in 5" :key="i"></i>
          </div>
          <p class="testimonial-text">
            "{{ testimonials[currentIndex].text }}"
          </p>
          <div class="testimonial-author">
            <h4>{{ testimonials[currentIndex].name }}</h4>
            <p>{{ testimonials[currentIndex].role }}</p>
          </div>
        </div>

        <button @click="next" class="slider-btn next">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  background-color: var(--bg-primary);
  overflow: hidden;
}

.testimonials-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.testimonial-content {
  text-align: center;
  padding: 3rem;
  background: #f8fbff;
  border: 1px solid rgba(43, 108, 176, 0.1);
  border-radius: var(--radius-lg);
  flex: 1;
}

.rating {
  color: #f6ad55;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.testimonial-text {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #4a5568;
  font-style: italic;
  margin-bottom: 2.5rem;
}

.testimonial-author h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.testimonial-author p {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1rem;
}

.slider-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: white;
  color: var(--text-primary);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.slider-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .testimonials-slider {
    gap: 1rem;
  }
  .testimonial-content {
    padding: 2rem 1.5rem;
  }
  .testimonial-text {
    font-size: 1rem;
  }
  .slider-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
