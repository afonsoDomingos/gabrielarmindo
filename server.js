const dns = require('dns');
// Set custom DNS only on local Windows to bypass local Windows DNS SRV lookup issues
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn('Aviso DNS:', e.message);
  }
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Ignore filesystem errors in serverless environments (e.g. Vercel read-only disk)
}

// Models
const Post = require('./models/Post');
const Package = require('./models/Package');
const Message = require('./models/Message');
const Testimonial = require('./models/Testimonial');
const User = require('./models/User');
const Resume = require('./models/Resume');
const Service = require('./models/Service');
const Transaction = require('./models/Transaction');

// Cloudinary Configuration with Local Fallback
let upload;
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio_blog',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
      }
    });
    upload = multer({ storage: storage });
  } catch (err) {
    console.warn('Falha ao configurar Cloudinary, usando disco local:', err.message);
  }
}

if (!upload) {
  if (process.env.VERCEL) {
    upload = multer({ storage: multer.memoryStorage() });
  } else {
    const localStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + ext);
      }
    });
    upload = multer({ storage: localStorage });
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir));
app.use(express.static('dist'));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gabrielarmindodb';
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI não encontrada no .env. Utilizando URI local ou de fallback.');
}

// Default Resume / Trajectory Data
function getDefaultResumeData() {
  return {
    skillsIntro: {
      title: 'Especialista em M&E,\nKoboToolbox e Análise de Dados',
      description: 'Mais de 10 anos de experiência em Monitoria e Avaliação, com expertise comprovada em KoboToolbox, Excel Avançado, Power BI e gestão de programas.'
    },
    education: [
      { category: 'Formação Académica', title: 'Licenciatura em Psicologia Social e das Organizações', issuer: 'Universidade Eduardo Mondlane (2018 - 2022)', order: 1 },
      { category: 'Formação Académica', title: 'Técnico Médio de Agro-Pecuária', issuer: 'Instituto Agrário de Chimoio (2013 - 2015)', order: 2 },
      { category: 'Gestão de Projectos & M&A', title: 'Certificação em MEAL para Desenvolvimento', issuer: 'Humanitarian Leadership Academy', order: 3 },
      { category: 'Gestão de Projectos & M&A', title: 'Certificação em Monitoria e Avaliação de Projectos', issuer: 'SentiPensar', order: 4 },
      { category: 'Gestão de Projectos & M&A', title: 'Certificação em Teoria da Mudança', issuer: 'SentiPensar', order: 5 },
      { category: 'Análise de Dados & BI', title: 'Certificação em Data Analytics Essentials', issuer: 'Cisco Networking Academy', order: 6 },
      { category: 'Análise de Dados & BI', title: 'Extensão Universitária em Gestão e Análise de Dados com KoboToolbox, Excel, Power BI, SPSS e R', issuer: 'Corporate Business School', order: 7 },
      { category: 'Análise de Dados & BI', title: 'Certificação em Power BI – Business Intelligence', issuer: 'Expert Cursos', order: 8 },
      { category: 'Análise de Dados & BI', title: 'Certificação em Excel: Do Zero ao Avançado', issuer: 'EvolutionTech Training', order: 9 },
      { category: 'Análise de Dados & BI', title: 'Certificação em Análise de Dados com Excel', issuer: 'EvolutionTech Training', order: 10 }
    ],
    skillBars: [
      { name: 'KoboToolbox Design', percentage: 95 },
      { name: 'Excel Avançado', percentage: 90 },
      { name: 'Sistemas M&E', percentage: 95 },
      { name: 'Power BI & Data Analysis', percentage: 85 },
      { name: 'Program Management', percentage: 88 }
    ],
    skillCards: [
      {
        title: 'KoboToolbox Expert',
        years: '10+ Anos',
        subtitle: 'Design e Implementação',
        description: 'Especialista em desenho de formulários Excel para KoboToolbox, validação, lógica condicional e integração com sistemas M&E.'
      },
      {
        title: 'M&E Specialist',
        years: '10+ Anos',
        subtitle: 'Monitoria e Avaliação',
        description: 'Implementação de sistemas M&E completos, desde desenho até relatórios, incluindo baseline, endline e avaliações de impacto.'
      },
      {
        title: 'Data Analysis Expert',
        years: '8+ Anos',
        subtitle: 'Excel & Power BI',
        description: 'Criação de dashboards avançados em Excel e Power BI para análise de dados, KPIs e tomada de decisão baseada em evidências.'
      }
    ],
    experiences: [
      {
        role: 'Consultor de Monitoria, Avaliação e Pesquisa',
        company: 'Consulting And Coaching Agency',
        period: '09/2025 - Presente',
        tag: '',
        desc: '• Desenvolvimento de cursos em Monitoria & Avaliação, Excel, Análise de Dados e KoboToolbox\n• Capacitação de equipas e parceiros através de formações técnicas e mentorias\n• Desenho de formulários em XLSForm/KoboToolbox, integração com ODK e Power BI\n• Desenvolvimento de planos de M&A, estudos de base, avaliações de impacto e relatórios técnicos\n• Garantia da qualidade de dados (DQA) e apoio à tomada de decisão baseada em evidências',
        order: 1
      },
      {
        role: 'Especialista em Monitoria e Avaliação',
        company: 'ODEI',
        period: '2023 - 2025',
        tag: '',
        desc: '• Coordenação e implementação de sistemas de MEAL\n• Monitoria de projectos e avaliações (baseline, PDM e outcome monitoring)\n• Gestão da qualidade de dados e mechanisms de accountability comunitária\n• Desenvolvimento de ferramentas digitais de recolha de dados\n• Formação e supervisão de inquiridores\n• Produção de relatórios técnicos e acompanhamento de campo com foco em qualidade e conformidade humanitária',
        order: 2
      },
      {
        role: 'Docente',
        company: 'Escola de Desenho, Monitoria e Avaliação',
        period: '11/2025 - Actualmente',
        tag: 'TEMPO PARCIAL',
        desc: 'Docente dos módulos de Monitoria & Avaliação e Análise de Dados.',
        order: 3
      },
      {
        role: 'Consultor de Pesquisa',
        company: 'Prátiq Consultoria',
        period: '2021 - 2023',
        tag: '',
        desc: '• Desenvolvimento de propostas técnicas e financeiras\n• Elaboração de protocolos de pesquisa\n• Gestão da qualidade e integridade de dados\n• Análise de evidências e produção de relatórios analíticos para apoio à tomada de decisão',
        order: 4
      },
      {
        role: 'Técnico de Apoio Psicossocial',
        company: 'Helen Keller International',
        period: '2019 - 2021',
        tag: '',
        desc: '• Implementação de intervenções psicossociais inclusivas para jovens com deficiência visual\n• Apoio em direitos humanos, protecção, inclusão social e fortalecimento comunitário\n• Gestão de casos de VBG e apoio psicossocial individual e familiar\n• Mobilização comunitária e articulação multissectorial com autoridades locais e unidades sanitárias',
        order: 5
      }
    ],
    studies: [
      {
        title: 'Concepção e Realização de Avaliações',
        description: 'Especialista na concepção e realização de avaliações completas incluindo baseline, endline, outcome e avaliações de impacto para organizações.',
        tags: ['Baseline', 'Endline', 'PDM'],
        order: 1
      },
      {
        title: 'Pesquisas Sociais & Psicológicas',
        description: 'Pesquisas sociais e antropológicas incluindo estudos sobre intervenção psicológica em situações de crise.',
        tags: ['Psicologia', 'Qualitativo'],
        order: 2
      },
      {
        title: 'Avaliações de Necessidades',
        description: 'Avaliações de necessidades para resposta humanitária e desenvolvimento comunitário em contextos de emergência e pós-conflito.',
        tags: ['Emergência', 'Humanitário'],
        order: 3
      },
      {
        title: 'Pesquisa de Mercado',
        description: 'Análises de mercado e auditorias de qualidade de dados (DQA) para garantir integridade e precisão dos sistemas M&E.',
        tags: ['Análise de Mercado', 'DQA'],
        order: 4
      }
    ],
    partners: [
      {
        name: 'ODEI',
        description: 'Coordenação técnica de sistemas de MEAL, DQA e gestão de qualidade de dados em projectos humanitários.',
        icon: 'fas fa-university',
        order: 1
      },
      {
        name: 'Consulting And Coaching Agency',
        description: 'Consultoria especializada em capacitação de equipas, dashboards estratégicos e recolha digital (KoboToolbox).',
        icon: 'fas fa-brain',
        order: 2
      }
    ],
    consultancies: [
      {
        title: 'Consultoria de Monitoria, Avaliação e Pesquisa',
        client: 'Consulting And Coaching Agency',
        period: '09/2025 - Presente',
        location: 'Moçambique',
        type: 'Consultoria M&E',
        description: 'Desenvolvimento de cursos práticos e capacitação institucional em Monitoria & Avaliação, Excel Avançado e KoboToolbox. Desenho de formulários em XLSForm/ODK e integração com dashboards analíticos em Power BI.',
        tags: ['M&E', 'KoboToolbox', 'Power BI', 'Capacitação'],
        order: 1
      },
      {
        title: 'Consultoria de Pesquisa e Avaliações Técnicas',
        client: 'Prátiq Consultoria',
        period: '2021 - 2023',
        location: 'Moçambique',
        type: 'Pesquisa Aplicada',
        description: 'Desenvolvimento de propostas técnicas e financeiras, elaboração de protocolos de pesquisa de campo, supervisão de colecta e garantia da integridade e qualidade de dados analíticos.',
        tags: ['Pesquisa', 'Protocolos', 'DQA', 'Análise'],
        order: 2
      }
    ]
  };
}

