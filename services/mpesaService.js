const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.baseURL = process.env.MPESA_API_URL || 'https://api.mpesa.co.mz';
    this.apiKey = process.env.MPESA_API_KEY;
    this.publicKey = process.env.MPESA_PUBLIC_KEY;
    this.origin = process.env.MPESA_ORIGIN || 'partner'; // ou 'developer'
    this.isTestMode = !this.apiKey || this.apiKey.includes('test');
  }

  /**
   * Generate authentication token
   * M-Pesa uses public key encryption for authentication
   */
  generateAuthToken() {
    try {
      if (!this.publicKey) {
        throw new Error('MPESA_PUBLIC_KEY not configured');
      }

      // Decode the public key
      const publicKey = Buffer.from(this.publicKey, 'base64').toString('utf-8');

      // Create authorization token
      const authString = `${this.apiKey}:${this.origin}`;
      const buffer = Buffer.from(authString);
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        },
        buffer
      );

      return encrypted.toString('base64');
    } catch (error) {
      console.error('Error generating M-Pesa auth token:', error.message);
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
   * @returns {Promise<Object>} Payment response from M-Pesa
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
        `${this.baseURL}/c2b/v1/paymentrequest`,
        {
          input_CustomerMSISDN: phone,
          input_Amount: paymentData.amount,
          input_Currency: paymentData.currency || 'MZN',
          input_TransactionReference: paymentData.reference || `REF-${Date.now()}`,
          input_ThirdPartyConversationID: `TXN-${Date.now()}`,
          input_PurchaseItemsDesc: paymentData.description || 'Pagamento de Serviço'
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Origin': this.origin
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('M-Pesa C2B Payment Error:', error.response?.data || error.message);
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
   * Get C2B payment status
   * @param {string} transactionId - M-Pesa transaction ID
   * @returns {Promise<Object>} Payment status
   */
  async getC2BPayment(transactionId) {
    try {
      const authToken = this.generateAuthToken();

      const response = await axios.get(
        `${this.baseURL}/c2b/v1/querytransactionstatus`,
        {
          params: {
            input_TransactionID: transactionId,
            input_ThirdPartyConversationID: transactionId
          },
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Origin': this.origin
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('M-Pesa Get Payment Error:', error.response?.data || error.message);
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
   * Create B2C payout (Business to Customer)
   * @param {Object} payoutData - Payout details
   * @param {string} payoutData.phone - Beneficiary phone number
   * @param {number} payoutData.amount - Amount to send
   * @param {string} payoutData.currency - Currency code (default: MZN)
   * @param {string} payoutData.reference - External reference
   * @returns {Promise<Object>} Payout response
   */
  async createB2CPayout(payoutData) {
    try {
      const authToken = this.generateAuthToken();

      // Format phone number
      let phone = payoutData.phone;
      if (!phone.startsWith('+')) {
        if (phone.startsWith('258')) {
          phone = '+' + phone;
        } else {
          phone = '+258' + phone;
        }
      }

      const response = await axios.post(
        `${this.baseURL}/b2c/v1/paymentrequest`,
        {
          input_CustomerMSISDN: phone,
          input_Amount: payoutData.amount,
          input_Currency: payoutData.currency || 'MZN',
          input_TransactionReference: payoutData.reference || `PAYOUT-${Date.now()}`,
          input_ThirdPartyConversationID: `TXN-${Date.now()}`
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Origin': this.origin
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('M-Pesa B2C Payout Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || {
          code: 'PAYOUT_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Validate webhook signature (if M-Pesa provides this)
   * @param {string} signature - Webhook signature header
   * @param {string} payload - Raw webhook payload
   * @returns {boolean} Whether signature is valid
   */
  validateWebhookSignature(signature, payload) {
    // Implement signature validation if M-Pesa provides webhook signing
    // This is a placeholder - check M-Pesa documentation for actual implementation
    if (!process.env.MPESA_WEBHOOK_SECRET) {
      console.warn('MPESA_WEBHOOK_SECRET not configured, skipping signature validation');
      return true;
    }

    // TODO: Implement actual signature validation based on M-Pesa's webhook signing method
    return true;
  }

  /**
   * Process webhook event
   * @param {Object} webhookData - Webhook payload
   * @returns {Object} Processed event data
   */
  processWebhookEvent(webhookData) {
    // M-Pesa webhook structure may vary - adapt based on actual API documentation
    return {
      transactionId: webhookData.TransactionID || webhookData.input_TransactionID,
      status: this.mapMpesaStatus(webhookData.ResponseCode || webhookData.status),
      amount: webhookData.Amount || webhookData.input_Amount,
      phone: webhookData.MSISDN || webhookData.input_CustomerMSISDN,
      reference: webhookData.Reference || webhookData.input_TransactionReference,
      rawData: webhookData
    };
  }

  /**
   * Map M-Pesa status codes to standard status
   * @param {string} mpesaStatus - M-Pesa status code
   * @returns {string} Standardized status
   */
  mapMpesaStatus(mpesaStatus) {
    const statusMap = {
      'INS-0': 'paid', // Success
      'INS-1': 'failed', // Failed
      'INS-2': 'pending', // Pending
      'INS-3': 'processing', // Processing
      'INS-5': 'failed', // Insufficient funds
      'INS-6': 'failed', // Invalid MSISDN
      'INS-7': 'failed', // Invalid amount
      'INS-8': 'failed', // Invalid transaction
      'INS-9': 'failed', // Duplicate transaction
      'INS-10': 'failed', // System error
      'INS-200': 'paid', // Successful
      'INS-201': 'failed', // Request rejected
      'INS-202': 'failed', // Request rejected
      'INS-205': 'failed', // Request rejected
      'paid': 'paid',
      'failed': 'failed',
      'pending': 'pending',
      'processing': 'processing'
    };

    return statusMap[mpesaStatus] || 'pending';
  }
}

module.exports = new MpesaService();
