<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Bar, Doughnut } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  ArcElement 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const router = useRouter();
const activeTab = ref('overview'); // 'overview', 'blog', 'packages', 'messages', 'testimonials'

// Data collections
const posts = ref([]);
const packages = ref([]);
const messages = ref([]);
const testimonials = ref([]);
const stats = ref({
  totalPosts: 0,
  totalPackages: 0,
  totalMessages: 0,
  unreadMessages: 0,
  totalViews: 0,
  categoryStats: {}
});

// Loading state
const isLoading = ref(true);

// Toast Notification System
const toast = ref({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

// Filter & Search
const blogSearch = ref('');
const selectedBlogCategory = ref('Todos');
const messageFilter = ref('all'); // 'all', 'unread'

// Modal States
const isBlogModalOpen = ref(false);
const editingPost = ref(null);
const postForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  category: 'MEAL',
  content: '',
  image: '',
  author: 'Gabriel Armindo',
  published: true
});

const isPackageModalOpen = ref(false);
const editingPackage = ref(null);
const packageForm = ref({
  title: '',
  price: '',
  description: '',
  features: [],
  icon: 'fas fa-chart-line'
});
const newFeature = ref('');

const isMessageModalOpen = ref(false);
const selectedMessage = ref(null);

const isTestimonialModalOpen = ref(false);
const editingTestimonial = ref(null);
const testimonialForm = ref({
  name: '',
  role: '',
  content: '',
  rating: 5,
  active: true
});

// Image Upload Preview
const isUploading = ref(false);
const uploadTab = ref('upload'); // 'upload' or 'url'