// Initial Seed Data
const seedInitialData = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('Populando artigos de blog iniciais no MongoDB...');
      await Post.insertMany([
        {
          title: 'A Importância do MEAL em Projectos de Impacto Social',
          slug: 'importancia-meal-projectos-impacto-social',
          excerpt: 'Como sistemas de monitoria e avaliação transformam a gestão de projectos humanitários e asseguram resultados sustentáveis.',
          content: '<p>A <strong>Monitoria, Avaliação, Prestação de Contas e Aprendizagem (MEAL)</strong> é a espinha dorsal de qualquer intervenção de desenvolvimento eficaz. Neste artigo, exploramos como o desenho de quadros lógicos robustos e a recolha sistemática de dados permitem não apenas medir o sucesso, mas aprender com os desafios e adaptar estratégias em tempo real para maximizar o impacto nas comunidades.</p><p>Um sistema MEAL bem estruturado garante transparência para doadores e beneficiários, permitindo tomadas de decisão baseadas em evidências rigorosas.</p>',
          author: 'Gabriel Armindo',
          category: 'MEAL',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
          views: 124,
          published: true
        },
        {
          title: 'Análise de Dados com Power BI para Tomada de Decisão Estratégica',
          slug: 'analise-dados-power-bi-decisao-estrategica',
          excerpt: 'Transformando dados brutos em dashboards interativos e insights acionáveis para stakeholders e doadores.',
          content: '<p>No sector humanitário e corporativo, a capacidade de visualizar dados complexos de forma clara é crucial. Utilizando ferramentas modernas como <strong>Power BI</strong> e <strong>SPSS</strong>, conseguimos transformar folhas de cálculo densas em indicadores visuais que facilitam a compreensão rápida do progresso do projecto.</p><p>Discutiremos técnicas de limpeza de dados, modelagem analítica e as melhores práticas para criar dashboards que suportem a tomada de decisão baseada em evidências sólidas.</p>',
          author: 'Gabriel Armindo',
          category: 'Dados',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          views: 87,
          published: true
        },
        {
          title: 'Psicologia Social e Inclusão em Contextos Humanitários Complexos',
          slug: 'psicologia-social-inclusao-humanitarios-complexos',
          excerpt: 'A integração de abordagens sensíveis ao género e protecção baseada em direitos humanos em intervenções comunitárias.',
          content: '<p>A minha formação em <strong>Psicologia Social e Comunitária</strong> permite uma visão aprofundada sobre como as intervenções afectam as dinâmicas comunitárias e individuais. Este artigo foca na importância de incluir perspectivas de género e inclusão social (GESI) desde a fase inicial de diagnóstico.</p><p>Garantir que populações vulneráveis tenham voz ativa no processo de avaliação não é apenas um imperativo ético, mas uma garantia de eficácia de longo prazo.</p>',
          author: 'Gabriel Armindo',
          category: 'Geral',
          image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
          views: 95,
          published: true
        }
      ]);
      console.log('✅ Artigos de blog iniciais inseridos com sucesso!');
    }

    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      console.log('Populando pacotes de serviços iniciais no MongoDB...');
      await Package.insertMany([
        {
          title: 'Consultoria M&E',
          priceMin: 200,
          priceMax: 300,
          price: '$200-300',
          frequency: 'Por dia / Consultoria',
          cta: 'Solicitar Orçamento',
          popular: false,
          description: 'Consultoria especializada em Monitoria e Avaliação para projectos humanitários e de desenvolvimento.',
          features: ['Desenho e condução de avaliações', 'Propostas técnicas e financeiras', 'Treinamento de inquiridores', 'Análise de dados', 'Produção de relatórios'],
          icon: 'fas fa-chart-line',
          order: 1
        },
        {
          title: 'Sistema M&E Completo',
          priceMin: 94,
          priceMax: null,
          price: 'A partir de $94',
          frequency: 'Por projeto / 2-3 meses',
          cta: 'Começar Projeto',
          popular: true,
          description: 'Desenvolvimento e implementação completa de sistemas integrados de MEAL para organizações.',
          features: ['Sistema M&E personalizado', 'Formulários KoboToolbox', 'Dashboard Power BI/Excel', 'Treinamento da equipe', 'Suporte por 3 meses'],
          icon: 'fas fa-cogs',
          order: 2
        },
        {
          title: 'M&E Mentorship',
          priceMin: 31,
          priceMax: null,
          price: 'A partir de $31',
          frequency: 'Por mês / Mínimo 4 sessões',
          cta: 'Começar Mentoria',
          popular: false,
          description: 'Mentoria técnica especializada para profissionais e organizações em Monitoria, Avaliação e Aprendizagem.',
          features: ['4+ sessões mensais', 'Desenvolvimento de capacidades', 'Suporte via WhatsApp', 'Templates M&E e ferramentas', 'Revisão de documentos'],
          icon: 'fas fa-user-friends',
          order: 3
        },
        {
          title: 'Esclarecimentos M&E',
          priceMin: 8,
          priceMax: null,
          price: 'A partir de $8',
          frequency: 'Por hora / Sessão',
          cta: 'Agendar Sessão',
          popular: false,
          description: 'Sessões de esclarecimento técnico sobre metodologias e práticas de M&E.',
          features: ['Dúvidas sobre metodologias M&E', 'Orientação em projetos', 'Suporte técnico pontual', 'Consulta via chamada/video'],
          icon: 'fas fa-comments',
          order: 4
        },
        {
          title: 'Revisão de CVs',
          priceMin: 8,
          priceMax: null,
          price: 'A partir de $8',
          frequency: 'Por CV / Entrega em 72h',
          cta: 'Enviar CV',
          popular: false,
          description: 'Revisão completa e otimização do CV para a área M&E com entrega em 72 horas.',
          features: ['Revisão completa do CV', 'Otimização para área M&E', 'Sugestões de melhorias', 'Formatação profissional'],
          icon: 'fas fa-file-alt',
          order: 5
        },
        {
          title: 'Criação de Dashboards com efeito UAU',
          priceMin: 100,
          priceMax: 1000,
          price: '$100-1000',
          frequency: 'Por projeto / escopo sob medida',
          cta: 'Começar Projeto',
          popular: false,
          description: 'Dashboards profissionais em Power BI e Excel com design premium e integração de dados.',
          features: ['Design profissional em Power BI e Excel', 'Integração de fontes de dados', 'KPIs claros e interatividade', 'Suporte opcional de ajustes'],
          icon: 'fas fa-chart-bar',
          order: 6
        }
      ]);
      console.log('✅ Pacotes de serviços iniciais inseridos com sucesso!');
    }


    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('Populando depoimento inicial no MongoDB...');
      await Testimonial.create({
        name: 'Samuel Matola',
        role: 'Consultor de Pesquisa | Oficial de MEAL',
        content: 'Participar da mentoria em Monitoria e Avaliação com Gabriel Armindo foi uma experiência transformadora para a minha carreira. Os conteúdos práticos e bem estruturados ajudaram-me a aplicar os conceitos no dia a dia, dando-me confiança para atuar como Consultor e Oficial de MEAL. Sou muito grato pelo profissionalismo e dedicação do mentor.',
        rating: 5,
        active: true
      });
      console.log('✅ Depoimento inicial inserido!');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Populando usuário administrador inicial no MongoDB...');
      await User.create({
        name: 'Gabriel Armindo',
        email: process.env.ADMIN_EMAIL || 'info@gabrielarmindo.com',
        password: process.env.ADMIN_PASSWORD || '@Admin123@',
        role: 'superadmin',
        avatar: '/images/perfil1.png'
      });
      console.log('✅ Usuário administrador criado com sucesso no MongoDB Atlas!');
    }

    const resumeCount = await Resume.countDocuments();
    if (resumeCount === 0) {
      console.log('Populando dados de currículo iniciais no MongoDB...');
      await Resume.create(getDefaultResumeData());
      console.log('✅ Dados de currículo iniciais inseridos com sucesso!');
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('Populando serviços iniciais no MongoDB...');
      await Service.insertMany([
        {
          title: 'Design de Formulários para KoboToolbox',
          titleEn: 'Form Design for KoboToolbox',
          icon: 'fas fa-clipboard-list',
          description: 'Especialista no desenho de formulários avançados em KoboToolbox/XLSForm para recolha de dados de alta qualidade em contextos de pesquisa, monitoria e avaliação.',
          descriptionEn: 'Expert in designing advanced forms in KoboToolbox/XLSForm for high-quality data collection in research, monitoring, and evaluation contexts.',
          features: [
            'Criação de formulários inteligentes com XLSForm',
            'Desenvolvimento de lógica condicional e validações automatizadas',
            'Estruturação de instrumentos complexos para estudos, avaliações e projectos humanitários',
            'Integração de sistemas de recolha de dados com sistemas de MEAL',
            'Formação e supervisão de enumeradores em recolha digital, ética e controlo de qualidade'
          ],
          featuresEn: [
            'Smart form creation with XLSForm',
            'Development of conditional logic and automated validations',
            'Structuring complex instruments for studies, evaluations, and humanitarian projects',
            'Integration of data collection systems with MEAL systems',
            'Training and supervision of enumerators in digital collection, ethics, and quality control'
          ],
          order: 1,
          active: true
        },
        {
          title: 'Sistemas de Monitoria & Avaliação (M&E)',
          titleEn: 'Monitoring & Evaluation Systems (M&E)',
          icon: 'fas fa-chart-line',
          description: 'Desenvolvimento e implementação de sistemas integrados de MEAL para monitorar desempenho, gerar evidências e apoiar decisões estratégicas.',
          descriptionEn: 'Development and implementation of integrated MEAL systems to monitor performance, generate evidence, and support strategic decisions.',
          features: [
            'Desenvolvimento de KPIs e frameworks de desempenho',
            'Sistemas digitais de recolha, gestão e validação de dados',
            'Automatização de dashboards e relatórios analíticos',
            'Configuração de mecanismos de alerta e acompanhamento em tempo real'
          ],
          featuresEn: [
            'Development of KPIs and performance frameworks',
            'Digital systems for data collection, management, and validation',
            'Automation of dashboards and analytical reports',
            'Configuration of alert mechanisms and real-time monitoring'
          ],
          order: 2,
          active: true
        },
        {
          title: 'Data Analysis & Business Intelligence',
          titleEn: 'Data Analysis & Business Intelligence',
          icon: 'fas fa-laptop-code',
          description: 'Análise avançada de dados e criação de dashboards interactivos para geração de insights estratégicos.',
          descriptionEn: 'Advanced data analysis and creation of interactive dashboards to generate strategic insights.',
          features: [
            'Dashboards avançados em Excel',
            'Relatórios interactivos em Power BI',
            'Análise estatística',
            'Visualização estratégica de dados'
          ],
          featuresEn: [
            'Advanced Excel Dashboards',
            'Interactive Power BI Reports',
            'Statistical analysis',
            'Strategic data visualization'
          ],
          order: 3,
          active: true
        },
        {
          title: 'Mentoria em MEAL',
          titleEn: 'MEAL Mentorship',
          icon: 'fas fa-user-friends',
          description: 'Mentoria técnica especializada para profissionais e organizações que procuram fortalecer competências em Monitoria, Avaliação, Accountability e Aprendizagem.',
          descriptionEn: 'Specialized technical mentorship for professionals and organizations seeking to strengthen skills in Monitoring, Evaluation, Accountability, and Learning.',
          features: [
            'Mentoria individual',
            'Capacitação prática de equipas',
            'Apoio no desenho e fortalecimento de sistemas de MEAL',
            'Acompanhamento técnico contínuo'
          ],
          featuresEn: [
            'Individual mentorship',
            'Practical team training',
            'Support in the design and strengthening of MEAL systems',
            'Continuous technical guidance'
          ],
          order: 4,
          active: true
        },
        {
          title: 'Consultorias Especializadas',
          titleEn: 'Specialized Consultancies',
          icon: 'fas fa-briefcase',
          description: 'Serviços completos de consultoria em Monitoria & Avaliação, investigação aplicada e resposta humanitária.',
          descriptionEn: 'Full consulting services in Monitoring & Evaluation, applied research, and humanitarian response.',
          features: [
            'Desenho e condução de avaliações',
            'Desenvolvimento de ferramentas de recolha de dados',
            'Formação de inquiridores',
            'Análise de dados e elaboração de relatórios técnicos',
            'Apoio a projectos de assistência humanitária'
          ],
          featuresEn: [
            'Assessment design and conduct',
            'Development of data collection tools',
            'Enumerator training',
            'Data analysis and preparation of technical reports',
            'Support for humanitarian assistance projects'
          ],
          order: 5,
          active: true
        },
        {
          title: 'Gestão de Programas e Projectos',
          titleEn: 'Program & Project Management',
          icon: 'fas fa-tasks',
          description: 'Coordenação estratégica e operacional de programas e projectos com foco em impacto, eficiência e sustentabilidade.',
          descriptionEn: 'Strategic and operational coordination of programs and projects with a focus on impact, efficiency, and sustainability.',
          features: [
            'Liderança de equipas multidisciplinares',
            'Planeamento estratégico e operacional',
            'Coordenação e acompanhamento de resultados',
            'Gestão de parcerias e articulação institucional',
            'Produção de relatórios institucionais e suporte à tomada de decisão estratégica'
          ],
          featuresEn: [
            'Leadership of multidisciplinary teams',
            'Strategic and operational planning',
            'Coordination and monitoring of results',
            'Partnership management and institutional coordination',
            'Production of institutional reports and strategic decision-making support'
          ],
          order: 6,
          active: true
        }
      ]);
      console.log('✅ Serviços iniciais inseridos com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao popular dados iniciais:', err.message);
  }
};

