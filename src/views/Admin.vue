<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Bar, Pie } from 'vue-chartjs';
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
const activeTab = ref('overview'); // 'overview', 'blog', or 'packages'
const posts = ref([]);
const packages = ref([]);

// Modal State (Blog)
const isBlogModalOpen = ref(false);
const editingPost = ref(null);
const postForm = ref({ title: '', excerpt: '', category: 'Geral', content: '', image: '' });

// Modal State (Packages)
const isPackageModalOpen = ref(false);
const editingPackage = ref(null);
const packageForm = ref({ title: '', price: '', description: '', features: [], icon: 'fas fa-box' });
const newFeature = ref('');

const apiToken = localStorage.getItem('gabriel_admin_token');
const axiosConfig = { headers: { Authorization: `Bearer ${apiToken}` } };

const fetchData = async () => {
  try {
    const [blogRes, pkgRes] = await Promise.all([
      axios.get('/api/blog'),
      axios.get('/api/packages')
    ]);
    posts.value = blogRes.data;
    packages.value = pkgRes.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchData);

// Stats Calculation
const totalPosts = computed(() => posts.value.length);
const categoryStats = computed(() => {
  const stats = {};
  posts.value.forEach(p => stats[p.category] = (stats[p.category] || 0) + 1);
  return stats;
});

// Chart Data
const barChartData = computed(() => ({
  labels: Object.keys(categoryStats.value),
  datasets: [{
    label: 'Posts por Categoria',
    backgroundColor: '#FF7B1A',
    data: Object.values(categoryStats.value)
  }]
}));

const pieChartData = computed(() => ({
  labels: Object.keys(categoryStats.value),
  datasets: [{
    backgroundColor: ['#FF7B1A', '#FF9F55', '#FFBF8B', '#FFD8B9'],
    data: Object.values(categoryStats.value)
  }]
}));

const chartOptions = { responsive: true, maintainAspectRatio: false };

// --- Blog CRUD ---
const openBlogModal = (post = null) => {
  if (post) {
    editingPost.value = post;
    postForm.value = { ...post };
  } else {
    editingPost.value = null;
    postForm.value = { title: '', excerpt: '', category: 'Geral', content: '', image: '' };
  }
  isBlogModalOpen.value = true;
};

const savePost = async () => {
  try {
    if (editingPost.value) await axios.put(`/api/blog/${editingPost.value.id}`, postForm.value, axiosConfig);
    else await axios.post('/api/blog', postForm.value, axiosConfig);
    isBlogModalOpen.value = false;
    fetchData();
  } catch (err) { alert('Erro ao salvar post'); }
};

const deletePost = async (id) => {
  if (!confirm('Excluir este post?')) return;
  await axios.delete(`/api/blog/${id}`, axiosConfig);
  fetchData();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await axios.post('/api/upload', formData, axiosConfig);
    postForm.value.image = res.data.url;
  } catch (err) { alert('Erro no upload'); }
};

// --- Packages CRUD ---
const openPackageModal = (pkg = null) => {
  if (pkg) {
    editingPackage.value = pkg;
    packageForm.value = { ...pkg, features: [...pkg.features] };
  } else {
    editingPackage.value = null;
    packageForm.value = { title: '', price: '', description: '', features: [], icon: 'fas fa-box' };
  }
  isPackageModalOpen.value = true;
};

const addFeature = () => {
  if (newFeature.value.trim()) {
    packageForm.value.features.push(newFeature.value.trim());
    newFeature.value = '';
  }
};

const removeFeature = (index) => {
  packageForm.value.features.splice(index, 1);
}

const savePackage = async () => {
  try {
    if (editingPackage.value) await axios.put(`/api/packages/${editingPackage.value.id}`, packageForm.value, axiosConfig);
    else await axios.post('/api/packages', packageForm.value, axiosConfig);
    isPackageModalOpen.value = false;
    fetchData();
  } catch (err) { alert('Erro ao salvar pacote'); }
};

const deletePackage = async (id) => {
  if (!confirm('Excluir este pacote?')) return;
  await axios.delete(`/api/packages/${id}`, axiosConfig);
  fetchData();
};

