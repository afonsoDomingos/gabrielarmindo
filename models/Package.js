const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Preço numérico mínimo em USD (base de conversão)
  priceMin: {
    type: Number,
    default: null
  },
  // Preço numérico máximo em USD (null se não houver range)
  priceMax: {
    type: Number,
    default: null
  },
  // Campo legado de texto (manter compatibilidade)
  price: {
    type: String,
    default: 'Sob Consulta',
    trim: true
  },
  frequency: {
    type: String,
    default: '',
    trim: true
  },
  cta: {
    type: String,
    default: 'Solicitar Orçamento',
    trim: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: 'fas fa-chart-line',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Package', packageSchema);