// Database Connection & Serverless Helper
let dbPromise = null;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!dbPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI não configurada nas variáveis de ambiente!');
      throw new Error('Variável MONGODB_URI não encontrada nas configurações do ambiente/servidor.');
    }
    dbPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    }).then(async (m) => {
      console.log('🍃 Conectado com sucesso ao MongoDB Atlas!');
      await seedInitialData();
      return m;
    }).catch(err => {
      console.error('❌ Erro na conexão com o MongoDB Atlas:', err.message);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

// Initial connection for persistent node processes
if (process.env.MONGODB_URI && !process.env.VERCEL) {
  connectDB().catch(e => console.warn('Conexão assíncrona inicial:', e.message));
} else if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI não encontrada nas variáveis de ambiente.');
}

// Middleware to ensure DB connection before executing any /api route
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
      next();
    } catch (err) {
      console.error('❌ Falha na conexão MongoDB para a rota:', req.path, err.message);
      return res.status(500).json({
        message: 'Falha ao conectar com o banco de dados MongoDB Atlas.',
        error: err.message,
        hint: !process.env.MONGODB_URI 
          ? 'Certifique-se de configurar MONGODB_URI nas variáveis de ambiente do seu provedor (ex: Vercel Project Settings > Environment Variables).' 
          : 'Verifique se o cluster do MongoDB Atlas permite conexões de qualquer IP (0.0.0.0/0 no Network Access).'
      });
    }
  } else {
    next();
  }
});

