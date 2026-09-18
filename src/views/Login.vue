<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useLanguage } from '../store/language';

const { t } = useLanguage();
const email = ref('info@gabrielarmindo.com');
const password = ref('');
const router = useRouter();
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const res = await axios.post('/api/login', { 
      email: email.value, 
      password: password.value 
    });
    
    localStorage.setItem('gabriel_admin_token', res.data.token);
    router.push('/admin');
  } catch (err) {
    console.error('Erro detalhado no login:', err);
    const data = err.response?.data;
    if (data?.hint) {
      errorMessage.value = `${data.message} ${data.hint}`;
    } else if (data?.message && data?.error) {
      errorMessage.value = `${data.message} (${data.error})`;
    } else if (data?.message) {
      errorMessage.value = data.message;
    } else if (err.response?.status === 500) {
      errorMessage.value = t('Erro 500 no servidor. Verifique as variáveis de ambiente e a conexão ao MongoDB Atlas.', 'Server 500 error. Please check environment variables and MongoDB Atlas connection.');
    } else {
      errorMessage.value = t('Email ou senha inválidos!', 'Invalid email or password!');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h2>{{ t('Login de Admin', 'Admin Login') }}</h2>

      <div v-if="errorMessage" class="error-banner">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required :disabled="isLoading" />
        </div>
        <div class="form-group">
          <label>{{ t('Senha', 'Password') }}</label>
          <input type="password" v-model="password" required :disabled="isLoading" />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isLoading">
          <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> {{ t('A autenticar...', 'Authenticating...') }}</span>
          <span v-else>{{ t('Entrar', 'Login') }}</span>
        </button>
      </form>
      <div style="margin-top: 1.5rem; text-align: center;">
        <router-link to="/" style="font-size: 0.9rem; color: #666;">
          <i class="fas fa-arrow-left"></i> {{ t('Voltar ao site', 'Back to site') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #f4f7f6;
    padding: 1.5rem;
}

.login-container {
    background: white; padding: 2.5rem; border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    width: 100%; max-width: 420px;
}

.error-banner {
    background: #fff0f0;
    color: #d32f2f;
    border: 1px solid #ffcdd2;
    padding: 0.85rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.88rem;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    line-height: 1.4;
}

.error-banner i {
    margin-top: 0.2rem;
    flex-shrink: 0;
}

h2 { text-align: center; margin-bottom: 1.8rem; font-family: var(--font-accent); color: #1e293b; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #334155; font-size: 0.92rem; }
.form-group input { width: 100%; padding: 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; }
.form-group input:focus { border-color: #2563eb; outline: none; }
</style>
