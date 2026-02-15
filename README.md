# Portfólio - Gabriel Armindo

Este é o portfólio profissional de Gabriel Armindo, Especialista em Monitoria, Avaliação (M&E) e Análise de Dados. O projeto foi desenvolvido com foco em performance, design moderno e facilidade de gestão de conteúdo através de um sistema de blog integrado.

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Variáveis CSS, Flexbox, Grid), JavaScript (ES6+).
- **Backend**: Node.js, Express.
- **Design**: Responsivo, Glassmorphism, Gradientes modernos.
- **Ícones**: Font Awesome.

## 📂 Estrutura do Projeto

```
/
├── public/              # Arquivos estáticos do frontend
│   ├── css/             # Estilos CSS
│   ├── js/              # Lógica JavaScript
│   ├── images/          # Imagens do site e blog
│   └── index.html       # Página principal
├── server.js            # Servidor backend e API
├── package.json         # Dependências e scripts
└── .env                 # Variáveis de ambiente
```

## 🛠️ Como Executar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor**:
   Para desenvolvimento (com hot-reload):
   ```bash
   npm run dev
   ```
   
   Para produção:
   ```bash
   npm start
   ```

3. **Acesse**:
   Abra seu navegador em `http://localhost:3000`.

## ✨ Funcionalidades

- **Design Premium**: Interface moderna com animações suaves e paleta de cores profissional.
- **Blog Dinâmico**: Sistema integrado para criar e listar artigos sobre M&A e Análise de Dados.
- **Contador Animado**: Estatísticas de experiência e impacto com animação de contagem.
- **Formulário de Contato**: Funcional e pronto para integração com serviços de email.
- **Responsividade**: Adapta-se perfeitamente a celulares, tablets e desktops.

## 📝 Personalização

Para adicionar novos posts ao blog, você pode usar o botão "Criar Novo Post" na seção de blog (os dados são salvos em memória enquanto o servidor estiver rodando) ou editar o array `blogPosts` no arquivo `server.js` para adicionar posts permanentes.

---
Desenvolvido para Afonso Domingos.