// Auth Header
const getAuthHeaders = () => {
  const token = localStorage.getItem('gabriel_admin_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch All Data from MongoDB
const fetchData = async () => {
  isLoading.value = true;
  try {
    const [postsRes, packagesRes, messagesRes, statsRes, testRes] = await Promise.all([
      axios.get('/api/blog'),
      axios.get('/api/packages'),
      axios.get('/api/messages', getAuthHeaders()).catch(() => ({ data: [] })),
      axios.get('/api/admin/stats', getAuthHeaders()).catch(() => ({ data: null })),
      axios.get('/api/testimonials').catch(() => ({ data: [] }))
    ]);

    posts.value = postsRes.data || [];
    packages.value = packagesRes.data || [];
    messages.value = messagesRes.data || [];
    testimonials.value = testRes.data || [];

    if (statsRes.data) {
      stats.value = statsRes.data;
    } else {
      // Fallback calculation
      stats.value = {
        totalPosts: posts.value.length,
        totalPackages: packages.value.length,
        totalMessages: messages.value.length,
        unreadMessages: messages.value.filter(m => !m.read).length,
        totalViews: posts.value.reduce((acc, p) => acc + (p.views || 0), 0),
        categoryStats: posts.value.reduce((acc, p) => {
          acc[p.category || 'Geral'] = (acc[p.category || 'Geral'] || 0) + 1;
          return acc;
        }, {})
      };
    }
  } catch (err) {
    console.error('Erro ao carregar dados do MongoDB:', err);
    if (err.response?.status === 401) {
      logout();
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

// Categories
const allCategories = computed(() => {
  const cats = new Set(['MEAL', 'Dados', 'M&A', 'Geral', 'Pesquisa']);
  posts.value.forEach(p => { if (p.category) cats.add(p.category); });
  return Array.from(cats);
});

// Filtered Blog Posts
const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = !blogSearch.value || 
      post.title?.toLowerCase().includes(blogSearch.value.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(blogSearch.value.toLowerCase());
    const matchesCategory = selectedBlogCategory.value === 'Todos' || post.category === selectedBlogCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Filtered Messages
const filteredMessages = computed(() => {
  if (messageFilter.value === 'unread') {
    return messages.value.filter(m => !m.read);
  }
  return messages.value;
});

const unreadCount = computed(() => messages.value.filter(m => !m.read).length);

// Chart Configurations
const barChartData = computed(() => {
  const catStats = stats.value.categoryStats || {};
  return {
    labels: Object.keys(catStats).length ? Object.keys(catStats) : ['Nenhum'],
    datasets: [{
      label: 'Artigos por Categoria',
      backgroundColor: ['#FF7B1A', '#FF9F55', '#3B82F6', '#10B981', '#8B5CF6'],
      borderRadius: 8,
      data: Object.keys(catStats).length ? Object.values(catStats) : [0]
    }]
  };
});

const doughnutChartData = computed(() => {
  const catStats = stats.value.categoryStats || {};
  return {
    labels: Object.keys(catStats).length ? Object.keys(catStats) : ['Vazio'],
    datasets: [{
      backgroundColor: ['#FF7B1A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
      data: Object.keys(catStats).length ? Object.values(catStats) : [1],
      borderWidth: 0
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { family: 'Inter', size: 12 }, padding: 16 }
    }
  }
};

// --- BLOG ACTIONS ---
const autoGenerateSlug = () => {
  if (!editingPost.value && postForm.value.title) {
    postForm.value.slug = postForm.value.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
};

const openBlogModal = (post = null) => {
  if (post) {
    editingPost.value = post;
    postForm.value = {
      title: post.title,
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      category: post.category || 'MEAL',
      content: post.content || '',
      image: post.image || '',
      author: post.author || 'Gabriel Armindo',
      published: post.published !== undefined ? post.published : true
    };
  } else {
    editingPost.value = null;
    postForm.value = {
      title: '',
      slug: '',
      excerpt: '',
      category: 'MEAL',
      content: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      author: 'Gabriel Armindo',
      published: true
    };
  }
  isBlogModalOpen.value = true;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  isUploading.value = true;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axios.post('/api/upload', formData, getAuthHeaders());
    postForm.value.image = res.data.url;
    showToast('Imagem enviada com sucesso!');
  } catch (err) {
    showToast('Erro ao carregar imagem: ' + (err.response?.data?.message || err.message), 'error');
  } finally {
    isUploading.value = false;
  }
};

const savePost = async () => {
  if (!postForm.value.title || !postForm.value.content) {
    showToast('Título e conteúdo são obrigatórios!', 'error');
    return;
  }

  try {
    const targetId = editingPost.value?._id || editingPost.value?.id;
    if (editingPost.value && targetId) {
      await axios.put(`/api/blog/${targetId}`, postForm.value, getAuthHeaders());
      showToast('Artigo atualizado com sucesso no MongoDB!');
    } else {
      await axios.post('/api/blog', postForm.value, getAuthHeaders());
      showToast('Novo artigo publicado com sucesso no MongoDB!');
    }
    isBlogModalOpen.value = false;
    await fetchData();
  } catch (err) {
    showToast('Erro ao salvar artigo: ' + (err.response?.data?.message || err.message), 'error');
  }
};

const deletePost = async (post) => {
  const targetId = post._id || post.id;
  if (!confirm(`Tem certeza que deseja apagar o artigo "${post.title}"?`)) return;

  try {
    await axios.delete(`/api/blog/${targetId}`, getAuthHeaders());
    showToast('Artigo removido com sucesso!');
    await fetchData();
  } catch (err) {
    showToast('Erro ao apagar artigo', 'error');
  }
};

// --- PACKAGE ACTIONS ---
const openPackageModal = (pkg = null) => {
  if (pkg) {
    editingPackage.value = pkg;
    packageForm.value = {
      title: pkg.title,
      price: pkg.price || '',
      description: pkg.description || '',
      features: [...(pkg.features || [])],
      icon: pkg.icon || 'fas fa-chart-line'
    };
  } else {
    editingPackage.value = null;
    packageForm.value = {
      title: '',
      price: 'Sob Consulta',
      description: '',
      features: [],
      icon: 'fas fa-chart-line'
    };
  }
  isPackageModalOpen.value = true;
};

const addFeature = () => {
  if (newFeature.value.trim()) {
    packageForm.value.features.push(newFeature.value.trim());
    newFeature.value = '';
  }
};

const removeFeature = (idx) => {
  packageForm.value.features.splice(idx, 1);
};

const savePackage = async () => {
  if (!packageForm.value.title) {
    showToast('Nome do serviço é obrigatório!', 'error');
    return;
  }

  try {
    const targetId = editingPackage.value?._id || editingPackage.value?.id;
    if (editingPackage.value && targetId) {
      await axios.put(`/api/packages/${targetId}`, packageForm.value, getAuthHeaders());
      showToast('Pacote atualizado no MongoDB!');
    } else {
      await axios.post('/api/packages', packageForm.value, getAuthHeaders());
      showToast('Novo pacote cadastrado com sucesso!');
    }
    isPackageModalOpen.value = false;
    await fetchData();
  } catch (err) {
    showToast('Erro ao salvar pacote', 'error');
  }
};

const deletePackage = async (pkg) => {
  const targetId = pkg._id || pkg.id;
  if (!confirm(`Excluir o pacote "${pkg.title}"?`)) return;

  try {
    await axios.delete(`/api/packages/${targetId}`, getAuthHeaders());
    showToast('Pacote excluído!');
    await fetchData();
  } catch (err) {
    showToast('Erro ao excluir pacote', 'error');
  }
};

// --- MESSAGE ACTIONS ---
const openMessageModal = async (msg) => {
  selectedMessage.value = msg;
  isMessageModalOpen.value = true;
  if (!msg.read) {
    await toggleMessageRead(msg, true);
  }
};

const toggleMessageRead = async (msg, forceStatus = null) => {
  const targetId = msg._id || msg.id;
  const newRead = forceStatus !== null ? forceStatus : !msg.read;
  try {
    await axios.patch(`/api/messages/${targetId}/read`, { read: newRead }, getAuthHeaders());
    msg.read = newRead;
    // update stats
    stats.value.unreadMessages = messages.value.filter(m => !m.read).length;
  } catch (err) {
    console.error('Erro ao atualizar status da mensagem:', err);
  }
};

const deleteMessage = async (msg) => {
  const targetId = msg._id || msg.id;
  if (!confirm('Deseja excluir esta mensagem permanentemente?')) return;

  try {
    await axios.delete(`/api/messages/${targetId}`, getAuthHeaders());
    showToast('Mensagem excluída!');
    if (selectedMessage.value && (selectedMessage.value._id === targetId || selectedMessage.value.id === targetId)) {
      isMessageModalOpen.value = false;
    }
    await fetchData();
  } catch (err) {
    showToast('Erro ao excluir mensagem', 'error');
  }
};

// --- TESTIMONIAL ACTIONS ---
const openTestimonialModal = (item = null) => {
  if (item) {
    editingTestimonial.value = item;
    testimonialForm.value = { ...item };
  } else {
    editingTestimonial.value = null;
    testimonialForm.value = {
      name: '',
      role: '',
      content: '',
      rating: 5,
      active: true
    };
  }
  isTestimonialModalOpen.value = true;
};

const saveTestimonial = async () => {
  if (!testimonialForm.value.name || !testimonialForm.value.content) {
    showToast('Nome e depoimento são obrigatórios!', 'error');
    return;
  }

  try {
    const targetId = editingTestimonial.value?._id || editingTestimonial.value?.id;
    if (editingTestimonial.value && targetId) {
      await axios.put(`/api/testimonials/${targetId}`, testimonialForm.value, getAuthHeaders());
      showToast('Depoimento atualizado com sucesso!');
    } else {
      await axios.post('/api/testimonials', testimonialForm.value, getAuthHeaders());
      showToast('Novo depoimento adicionado com sucesso!');
    }
    isTestimonialModalOpen.value = false;
    await fetchData();
  } catch (err) {
    showToast('Erro ao salvar depoimento', 'error');
  }
};

const deleteTestimonial = async (item) => {
  const targetId = item._id || item.id;
  if (!confirm(`Excluir depoimento de "${item.name}"?`)) return;

  try {
    await axios.delete(`/api/testimonials/${targetId}`, getAuthHeaders());
    showToast('Depoimento excluído!');
    await fetchData();
  } catch (err) {
    showToast('Erro ao excluir', 'error');
  }
};

// --- LOGOUT ---
const logout = () => {
  localStorage.removeItem('gabriel_admin_token');
  router.push('/login');
};
</script>

<template>
  <div class="admin-layout">
    <!-- Toast Message -->
    <transition name="toast-fade">
      <div v-if="toast.show" :class="['admin-toast', toast.type]">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-text">Gabriel</span>
          <span class="logo-badge">Admin</span>
        </div>
        <span class="mongo-status">
          <span class="status-dot online"></span> MongoDB Conectado
        </span>
      </div>

      <nav class="sidebar-nav">
        <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <i class="fas fa-chart-pie"></i>
          <span>Visão Geral</span>
        </button>

        <button :class="{ active: activeTab === 'blog' }" @click="activeTab = 'blog'">
          <i class="fas fa-newspaper"></i>
          <span>Artigos do Blog</span>
          <span class="badge-count">{{ posts.length }}</span>
        </button>

        <button :class="{ active: activeTab === 'packages' }" @click="activeTab = 'packages'">
          <i class="fas fa-box-open"></i>
          <span>Serviços & Planos</span>
          <span class="badge-count">{{ packages.length }}</span>
        </button>

        <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'">
          <i class="fas fa-envelope"></i>
          <span>Mensagens (Inbox)</span>
          <span v-if="unreadCount > 0" class="badge-count unread">{{ unreadCount }}</span>
        </button>

        <button :class="{ active: activeTab === 'testimonials' }" @click="activeTab = 'testimonials'">
          <i class="fas fa-star"></i>
          <span>Testemunhos</span>
          <span class="badge-count">{{ testimonials.length }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <a href="/" target="_blank" class="view-site-link">
          <i class="fas fa-external-link-alt"></i> Ver Site
        </a>
        <button @click="logout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Sair da Conta
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1>
            {{ 
              activeTab === 'overview' ? 'Painel de Controlo' : 
              activeTab === 'blog' ? 'Gestão de Artigos & Publicações' : 
              activeTab === 'packages' ? 'Catálogo de Serviços & Consultoria' : 
              activeTab === 'messages' ? 'Mensagens Recebidas do Formulário' : 
              'Gestão de Testemunhos & Avaliações' 
            }}
          </h1>
          <p class="topbar-sub">Banco de Dados Ativo: <strong>cluster0.oe0akin.mongodb.net (gabrielarmindodb)</strong></p>
        </div>

        <div class="topbar-right">
          <button v-if="activeTab === 'blog'" @click="openBlogModal()" class="btn-action-top">
            <i class="fas fa-plus"></i> Novo Artigo
          </button>
          <button v-if="activeTab === 'packages'" @click="openPackageModal()" class="btn-action-top">
            <i class="fas fa-plus"></i> Novo Pacote
          </button>
          <button v-if="activeTab === 'testimonials'" @click="openTestimonialModal()" class="btn-action-top">
            <i class="fas fa-plus"></i> Novo Depoimento
          </button>

          <div class="admin-profile-pill">
            <img src="/images/perfil1.png" alt="Gabriel Armindo" class="admin-avatar" />
            <div class="admin-info-mini">
              <span class="admin-name">Gabriel Armindo</span>
              <span class="admin-role">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content-body">
        
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>A sincronizar dados com o MongoDB Atlas...</p>
        </div>

        <div v-else>
          <!-- TAB 1: VISÃO GERAL (OVERVIEW) -->
          <div v-if="activeTab === 'overview'" class="tab-pane fade-in">
            <!-- Metric Cards -->
            <div class="metrics-grid">
              <div class="metric-card orange">
                <div class="metric-icon"><i class="fas fa-newspaper"></i></div>
                <div class="metric-details">
                  <span class="metric-label">Artigos no Blog</span>
                  <span class="metric-val">{{ stats.totalPosts }}</span>
                  <span class="metric-hint"><i class="fas fa-database"></i> Gravados no MongoDB</span>
                </div>
              </div>

              <div class="metric-card blue">
                <div class="metric-icon"><i class="fas fa-eye"></i></div>
                <div class="metric-details">
                  <span class="metric-label">Visualizações Totais</span>
                  <span class="metric-val">{{ stats.totalViews }}</span>
                  <span class="metric-hint"><i class="fas fa-chart-line"></i> Alcance orgânico</span>
                </div>
              </div>

              <div class="metric-card green">
                <div class="metric-icon"><i class="fas fa-boxes"></i></div>
                <div class="metric-details">
                  <span class="metric-label">Serviços Cadastrados</span>
                  <span class="metric-val">{{ stats.totalPackages }}</span>
                  <span class="metric-hint"><i class="fas fa-check-circle"></i> Disponíveis online</span>
                </div>
              </div>

              <div class="metric-card purple" @click="activeTab = 'messages'" style="cursor: pointer;">
                <div class="metric-icon"><i class="fas fa-inbox"></i></div>
                <div class="metric-details">
                  <span class="metric-label">Mensagens de Contacto</span>
                  <span class="metric-val">{{ stats.totalMessages }}</span>
                  <span class="metric-hint" :class="{ 'has-unread': stats.unreadMessages > 0 }">
                    <i class="fas fa-envelope-open-text"></i> {{ stats.unreadMessages }} novas não lidas
                  </span>
                </div>
              </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-row">
              <div class="card chart-card">
                <div class="card-header">
                  <h3><i class="fas fa-chart-bar"></i> Distribuição por Categoria</h3>
                  <span class="card-tag">Artigos</span>
                </div>
                <div class="chart-canvas-box">
                  <Bar :data="barChartData" :options="chartOptions" />
                </div>
              </div>

              <div class="card chart-card">
                <div class="card-header">
                  <h3><i class="fas fa-chart-pie"></i> Proporção de Conteúdos</h3>
                  <span class="card-tag">Categorias</span>
                </div>
                <div class="chart-canvas-box">
                  <Doughnut :data="doughnutChartData" :options="chartOptions" />
                </div>
              </div>
            </div>

            <!-- Recent Quick Lists -->
            <div class="quick-overview-row">
              <!-- Recent Posts -->
              <div class="card quick-card">
                <div class="card-header">
                  <h3><i class="fas fa-edit"></i> Artigos Recentes</h3>
                  <button @click="activeTab = 'blog'" class="btn-link">Gerir Todos &rarr;</button>
                </div>
                <div class="quick-list">
                  <div v-for="post in posts.slice(0, 4)" :key="post._id || post.id" class="quick-item">
                    <img :src="post.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'" class="mini-thumb" />
                    <div class="quick-info">
                      <span class="quick-title">{{ post.title }}</span>
                      <div class="quick-meta">
                        <span class="cat-pill">{{ post.category }}</span>
                        <span><i class="far fa-eye"></i> {{ post.views || 0 }}</span>
                      </div>
                    </div>
                    <button @click="openBlogModal(post); activeTab = 'blog'" class="btn-icon" title="Editar">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                  </div>
                  <p v-if="posts.length === 0" class="empty-text">Nenhum artigo encontrado no banco.</p>
                </div>
              </div>

              <!-- Recent Contact Messages -->
              <div class="card quick-card">
                <div class="card-header">
                  <h3><i class="fas fa-envelope-open-text"></i> Últimas Mensagens Recebidas</h3>
                  <button @click="activeTab = 'messages'" class="btn-link">Ver Caixa de Entrada &rarr;</button>
                </div>
                <div class="quick-list">
                  <div 
                    v-for="msg in messages.slice(0, 4)" 
                    :key="msg._id || msg.id" 
                    :class="['quick-item', { unread: !msg.read }]"
                    @click="openMessageModal(msg)"
                    style="cursor: pointer;"
                  >
                    <div class="msg-avatar-badge">
                      {{ (msg.name || 'C')[0].toUpperCase() }}
                    </div>
                    <div class="quick-info">
                      <div class="msg-header-row">
                        <span class="quick-title">{{ msg.name }}</span>
                        <span v-if="!msg.read" class="new-dot" title="Não lida"></span>
                      </div>
                      <span class="quick-sub">{{ msg.email }}</span>
                      <p class="quick-snippet">{{ msg.message }}</p>
                    </div>
                  </div>
                  <p v-if="messages.length === 0" class="empty-text">Nenhuma mensagem recebida ainda.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: BLOG POSTS -->
          <div v-if="activeTab === 'blog'" class="tab-pane fade-in">
            <!-- Filter & Action Bar -->
            <div class="action-bar-glass">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input 
                  type="text" 
                  v-model="blogSearch" 
                  placeholder="Pesquisar por título ou resumo..." 
                />
              </div>

              <div class="category-filter">
                <label>Categoria:</label>
                <select v-model="selectedBlogCategory">
                  <option value="Todos">Todas as Categorias</option>
                  <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <button @click="openBlogModal()" class="btn-primary-add">
                <i class="fas fa-plus"></i> Novo Artigo
              </button>
            </div>

            <!-- Blog Posts Table -->
            <div class="card table-container-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Capa</th>
                    <th>Título do Artigo</th>
                    <th>Categoria</th>
                    <th>Visualizações</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in filteredPosts" :key="post._id || post.id">
                    <td class="col-thumb">
                      <img 
                        :src="post.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'" 
                        class="post-thumb" 
                        alt="Capa"
                      />
                    </td>
                    <td class="col-title">
                      <strong>{{ post.title }}</strong>
                      <span class="post-slug-sub">/blog/{{ post.slug }}</span>
                    </td>
                    <td>
                      <span class="cat-badge" :class="post.category?.toLowerCase()">{{ post.category }}</span>
                    </td>
                    <td>
                      <span class="views-counter"><i class="fas fa-eye"></i> {{ post.views || 0 }}</span>
                    </td>
                    <td>
                      <span class="date-text">{{ new Date(post.date || post.createdAt).toLocaleDateString() }}</span>
                    </td>
                    <td>
                      <span :class="['status-pill', post.published !== false ? 'published' : 'draft']">
                        {{ post.published !== false ? 'Publicado' : 'Rascunho' }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="btn-actions-cluster">
                        <button @click="openBlogModal(post)" class="action-btn edit" title="Editar Artigo">
                          <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button @click="deletePost(post)" class="action-btn delete" title="Excluir Artigo">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredPosts.length === 0">
                    <td colspan="7" class="text-center empty-cell">
                      <i class="fas fa-folder-open"></i>
                      <p>Nenhum artigo encontrado correspondente aos filtros.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 3: PACKAGES & SERVICES -->
          <div v-if="activeTab === 'packages'" class="tab-pane fade-in">
            <div class="section-intro-bar">
              <div>
                <h2>Serviços e Planos de Consultoria</h2>
                <p>Estes pacotes são sincronizados dinamicamente na base de dados MongoDB.</p>
              </div>
              <button @click="openPackageModal()" class="btn-primary-add">
                <i class="fas fa-plus"></i> Novo Pacote
              </button>
            </div>

            <div class="packages-grid">
              <div v-for="pkg in packages" :key="pkg._id || pkg.id" class="card package-admin-card">
                <div class="pkg-top">
                  <div class="pkg-icon-wrap">
                    <i :class="pkg.icon || 'fas fa-chart-line'"></i>
                  </div>
                  <div class="pkg-header-info">
                    <h3>{{ pkg.title }}</h3>
                    <span class="pkg-price-badge">{{ pkg.price || 'Sob Consulta' }}</span>
                  </div>
                </div>

                <p class="pkg-description">{{ pkg.description }}</p>

                <div class="pkg-deliverables">
                  <span class="deliverables-heading"><i class="fas fa-check-double"></i> Entregáveis Incluídos:</span>
                  <ul class="features-list">
                    <li v-for="(feat, idx) in pkg.features" :key="idx">
                      <i class="fas fa-check"></i> {{ feat }}
                    </li>
                    <li v-if="!pkg.features || pkg.features.length === 0" class="no-feats">
                      Nenhum item adicionado
                    </li>
                  </ul>
                </div>

                <div class="pkg-card-actions">
                  <button @click="openPackageModal(pkg)" class="pkg-btn edit">
                    <i class="fas fa-edit"></i> Editar
                  </button>
                  <button @click="deletePackage(pkg)" class="pkg-btn del">
                    <i class="fas fa-trash"></i> Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: MESSAGES (INBOX) -->
          <div v-if="activeTab === 'messages'" class="tab-pane fade-in">
            <div class="action-bar-glass">
              <div class="filter-tabs-pills">
                <button 
                  :class="['filter-pill', { active: messageFilter === 'all' }]"
                  @click="messageFilter = 'all'"
                >
                  Todas ({{ messages.length }})
                </button>
                <button 
                  :class="['filter-pill', { active: messageFilter === 'unread' }]"
                  @click="messageFilter = 'unread'"
                >
                  Não Lidas ({{ unreadCount }})
                </button>
              </div>

              <div class="inbox-info-text">
                <i class="fas fa-info-circle"></i> Mensagens enviadas no formulário de contacto do site são salvas aqui no MongoDB.
              </div>
            </div>

            <div class="card table-container-card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 40px;"></th>
                    <th>Remetente</th>
                    <th>Email</th>
                    <th>Assunto</th>
                    <th>Prévia da Mensagem</th>
                    <th>Data</th>
                    <th class="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="msg in filteredMessages" 
                    :key="msg._id || msg.id"
                    :class="['msg-row', { unread: !msg.read }]"
                  >
                    <td>
                      <button 
                        @click.stop="toggleMessageRead(msg)" 
                        class="btn-read-toggle"
                        :title="msg.read ? 'Marcar como não lida' : 'Marcar como lida'"
                      >
                        <i :class="msg.read ? 'far fa-envelope-open text-muted' : 'fas fa-envelope text-orange'"></i>
                      </button>
                    </td>
                    <td class="font-semibold">{{ msg.name }}</td>
                    <td>
                      <a :href="`mailto:${msg.email}`" class="email-link">{{ msg.email }}</a>
                    </td>
                    <td><span class="subject-badge">{{ msg.subject || 'Contacto' }}</span></td>
                    <td class="msg-snippet-td" @click="openMessageModal(msg)">
                      {{ msg.message }}
                    </td>
                    <td class="date-cell">{{ new Date(msg.createdAt).toLocaleDateString() }}</td>
                    <td class="text-right">
                      <div class="btn-actions-cluster">
                        <button @click="openMessageModal(msg)" class="action-btn view" title="Ler Mensagem Completa">
                          <i class="fas fa-eye"></i>
                        </button>
                        <a :href="`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Contacto Gabriel Armindo')}`" class="action-btn reply" title="Responder por Email">
                          <i class="fas fa-reply"></i>
                        </a>
                        <button @click="deleteMessage(msg)" class="action-btn delete" title="Excluir Mensagem">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredMessages.length === 0">
                    <td colspan="7" class="text-center empty-cell">
                      <i class="fas fa-inbox"></i>
                      <p>Nenhuma mensagem nesta visualização.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 5: TESTIMONIALS -->
          <div v-if="activeTab === 'testimonials'" class="tab-pane fade-in">
            <div class="section-intro-bar">
              <div>
                <h2>Depoimentos & Recomendações</h2>
                <p>Gerencie o feedback e as avaliações de clientes e mentorados exibidos na página principal.</p>
              </div>
              <button @click="openTestimonialModal()" class="btn-primary-add">
                <i class="fas fa-plus"></i> Novo Depoimento
              </button>
            </div>

            <div class="testimonials-admin-grid">
              <div v-for="item in testimonials" :key="item._id || item.id" class="card testimonial-admin-card">
                <div class="testimonial-rating">
                  <i class="fas fa-star" v-for="star in (item.rating || 5)" :key="star"></i>
                </div>
                <p class="testimonial-body">"{{ item.content }}"</p>
                <div class="testimonial-footer-admin">
                  <div class="author-details">
                    <h4>{{ item.name }}</h4>
                    <span>{{ item.role }}</span>
                  </div>
                  <div class="actions">
                    <button @click="openTestimonialModal(item)" class="action-btn edit" title="Editar">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button @click="deleteTestimonial(item)" class="action-btn delete" title="Excluir">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- ================= MODALS ================= -->

    <!-- BLOG MODAL (Create & Edit) -->
    <div v-if="isBlogModalOpen" class="modal-overlay-custom">
      <div class="modal-dialog large">
        <div class="modal-header-custom">
          <div>
            <h3>{{ editingPost ? 'Editar Artigo' : 'Publicar Novo Artigo' }}</h3>
            <span class="modal-subtitle">As alterações serão gravadas diretamente no MongoDB Atlas</span>
          </div>
          <button @click="isBlogModalOpen = false" class="btn-close-modal">&times;</button>
        </div>

        <form @submit.prevent="savePost" class="modal-form">
          <div class="form-grid-2">
            <!-- Title -->
            <div class="form-group span-2">
              <label>Título do Artigo <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="postForm.title" 
                @input="autoGenerateSlug" 
                required 
                placeholder="Ex: Metodologias Ágeis em M&E para Impacto Social" 
              />
            </div>

            <!-- Slug -->
            <div class="form-group">
              <label>Slug URL (automático)</label>
              <input 
                type="text" 
                v-model="postForm.slug" 
                placeholder="metodologias-ageis-me-impacto" 
              />
            </div>

            <!-- Category -->
            <div class="form-group">
              <label>Categoria</label>
              <input 
                type="text" 
                v-model="postForm.category" 
                list="category-suggestions" 
                placeholder="Ex: MEAL, Dados, M&A..." 
              />
              <datalist id="category-suggestions">
                <option value="MEAL"></option>
                <option value="Dados"></option>
                <option value="M&A"></option>
                <option value="Geral"></option>
                <option value="Pesquisa"></option>
              </datalist>
            </div>

            <!-- Excerpt -->
            <div class="form-group span-2">
              <label>Resumo Rápido (Subtítulo)</label>
              <input 
                type="text" 
                v-model="postForm.excerpt" 
                placeholder="Uma síntese cativante para os cartões da página inicial..." 
              />
            </div>

            <!-- Image Cover Upload / URL -->
            <div class="form-group span-2">
              <div class="image-field-header">
                <label>Imagem de Capa</label>
                <div class="upload-mode-toggle">
                  <button 
                    type="button" 
                    :class="{ active: uploadTab === 'upload' }" 
                    @click="uploadTab = 'upload'"
                  >
                    Upload Arquivo
                  </button>
                  <button 
                    type="button" 
                    :class="{ active: uploadTab === 'url' }" 
                    @click="uploadTab = 'url'"
                  >
                    Link / URL Externa
                  </button>
                </div>
              </div>

              <!-- File Upload Mode -->
              <div v-if="uploadTab === 'upload'" class="upload-dropzone">
                <input 
                  type="file" 
                  id="post-image-file" 
                  accept="image/*" 
                  @change="handleFileUpload" 
                  style="display: none;" 
                />
                <label for="post-image-file" class="dropzone-label">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>{{ isUploading ? 'A carregar imagem...' : 'Clique para selecionar do computador' }}</span>
                  <small>Formatos aceitos: JPG, PNG, WEBP</small>
                </label>
              </div>

              <!-- URL Mode -->
              <div v-else class="url-input-wrap">
                <input 
                  type="url" 
                  v-model="postForm.image" 
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <!-- Image Preview -->
              <div v-if="postForm.image" class="image-preview-box">
                <img :src="postForm.image" alt="Preview da Capa" />
                <button type="button" @click="postForm.image = ''" class="btn-remove-img">&times;</button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="form-group span-2">
              <label>Conteúdo Completo do Artigo <span class="required">*</span></label>
              <textarea 
                v-model="postForm.content" 
                rows="10" 
                required
                placeholder="Escreva o conteúdo do artigo aqui. Parágrafos, listas e formatação HTML são aceitos..."
              ></textarea>
              <small class="hint">Suporta tags HTML como &lt;p&gt;, &lt;strong&gt;, &lt;h3&gt;, &lt;ul&gt;, etc.</small>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label>Status de Publicação</label>
              <select v-model="postForm.published">
                <option :value="true">Publicado no Site</option>
                <option :value="false">Rascunho (Oculto)</option>
              </select>
            </div>

            <!-- Author -->
            <div class="form-group">
              <label>Autor</label>
              <input type="text" v-model="postForm.author" placeholder="Gabriel Armindo" />
            </div>
          </div>

          <div class="modal-footer-custom">
            <button type="button" @click="isBlogModalOpen = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">
              <i class="fas fa-save"></i> Salvar no MongoDB
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PACKAGE MODAL -->
    <div v-if="isPackageModalOpen" class="modal-overlay-custom">
      <div class="modal-dialog">
        <div class="modal-header-custom">
          <div>
            <h3>{{ editingPackage ? 'Editar Pacote' : 'Novo Pacote de Serviços' }}</h3>
            <span class="modal-subtitle">Configure preço, entregáveis e ícone</span>
          </div>
          <button @click="isPackageModalOpen = false" class="btn-close-modal">&times;</button>
        </div>

        <form @submit.prevent="savePackage" class="modal-form">
          <div class="form-grid-2">
            <div class="form-group span-2">
              <label>Nome do Serviço / Pacote <span class="required">*</span></label>
              <input type="text" v-model="packageForm.title" required placeholder="Ex: Consultoria MEAL Completa" />
            </div>

            <div class="form-group">
              <label>Preço Sugerido</label>
              <input type="text" v-model="packageForm.price" placeholder="Ex: Sob Consulta ou A partir de $250" />
            </div>

            <div class="form-group">
              <label>Ícone (FontAwesome)</label>
              <input type="text" v-model="packageForm.icon" placeholder="fas fa-chart-line" />
            </div>

            <div class="form-group span-2">
              <label>Descrição do Pacote</label>
              <textarea v-model="packageForm.description" rows="3" placeholder="Breve resumo da proposta de valor..."></textarea>
            </div>

            <div class="form-group span-2">
              <label>Entregáveis / Benefícios Incluídos</label>
              <div class="feature-input-row">
                <input 
                  type="text" 
                  v-model="newFeature" 
                  @keyup.enter.prevent="addFeature" 
                  placeholder="Ex: Desenho de Quadro Lógico..." 
                />
                <button type="button" @click="addFeature" class="btn-add-item">
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <div class="features-pill-list">
                <div v-for="(feat, idx) in packageForm.features" :key="idx" class="feature-chip">
                  <span>{{ feat }}</span>
                  <button type="button" @click="removeFeature(idx)">&times;</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button type="button" @click="isPackageModalOpen = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">
              <i class="fas fa-check"></i> Salvar Pacote
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MESSAGE MODAL (Reader) -->
    <div v-if="isMessageModalOpen && selectedMessage" class="modal-overlay-custom">
      <div class="modal-dialog">
        <div class="modal-header-custom">
          <div>
            <h3>Mensagem de {{ selectedMessage.name }}</h3>
            <span class="modal-subtitle">Recebida em {{ new Date(selectedMessage.createdAt).toLocaleString() }}</span>
          </div>
          <button @click="isMessageModalOpen = false" class="btn-close-modal">&times;</button>
        </div>

        <div class="message-details-body">
          <div class="detail-row">
            <strong>Email:</strong>
            <a :href="`mailto:${selectedMessage.email}`">{{ selectedMessage.email }}</a>
          </div>
          <div class="detail-row">
            <strong>Assunto:</strong>
            <span>{{ selectedMessage.subject || 'Contacto via Website' }}</span>
          </div>
          <div class="message-full-box">
            <p>{{ selectedMessage.message }}</p>
          </div>
        </div>

        <div class="modal-footer-custom">
          <button type="button" @click="deleteMessage(selectedMessage)" class="btn-danger-modal">
            <i class="fas fa-trash-alt"></i> Excluir
          </button>
          <div class="right-buttons">
            <button type="button" @click="isMessageModalOpen = false" class="btn-cancel">Fechar</button>
            <a 
              :href="`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Contacto')}`" 
              class="btn-save"
            >
              <i class="fas fa-reply"></i> Responder por Email
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- TESTIMONIAL MODAL -->
    <div v-if="isTestimonialModalOpen" class="modal-overlay-custom">
      <div class="modal-dialog">
        <div class="modal-header-custom">
          <div>
            <h3>{{ editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento' }}</h3>
            <span class="modal-subtitle">Exibido na secção de testemunhos da landing page</span>
          </div>
          <button @click="isTestimonialModalOpen = false" class="btn-close-modal">&times;</button>
        </div>

        <form @submit.prevent="saveTestimonial" class="modal-form">
          <div class="form-grid-2">
            <div class="form-group span-2">
              <label>Nome da Pessoa / Organização <span class="required">*</span></label>
              <input type="text" v-model="testimonialForm.name" required placeholder="Ex: Samuel Matola" />
            </div>

            <div class="form-group">
              <label>Cargo / Função</label>
              <input type="text" v-model="testimonialForm.role" placeholder="Ex: Oficial de MEAL | Consultor" />
            </div>

            <div class="form-group">
              <label>Avaliação (Estrelas)</label>
              <select v-model="testimonialForm.rating">
                <option :value="5">⭐⭐⭐⭐⭐ (5 Estrelas)</option>
                <option :value="4">⭐⭐⭐⭐ (4 Estrelas)</option>
                <option :value="3">⭐⭐⭐ (3 Estrelas)</option>
              </select>
            </div>

            <div class="form-group span-2">
              <label>Depoimento <span class="required">*</span></label>
              <textarea v-model="testimonialForm.content" rows="4" required placeholder="Relato da experiência de trabalho ou mentoria..."></textarea>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button type="button" @click="isTestimonialModalOpen = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">
              <i class="fas fa-save"></i> Salvar Depoimento
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ==================== GLOBAL LAYOUT ==================== */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f6f8fb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2d3748;
}

/* ==================== TOAST NOTIFICATION ==================== */
.admin-toast {
  position: fixed;
  top: 24px;
  right: 28px;
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: 12px;
  background: #1e293b;
  color: #fff;
  font-weight: 500;
  font-size: 0.92rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}
.admin-toast.success i { color: #10b981; }
.admin-toast.error i { color: #ef4444; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-15px); }

/* ==================== SIDEBAR ==================== */
.sidebar {
  width: 280px;
  background: #0f172a;
  color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0,0,0,0.05);
}

.sidebar-header {
  padding: 2rem 1.75rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #fff;
  font-family: 'Outfit', sans-serif;
}
.logo-badge {
  background: #FF7B1A;
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mongo-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  font-size: 0.75rem;
  color: #94a3b8;
}
.status-dot.online {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.sidebar-nav button {
  width: 100%;
  text-align: left;
  padding: 0.85rem 1.1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.sidebar-nav button i {
  font-size: 1.15rem;
  width: 22px;
  text-align: center;
  color: #64748b;
  transition: color 0.2s;
}

.sidebar-nav button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.sidebar-nav button:hover i {
  color: #FF7B1A;
}

.sidebar-nav button.active {
  color: #fff;
  background: linear-gradient(90deg, rgba(255,123,26,0.15), rgba(255,123,26,0.05));
  border-left: 3px solid #FF7B1A;
  font-weight: 600;
}
.sidebar-nav button.active i {
  color: #FF7B1A;
}

.badge-count {
  margin-left: auto;
  background: rgba(255,255,255,0.1);
  color: #cbd5e1;
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 99px;
  font-weight: 600;
}
.badge-count.unread {
  background: #FF7B1A;
  color: #fff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.sidebar-footer {
  padding: 1.2rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.view-site-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.88rem;
  border-radius: 8px;
  transition: 0.2s;
}
.view-site-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 1rem;
  color: #f87171;
  background: transparent;
  border: none;
  font-size: 0.88rem;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s;
  text-align: left;
}
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* ==================== MAIN CONTENT & TOPBAR ==================== */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  background: #fff;
  padding: 1.2rem 2.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left h1 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.topbar-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 3px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.btn-action-top {
  background: linear-gradient(135deg, #FF7B1A, #ff9442);
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(255,123,26,0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-action-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,123,26,0.35);
}

.admin-profile-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 5px;
  background: #f8fafc;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
}
.admin-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #FF7B1A;
}
.admin-info-mini {
  display: flex;
  flex-direction: column;
}
.admin-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}
.admin-role {
  font-size: 0.7rem;
  color: #64748b;
}

/* ==================== CONTENT BODY ==================== */
.content-body {
  padding: 2.2rem 2.5rem;
  flex: 1;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1.2rem;
  color: #64748b;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #FF7B1A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Cards */
.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

/* ==================== TAB 1: OVERVIEW ==================== */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.25s, box-shadow 0.25s;
}
.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.metric-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.metric-card.orange .metric-icon { background: rgba(255,123,26,0.12); color: #FF7B1A; }
.metric-card.blue .metric-icon { background: rgba(59,130,246,0.12); color: #3b82f6; }
.metric-card.green .metric-icon { background: rgba(16,185,129,0.12); color: #10b981; }
.metric-card.purple .metric-icon { background: rgba(139,92,246,0.12); color: #8b5cf6; }

.metric-details {
  display: flex;
  flex-direction: column;
}
.metric-label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
}
.metric-val {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin: 2px 0 4px;
}
.metric-hint {
  font-size: 0.72rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}
.metric-hint.has-unread {
  color: #FF7B1A;
  font-weight: 600;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.chart-card {
  padding: 1.5rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}
.card-header h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.card-tag {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
}
.chart-canvas-box {
  height: 260px;
  position: relative;
}

/* Quick Lists */
.quick-overview-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.quick-card {
  padding: 1.5rem;
}
.btn-link {
  background: none;
  border: none;
  color: #FF7B1A;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-link:hover { text-decoration: underline; }

.quick-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.quick-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  transition: background 0.2s;
}
.quick-item:hover { background: #f8fafc; }
.quick-item.unread {
  background: rgba(255,123,26,0.04);
  border-color: rgba(255,123,26,0.25);
}

.mini-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
.quick-info { flex: 1; min-width: 0; }
.quick-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quick-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #64748b;
}
.cat-pill {
  background: #f1f5f9;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 600;
  color: #475569;
}

.msg-avatar-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF7B1A;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
}
.msg-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.new-dot {
  width: 8px;
  height: 8px;
  background: #FF7B1A;
  border-radius: 50%;
}
.quick-sub { font-size: 0.76rem; color: #64748b; display: block; }
.quick-snippet {
  font-size: 0.78rem;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.empty-text {
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  padding: 2rem 0;
}

/* ==================== ACTION BAR (FILTERS) ==================== */
.action-bar-glass {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.search-box i {
  position: absolute;
  left: 14px;
  color: #94a3b8;
}
.search-box input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-box input:focus {
  border-color: #FF7B1A;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: #64748b;
}
.category-filter select {
  padding: 0.65rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.88rem;
  background: #fff;
  outline: none;
}

.btn-primary-add {
  background: #FF7B1A;
  color: #fff;
  border: none;
  padding: 0.7rem 1.3rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  white-space: nowrap;
}
.btn-primary-add:hover {
  background: #e66b12;
}

.filter-tabs-pills {
  display: flex;
  gap: 8px;
}
.filter-pill {
  background: #f1f5f9;
  border: none;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: 0.2s;
}
.filter-pill.active {
  background: #0f172a;
  color: #fff;
}
.inbox-info-text {
  margin-left: auto;
  font-size: 0.82rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ==================== DATA TABLES ==================== */
.table-container-card {
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.data-table th {
  background: #f8fafc;
  padding: 1rem 1.25rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}
.data-table tbody tr:hover {
  background: #fbfcfe;
}

.col-thumb { width: 70px; }
.post-thumb {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
}
.col-title strong {
  display: block;
  font-size: 0.92rem;
  color: #1e293b;
}
.post-slug-sub {
  font-size: 0.74rem;
  color: #94a3b8;
}

.cat-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
}
.cat-badge.meal { background: #fee2e2; color: #b91c1c; }
.cat-badge.dados { background: #e0e7ff; color: #4338ca; }
.cat-badge.m\&a { background: #dcfce7; color: #15803d; }

.views-counter {
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
}
.date-text, .date-cell {
  font-size: 0.82rem;
  color: #64748b;
}

.status-pill {
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 99px;
  font-weight: 600;
}
.status-pill.published { background: #d1fae5; color: #065f46; }
.status-pill.draft { background: #f1f5f9; color: #64748b; }

.btn-actions-cluster {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.action-btn:hover { color: #0f172a; border-color: #cbd5e1; }
.action-btn.edit:hover { color: #3b82f6; border-color: #3b82f6; background: #eff6ff; }
.action-btn.delete:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }
.action-btn.reply:hover { color: #10b981; border-color: #10b981; background: #ecfdf5; }
.action-btn.view:hover { color: #FF7B1A; border-color: #FF7B1A; background: #fff7ed; }

.empty-cell {
  padding: 3.5rem 0 !important;
  color: #94a3b8;
}
.empty-cell i { font-size: 2rem; margin-bottom: 8px; }

/* Inbox table rows */
.msg-row.unread {
  background: rgba(255,123,26,0.03);
  font-weight: 500;
}
.msg-snippet-td {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: #475569;
}
.btn-read-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.text-orange { color: #FF7B1A; }
.text-muted { color: #94a3b8; }
.email-link { color: #3b82f6; text-decoration: none; }
.email-link:hover { text-decoration: underline; }
.subject-badge {
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #334155;
}

/* ==================== PACKAGES TAB ==================== */
.section-intro-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.section-intro-bar h2 {
  font-size: 1.35rem;
  color: #0f172a;
  margin: 0 0 4px;
}
.section-intro-bar p {
  color: #64748b;
  font-size: 0.88rem;
  margin: 0;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.package-admin-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
}
.package-admin-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
}

.pkg-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.pkg-icon-wrap {
  width: 52px;
  height: 52px;
  background: rgba(255,123,26,0.1);
  color: #FF7B1A;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}
.pkg-header-info h3 {
  font-size: 1.1rem;
  color: #0f172a;
  margin: 0 0 4px;
}
.pkg-price-badge {
  font-size: 0.85rem;
  font-weight: 700;
  color: #FF7B1A;
}

.pkg-description {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.pkg-deliverables {
  flex: 1;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}
.deliverables-heading {
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.features-list li {
  font-size: 0.83rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}
.features-list li i {
  color: #10b981;
  font-size: 0.75rem;
}
.features-list .no-feats { color: #94a3b8; font-style: italic; }

.pkg-card-actions {
  display: flex;
  gap: 10px;
}
.pkg-btn {
  flex: 1;
  padding: 0.65rem 0;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
}
.pkg-btn.edit {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
}
.pkg-btn.edit:hover { background: #e2e8f0; color: #0f172a; }
.pkg-btn.del {
  background: #fff;
  border: 1px solid #fee2e2;
  color: #ef4444;
}
.pkg-btn.del:hover { background: #fef2f2; }

/* ==================== TESTIMONIALS TAB ==================== */
.testimonials-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}
.testimonial-admin-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
}
.testimonial-rating {
  color: #f59e0b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}
.testimonial-body {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  font-style: italic;
  flex: 1;
  margin-bottom: 1.25rem;
}
.testimonial-footer-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
}
.author-details h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
}
.author-details span {
  font-size: 0.78rem;
  color: #64748b;
}

/* ==================== MODALS ==================== */
.modal-overlay-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
}

.modal-dialog {
  background: #fff;
  width: 100%;
  max-width: 580px;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalScale 0.25s ease-out;
}
.modal-dialog.large {
  max-width: 780px;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header-custom {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.modal-header-custom h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin: 0 0 4px;
}
.modal-subtitle {
  font-size: 0.8rem;
  color: #64748b;
}
.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}
.btn-close-modal:hover { color: #0f172a; }

.modal-form {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group.span-2 { grid-column: span 2; }
.form-group label {
  font-size: 0.84rem;
  font-weight: 600;
  color: #334155;
}
.required { color: #ef4444; }

.form-group input, 
.form-group select, 
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  border-color: #FF7B1A;
  box-shadow: 0 0 0 3px rgba(255,123,26,0.12);
}
.hint { font-size: 0.75rem; color: #94a3b8; }

/* Upload / Image inside Modal */
.image-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-mode-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px;
}
.upload-mode-toggle button {
  background: none;
  border: none;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
}
.upload-mode-toggle button.active {
  background: #fff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.upload-dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
}
.dropzone-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #64748b;
}
.dropzone-label i { font-size: 2rem; color: #FF7B1A; }
.dropzone-label small { color: #94a3b8; }

.image-preview-box {
  position: relative;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  max-height: 180px;
}
.image-preview-box img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
}

/* Feature input inside Package Modal */
.feature-input-row {
  display: flex;
  gap: 8px;
}
.feature-input-row input { flex: 1; }
.btn-add-item {
  background: #0f172a;
  color: #fff;
  border: none;
  width: 44px;
  border-radius: 8px;
  cursor: pointer;
}
.features-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.feature-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 6px;
}
.feature-chip button {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1;
}

/* Message details inside Reader */
.message-details-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.detail-row {
  display: flex;
  gap: 10px;
  font-size: 0.92rem;
}
.detail-row strong { width: 70px; color: #475569; }
.message-full-box {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  line-height: 1.6;
  color: #1e293b;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

/* Modal Footer */
.modal-footer-custom {
  padding: 1.2rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
}
.btn-cancel {
  background: #fff;
  border: 1px solid #cbd5e1;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  color: #475569;
}
.btn-save {
  background: #FF7B1A;
  border: none;
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.btn-save:hover { background: #e66b12; }
.btn-danger-modal {
  margin-right: auto;
  background: none;
  border: 1px solid #fee2e2;
  color: #ef4444;
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger-modal:hover { background: #fef2f2; }
.right-buttons { display: flex; gap: 10px; }

/* Transitions */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .charts-row, .quick-overview-row { grid-template-columns: 1fr; }
}
</style>
