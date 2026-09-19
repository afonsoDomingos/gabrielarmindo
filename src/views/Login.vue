<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useLanguage } from '../store/language';

const { t } = useLanguage();
const email = ref('info@gabrielarmindo.com');
const password = ref('');
const router = useRouter();
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

// Verifica se já há sessão activa
const hasSession = ref(false);
const sessionUser = ref(null);

onMounted(() => {
  const token = localStorage.getItem('gabriel_admin_token');
  const userData = localStorage.getItem('gabriel_admin_user');
  if (token) {
    hasSession.value = true;
    try { sessionUser.value = JSON.parse(userData); } catch {}
  }
});

const goToAdmin = () => router.push('/admin');

const logout = () => {
  localStorage.removeItem('gabriel_admin_token');
  localStorage.removeItem('gabriel_admin_user');
  hasSession.value = false;
  sessionUser.value = null;
  password.value = '';
};

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const res = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('gabriel_admin_token', res.data.token);
    localStorage.setItem('gabriel_admin_user', JSON.stringify(res.data.user));
    router.push('/admin');
  } catch (err) {
    const data = err.response?.data;
    if (data?.hint) {
      errorMessage.value = `${data.message} ${data.hint}`;
    } else if (data?.message && data?.error) {
      errorMessage.value = `${data.message} (${data.error})`;
    } else if (data?.message) {
      errorMessage.value = data.message;
    } else if (err.response?.status === 500) {
      errorMessage.value = t(
        'Erro 500 no servidor. Verifique as variáveis de ambiente e a conexão ao MongoDB Atlas.',
        'Server 500 error. Check environment variables and MongoDB Atlas connection.'
      );
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
    <!-- Background blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="login-wrapper">
      <!-- Brand -->
      <div class="brand-header">
        <div class="brand-avatar">GA</div>
        <div>
          <p class="brand-name">Gabriel Armindo</p>
          <p class="brand-role">Painel Administrativo</p>
        </div>
      </div>

      <!-- SESSÃO ACTIVA -->
      <div v-if="hasSession" class="session-card">
        <div class="session-avatar-ring">
          <img src="/images/perfil1.png" alt="Admin" class="session-avatar" />
          <span class="session-online-dot"></span>
        </div>
        <h2 class="session-title">Bem-vindo de volta! 👋</h2>
        <p class="session-sub">
          Sessão activa como <strong>{{ sessionUser?.name || 'Administrador' }}</strong>
        </p>
        <p class="session-email">{{ sessionUser?.email || email }}</p>

        <div class="session-actions">
          <button @click="goToAdmin" class="btn-enter-admin">
            <i class="fas fa-tachometer-alt"></i>
            Entrar no Painel Admin
          </button>
          <button @click="logout" class="btn-end-session">
            <i class="fas fa-sign-out-alt"></i>
            Terminar Sessão
          </button>
        </div>

        <router-link to="/" class="back-site-link">
          <i class="fas fa-globe"></i> Ver o site público
        </router-link>
      </div>

      <!-- FORMULÁRIO DE LOGIN -->
      <div v-else class="login-card">
        <div class="login-card-header">
          <h2>{{ t('Acesso Restrito', 'Restricted Access') }}</h2>
          <p>{{ t('Introduza as suas credenciais para continuar', 'Enter your credentials to continue') }}</p>
        </div>

        <div v-if="errorMessage" class="error-banner">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Email</label>
            <div class="input-wrap">
              <i class="fas fa-envelope input-icon"></i>
              <input
                type="email"
                v-model="email"
                required
                :disabled="isLoading"
                placeholder="info@gabrielarmindo.com"
              />
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('Senha', 'Password') }}</label>
            <div class="input-wrap">
              <i class="fas fa-lock input-icon"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                :disabled="isLoading"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="toggle-pw"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" :disabled="isLoading">
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i>
              {{ t('A autenticar...', 'Authenticating...') }}
            </span>
            <span v-else>
              <i class="fas fa-shield-alt"></i>
              {{ t('Entrar no Painel', 'Enter Panel') }}
            </span>
          </button>
        </form>

        <router-link to="/" class="back-site-link">
          <i class="fas fa-arrow-left"></i> {{ t('Voltar ao site', 'Back to site') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- Layout ---- */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c1426 100%);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
  pointer-events: none;
}
.blob-1 {
  width: 500px; height: 500px;
  background: #FF7B1A;
  top: -150px; left: -150px;
}
.blob-2 {
  width: 400px; height: 400px;
  background: #3b82f6;
  bottom: -100px; right: -100px;
}

