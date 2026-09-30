<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  packageId: {
    type: String,
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'MZN'
  }
});

const emit = defineEmits(['payment-complete', 'payment-cancelled']);

// Gateway selection
const selectedGateway = ref('KIVORA');
const availableGateways = [
  { value: 'KIVORA', name: 'Kivora Payments', icon: 'fas fa-credit-card' },
  { value: 'MPESA', name: 'M-Pesa', icon: 'fas fa-mobile-alt' }
];

// Form state
const paymentForm = ref({
  phone: '',
  name: '',
  email: ''
});

// Payment state
const isProcessing = ref(false);
const paymentStatus = ref(null); // 'pending', 'processing', 'paid', 'failed'
const transactionId = ref(null);
const gatewayPaymentId = ref(null);
const errorMessage = ref('');

// Phone validation
const isValidPhone = computed(() => {
  const phone = paymentForm.value.phone.replace(/\D/g, '');
  return phone.length === 9 && (phone.startsWith('8') || phone.startsWith('7') || phone.startsWith('6'));
});

// Format phone number
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits;
};

const handlePhoneInput = (e) => {
  paymentForm.value.phone = formatPhone(e.target.value);
};

// Initiate payment
const initiatePayment = async () => {
  if (!isValidPhone.value) {
    errorMessage.value = 'Por favor, insira um número de telemóvel válido (9 dígitos)';
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';
  paymentStatus.value = 'processing';

  try {
    const response = await axios.post('/api/payments/universal', {
      gateway: selectedGateway.value,
      phone: paymentForm.value.phone,
      amount: props.price,
      currency: props.currency,
      reference: `PKG-${props.packageId}-${Date.now()}`,
      description: `Pagamento: ${props.packageName}`,
      packageId: props.packageId,
      packageName: props.packageName,
      customerName: paymentForm.value.name,
      customerEmail: paymentForm.value.email
    });

    if (response.data.success) {
      gatewayPaymentId.value = response.data.payment.id || response.data.payment.TransactionID;
      transactionId.value = response.data.transaction.id;
      paymentStatus.value = 'pending';

      // Start polling for payment status
      pollPaymentStatus(response.data.transaction.id);
    } else {
      errorMessage.value = 'Erro ao iniciar pagamento. Tente novamente.';
      paymentStatus.value = 'failed';
      isProcessing.value = false;
    }
  } catch (error) {
    console.error('Payment error:', error);
    errorMessage.value = error.response?.data?.message || 'Erro ao processar pagamento';
    paymentStatus.value = 'failed';
    isProcessing.value = false;
  }
};

// Poll payment status
const pollPaymentStatus = async (transId) => {
  const pollInterval = setInterval(async () => {
    try {
      const response = await axios.get(`/api/payments/${transId}`);
      const status = response.data.transaction.status;

      if (status === 'paid' || status === 'completed') {
        clearInterval(pollInterval);
        paymentStatus.value = 'paid';
        isProcessing.value = false;
        emit('payment-complete', response.data.transaction);
      } else if (status === 'failed') {
        clearInterval(pollInterval);
        paymentStatus.value = 'failed';
        isProcessing.value = false;
        errorMessage.value = 'Pagamento falhou. Tente novamente.';
      }
      // Continue polling for 'pending' or 'processing'
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 3000); // Poll every 3 seconds

  // Stop polling after 5 minutes
  setTimeout(() => {
    clearInterval(pollInterval);
    if (paymentStatus.value === 'pending' || paymentStatus.value === 'processing') {
      isProcessing.value = false;
      errorMessage.value = 'Tempo limite excedido. Verifique o status do pagamento.';
    }
  }, 300000); // 5 minutes
};

const cancelPayment = () => {
  emit('payment-cancelled');
};

const resetForm = () => {
  paymentForm.value = {
    phone: '',
    name: '',
    email: ''
  };
  paymentStatus.value = null;
  transactionId.value = null;
  gatewayPaymentId.value = null;
  errorMessage.value = '';
  isProcessing.value = false;
};
</script>

<template>
  <div class="payment-checkout">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <h3>Pagamento</h3>
        <p class="package-info">
          {{ packageName }} - {{ currency }} {{ price }}
        </p>
      </div>

      <!-- Gateway Selection -->
      <div v-if="!paymentStatus || paymentStatus === 'failed'" class="gateway-selector">
        <label>Escolha o Gateway:</label>
        <div class="gateway-options">
          <button
            v-for="gateway in availableGateways"
            :key="gateway.value"
            :class="['gateway-option', { active: selectedGateway === gateway.value }]"
            @click="selectedGateway = gateway.value"
          >
            <i :class="gateway.icon"></i>
            {{ gateway.name }}
          </button>
        </div>
      </div>

      <!-- Payment Form -->
      <div v-if="!paymentStatus || paymentStatus === 'failed'" class="payment-form">
        <div class="form-group">
          <label>Número de Telemóvel *</label>
          <input
            v-model="paymentForm.phone"
            @input="handlePhoneInput"
            type="tel"
            placeholder="841234567"
            maxlength="9"
            :class="{ 'error': !isValidPhone && paymentForm.phone.length > 0 }"
          />
          <small v-if="!isValidPhone && paymentForm.phone.length > 0" class="error-text">
            Número inválido (9 dígitos, começando com 8, 7 ou 6)
          </small>
        </div>

        <div class="form-group">
          <label>Nome Completo</label>
          <input
            v-model="paymentForm.name"
            type="text"
            placeholder="Seu nome"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="paymentForm.email"
            type="email"
            placeholder="seu@email.com"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>

        <button
          @click="initiatePayment"
          :disabled="!isValidPhone || isProcessing"
          class="btn-pay"
        >
          <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-mobile-alt"></i>
          {{ isProcessing ? 'Processando...' : 'Pagar Agora' }}
        </button>

        <button @click="cancelPayment" class="btn-cancel">
          Cancelar
        </button>
      </div>

      <!-- Pending Payment -->
      <div v-if="paymentStatus === 'pending'" class="payment-pending">
        <div class="pending-icon">
          <i class="fas fa-clock"></i>
        </div>
        <h4>Aguardando Pagamento</h4>
        <p>
          Verifique o seu telemóvel. Você receberá uma notificação para autorizar o pagamento.
        </p>
        <p class="payment-details">
          <strong>Valor:</strong> {{ currency }} {{ price }}<br>
          <strong>Gateway:</strong> {{ selectedGateway }}<br>
          <strong>Transacção:</strong> {{ gatewayPaymentId }}
        </p>
        <div class="spinner"></div>
        <p class="status-text">A verificar o status...</p>
      </div>

      <!-- Payment Successful -->
      <div v-if="paymentStatus === 'paid'" class="payment-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h4>Pagamento Concluído!</h4>
        <p>O seu pagamento foi processado com sucesso.</p>
        <button @click="resetForm" class="btn-ok">
          <i class="fas fa-check"></i> OK
        </button>
      </div>

      <!-- Payment Failed -->
      <div v-if="paymentStatus === 'failed'" class="payment-failed">
        <div class="failed-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h4>Pagamento Falhou</h4>
        <p>{{ errorMessage || 'Ocorreu um erro ao processar o pagamento.' }}</p>
        <button @click="resetForm" class="btn-retry">
          <i class="fas fa-redo"></i> Tentar Novamente
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-checkout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.checkout-container {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: var(--card-border);
}

.checkout-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.checkout-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.package-info {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* Gateway Selector */
.gateway-selector {
  margin-bottom: 2rem;
}

.gateway-selector label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.gateway-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.gateway-option {
  padding: 0.85rem 1rem;
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.gateway-option:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.gateway-option.active {
  border-color: var(--primary-color);
  background: rgba(255, 123, 26, 0.1);
  color: var(--primary-color);
}

.gateway-option i {
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color 0.3s;
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  display: block;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-pay {
  width: 100%;
  padding: 1rem;
  background: var(--gradient-1);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 123, 26, 0.35);
}

.btn-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  width: 100%;
  padding: 0.85rem;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Payment States */
.payment-pending,
.payment-success,
.payment-failed {
  text-align: center;
  padding: 2rem 1rem;
}

.pending-icon,
.success-icon,
.failed-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
}

.pending-icon {
  background: #fef3c7;
  color: #d97706;
}

.success-icon {
  background: #d1fae5;
  color: #059669;
}

.failed-icon {
  background: #fef2f2;
  color: #dc2626;
}

.payment-pending h4,
.payment-success h4,
.payment-failed h4 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.payment-pending p,
.payment-success p,
.payment-failed p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.payment-details {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-subtle);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1.5rem auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-ok,
.btn-retry {
  padding: 0.85rem 2rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-ok {
  background: #059669;
  color: white;
}

.btn-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);
}

.btn-retry {
  background: var(--primary-color);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 123, 26, 0.35);
}
</style>
