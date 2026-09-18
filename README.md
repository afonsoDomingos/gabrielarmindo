# Portfólio Profissional & Painel Administrativo - Gabriel Armindo

Plataforma profissional e sistema de gestão de conteúdos (CMS / Admin) de **Gabriel Armindo**, Especialista Sénior em Monitoria, Avaliação (MEAL / M&E), Análise de Dados e Psicologia Social.

---

## 🚀 Tecnologias

- **Frontend**: Vue.js 3 (Composition API, `<script setup>`), Vite 5, Vue Router 4, Chart.js & vue-chartjs.
- **Estilos & UI**: CSS3 Moderno, Glassmorphism, Dark/Modern Themes, Font Awesome 6, Google Fonts (Inter, Outfit).
- **Backend**: Node.js, Express, Mongoose (MongoDB ODM), Multer.
- **Banco de Dados**: **MongoDB Atlas** (Cloud Database persistente).
- **Armazenamento de Imagens**: Suporte integrado para Cloudinary e upload local (`public/uploads/`).

---

## 📂 Estrutura do Projeto

```
/
├── models/                  # Modelos Mongoose (MongoDB)
│   ├── Post.js              # Artigos do Blog (slug, views, category, etc.)
│   ├── Package.js           # Catálogo de Serviços & Consultoria
│   ├── Message.js           # Mensagens do Formulário de Contacto (Inbox)
│   └── Testimonial.js       # Depoimentos & Avaliações
├── src/
│   ├── components/          # Componentes Vue da Landing Page
│   │   ├── Navbar.vue, Hero.vue, About.vue, ResumeTabs.vue
│   │   ├── ServicesOverview.vue, Services.vue, Blog.vue, Contact.vue, etc.
│   │   └── Testimonials.vue # Depoimentos dinâmicos sincronizados com MongoDB
│   ├── views/
│   │   ├── Home.vue         # Página inicial pública
│   │   ├── Login.vue        # Autenticação de Administrador
│   │   └── Admin.vue        # Painel Administrativo Completo
│   ├── router/              # Rotas e guardas de autenticação
│   └── main.js              # Configurações globais, interatividade e scroll reveal
├── public/                  # Arquivos estáticos e uploads locais
├── server.js                # Servidor Express, conexão Atlas e APIs REST
├── .env                     # Variáveis de ambiente e MongoDB URI
└── package.json
```

---

## 🛠️ Como Executar

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configuração de Ambiente (`.env`)**:
   Configure as variáveis de conexão no arquivo `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster0.oe0akin.mongodb.net/gabrielarmindo?retryWrites=true&w=majority
   ADMIN_EMAIL=info@gabrielarmindo.com
   ADMIN_PASSWORD=@Admin123@
   JWT_SECRET=gabrielarmindo_secret_key_2026_secure
   ```

3. **Iniciar em Modo de Desenvolvimento** (Backend + Frontend com hot-reload):
   ```bash
   npm run dev
   ```

4. **Modo Produção**:
   ```bash
   npm run build
   npm start
   ```
   Acesse em: `http://localhost:3000`

---

## 🔐 Painel Administrativo (/admin)

Para acessar o console de administração:
1. Abra `http://localhost:3000/login` (ou clique no link "Admin" no rodapé da página).
2. **Email**: `info@gabrielarmindo.com`
3. **Senha**: `@Admin123@`

### Funcionalidades do Painel:
- 📊 **Visão Geral**: Métricas em tempo real (Total de Artigos, Visualizações totais, Serviços ativos, Mensagens recebidas) e gráficos interativos de categorias.
- ✍️ **Gestão de Blog**: Publicação, edição e exclusão de artigos, geração automática de slugs amigáveis, upload ou URL de capas, visualizações acumuladas e filtros por categoria.
- 💼 **Serviços & Planos**: Criação e edição de pacotes de consultoria com checklist dinâmico de entregáveis e definição de preços.
- 📬 **Mensagens (Inbox)**: Leitor de mensagens enviadas por visitantes no formulário de contacto do site, com status de lida/não lida, resposta rápida por email e exclusão.
- 💬 **Testemunhos**: Gestão de depoimentos de clientes e mentorados com avaliação por estrelas.