// Auth Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@gabrielarmindo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@Admin123@';
const AUTH_TOKEN = process.env.JWT_SECRET || 'gabrielarmindo_secret_key_2026_secure';

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${AUTH_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado. Faça login novamente.' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    // 1. Procurar no MongoDB
    let user = await User.findOne({ email: cleanEmail });

    // 2. Se não existir no banco mas bater com as credenciais padrão, criar no MongoDB
    if (!user && (email === ADMIN_EMAIL || cleanEmail === ADMIN_EMAIL.toLowerCase()) && password === ADMIN_PASSWORD) {
      user = await User.create({
        name: 'Gabriel Armindo',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'superadmin',
        avatar: '/images/perfil1.png'
      });
    }

    if (user && user.password === password) {
      user.lastLogin = new Date();
      await user.save();
      return res.json({
        token: AUTH_TOKEN,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    }

    return res.status(401).json({ message: 'Email ou senha inválidos.' });
  } catch (err) {
    console.error('❌ Erro no /api/login:', err);
    return res.status(500).json({ message: 'Erro no servidor durante login', error: err.message });
  }
});

// --- STATS ROUTE ---
app.get('/api/admin/stats', authenticate, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    const totalServices = await Service.countDocuments({ active: true });
    const totalPayments = await Transaction.countDocuments();

    // Aggregation for category distribution
    const categoryStats = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Total views calculation
    const viewsAgg = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;

    res.json({
      totalPosts,
      totalPackages,
      totalMessages,
      unreadMessages,
      totalServices,
      totalPayments,
      totalViews,
      categoryStats: categoryStats.reduce((acc, curr) => {
        acc[curr._id || 'Geral'] = curr.count;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter estatísticas', error: err.message });
  }
});

// --- IMAGE UPLOAD ROUTE ---
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  if (req.file) {
    // If local storage, build relative URL
    let fileUrl = req.file.path;
    if (!hasCloudinary || !fileUrl.startsWith('http')) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    res.json({ url: fileUrl });
  } else {
    res.status(400).json({ message: 'Nenhuma imagem enviada ou erro no upload.' });
  }
});

