const axios = require('axios');
const crypto = require('crypto');

class EmolaService {
  constructor() {
    this.baseURL = process.env.EMOLA_API_URL || 'https://api.emola.co.mz';
    this.apiKey = process.env.EMOLA_API_KEY;
    this.apiSecret = process.env.EMOLA_API_SECRET;
    this.merchantId = process.env.EMOLA_MERCHANT_ID;
    this.isTestMode = !this.apiKey || this.apiKey.includes('test');
  }

  /**
   * Generate authentication token
   * e-Mola uses API Key and Secret for authentication
   */
  generateAuthToken() {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('EMOLA_API_KEY and EMOLA_API_SECRET not configured');
      }

      // Create authorization token (API Key + Secret hashed)
      const authString = `${this.apiKey}:${this.apiSecret}`;
      const hash = crypto.createHash('sha256').update(authString).digest('hex');

      return hash;
    } catch (error) {
      console.error('Error generating e-Mola auth token:', error.message);
      throw error;
    }
  }

  /**
   * Create C2B payment (Customer to Business)
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.phone - Customer phone number (with +258 or 84...)
   * @param {number} paymentData.amount - Amount to charge
   * @param {string} paymentData.currency - Currency code (default: MZN)
   * @param {string} paymentData.reference - External reference
   * @param {string} paymentData.description - Payment description
   * @returns {Promise<Object>} Payment response from e-Mola
   */
  async createC2BPayment(paymentData) {
    try {
      const authToken = this.generateAuthToken();

      // Format phone number - ensure it has +258 prefix
      let phone = paymentData.phone;
      if (!phone.startsWith('+')) {
        if (phone.startsWith('258')) {
          phone = '+' + phone;
        } else {
          phone = '+258' + phone;
        }
      }

      const response = await axios.post(
        `${this.baseURL}/api/v1/payment`,
        {
          merchant_id: this.merchantId,
          customer_phone: phone,
          amount: paymentData.amount,
          currency: paymentData.currency || 'MZN',
          reference: paymentData.reference || `REF-${Date.now()}`,
          description: paymentData.description || 'Pagamento de Serviço',
          callback_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/webhooks/emola`
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('e-Mola C2B Payment Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || {
          code: 'PAYMENT_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Query C2B payment status
   * @param {string} transactionId - e-Mola transaction ID
   * @returns {Promise<Object>} Payment status response
   */
  async getC2BPayment(transactionId) {
    try {
      const authToken = this.generateAuthToken();

      const response = await axios.get(
        `${this.baseURL}/api/v1/payment/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('e-Mola Status Query Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || {
          code: 'STATUS_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Process webhook event from e-Mola
   * @param {Object} event - Webhook event data
   * @returns {Object} Processed event with normalized status
   */
  processWebhookEvent(event) {
    try {
      // Map e-Mola status codes to our standard statuses
      const statusMap = {
        'PENDING': 'pending',
        'PROCESSING': 'processing',
        'COMPLETED': 'paid',
        'SUCCESS': 'paid',
        'FAILED': 'failed',
        'CANCELLED': 'cancelled',
        'EXPIRED': 'failed'
      };

      const status = statusMap[event.status] || event.status?.toLowerCase() || 'pending';

      return {
        transactionId: event.transaction_id || event.id,
        status: status,
        amount: event.amount,
        currency: event.currency,
        phone: event.customer_phone || event.phone,
        reference: event.reference,
        timestamp: event.timestamp || new Date(),
        rawEvent: event
      };
    } catch (error) {
      console.error('Error processing e-Mola webhook event:', error.message);
      return {
        status: 'pending',
        rawEvent: event
      };
    }
  }

  /**
   * Validate webhook signature
   * @param {string} signature - Signature from webhook header
   * @param {string} payload - Raw webhook payload
   * @returns {boolean} Whether signature is valid
   */
  validateWebhookSignature(signature, payload) {
    try {
      if (!process.env.EMOLA_WEBHOOK_SECRET) {
        console.warn('EMOLA_WEBHOOK_SECRET not configured, skipping signature validation');
        return true;
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.EMOLA_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Error validating e-Mola webhook signature:', error.message);
      return false;
    }
  }
}

module.exports = new EmolaService();