.login-wrapper {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* ---- Brand ---- */
.brand-header {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}
.brand-avatar {
  width: 46px; height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FF7B1A, #f59e0b);
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(255,123,26,0.4);
}
.brand-name {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
}
.brand-role {
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
  margin: 0;
}

/* ---- Session Card ---- */
.session-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  animation: slideUp 0.4s ease;
}
.session-avatar-ring {
  position: relative;
  display: inline-block;
  margin-bottom: 1.25rem;
}
.session-avatar {
  width: 84px; height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255,123,26,0.6);
  box-shadow: 0 0 0 6px rgba(255,123,26,0.12);
}
.session-online-dot {
  position: absolute;
  bottom: 5px; right: 5px;
  width: 16px; height: 16px;
  background: #22c55e;
  border-radius: 50%;
  border: 3px solid #1e293b;
  box-shadow: 0 0 6px rgba(34,197,94,0.5);
}
.session-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}
.session-sub {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  margin: 0 0 4px;
}
.session-sub strong { color: #FF7B1A; }
.session-email {
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;
  margin: 0 0 2rem;
}
.session-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}
.btn-enter-admin {
  background: linear-gradient(135deg, #FF7B1A, #f59e0b);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(255,123,26,0.35);
}
.btn-enter-admin:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(255,123,26,0.45);
}
.btn-end-session {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.55);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.85rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.25s;
}
.btn-end-session:hover {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.3);
  color: #fca5a5;
}

/* ---- Login Card ---- */
.login-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  animation: slideUp 0.4s ease;
}
.login-card-header {
  text-align: center;
  margin-bottom: 2rem;
}
.login-card-header h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 6px;
}
.login-card-header p {
  color: rgba(255,255,255,0.4);
  font-size: 0.88rem;
  margin: 0;
}

/* ---- Error ---- */
.error-banner {
  background: rgba(220,38,38,0.12);
  color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.25);
  padding: 0.85rem 1rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.4;
}
.error-banner i { margin-top: 0.15rem; flex-shrink: 0; }

/* ---- Form ---- */
.login-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  color: rgba(255,255,255,0.3);
  font-size: 0.9rem;
  pointer-events: none;
}
.input-wrap input {
  width: 100%;
  padding: 0.9rem 2.75rem 0.9rem 2.75rem;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  transition: border-color 0.2s, background 0.2s;
  outline: none;
  box-sizing: border-box;
}
.input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
.input-wrap input:focus {
  border-color: rgba(255,123,26,0.6);
  background: rgba(255,255,255,0.1);
}
.input-wrap input:disabled { opacity: 0.5; }
.toggle-pw {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
  transition: color 0.2s;
}
.toggle-pw:hover { color: rgba(255,255,255,0.7); }

/* ---- Button ---- */
.btn-login {
  background: linear-gradient(135deg, #FF7B1A, #f59e0b);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px rgba(255,123,26,0.3);
  margin-top: 0.5rem;
}
.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255,123,26,0.4);
}
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ---- Back link ---- */
.back-site-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 1.5rem;
  color: rgba(255,255,255,0.3);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s;
}
.back-site-link:hover { color: rgba(255,255,255,0.65); }

/* ---- Animation ---- */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
