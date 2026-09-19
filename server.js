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
          title: 'Consultoria MEAL Completa',
          price: 'Sob Consulta',
          description: 'Desenvolvimento integral de sistemas de Monitoria, Avaliação, Prestação de Contas e Aprendizagem.',
          features: ['Design de Quadro Lógico', 'Planos de Monitoria & Indicadores', 'Sistemas de Feedback e Mecanismos de Reclamação'],
          icon: 'fas fa-chart-line',
          order: 1
        },
        {
          title: 'Análise de Dados e BI',
          price: 'A partir de $250',
          description: 'Transformação de dados brutos em dashboards interativos para tomada de decisão ágil.',
          features: ['Dashboards Interativos no Power BI', 'Limpeza e Tratamento Avançado de Dados', 'Relatórios Executivos para Doadores'],
          icon: 'fas fa-database',
          order: 2
        },
        {
          title: 'Treinamento e Capacitação',
          price: 'Personalizado',
          description: 'Capacitação prática de equipas em recolha digital e análise estatística.',
          features: ['Treinamento Prático em KoboToolbox', 'Mentoria em Análise Estatística (SPSS/Excel)', 'Workshops Hands-on de MEAL'],
          icon: 'fas fa-users-cog',
          order: 3
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
