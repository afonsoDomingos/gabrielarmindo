<script setup>
import { useLanguage } from '../store/language';
const { t } = useLanguage();
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <a href="/" class="nav-logo">
            <span class="logo-text">Gabriel</span>
            <span class="logo-accent">Armindo</span>
          </a>
          <p>{{ t('Especialista Sénior em Monitoria, Avaliação e Análise de Dados.', 'Senior Specialist in Monitoring, Evaluation and Data Analysis.') }}</p>
        </div>

        <div class="footer-social">
          <a href="https://www.linkedin.com/in/gabriel-armindo/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://www.facebook.com/gabrielarmindo.armindo.9" target="_blank"><i class="fab fa-facebook-f"></i></a>
          <a href="mailto:gabrielarmindo32@gmail.com"><i class="fas fa-envelope"></i></a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; 2026 Gabriel Armindo. {{ t('Todos os direitos reservados.', 'All rights reserved.') }}
          <router-link to="/login" class="admin-link">Admin</router-link>
        </p>
        
        <div class="vibe-credit">
          <span>Powered by</span>
          <a href="https://wehosthere.co.mz" target="_blank" class="wehosthere-link">
            <img src="/images/Wehosthere.png" alt="WeHostHere" class="wehosthere-logo" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
    background: #fff;
    padding: 4rem 0 2rem;
    border-top: 1px solid #eee;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
}

.footer-social { display: flex; gap: 1rem; }
.footer-social a {
    width: 40px; height: 40px; border-radius: 50%;
    background: #f8f9fa; display: flex; align-items: center; justify-content: center;
    transition: 0.3s;
}
.footer-social a:hover { background: var(--gradient-1); color: white; transform: translateY(-3px); }

.footer-bottom {
    border-top: 1px solid #eee;
    padding-top: 2rem;
    text-align: center;
    color: var(--text-muted);
}

.admin-link { opacity: 0.2; font-size: 0.7rem; margin-left: 10px; }
.admin-link:hover { opacity: 1; color: var(--primary-color); }

.vibe-credit {
    margin-top: 1.5rem;
    display: flex; align-items: center; justify-content: center;
    gap: 8px; font-size: 0.8rem; opacity: 0.75;
    color: var(--text-muted);
}

.wehosthere-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
}
.wehosthere-link:hover {
    opacity: 1;
    transform: translateY(-1px);
}
.wehosthere-logo {
    height: 22px;
    width: auto;
    object-fit: contain;
    border-radius: 4px;
}
@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
    
    .footer {
        padding: 3rem 0 1.5rem;
    }
}
</style>
