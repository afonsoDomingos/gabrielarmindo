const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_blog',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('dist'));

// Admin Credentials
const ADMIN_EMAIL = 'info@gabrielarmindo.com';
const ADMIN_PASSWORD = '@Admin123@';
const AUTH_TOKEN = 'mock-session-token-12345'; // Em produção, usar JWT

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${AUTH_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado' });
  }
};

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ token: AUTH_TOKEN });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Image Upload Route
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ message: 'Falha no upload da imagem' });
  }
});

// In-memory storage for blog posts (em produção, usar banco de dados)
let blogPosts = [
  {
    id: 1,
    title: 'A Importância do MEAL em Projectos de Impacto Social',
    slug: 'importancia-meal-projectos-impacto-social',
    excerpt: 'Como sistemas de monitoria e avaliação transformam a gestão de projectos humanitários e asseguram resultados.',
    content: 'A Monitoria, Avaliação, Prestação de Contas e Aprendizagem (MEAL) é a espinha dorsal de qualquer intervenção de desenvolvimento eficaz. Neste artigo, exploramos como o desenho de quadros lógicos robustos e a recolha sistemática de dados permitem não apenas medir o sucesso, mas aprender com os desafios e adaptar estratégias em tempo real para maximizar o impacto nas comunidades...',
    author: 'Gabriel Armindo',
    date: new Date().toISOString(),
    category: 'MEAL',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Análise de Dados com Power BI para Tomada de Decisão',
    slug: 'analise-dados-power-bi-decisao',
    excerpt: 'Transformando dados brutos em dashboards estratégicos e insights acionáveis para stakeholders e doadores.',
    content: 'No sector humanitário, a capacidade de visualizar dados complexos de forma clara é crucial. Utilizando ferramentas como Power BI e SPSS, conseguimos transformar folhas de cálculo densas em indicadores visuais que facilitam a compreensão do progresso do projecto. Discutiremos técnicas de limpeza de dados e as melhores práticas para criar dashboards que suportem a tomada de decisão baseada em evidências...',
    author: 'Gabriel Armindo',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'Dados',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Psicologia Social e Inclusão em Contextos Humanitários',
    slug: 'psicologia-social-inclusao-humanitarios',
    excerpt: 'A integração de abordagens sensíveis ao género e protecção baseada em direitos humanos em projectos complexos.',
    content: 'A minha formação em Psicologia Social e Comunitária permite uma visão única sobre como as intervenções afectam as dinâmicas sociais. Este post foca na importância de incluir perspectivas de género e inclusão social (GESI) desde o desenho do projecto, garantindo que as populações mais vulneráveis não sejam apenas beneficiárias, mas participantes activas no seu próprio desenvolvimento...',
    author: 'Gabriel Armindo',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    category: 'Geral',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop'
  }
];

let servicePackages = [
  {
    id: 1,
    title: 'Consultoria MEAL Completa',
    price: 'Sob Consulta',
    description: 'Desenvolvimento integral de sistemas de Monitoria, Avaliação, Prestação de Contas e Aprendizagem.',
    features: ['Design de Quadro Lógico', 'Planos de Monitoria', 'Sistemas de Feedback'],
    icon: 'fas fa-chart-line'
  },
  {
    id: 2,
    title: 'Análise de Dados e BI',
    price: 'A partir de $250',
    description: 'Transformação de dados brutos em dashboards interativos para tomada de decisão.',
    features: ['Dashboards Power BI', 'Limpeza de Dados', 'Análise Estatística'],
    icon: 'fas fa-database'
  },
  {
    id: 3,
    title: 'Treinamento e Capacitação',
    price: 'Personalizado',
    description: 'Capacitação de equipes em ferramentas de coleta e análise de dados (Kobo, SPSS, Excel).',
    features: ['Treinamento KoboToolbox', 'Mentoria em SPSS', 'Workshops MEAL'],
    icon: 'fas fa-users-cog'
  }
];

// API Routes
// Packages Routes
app.get('/api/packages', (req, res) => {
  console.log(`Enviando ${servicePackages.length} pacotes para o frontend`);
  res.json(servicePackages);
});

app.post('/api/packages', authenticate, (req, res) => {
  const newPackage = {
    ...req.body,
    id: servicePackages.length > 0 ? Math.max(...servicePackages.map(p => p.id)) + 1 : 1
  };
  servicePackages.push(newPackage);
  res.status(201).json(newPackage);
});

app.put('/api/packages/:id', authenticate, (req, res) => {
  const index = servicePackages.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    servicePackages[index] = { ...req.body, id: parseInt(req.params.id) };
    res.json(servicePackages[index]);
  } else {
    res.status(404).json({ message: 'Pacote não encontrado' });
  }
});

app.delete('/api/packages/:id', authenticate, (req, res) => {
  const index = servicePackages.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    servicePackages.splice(index, 1);
    res.json({ message: 'Pacote deletado' });
  } else {
    res.status(404).json({ message: 'Pacote não encontrado' });
  }
});

// Get all blog posts
app.get('/api/blog', (req, res) => {
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sortedPosts);
});

// Get single blog post
app.get('/api/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post não encontrado' });
  }
});

// Create new blog post
app.post('/api/blog', authenticate, (req, res) => {
  const { title, content, excerpt, category, image } = req.body;

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const newPost = {
    id: blogPosts.length + 1,
    title,
    slug,
    excerpt,
    content,
    author: 'Gabriel Armindo',
    date: new Date().toISOString(),
    category: category || 'Geral',
    image: image || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop'
  };

  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

// Update blog post
app.put('/api/blog/:id', authenticate, (req, res) => {
  const postIndex = blogPosts.findIndex(p => p.id === parseInt(req.params.id));

  if (postIndex !== -1) {
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...req.body,
      id: parseInt(req.params.id)
    };
    res.json(blogPosts[postIndex]);
  } else {
    res.status(404).json({ message: 'Post não encontrado' });
  }
});

// Delete blog post
app.delete('/api/blog/:id', authenticate, (req, res) => {
  const postIndex = blogPosts.findIndex(p => p.id === parseInt(req.params.id));

  if (postIndex !== -1) {
    blogPosts.splice(postIndex, 1);
    res.json({ message: 'Post deletado com sucesso' });
  } else {
    res.status(404).json({ message: 'Post não encontrado' });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  console.log('Nova mensagem de contato:');
  console.log(`Nome: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Mensagem: ${message}`);

  // Em produção, enviar email ou salvar no banco de dados
  res.json({ message: 'Mensagem enviada com sucesso!' });
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