const logout = () => {
  localStorage.removeItem('gabriel_admin_token');
  router.push('/login');
};
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-text">Gabriel</span>
          <span class="logo-badge">Console</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
          <i class="fas fa-chart-pie"></i> Visão Geral
        </button>
        <button :class="{ active: activeTab === 'blog' }" @click="activeTab = 'blog'">
          <i class="fas fa-file-alt"></i> Blog Posts
        </button>
        <button :class="{ active: activeTab === 'packages' }" @click="activeTab = 'packages'">
          <i class="fas fa-box-open"></i> Serviços
        </button>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <i class="fas fa-door-open"></i> Sair
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <h1>{{ activeTab === 'overview' ? 'Dashboard' : activeTab === 'blog' ? 'Gestão de Blog' : 'Gestão de Serviços' }}</h1>
        <div class="user-profile">
          <span>Admin Gabriel</span>
          <img src="/images/perfil1.png" alt="Admin" />
        </div>
      </header>

      <div class="content-wrapper">
        <!-- Dashboard Overview -->
        <div v-if="activeTab === 'overview'" class="fade-in">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-pen-nib"></i></div>
              <div class="stat-info">
                <span class="stat-label">Artigos</span>
                <span class="stat-value">{{ totalPosts }}</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-concierge-bell"></i></div>
              <div class="stat-info">
                <span class="stat-label">Serviços</span>
                <span class="stat-value">{{ packages.length }}</span>
              </div>
            </div>
          </div>

          <div class="charts-grid">
            <div class="card chart-container">
              <h3>Distribuição de Conteúdo</h3>
              <div class="chart-wrapper"><Bar :data="barChartData" :options="chartOptions" /></div>
            </div>
            <div class="card chart-container">
              <h3>Engajamento por Categoria</h3>
              <div class="chart-wrapper"><Pie :data="pieChartData" :options="chartOptions" /></div>
            </div>
          </div>
        </div>

        <!-- Blog Management -->
        <div v-if="activeTab === 'blog'" class="fade-in">
          <div class="section-header-admin">
            <h2>Postagens</h2>
            <button @click="openBlogModal()" class="btn btn-primary"><i class="fas fa-plus"></i> Novo Post</button>
          </div>
          <div class="card table-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Capa</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post.id">
                  <td><img :src="post.image || '/images/vibe_author.png'" class="table-thumb" /></td>
                  <td class="td-title">{{ post.title }}</td>
                  <td><span class="badge-cat">{{ post.category }}</span></td>
                  <td>
                    <div class="btn-group">
                      <button @click="openBlogModal(post)" class="btn-sm"><i class="fas fa-pencil-alt"></i></button>
                      <button @click="deletePost(post.id)" class="btn-sm del"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Services Management -->
        <div v-if="activeTab === 'packages'" class="fade-in">
          <div class="section-header-admin">
            <h2>Nossos Planos</h2>
            <button @click="openPackageModal()" class="btn btn-primary"><i class="fas fa-plus"></i> Novo Pacote</button>
          </div>
          <div class="packages-grid-admin">
            <div v-for="pkg in packages" :key="pkg.id" class="card pkg-admin-card">
              <div class="pkg-header">
                <i :class="pkg.icon"></i>
                <div>
                  <h3>{{ pkg.title }}</h3>
                  <span class="pkg-price-tag">{{ pkg.price }}</span>
                </div>
              </div>
              <p class="pkg-desc">{{ pkg.description }}</p>
              <div class="pkg-footer-btns">
                <button @click="openPackageModal(pkg)" class="btn-inline"><i class="fas fa-edit"></i> Editar</button>
                <button @click="deletePackage(pkg.id)" class="btn-inline del"><i class="fas fa-trash"></i> Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <!-- Blog Modal -->
    <div v-if="isBlogModalOpen" class="modal-root">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editingPost ? 'Editar Postagem' : 'Nova Postagem' }}</h3>
          <button @click="isBlogModalOpen = false">&times;</button>
        </div>
        <form @submit.prevent="savePost" class="modern-form">
          <div class="form-grid">
            <div class="input-wrap wide">
              <label>Título Principal</label>
              <input type="text" v-model="postForm.title" required placeholder="Digite o título..." />
            </div>
            <div class="input-wrap">
              <label>Categoria</label>
              <select v-model="postForm.category">
                <option>Geral</option>
                <option>M&A</option>
                <option>MEAL</option>
                <option>Dados</option>
              </select>
            </div>
            <div class="input-wrap wide">
              <label>Resumo Rápido</label>
              <input type="text" v-model="postForm.excerpt" placeholder="Uma frase chamativa..." />
            </div>
            <div class="input-wrap wide">
              <label>Conteúdo do Artigo</label>
              <textarea v-model="postForm.content" rows="6" placeholder="Escreva aqui..."></textarea>
            </div>
            <div class="input-wrap wide">
              <label>Capa do Post</label>
              <div class="upload-area">
                <input type="file" @change="handleFileUpload" id="blog-file" />
                <label for="blog-file" class="upload-trigger">
                  <i class="fas fa-upload"></i> {{ postForm.image ? 'Trocar Imagem' : 'Selecionar Imagem' }}
                </label>
                <img v-if="postForm.image" :src="postForm.image" class="mini-preview" />
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="isBlogModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-save">Salvar Conteúdo</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Package Modal -->
    <div v-if="isPackageModalOpen" class="modal-root">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editingPackage ? 'Editar Pacote' : 'Novo Pacote' }}</h3>
          <button @click="isPackageModalOpen = false">&times;</button>
        </div>
        <form @submit.prevent="savePackage" class="modern-form">
          <div class="form-grid">
            <div class="input-wrap wide">
              <label>Nome do Serviço</label>
              <input type="text" v-model="packageForm.title" required placeholder="Ex: Master Plan consultoria" />
            </div>
            <div class="input-wrap">
              <label>Preço Sugerido</label>
              <input type="text" v-model="packageForm.price" placeholder="Ex: Sob Consulta" />
            </div>
            <div class="input-wrap">
              <label>Ícone (FontAwesome)</label>
              <input type="text" v-model="packageForm.icon" placeholder="Ex: fas fa-chart-line" />
            </div>
            <div class="input-wrap wide">
              <label>Descrição Curta</label>
              <textarea v-model="packageForm.description" rows="2"></textarea>
            </div>
            <div class="input-wrap wide">
              <label>O que está incluído?</label>
              <div class="feature-add">
                <input type="text" v-model="newFeature" @keyup.enter="addFeature" placeholder="Adicionar funcionalidade..." />
                <button type="button" @click="addFeature"><i class="fas fa-plus"></i></button>
              </div>
              <ul class="feature-list-admin">
                <li v-for="(feat, i) in packageForm.features" :key="i">
                  {{ feat }} <button type="button" @click="removeFeature(i)">&times;</button>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="isPackageModalOpen = false">Cancelar</button>
            <button type="submit" class="btn-save">Confirmar Pacote</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Refined Admin Styles */