// --- BLOG ROUTES (MongoDB) ---
// Get all posts (supports ?search= and ?category=)
app.get('/api/blog', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (category && category !== 'Todos') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    const posts = await Post.find(filter).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar artigos', error: err.message });
  }
});

// Get single post by slug or ID & increment views
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let post = await Post.findOne({ slug });
    if (!post && mongoose.Types.ObjectId.isValid(slug)) {
      post = await Post.findById(slug);
    }
    if (post) {
      post.views = (post.views || 0) + 1;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ message: 'Artigo não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar artigo', error: err.message });
  }
});

// Create new post
app.post('/api/blog', authenticate, async (req, res) => {
  try {
    const { title, content, excerpt, category, image, author, published } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    let slug = baseSlug;
    let counter = 1;
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPost = new Post({
      title,
      slug,
      excerpt: excerpt || title,
      content,
      category: category || 'Geral',
      image: image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      author: author || 'Gabriel Armindo',
      published: published !== undefined ? published : true,
      date: new Date()
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar artigo', error: err.message });
  }
});

// Update post
app.put('/api/blog/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // If title changed, update slug
    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    }

    const updated = await Post.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar artigo', error: err.message });
  }
});

// Delete post
app.delete('/api/blog/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }
    res.json({ message: 'Artigo excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir artigo', error: err.message });
  }
});

