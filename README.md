# Gestor de Tarefas Premium - Web II

## Equipe
- [Eliabi]
- [Iury Morais]
- [Galvão Segundo]

## Descrição
O **Gestor de Tarefas Premium** é uma aplicação Fullstack desenvolvida para resolver o problema de desorganização pessoal e profissional. Permite aos usuários criar múltiplos "Workspaces" (espaços de trabalho) para categorizar suas atividades (ex: Trabalho, Estudos, Pessoal) e gerenciar tarefas em um quadro Kanban interativo. O foco principal é oferecer uma experiência de usuário (UX) fluida, moderna e visualmente agradável.

## Tecnologias
- **Next.js 14+ (App Router)**: Framework principal utilizando a arquitetura moderna de Server/Client Components.
- **MongoDB Atlas & Mongoose**: Banco de dados NoSQL na nuvem para persistência de dados flexível.
- **HeroUI (NextUI) & Tailwind CSS**: Biblioteca de componentes e utilitários CSS para uma interface responsiva e premium.
- **NextAuth.js**: Sistema de autenticação seguro (Credenciais).

## Funcionalidades
- [x] **Cadastro e Login de Usuários**: Sistema completo de autenticação com proteção de rotas.
- [x] **Múltiplos Workspaces**: Criação, visualização e exclusão de diferentes contextos (CRUD de Workspaces).
- [x] **Gestão de Tarefas (CRUD)**: Adicionar, editar, listar e excluir tarefas dentro de cada workspace.
- [x] **Visualização Kanban**: Organização visual das tarefas por status (Pendente, Em Andamento, Concluída).
- [x] **Interface Responsiva**: Design adaptado para Celulares e Desktop.
- [x] **Soft UI Design**: Estética minimalista com feedbacks visuais e micro-interações.

## Configuração
Instruções para rodar o projeto localmente:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPO.git
   cd GestorDeTarefas
   ```

2. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz e adicione:
   ```env
   MONGODB_URI=sua_string_de_conexao_mongodb_atlas
   NEXTAUTH_SECRET=um_segredo_aleatorio_seguro
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Rode o projeto**
   ```bash
   npm run dev
   ```
   Acesse http://localhost:3000

## Deploy
[Acesse o projeto aqui](https://link-da-vercel.com)
