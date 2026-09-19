const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Formação Académica', 'Gestão de Projectos & M&A', 'Análise de Dados & BI', 'Outras'],
    default: 'Formação Académica'
  },
  order: { type: Number, default: 0 }
});

const skillBarSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  percentage: { type: Number, required: true, min: 0, max: 100, default: 80 }
});

const skillCardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  years: { type: String, default: '5+ Anos' },
  subtitle: { type: String, trim: true },
  description: { type: String, trim: true }
});

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
  tag: { type: String, default: '' },
  desc: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const studySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  order: { type: Number, default: 0 }
});

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'fas fa-handshake' },
  order: { type: Number, default: 0 }
});

const resumeSchema = new mongoose.Schema({
  skillsIntro: {
    title: { type: String, default: 'Especialista em M&E,\nKoboToolbox e Análise de Dados' },
    description: { 
      type: String, 
      default: 'Mais de 10 anos de experiência em Monitoria e Avaliação, com expertise comprovada em KoboToolbox, Excel Avançado, Power BI e gestão de programas.' 
    }
  },
  education: [educationSchema],
  skillBars: [skillBarSchema],
  skillCards: [skillCardSchema],
  experiences: [experienceSchema],
  studies: [studySchema],
  partners: [partnerSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