// Like post
app.post('/api/blog/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post && mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id);
    }
    if (!post) {
      post = await Post.findOne({ slug: id });
    }
    if (!post) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar like', error: err.message });
  }
});

// Comment on post
app.post('/api/blog/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ message: 'Nome e comentário são obrigatórios.' });
    }

    let post = await Post.findById(id);
    if (!post) {
      post = await Post.findOne({ slug: id });
    }
    if (!post) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    const newComment = {
      name: name.trim(),
      content: content.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: 'Comentário publicado com sucesso!', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao publicar comentário', error: err.message });
  }
});

// Delete comment (admin only)
app.delete('/api/blog/:id/comment/:commentId', authenticate, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
    res.json({ message: 'Comentário excluído com sucesso!', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir comentário', error: err.message });
  }
});

// --- PACKAGES ROUTES (MongoDB) ---
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1, createdAt: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pacotes', error: err.message });
  }
});

app.post('/api/packages', authenticate, async (req, res) => {
  try {
    const newPkg = new Package(req.body);
    const saved = await newPkg.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar pacote', error: err.message });
  }
});

app.put('/api/packages/:id', authenticate, async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Pacote não encontrado.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar pacote', error: err.message });
  }
});

app.delete('/api/packages/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Pacote não encontrado.' });
    }
    res.json({ message: 'Pacote deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar pacote', error: err.message });
  }
});

// --- CONTACT & MESSAGES ROUTES (MongoDB) ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nome, email e mensagem são obrigatórios.' });
    }
    
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'Contacto via Website',
      message
    });

    console.log(`📩 Nova mensagem recebida de: ${name} (${email})`);
    res.json({ message: 'Mensagem enviada com sucesso!', id: newMessage._id });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar mensagem', error: err.message });
  }
});

app.get('/api/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar mensagens', error: err.message });
  }
});

app.patch('/api/messages/:id/read', authenticate, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Mensagem não encontrada.' });
    }
    msg.read = req.body.read !== undefined ? req.body.read : !msg.read;
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar mensagem', error: err.message });
  }
});

app.delete('/api/messages/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Mensagem não encontrada.' });
    }
    res.json({ message: 'Mensagem excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir mensagem', error: err.message });
  }
});

// --- TESTIMONIALS ROUTES (MongoDB) ---
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar testemunhos', error: err.message });
  }
});

app.post('/api/testimonials', authenticate, async (req, res) => {
  try {
    const newTestimonial = await Testimonial.create(req.body);
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar testemunho', error: err.message });
  }
});

app.put('/api/testimonials/:id', authenticate, async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar testemunho', error: err.message });
  }
});

app.delete('/api/testimonials/:id', authenticate, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testemunho excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir testemunho', error: err.message });
  }
});

// --- RESUME & TRAJECTORY ROUTES (MongoDB) ---
app.get('/api/resume', async (req, res) => {
  try {
    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create(getDefaultResumeData());
    }
    res.json(resume);
  } catch (err) {
    console.error('Erro ao buscar currículo no MongoDB:', err.message);
    res.status(500).json({ 
      message: 'Erro ao buscar dados do currículo', 
      error: err.message, 
      fallback: getDefaultResumeData() 
    });
  }
});

