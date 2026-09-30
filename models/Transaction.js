const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Payment gateway
  gateway: {
    type: String,
    enum: ['KIVORA', 'MPESA', 'EMOLA'],
    required: true,
    default: 'KIVORA'
  },

  // Gateway-specific payment IDs
  kivoraPaymentId: String,
  mpesaTransactionId: String,
  emolaTransactionId: String,

  // Payment type (C2B, B2C, SUBSCRIPTION)
  paymentType: {
    type: String,
    enum: ['C2B', 'B2C', 'SUBSCRIPTION'],
    default: 'C2B'
  },

  // Status from gateway
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Customer information
  customer: {
    name: String,
    email: String,
    phone: {
      type: String,
      required: true
    }
  },

  // Payment details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'MZN'
  },

  // Reference (order ID, subscription ID, etc.)
  reference: {
    type: String
  },

  // Description
  description: {
    type: String
  },

  // Package/service being purchased
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  packageName: String,

  // Webhook data
  webhookReceived: {
    type: Boolean,
    default: false
  },
  webhookData: {
    type: Object
  },

  // Timestamps
  completedAt: Date,
  failedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
TransactionSchema.index({ gateway: 1 });
TransactionSchema.index({ kivoraPaymentId: 1 });
TransactionSchema.index({ mpesaTransactionId: 1 });
TransactionSchema.index({ emolaTransactionId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ customer: { phone: 1 } });
TransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
