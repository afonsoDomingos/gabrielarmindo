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
  },
  purchaseCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['payment-complete', 'payment-cancelled']);

// Gateway selection
const selectedGateway = ref('MPESA');
const availableGateways = [
  { value: 'MPESA', name: 'M-Pesa', icon: 'fas fa-mobile-alt' },
  { value: 'EMOLA', name: 'e-Mola', icon: 'fas fa-sim-card' },
  { value: 'KIVORA', name: 'Kivora', icon: 'fas fa-credit-card' }
];

// Form state
const paymentForm = ref({
  fullName: '',
  email: '',
  whatsapp: '',
  phone: ''
});

const agreeTerms = ref(false);

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

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(paymentForm.value.email);
});

// Form validation
const isFormValid = computed(() => {
  return paymentForm.value.fullName.trim() !== '' &&
         isValidEmail.value &&
         isValidPhone.value &&
         agreeTerms.value;
});

// Gateway label helper
const getGatewayLabel = () => {
  const labels = {
    'MPESA': 'Número M-Pesa',
    'EMOLA': 'Número e-Mola',
    'KIVORA': 'Número de telemóvel'
  };
  return labels[selectedGateway.value] || 'Número de telemóvel';
};

// Phone placeholder helper
const getPhonePlaceholder = () => {
  const placeholders = {
    'MPESA': '841234567',
    'EMOLA': '841234567',
    'KIVORA': '841234567'
  };
  return placeholders[selectedGateway.value] || '841234567';
};

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
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, preencha todos os campos obrigatórios.';
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
      customerName: paymentForm.value.fullName,
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
    fullName: '',
    email: '',
    whatsapp: '',
    phone: ''
  };
  agreeTerms.value = false;
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
      <!-- Close button -->
      <button @click="cancelPayment" class="close-btn">&times;</button>

      <!-- Loading State -->
      <div v-if="isProcessing && paymentStatus === 'processing'" class="processing-overlay">
        <div class="spinner"></div>
        <p>A processar pagamento...</p>
      </div>

      <!-- Pending Payment State -->
      <div v-if="paymentStatus === 'pending'" class="pending-state">
        <div class="pending-icon">
          <i class="fas fa-clock"></i>
        </div>
        <h4>Aguardando Pagamento</h4>
        <p>Verifique o seu telemóvel. Você receberá uma notificação para autorizar o pagamento.</p>
        <p class="payment-details">
          <strong>Valor:</strong> {{ currency }} {{ price }}<br>
          <strong>Gateway:</strong> {{ selectedGateway }}<br>
          <strong>Transacção:</strong> {{ gatewayPaymentId }}
        </p>
        <div class="spinner"></div>
        <p class="status-text">A verificar o status...</p>
      </div>

      <!-- Payment Successful -->
      <div v-if="paymentStatus === 'paid'" class="success-state">
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
      <div v-if="paymentStatus === 'failed'" class="failed-state">
        <div class="failed-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h4>Pagamento Falhou</h4>
        <p>{{ errorMessage || 'Ocorreu um erro ao processar o pagamento.' }}</p>
        <button @click="resetForm" class="btn-retry">
          <i class="fas fa-redo"></i> Tentar Novamente
        </button>
      </div>

      <!-- Main Checkout Form -->
      <div v-if="!paymentStatus || paymentStatus === 'failed'" class="checkout-content">
        <!-- Left Column: Product Details -->
        <div class="product-details">
          <div class="product-header">
            <h3>{{ packageName }}</h3>
            <div class="purchase-count">
              <i class="fas fa-users"></i>
              <span>{{ purchaseCount }} pessoas já compraram este produto!</span>
            </div>
          </div>

          <div class="price-summary">
            <div class="price-row">
              <span>Subtotal</span>
              <span>{{ currency }} {{ price }}</span>
            </div>
            <div class="price-row">
              <span>Impostos</span>
              <span>Grátis</span>
            </div>
            <div class="price-row total">
              <span>Total</span>
              <span>{{ currency }} {{ price }}</span>
            </div>
          </div>

          <div class="product-features">
            <h4>O que está incluído:</h4>
            <ul>
              <li><i class="fas fa-check"></i> Acesso imediato ao conteúdo</li>
              <li><i class="fas fa-check"></i> Suporte técnico via WhatsApp</li>
              <li><i class="fas fa-check"></i> Actualizações gratuitas</li>
              <li><i class="fas fa-check"></i> Certificado de conclusão</li>
            </ul>
          </div>
        </div>

        <!-- Right Column: Payment Form -->
        <div class="payment-form">
          <h3>Dados de Compra</h3>

          <div class="form-group">
            <label>Nome completo *</label>
            <input
              v-model="paymentForm.fullName"
              type="text"
              placeholder="Seu nome completo"
              :class="{ 'error': paymentForm.fullName.trim() === '' && errorMessage }"
            />
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input
              v-model="paymentForm.email"
              type="email"
              placeholder="seu@email.com"
              :class="{ 'error': !isValidEmail && paymentForm.email }"
            />
          </div>

          <div class="form-group">
            <label>WhatsApp (opcional)</label>
            <input
              v-model="paymentForm.whatsapp"
              type="tel"
              placeholder="841234567"
              maxlength="9"
            />
          </div>

          <div class="form-group">
            <label>Selecione o método de pagamento *</label>
            <div class="gateway-selector">
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

          <div class="form-group">
            <label>{{ getGatewayLabel() }} *</label>
            <input
              v-model="paymentForm.phone"
              @input="handlePhoneInput"
              type="tel"
              :placeholder="getPhonePlaceholder()"
              maxlength="9"
              :class="{ 'error': !isValidPhone && paymentForm.phone.length > 0 }"
            />
            <small v-if="!isValidPhone && paymentForm.phone.length > 0" class="error-text">
              Número inválido (9 dígitos, começando com 8, 7 ou 6)
            </small>
          </div>

          <div class="terms-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" />
              <span>Ao clicar em "Finalizar Compra", você concorda com os <a href="/termos" target="_blank">Termos de Uso</a> e <a href="/privacidade" target="_blank">Política de Privacidade</a>.</span>
            </label>
          </div>

          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button
            @click="initiatePayment"
            :disabled="!isFormValid || isProcessing"
            class="btn-purchase"
          >
            <i v-if="isProcessing" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-lock"></i>
            {{ isProcessing ? 'Processando...' : 'Finalizar Compra' }}
          </button>

          <div class="secure-badge">
            <i class="fas fa-shield-alt"></i>
            <span>Pagamento 100% seguro</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-checkout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.checkout-container {
  background: white;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #dc2626;
}