app.put('/api/resume', authenticate, async (req, res) => {
  try {
    let resume = await Resume.findOne();
    if (!resume) {
      resume = new Resume(req.body);
    } else {
      if (req.body.skillsIntro) resume.skillsIntro = req.body.skillsIntro;
      if (req.body.education) resume.education = req.body.education;
      if (req.body.skillBars) resume.skillBars = req.body.skillBars;
      if (req.body.skillCards) resume.skillCards = req.body.skillCards;
      if (req.body.experiences) resume.experiences = req.body.experiences;
      if (req.body.studies) resume.studies = req.body.studies;
      if (req.body.partners) resume.partners = req.body.partners;
      if (req.body.consultancies) resume.consultancies = req.body.consultancies;
    }
    const saved = await resume.save();
    res.json({ message: 'Currículo e trajetória atualizados com sucesso no MongoDB!', data: saved });
  } catch (err) {
    console.error('Erro ao salvar currículo no MongoDB:', err.message);
    res.status(500).json({ message: 'Erro ao salvar dados do currículo', error: err.message });
  }
});

// --- SERVICES OVERVIEW ROUTES (MongoDB) ---
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviços', error: err.message });
  }
});

app.get('/api/services/all', authenticate, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviços', error: err.message });
  }
});

app.post('/api/services', authenticate, async (req, res) => {
  try {
    const newService = new Service(req.body);
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar serviço', error: err.message });
  }
});

app.put('/api/services/:id', authenticate, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar serviço', error: err.message });
  }
});

app.delete('/api/services/:id', authenticate, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Serviço excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir serviço', error: err.message });
  }
});

// --- PAYMENT GATEWAYS INTEGRATION ---
const emolaService = require('./services/emolaService');
const mpesaService = require('./services/mpesaService');

// Webhook endpoint for e-Mola events
app.post('/api/webhooks/emola', async (req, res) => {
  try {
    const webhookData = req.body;

    // Validate webhook signature if configured
    const signature = req.headers['x-emola-signature'];
    if (signature && !emolaService.validateWebhookSignature(signature, JSON.stringify(req.body))) {
      return res.status(401).json({ message: 'Assinatura do webhook inválida' });
    }

    // Process webhook event
    const event = emolaService.processWebhookEvent(webhookData);

    // Find and update transaction
    const transaction = await Transaction.findOne({ emolaTransactionId: event.transactionId });
    if (transaction) {
      transaction.status = event.status;
      transaction.webhookReceived = true;
      transaction.webhookData = event;

      if (event.status === 'paid') {
        transaction.completedAt = new Date();
      } else if (event.status === 'failed') {
        transaction.failedAt = new Date();
      }

      await transaction.save();
      console.log(`✅ Webhook e-Mola processado para transacção ${transaction._id}`);
    } else {
      console.warn(`⚠️ Transacção não encontrada para e-Mola transaction ID: ${event.transactionId}`);
    }

    // Always return 200 to acknowledge webhook
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Erro ao processar webhook e-Mola:', err);
    // Still return 200 to avoid webhook retries
    res.status(200).json({ received: true, error: err.message });
  }
});

// Get all transactions (admin only)
app.get('/api/payments', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate('packageId', 'title price');

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar transacções', error: err.message });
  }
});

// --- MPESA PAYMENTS INTEGRATION ---

// Create C2B payment via M-Pesa
app.post('/api/payments/mpesa/c2b', async (req, res) => {
  try {
    const { phone, amount, currency, reference, description, packageId, packageName, customerName, customerEmail } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ message: 'Phone e amount são obrigatórios!' });
    }

    // Create payment with M-Pesa
    const mpesaResponse = await mpesaService.createC2BPayment({
      phone,
      amount,
      currency: currency || 'MZN',
      reference: reference || `PKG-${packageId}-${Date.now()}`,
      description: description || `Pagamento: ${packageName || 'Serviço'}`
    });

    if (!mpesaResponse.success) {
      return res.status(500).json({
        message: 'Erro ao criar pagamento com M-Pesa',
        error: mpesaResponse.error
      });
    }

    // Save transaction to MongoDB
    const transaction = await Transaction.create({
      gateway: 'MPESA',
      mpesaTransactionId: mpesaResponse.data.TransactionID || mpesaResponse.data.input_TransactionID,
      paymentType: 'C2B',
      status: 'pending',
      customer: {
        name: customerName,
        email: customerEmail,
        phone
      },
      amount,
      currency: currency || 'MZN',
      reference: reference || mpesaResponse.data.input_TransactionReference,
      description: description || `Pagamento: ${packageName || 'Serviço'}`,
      packageId,
      packageName
    });

    res.status(201).json({
      success: true,
      payment: mpesaResponse.data,
      transaction: {
        id: transaction._id,
        mpesaTransactionId: transaction.mpesaTransactionId,
        status: transaction.status
      }
    });
  } catch (err) {
    console.error('Erro ao processar pagamento M-Pesa C2B:', err);
    res.status(500).json({ message: 'Erro ao processar pagamento', error: err.message });
  }
});

