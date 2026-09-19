<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLanguage } from '../store/language';

const { t } = useLanguage();

const posts = ref([]);
const selectedPost = ref(null);
const isModalOpen = ref(false);

// Likes State (saved in localStorage to remember user's liked posts)
const likedPosts = ref(JSON.parse(localStorage.getItem('gabriel_liked_posts') || '[]'));
const isLiked = (post) => {
  const id = post?._id || post?.id;
  return likedPosts.value.includes(id);
};

// Comment Form State
const commentForm = ref({ name: '', content: '' });
const isSubmittingComment = ref(false);
const commentSuccess = ref('');
const copiedToast = ref(false);

const fetchPosts = async () => {
  try {
    const res = await axios.get('/api/blog');
    posts.value = res.data;
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
  }
};

const openPost = async (post) => {
  selectedPost.value = post;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
  commentSuccess.value = '';
  commentForm.value = { name: '', content: '' };

  try {
    const slugOrId = post.slug || post._id || post.id;
    const res = await axios.get(`/api/blog/${slugOrId}`);
    if (res.data) {
      selectedPost.value = res.data;
      post.views = res.data.views;
      post.likes = res.data.likes;
      post.comments = res.data.comments;
    }
  } catch (e) {
    // Ignore error
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = '';
};

// Like Action
const likePost = async (post) => {
  const id = post._id || post.id;
  if (isLiked(post)) return; // prevent duplicate like

  try {
    const res = await axios.post(`/api/blog/${id}/like`);
    post.likes = res.data.likes;
    if (selectedPost.value && (selectedPost.value._id === id || selectedPost.value.id === id)) {
      selectedPost.value.likes = res.data.likes;
    }
    likedPosts.value.push(id);
    localStorage.setItem('gabriel_liked_posts', JSON.stringify(likedPosts.value));
  } catch (err) {
    console.error('Erro ao dar like:', err);
  }
};

// Comment Action
const submitComment = async () => {
  if (!commentForm.value.name.trim() || !commentForm.value.content.trim()) return;

  isSubmittingComment.value = true;
  const id = selectedPost.value._id || selectedPost.value.id;

  try {
    const res = await axios.post(`/api/blog/${id}/comment`, commentForm.value);
    selectedPost.value.comments = res.data.comments;

    // Update in posts list as well
    const found = posts.value.find(p => (p._id || p.id) === id);
    if (found) found.comments = res.data.comments;

    commentForm.value = { name: '', content: '' };
    commentSuccess.value = t('Comentário publicado com sucesso!', 'Comment posted successfully!');
    setTimeout(() => { commentSuccess.value = ''; }, 4000);
  } catch (err) {
    alert(t('Erro ao enviar comentário.', 'Error posting comment.'));
  } finally {
    isSubmittingComment.value = false;
  }
};

// Copy link action
const copyArticleLink = () => {
  const url = window.location.origin + '/#blog';
  navigator.clipboard.writeText(url);
  copiedToast.value = true;
  setTimeout(() => { copiedToast.value = false; }, 2500);
};

onMounted(fetchPosts);
</script>

<template>
  <section class="blog section" id="blog">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">{{ t('Publicações & Insights', 'Publications & Insights') }}</span>
        <h2 class="section-title">{{ t('Artigos', 'Articles') }}</h2>
      </div>

      <div class="blog-grid reveal-container">
        <div v-for="post in posts" :key="post._id || post.id" class="blog-card glass-card reveal-item" @click="openPost(post)">
          <div class="blog-image">
            <img v-if="post.image" :src="post.image" :alt="post.title" style="width: 100%; height: 100%; object-fit: cover;" />
            <i v-else class="fas fa-image"></i>
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-category">{{ post.category }}</span>
              <span class="blog-date">{{ new Date(post.date || post.createdAt).toLocaleDateString() }}</span>
              <div class="card-stats-row">
                <span title="Visualizações"><i class="far fa-eye"></i> {{ post.views || 0 }}</span>
                <span title="Curtidas"><i class="far fa-heart"></i> {{ post.likes || 0 }}</span>
                <span title="Comentários"><i class="far fa-comment"></i> {{ post.comments?.length || 0 }}</span>
              </div>
            </div>
            <h3>{{ post.title }}</h3>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <div class="blog-footer">
              <div class="blog-author">
                <img src="/images/perfil1.png" alt="Gabriel Armindo" class="author-avatar-img" />
                <span>{{ post.author || 'Gabriel Armindo' }}</span>
              </div>
              <span class="blog-read-more">
                {{ t('Ler mais', 'Read more') }} <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal do Artigo Completo -->
    <div v-if="isModalOpen" class="modal active">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">&times;</button>
        <div class="modal-body" v-if="selectedPost">
          <div class="modal-image" :style="{ backgroundImage: `url(${selectedPost.image})` }"></div>
          
          <div class="modal-meta-top">
            <span class="blog-category">{{ selectedPost.category }}</span>
            <div class="social-stats-modal">
              <span class="stat-pill"><i class="far fa-eye"></i> {{ selectedPost.views || 0 }} {{ t('visualizações', 'views') }}</span>
              <span class="stat-pill"><i class="far fa-heart"></i> {{ selectedPost.likes || 0 }} {{ t('curtidas', 'likes') }}</span>
              <span class="stat-pill"><i class="far fa-comment"></i> {{ selectedPost.comments?.length || 0 }} {{ t('comentários', 'comments') }}</span>
            </div>
          </div>

          <h2>{{ selectedPost.title }}</h2>

          <div class="blog-meta-modal">
            <span><i class="far fa-calendar-alt"></i> {{ new Date(selectedPost.date || selectedPost.createdAt).toLocaleDateString() }}</span>
            <span class="author-modal-badge">
              <img src="/images/perfil1.png" alt="Gabriel Armindo" class="author-avatar-img-sm" />
              {{ selectedPost.author || 'Gabriel Armindo' }}
            </span>
          </div>

          <!-- Conteúdo -->
          <div class="blog-full-content" v-html="selectedPost.content"></div>

          <!-- Barra de Interação (Like + Share) -->
          <div class="interaction-bar">
            <button 
              class="btn-like-interact" 
              :class="{ active: isLiked(selectedPost) }" 
              @click.stop="likePost(selectedPost)"
            >
              <i :class="isLiked(selectedPost) ? 'fas fa-heart text-red' : 'far fa-heart'"></i>
              <span>{{ isLiked(selectedPost) ? t('Gostou!', 'Liked!') : t('Gostar do Artigo', 'Like Article') }} ({{ selectedPost.likes || 0 }})</span>
            </button>

            <button class="btn-share-interact" @click="copyArticleLink">
              <i class="fas fa-share-alt"></i>
              <span>{{ copiedToast ? t('Link copiado!', 'Link copied!') : t('Partilhar', 'Share') }}</span>
            </button>
          </div>

          <!-- Secção de Comentários -->
          <div class="comments-section">
            <h3 class="comments-title">
              <i class="fas fa-comments"></i> 
              {{ t('Comentários', 'Comments') }} ({{ selectedPost.comments?.length || 0 }})
            </h3>

            <!-- Lista de Comentários -->
            <div class="comments-list">
              <div v-for="(comment, idx) in selectedPost.comments" :key="idx" class="comment-item">
                <div class="comment-avatar">
                  {{ (comment.name || 'A')[0].toUpperCase() }}
                </div>
                <div class="comment-content-wrap">
                  <div class="comment-header">
                    <strong>{{ comment.name }}</strong>
                    <span class="comment-time">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>

              <p v-if="!selectedPost.comments || selectedPost.comments.length === 0" class="no-comments-yet">
                {{ t('Ainda não há comentários. Seja o primeiro a comentar!', 'No comments yet. Be the first to leave a comment!') }}
              </p>
            </div>

            <!-- Formulário para Comentar -->
            <form @submit.prevent="submitComment" class="comment-form">
              <h4>{{ t('Deixe a sua opinião', 'Leave your feedback') }}</h4>
              
              <div v-if="commentSuccess" class="comment-success-msg">
                <i class="fas fa-check-circle"></i> {{ commentSuccess }}
              </div>

              <div class="form-group-comment">
                <label>{{ t('O seu Nome', 'Your Name') }} *</label>
                <input 
                  type="text" 
                  v-model="commentForm.name" 
                  required 
                  :placeholder="t('Ex: Maria Silva', 'E.g., Maria Silva')" 
                />
              </div>

              <div class="form-group-comment">
                <label>{{ t('Seu Comentário', 'Your Comment') }} *</label>
                <textarea 
                  v-model="commentForm.content" 
                  rows="3" 
                  required 
                  :placeholder="t('Escreva o que achou deste artigo...', 'Write what you think about this article...')"
                ></textarea>
              </div>

              <button type="submit" :disabled="isSubmittingComment" class="btn-submit-comment">
                <i class="fas fa-paper-plane"></i> 
                {{ isSubmittingComment ? t('A enviar...', 'Sending...') : t('Publicar Comentário', 'Post Comment') }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-md);
}

