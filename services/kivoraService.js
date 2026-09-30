const axios = require('axios');

class KivoraService {
  constructor() {
    this.baseURL = process.env.KIVORA_API_URL || 'https://www.kivorapayments.com';
    this.apiKey = process.env.KIVORA_API_KEY;
    this.isTestMode = !this.apiKey || this.apiKey.startsWith('sk_test_');
  }

  /**
   * Create a C2B payment (Customer to Business)
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.phone - Customer phone number (without +258)
   * @param {number} paymentData.amount - Amount to charge
   * @param {string} paymentData.currency - Currency code (default: MZN)
   * @param {string} paymentData.reference - External reference (e.g., order ID)
   * @param {string} paymentData.description - Payment description
   * @returns {Promise<Object>} Payment response from Kivora
   */
  async createC2BPayment(paymentData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/c2b`,
        {
          phone: paymentData.phone,
          amount: paymentData.amount,
          currency: paymentData.currency || 'MZN',
          reference: paymentData.reference,
          description: paymentData.description
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Kivora C2B Payment Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'PAYMENT_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Get C2B payment status
   * @param {string} paymentId - Kivora payment ID
   * @returns {Promise<Object>} Payment status
   */
  async getC2BPayment(paymentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/c2b/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Kivora Get Payment Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'PAYMENT_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Create a B2C payout (Business to Customer)
   * @param {Object} payoutData - Payout details
   * @param {string} payoutData.phone - Beneficiary phone number
   * @param {number} payoutData.amount - Amount to send
   * @param {string} payoutData.currency - Currency code (default: MZN)
   * @param {string} payoutData.reference - External reference
   * @returns {Promise<Object>} Payout response
   */
  async createB2CPayout(payoutData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/b2c`,
        {
          phone: payoutData.phone,
          amount: payoutData.amount,
          currency: payoutData.currency || 'MZN',
          reference: payoutData.reference
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Kivora B2C Payout Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'PAYOUT_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Create a subscription
   * @param {Object} subscriptionData - Subscription details
   * @param {Object} subscriptionData.customer - Customer object (name, email, phone)
   * @param {number} subscriptionData.amount - Amount per cycle
   * @param {string} subscriptionData.currency - Currency code (default: MZN)
   * @param {string} subscriptionData.interval - billing interval (daily, weekly, monthly, yearly)
   * @param {string} subscriptionData.reference - External reference
   * @returns {Promise<Object>} Subscription response
   */
  async createSubscription(subscriptionData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/subscriptions`,
        {
          customer: subscriptionData.customer,
          amount: subscriptionData.amount,
          currency: subscriptionData.currency || 'MZN',
          interval: subscriptionData.interval,
          reference: subscriptionData.reference
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Kivora Subscription Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'SUBSCRIPTION_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Get subscription status
   * @param {string} subscriptionId - Kivora subscription ID
   * @returns {Promise<Object>} Subscription status
   */
  async getSubscription(subscriptionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Kivora Get Subscription Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || {
          code: 'SUBSCRIPTION_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Validate webhook signature (if Kivora provides this)
   * @param {string} signature - Webhook signature header
   * @param {string} payload - Raw webhook payload
   * @returns {boolean} Whether signature is valid
   */
  validateWebhookSignature(signature, payload) {
    // Implement signature validation if Kivora provides webhook signing
    // This is a placeholder - check Kivora documentation for actual implementation
    if (!process.env.KIVORA_WEBHOOK_SECRET) {
      console.warn('KIVORA_WEBHOOK_SECRET not configured, skipping signature validation');
      return true;
    }

    // TODO: Implement actual signature validation based on Kivora's webhook signing method
    // This might involve HMAC-SHA256 or similar
    return true;
  }

  /**
   * Process webhook event
   * @param {Object} webhookData - Webhook payload
   * @returns {Object} Processed event data
   */
  processWebhookEvent(webhookData) {
    const eventType = webhookData.type;
    const eventData = webhookData.data;

    return {
      eventType,
      eventId: webhookData.id,
      livemode: webhookData.livemode,
      timestamp: webhookData.created_at,
      data: eventData
    };
  }
}

module.exports = new KivoraService();
