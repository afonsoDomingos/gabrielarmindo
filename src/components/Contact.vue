<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const form = ref({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const statusMessage = ref('');

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const res = await axios.post('/api/contact', form.value);
    statusMessage.value = t('Mensagem enviada com sucesso!', 'Message sent successfully!');
    form.value = { name: '', email: '', message: '' };
  } catch (err) {
    statusMessage.value = t('Erro ao enviar mensagem. Tente novamente.', 'Error sending message. Please try again.');
  } finally {
    isSubmitting.value = false;
    setTimeout(() => { statusMessage.value = ''; }, 5000);
  }
};
</script>

<template>
  <section class="contact section" id="contacto">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">{{ t('Vamos conversar?', 'Let’s talk?') }}</span>
        <h2 class="section-title">{{ t('Entre em Contacto', 'Get in Touch') }}</h2>
      </div>

      <div class="contact-container">
        <div class="contact-info reveal-left">
          <h3>{{ t('Sinta-se à vontade para me escrever!', 'Feel free to write to me!') }}</h3>
          <p>
            {{ t('Estou sempre aberto a novas oportunidades, colaborações em projectos de monitoria e avaliação ou apenas uma boa conversa sobre análise de dados.', 'I am always open to new opportunities, collaborations on monitoring and evaluation projects or just a good conversation about data analysis.') }}
          </p>

          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-envelope"></i></div>
              <div class="contact-content">
                <h4>Email</h4>
                <a href="mailto:gabrielarmindo32@gmail.com">gabrielarmindo32@gmail.com</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fab fa-linkedin-in"></i></div>
              <div class="contact-content">
                <h4>LinkedIn</h4>
                <a href="https://www.linkedin.com/in/gabriel-armindo/" target="_blank">linkedin.com/in/gabriel-armindo</a>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="contact-content">
                <h4>{{ t('Telefone / WhatsApp', 'Phone / WhatsApp') }}</h4>
                <div class="phone-numbers">
                  <a href="tel:+258865179513">+258 865 179 513</a> / 
                  <a href="tel:+258833722159">833 722 159</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form reveal-right">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>{{ t('Seu Nome', 'Your Name') }}</label>
              <input type="text" v-model="form.name" required :placeholder="t('Como devo te chamar?', 'How should I call you?')" />
            </div>
            <div class="form-group">
              <label>{{ t('Seu Email', 'Your Email') }}</label>
              <input type="email" v-model="form.email" required placeholder="exemplo@email.com" />
            </div>
            <div class="form-group">
              <label>{{ t('Mensagem', 'Message') }}</label>
              <textarea v-model="form.message" required rows="5" :placeholder="t('Em que posso te ajudar?', 'How can I help you?')"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" style="width: 100%;">
              <span v-if="!isSubmitting">{{ t('Enviar Mensagem', 'Send Message') }}</span>
              <span v-else>{{ t('Enviando...', 'Sending...') }}</span>
              <i class="fas fa-paper-plane" v-if="!isSubmitting" style="margin-left: 0.5rem"></i>
            </button>
            <p v-if="statusMessage" class="status-msg">{{ statusMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-container {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: var(--spacing-lg);
    text-align: left;
}

.contact-info h3 { font-size: 2.25rem; margin-bottom: 1.5rem; line-height: 1.2; }
.contact-details { display: flex; flex-direction: column; gap: 2rem; margin-top: 2rem; }
.contact-item { display: flex; gap: 1.25rem; align-items: center; }

.contact-icon {
    width: 56px; height: 56px;
    background: var(--gradient-1);
    color: white;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 5px 15px rgba(255, 123, 26, 0.2);
}

.contact-content h4 { font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.contact-content a { font-weight: 600; font-size: 1.1rem; }

.contact-form {
    background: white;
    padding: 3rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.status-msg {
    margin-top: 1rem;
    font-weight: 500;
    color: var(--primary-color);
}

.form-group { margin-bottom: 2rem; }
.form-group label { display: block; margin-bottom: 0.75rem; font-weight: 600; color: var(--text-primary); }
.form-group input, .form-group textarea {
    width: 100%; padding: 1rem 1.25rem;
    border: 1px solid #edf2f7; border-radius: 12px;
    background: #f8fafc;
    font-family: inherit;
    transition: all 0.3s ease;
}

.form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    background: white;
    box-shadow: 0 0 0 4px rgba(255, 123, 26, 0.1);
}

@media (max-width: 968px) {
    .contact-container { grid-template-columns: 1fr; gap: var(--spacing-lg); }
    .contact-info { text-align: center; }
    .contact-item { justify-content: center; }
    .contact-form { padding: 2.5rem; }
}

@media (max-width: 480px) {
    .contact-info h3 { font-size: 1.75rem; }
    .contact-form { padding: 2rem 1.5rem; }
}
</style>
