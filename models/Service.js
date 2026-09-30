const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleEn: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fas fa-chart-line'
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  featuresEn: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
