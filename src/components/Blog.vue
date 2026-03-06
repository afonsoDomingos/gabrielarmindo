<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const selectedPost = ref(null);
const isModalOpen = ref(false);

const fetchPosts = async () => {
  try {
    const res = await axios.get('/api/blog');
    posts.value = res.data;
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
  }
};

const openPost = (post) => {
  selectedPost.value = post;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = '';
};

onMounted(fetchPosts);
</script>

<template>
  <section class="blog section" id="blog">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-tag">Insights & Artigos</span>
        <h2 class="section-title">Meu Blog</h2>
      </div>

      <div class="blog-grid">
        <div v-for="post in posts" :key="post.id" class="blog-card" @click="openPost(post)">
          <div class="blog-image">
            <img v-if="post.image" :src="post.image" :alt="post.title" style="width: 100%; height: 100%; object-fit: cover;" />
            <i v-else class="fas fa-image"></i>
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-category">{{ post.category }}</span>
              <span class="blog-date">{{ new Date(post.date).toLocaleDateString() }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <div class="blog-footer">
              <div class="blog-author">
                <i class="fas fa-user-circle"></i>
                <span>{{ post.author }}</span>
              </div>
              <span class="blog-read-more">
                Ler mais <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal do Blog -->
    <div v-if="isModalOpen" class="modal active">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">&times;</button>
        <div class="modal-body" v-if="selectedPost">
          <div class="modal-image" :style="{ backgroundImage: `url(${selectedPost.image})` }"></div>
          <span class="blog-category">{{ selectedPost.category }}</span>
          <h2>{{ selectedPost.title }}</h2>
          <div class="blog-meta-modal">
            <span><i class="far fa-calendar-alt"></i> {{ new Date(selectedPost.date).toLocaleDateString() }}</span>
            <span><i class="fas fa-user"></i> {{ selectedPost.author }}</span>
          </div>
          <div class="blog-full-content" v-html="selectedPost.content"></div>
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
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.blog-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
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
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    font-size: 0.875rem;
}

.blog-category {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 123, 26, 0.1);
    border-radius: 50px;
    color: var(--primary-color);
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

.blog-read-more {
    color: var(--primary-color);
    font-weight: 600;
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
    width: 90%; max-width: 800px; max-height: 90vh;
    border-radius: var(--radius-xl);
    overflow-y: auto;
    z-index: 10;
}

.modal-image {
    width: 100%; height: 300px;
    background-size: cover; background-position: center;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.modal-body { padding: var(--spacing-lg); }
.modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: white; border: none; font-size: 2rem;
    cursor: pointer; width: 40px; height: 40px; border-radius: 50%;
}

.blog-full-content {
    margin-top: 2rem;
    line-height: 1.8;
    color: var(--text-secondary);
}

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
        padding: var(--spacing-md);
    }
}

@media (max-width: 480px) {
    .blog-content {
        padding: 1.5rem;
    }
    
    .modal-image {
        height: 200px;
    }
}
</style>