// Get M-Pesa payment status
app.get('/api/payments/mpesa/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.transactionId, gateway: 'MPESA' });
    if (!transaction) {
      return res.status(404).json({ message: 'Transacção não encontrada' });
    }

    // Get latest status from M-Pesa
    const mpesaResponse = await mpesaService.getC2BPayment(transaction.mpesaTransactionId);

    if (mpesaResponse.success) {
      // Update transaction status
      const processedEvent = mpesaService.processWebhookEvent(mpesaResponse.data);
      transaction.status = processedEvent.status;
      if (processedEvent.status === 'paid') {
        transaction.completedAt = new Date();
      } else if (processedEvent.status === 'failed') {
        transaction.failedAt = new Date();
      }
      await transaction.save();
    }

    res.json({
      transaction: {
        id: transaction._id,
        mpesaTransactionId: transaction.mpesaTransactionId,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        packageName: transaction.packageName,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt
      },
      mpesaStatus: mpesaResponse.success ? mpesaResponse.data : null
    });
  } catch (err) {
    console.error('Erro ao consultar pagamento M-Pesa:', err);
    res.status(500).json({ message: 'Erro ao consultar pagamento', error: err.message });
  }
});

// Webhook endpoint for M-Pesa events
app.post('/api/webhooks/mpesa', async (req, res) => {
  try {
    const webhookData = req.body;

    // Validate webhook signature if configured
    const signature = req.headers['x-mpesa-signature'];
    if (signature && !mpesaService.validateWebhookSignature(signature, JSON.stringify(req.body))) {
      return res.status(401).json({ message: 'Assinatura do webhook inválida' });
    }

    // Process webhook event
    const event = mpesaService.processWebhookEvent(webhookData);

    // Find and update transaction
    const transaction = await Transaction.findOne({ 
      mpesaTransactionId: event.transactionId,
      gateway: 'MPESA'
    });
    
    if (transaction) {
      transaction.status = event.status;
      transaction.webhookReceived = true;
      transaction.webhookData = event;

      if (event.status === 'paid') {
        transaction.completedAt = new Date();
      } else if (event.status === 'failed') {
        transaction.failedAt = new Date();
      }

      await transaction.save();
      console.log(`✅ Webhook M-Pesa processado para transacção ${transaction._id}`);
    } else {
      console.warn(`⚠️ Transacção não encontrada para M-Pesa transaction ID: ${event.transactionId}`);
    }

    // Always return 200 to acknowledge webhook
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Erro ao processar webhook M-Pesa:', err);
    // Still return 200 to avoid webhook retries
    res.status(200).json({ received: true, error: err.message });
  }
});

// Universal payment endpoint (with gateway selection)
app.post('/api/payments/universal', async (req, res) => {
  try {
    const { gateway, ...paymentData } = req.body;

    if (!gateway || !['MPESA'].includes(gateway)) {
      return res.status(400).json({ message: 'Gateway inválido. Apenas M-Pesa está disponível no momento' });
    }

    if (gateway === 'MPESA') {
      // Redirect to M-Pesa endpoint
      const mpesaResponse = await mpesaService.createC2BPayment(paymentData);
      
      if (!mpesaResponse.success) {
        return res.status(500).json({
          message: 'Erro ao criar pagamento com M-Pesa',
          error: mpesaResponse.error
        });
      }

      const transaction = await Transaction.create({
        gateway: 'MPESA',
        mpesaTransactionId: mpesaResponse.data.TransactionID || mpesaResponse.data.input_TransactionID,
        paymentType: 'C2B',
        status: 'pending',
        customer: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          phone: paymentData.phone
        },
        amount: paymentData.amount,
        currency: paymentData.currency || 'MZN',
        reference: paymentData.reference || mpesaResponse.data.input_TransactionReference,
        description: paymentData.description,
        packageId: paymentData.packageId,
        packageName: paymentData.packageName
      });

      res.status(201).json({
        success: true,
        gateway: 'MPESA',
        payment: mpesaResponse.data,
        transaction: {
          id: transaction._id,
          mpesaTransactionId: transaction.mpesaTransactionId,
          status: transaction.status
        }
      });
    }
  } catch (err) {
    console.error('Erro ao processar pagamento universal:', err);
    res.status(500).json({ message: 'Erro ao processar pagamento', error: err.message });
  }
});

// Universal payment status check
app.get('/api/payments/universal/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.transactionId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transacção não encontrada' });
    }

    let gatewayResponse;
    if (transaction.gateway === 'MPESA') {
      gatewayResponse = await mpesaService.getC2BPayment(transaction.mpesaTransactionId);
      if (gatewayResponse.success) {
        const processedEvent = mpesaService.processWebhookEvent(gatewayResponse.data);
        transaction.status = processedEvent.status;
        if (processedEvent.status === 'paid') {
          transaction.completedAt = new Date();
        } else if (processedEvent.status === 'failed') {
          transaction.failedAt = new Date();
        }
      }
    }

    await transaction.save();

    res.json({
      transaction: {
        id: transaction._id,
        gateway: transaction.gateway,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        packageName: transaction.packageName,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt
      },
      gatewayStatus: gatewayResponse?.success ? gatewayResponse.data : null
    });
  } catch (err) {
    console.error('Erro ao consultar pagamento universal:', err);
    res.status(500).json({ message: 'Erro ao consultar pagamento', error: err.message });
  }
});

// Serve index.html for all frontend SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend activo em http://localhost:${PORT}`);
  });
}

module.exports = app;