.blog-card {
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.blog-card:hover {
    transform: translateY(-8px);
}

.blog-image {
    width: 100%;
    height: 200px;
    background: var(--bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.blog-content {
    padding: var(--spacing-md);
}

.blog-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    font-size: 0.85rem;
}

.card-stats-row {
    margin-left: auto;
    display: flex;
    gap: 12px;
    color: var(--text-muted, #888);
    font-size: 0.78rem;
}
.card-stats-row span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.blog-category {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 123, 26, 0.1);
    border-radius: 50px;
    color: var(--primary-color, #FF7B1A);
    font-weight: 600;
}

.blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.blog-author {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-secondary, #475569);
}

.author-avatar-img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top center;
    border: 1.5px solid var(--primary-color, #FF7B1A);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

.author-modal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.author-avatar-img-sm {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top center;
    border: 1.5px solid var(--primary-color, #FF7B1A);
    flex-shrink: 0;
}

.blog-read-more {
    color: var(--primary-color, #FF7B1A);
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 2000;
    display: flex;
    align-items: center; justify-content: center;
}

.modal-overlay {
    position: absolute; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    background: white;
    width: 92%; max-width: 820px; max-height: 90vh;
    border-radius: var(--radius-xl, 16px);
    overflow-y: auto;
    z-index: 10;
}

.modal-image {
    width: 100%; height: 320px;
    background-size: cover; background-position: center;
    border-radius: var(--radius-lg, 16px) var(--radius-lg, 16px) 0 0;
}

.modal-body { padding: 2rem 2.5rem; }
.modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: white; border: none; font-size: 1.8rem;
    cursor: pointer; width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 20;
}

.modal-meta-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.social-stats-modal {
    display: flex;
    gap: 8px;
}
.stat-pill {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 0.78rem;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.blog-meta-modal {
    display: flex;
    gap: 1.5rem;
    font-size: 0.88rem;
    color: #64748b;
    margin: 0.8rem 0 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f1f5f9;
}
.blog-meta-modal span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.blog-full-content {
    margin-top: 1.5rem;
    line-height: 1.85;
    color: #334155;
    font-size: 1.05rem;
}

/* Interaction Bar */
.interaction-bar {
    display: flex;
    gap: 1rem;
    margin: 2.5rem 0 2rem;
    padding: 1.25rem 0;
    border-top: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
}

.btn-like-interact {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 0.75rem 1.5rem;
    border-radius: 99px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}
.btn-like-interact:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #ef4444;
}
.btn-like-interact.active {
    background: #fef2f2;
    border-color: #ef4444;
    color: #ef4444;
}
.text-red { color: #ef4444; }

.btn-share-interact {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 0.75rem 1.5rem;
    border-radius: 99px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}
.btn-share-interact:hover {
    background: #e2e8f0;
    color: #0f172a;
}

/* Comments Section */
.comments-section {
    margin-top: 2rem;
}
.comments-title {
    font-size: 1.25rem;
    color: #0f172a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}
.comment-item {
    display: flex;
    gap: 14px;
    background: #f8fafc;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
}
.comment-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF7B1A, #ff9442);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
}
.comment-content-wrap { flex: 1; }
.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}
.comment-header strong { font-size: 0.95rem; color: #0f172a; }
.comment-time { font-size: 0.75rem; color: #94a3b8; }
.comment-text { font-size: 0.92rem; color: #475569; margin: 0; line-height: 1.5; }
.no-comments-yet { color: #94a3b8; font-style: italic; font-size: 0.9rem; }

/* Comment Form */
.comment-form {
    background: #fbfcfe;
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
    border-radius: 14px;
}
.comment-form h4 {
    margin: 0 0 1rem;
    font-size: 1.05rem;
    color: #0f172a;
}
.comment-success-msg {
    background: #ecfdf5;
    color: #065f46;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.88rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-group-comment {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 1rem;
}
.form-group-comment label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #475569;
}
.form-group-comment input,
.form-group-comment textarea {
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
}
.form-group-comment input:focus,
.form-group-comment textarea:focus {
    border-color: #FF7B1A;
}

.btn-submit-comment {
    background: #FF7B1A;
    color: #fff;
    border: none;
    padding: 0.75rem 1.6rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
}
.btn-submit-comment:hover { background: #e66b12; }
.btn-submit-comment:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
    .blog-grid {
        grid-template-columns: 1fr;
        max-width: 450px;
        margin: 0 auto;
    }

    .modal-content {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .modal-image {
        height: 250px;
        border-radius: 0;
    }

    .modal-body {
        padding: 1.5rem;
    }
}
</style>
