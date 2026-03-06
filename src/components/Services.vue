<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const packages = ref([]);

const fetchPackages = async () => {
  try {
    const res = await axios.get('/api/packages');
    packages.value = res.data;
  } catch (err) {
    console.error('Erro ao buscar pacotes:', err);
  }
};

onMounted(fetchPackages);
</script>

<template>
  <section class="services section" id="services">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Soluções Sob Medida</span>
        <h2 class="section-title">Pacotes de Serviços</h2>
        <p class="section-subtitle">Escolha o plano ideal para as necessidades do seu projeto ou organização.</p>
      </div>

      <div class="services-grid reveal-container">
        <div v-for="(pkg, index) in packages.slice(0, 3)" :key="pkg.id" class="service-card glass-card reveal-item">
          <div class="service-icon">
            <i :class="pkg.icon || 'fas fa-box'"></i>
          </div>
          <h3 class="service-title">{{ pkg.title }}</h3>
          <p class="service-price">{{ pkg.price }}</p>
          <p class="service-description">{{ pkg.description }}</p>
          
          <ul class="service-features">
            <li v-for="(feature, idx) in pkg.features" :key="idx">
              <i class="fas fa-check"></i> {{ feature }}
            </li>
          </ul>
          
          <a href="#contacto" class="btn btn-outline" style="width: 100%; justify-content: center;">
            Solicitar Orçamento
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.service-card {
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  transform: translateY(-10px);
}

.service-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-1);
  color: white;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.service-title {
  font-size: 1.5rem;
  font-family: var(--font-accent);
  margin-bottom: 0.5rem;
}

.service-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.service-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.service-features {
  margin-bottom: 2rem;
  flex: 1;
}

.service-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.service-features li i {
  color: #22c55e;
}
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .service-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .service-card {
    padding: 1.5rem;
  }
}
</style>