.admin-layout { display: flex; min-height: 100vh; background: #f4f6f9; font-family: 'Inter', sans-serif; }

/* Improved Sidebar */
.sidebar { width: 280px; background: #111; color: #fff; position: fixed; height: 100vh; display: flex; flex-direction: column; }
.sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid #222; }
.logo { font-size: 1.6rem; font-weight: 800; display: flex; align-items: center; gap: 0.8rem; }
.logo-badge { background: #FF7B1A; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; }

.sidebar-nav { flex: 1; padding: 2rem 0; }
.sidebar-nav button {
  width: 100%; text-align: left; padding: 1.2rem 2rem; background: none; border: none;
  color: #888; display: flex; align-items: center; gap: 1.2rem; font-size: 1rem; cursor: pointer;
  transition: 0.3s;
}
.sidebar-nav button:hover, .sidebar-nav button.active { color: #fff; background: rgba(255,123,26,0.1); border-right: 4px solid #FF7B1A; }
.sidebar-nav button i { font-size: 1.2rem; }

.logout-btn { padding: 1.5rem 2rem; border-top: 1px solid #222; color: #ff4d4d; background: none; border: none; width: 100%; text-align: left; cursor: pointer; }

/* Main Content */
.main-content { flex: 1; margin-left: 280px; padding-bottom: 4rem; }
.topbar { background: #fff; padding: 1.2rem 3rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 10px rgba(0,0,0,0.05); }
.topbar h1 { font-size: 1.4rem; color: #333; }
.user-profile { display: flex; align-items: center; gap: 1rem; font-weight: 500; }
.user-profile img { width: 42px; height: 42px; border-radius: 50%; border: 2px solid #FF7B1A; }

.content-wrapper { padding: 2.5rem 3rem; }

.modal-box { background: #fff; width: 95%; max-width: 650px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
.modal-header { padding: 1.2rem 1.8rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { font-size: 1.2rem; font-weight: 700; }
.modal-header button { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #999; }
.modal-actions { padding: 1.2rem 1.8rem; background: #fafafa; display: flex; justify-content: flex-end; gap: 1rem; border-radius: 0 0 16px 16px; }
.btn-save { background: #FF7B1A; color: #fff; border: none; padding: 0.7rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.9rem; }
.btn-cancel { background: #eee; border: none; padding: 0.7rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem; }

/* Upload Area */
.upload-area { position: relative; border: 1.5px dashed #ddd; border-radius: 10px; padding: 1rem; text-align: center; }
.upload-trigger { display: block; cursor: pointer; color: #FF7B1A; font-weight: 700; font-size: 0.85rem; }
#blog-file { display: none; }
.mini-preview { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-top: 0.8rem; }

/* Improved Inputs & Forms */
.modern-form { display: flex; flex-direction: column; gap: 1.2rem; padding: 1.5rem 1.8rem; }
.input-wrap { display: flex; flex-direction: column; gap: 0.4rem; }
.input-wrap.wide { grid-column: span 2; }
.input-wrap label { font-weight: 600; font-size: 0.85rem; color: #666; }
.input-wrap input, .input-wrap select, .input-wrap textarea {
  padding: 0.75rem 1rem; border: 1px solid #e0e0e0; border-radius: 8px;
  background: #fdfdfd; transition: 0.3s; font-size: 0.9rem;
}
.input-wrap input:focus, .input-wrap select:focus, .input-wrap textarea:focus {
  border-color: #FF7B1A; box-shadow: 0 0 0 3px rgba(255,123,26,0.1); outline: none; background: #fff;
}

/* Dashboard Restored Elements */
.card { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: #fff; padding: 1.2rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem; }
.stat-icon { width: 45px; height: 45px; background: rgba(255,123,26,0.1); color: #FF7B1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.stat-value { font-size: 1.5rem; font-weight: 800; display: block; }

.charts-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; }
.chart-container h3 { margin-bottom: 1rem; font-size: 1rem; }
.chart-wrapper { height: 250px; position: relative; }

.section-header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }

/* Table */
.table-card { padding: 0; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { background: #fafafa; padding: 1rem; text-align: left; font-size: 0.8rem; color: #888; text-transform: uppercase; border-bottom: 1px solid #eee; }
.admin-table td { padding: 1rem; border-bottom: 1px solid #f9f9f9; font-size: 0.9rem; }
.table-thumb { width: 45px; height: 35px; object-fit: cover; border-radius: 6px; }
.badge-cat { background: rgba(255,123,26,0.1); color: #FF7B1A; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; }
.btn-group { display: flex; gap: 0.4rem; }
.btn-sm { width: 30px; height: 30px; border-radius: 6px; border: 1px solid #eee; background: white; cursor: pointer; transition: 0.2s; font-size: 0.8rem; }
.btn-sm:hover { background: #f0f0f0; }
.btn-sm.del:hover { color: #ff4d4d; border-color: #ff4d4d; }

/* Packages Admin */
.packages-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
.pkg-admin-card { display: flex; flex-direction: column; gap: 0.8rem; padding: 1.2rem; }
.pkg-header { display: flex; align-items: center; gap: 1rem; }
.pkg-header i { font-size: 1.5rem; color: #FF7B1A; }
.pkg-price-tag { color: #FF7B1A; font-weight: 800; font-size: 0.9rem; }
.pkg-desc { font-size: 0.85rem; color: #666; }
.pkg-footer-btns { display: flex; gap: 0.8rem; margin-top: auto; padding-top: 0.8rem; border-top: 1px solid #f0f0f0; }
.btn-inline { background: none; border: none; font-weight: 600; cursor: pointer; color: #666; font-size: 0.85rem; }
.btn-inline.del { color: #ff4d4d; }

/* Features Admin */
.feature-add { display: flex; gap: 0.4rem; }
.feature-add input { flex: 1; padding: 0.6rem !important; }
.feature-add button { background: #FF7B1A; color: #fff; border: none; width: 36px; border-radius: 8px; cursor: pointer; }
.feature-list-admin { margin-top: 0.8rem; padding: 0; list-style: none; }
.feature-list-admin li { display: flex; justify-content: space-between; padding: 0.6rem; background: #f8f9fa; border-radius: 6px; margin-bottom: 0.4rem; font-size: 0.85rem; }
.feature-list-admin li button { background: none; border: none; color: #ff4d4d; font-size: 1rem; cursor: pointer; }

/* Utilities */
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 900px) {
  .sidebar { width: 80px; }
  .logo span, .sidebar-nav button span, .logout-btn span { display: none; }
  .main-content { margin-left: 80px; }
  .form-grid { grid-template-columns: 1fr; gap: 1rem; }
  .input-wrap.wide { grid-column: auto; }
  .modal-box { width: 95%; border-radius: 12px; }
  .modal-header, .modern-form, .modal-actions { padding: 1.2rem; }
  .topbar { padding: 1rem 1.5rem; }
  .content-wrapper { padding: 1.5rem; }
  .charts-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
  .topbar h1 { font-size: 1.1rem; }
  .stat-card { flex-direction: column; text-align: center; gap: 0.5rem; }
  .btn-save, .btn-cancel { width: 100%; }
  .modal-actions { flex-direction: column; }
}
</style>