/* Processing Overlay */
.processing-overlay,
.pending-state,
.success-state,
.failed-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 3rem;
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
  margin-bottom: 1.5rem;
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

.pending-state h4,
.success-state h4,
.failed-state h4 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.pending-state p,
.success-state p,
.failed-state p {
  color: #64748b;
  text-align: center;
  max-width: 400px;
  margin-bottom: 1rem;
}

.payment-details {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #334155;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1.5rem 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  color: #64748b;
  font-size: 0.9rem;
}

.btn-ok,
.btn-retry {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-ok {
  background: #059669;
  color: white;
}

.btn-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.35);
}

.btn-retry {
  background: #667eea;
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
}

/* Main Content */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

/* Left Column - Product Details */
.product-details {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  color: white;
}

.product-header {
  margin-bottom: 2rem;
}

.product-header h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.purchase-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  width: fit-content;
}

.purchase-count i {
  color: #fef3c7;
}

.price-summary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.price-row:last-child {
  border-bottom: none;
}

.price-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.product-features {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
}

.product-features h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.product-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.product-features li i {
  color: #fef3c7;
}

/* Right Column - Payment Form */
.payment-form {
  padding: 3rem;
  background: white;
}

.payment-form h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 2rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background: #f8fafc;
  color: #1e293b;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
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

/* Gateway Selector */
.gateway-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.gateway-option {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
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
  border-color: #667eea;
  color: #667eea;
}

.gateway-option.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.gateway-option i {
  font-size: 1.1rem;
}

/* Terms Checkbox */
.terms-checkbox {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: underline;
}

.checkbox-label a:hover {
  color: #764ba2;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

/* Purchase Button */
.btn-purchase {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-purchase:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-purchase:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Secure Badge */
.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 600;
}

.secure-badge i {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .product-details {
    padding: 2rem;
  }

  .payment-form {
    padding: 2rem;
  }

  .payment-checkout {
    padding: 1rem;
  }

  .product-header h3 {
    font-size: 1.5rem;
  }

  .gateway-selector {
    grid-template-columns: 1fr;
  }
}
</style>
