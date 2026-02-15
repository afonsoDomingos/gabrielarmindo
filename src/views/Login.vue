<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('info@gabrielarmindo.com');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/login', { 
      email: email.value, 
      password: password.value 
    });
    
    localStorage.setItem('gabriel_admin_token', res.data.token);
    router.push('/admin');
  } catch (err) {
    alert('Credenciais inválidas!');
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
      </form>
      <div style="margin-top: 1rem; text-align: center;">
        <router-link to="/" style="font-size: 0.9rem; color: #666;">Voltar ao site</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #f4f7f6;
}

.login-container {
    background: white; padding: 3rem; border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    width: 100%; max-width: 400px;
}

h2 { text-align: center; margin-bottom: 2rem; font-family: var(--font-accent); }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
.form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; }
</style>
