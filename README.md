# Projeto Kaban - Laravel + Breeze + Bootstrap + Jquery + MySQL + AJAX

Sistema de gerenciamento de tarefas estilo **Trello**, desenvolvido com **Laravel** e **MySQL**, onde o usuário pode:

- Criar, editar, excluir **quadros (boards)**;
- Criar, editar, excluir **categorias (colunas)** dentro de cada quadro;
- Criar, editar, excluir e mover **tasks (tarefas)** entre categorias via **drag & drop**;
- Fazer login e cadastro via **Laravel Breeze** (autenticação completa).

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
|-------------|------------------|
| **Laravel 11** | Framework backend principal. Gerencia rotas, controllers, migrations e autenticação. |
| **Laravel Breeze** | Sistema de autenticação pronto, com login, registro, logout e middleware. |
| **MySQL** | Banco de dados relacional que armazena usuários, quadros, categorias e tasks. |
| **Eloquent ORM** | Camada de acesso ao banco de dados usada pelo Laravel. |
| **Bootstrap 5** | Framework CSS para estilização e layout responsivo. |
| **jQuery 3.7** | Facilita manipulação de DOM e requisições AJAX. |
| **jQuery UI (Sortable)** | Implementa o arrastar e soltar (drag & drop) das tasks. |
| **Alpine.js** | Usado pelo Laravel Breeze para interações reativas simples. |
| **Vite** | Ferramenta de build moderna para empacotar assets e JS. |
| **PHP 8.3** | Linguagem base utilizada pelo Laravel. |

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [PHP 8.3+](https://www.php.net/downloads)
- [Composer](https://getcomposer.org/)
- [Node.js 18+ e npm](https://nodejs.org/)
- [MySQL 8+](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

---

## 📥 Instalação

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/pedroronchini/project-kaban.git
```

Entre na pasta do projeto:
```bash
cd project-kaban
```

### 2️⃣ Instalar dependências do PHP e do Node
```bash
composer install
npm install
```

### 3️⃣ Criar o arquivo de ambiente
Copie o arquivo .env.example para .env:
```bash
cp .env.example .env
```

### 4️⃣ Configurar o banco de dados MySQL
Edite o arquivo .env e atualize as variáveis de ambiente de acordo com seu ambiente local:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_kaban
DB_USERNAME=root
DB_PASSWORD=suasenha
```

### 5️⃣ Gerar a chave da aplicação
```bash
php artisan key:generate
```

### 6️⃣ Executar as migrations
```bash
php artisan migrate
```

### 7️⃣ Compilar os assets com o Vite
Para rodar o servidor de desenvolvimento:
```bash
npm run dev
```
Ou para build de produção:
```bash
npm run build
```

### 8️⃣ Iniciar o servidor Laravel
```bash
php artisan serve
```
Acesse no navegador:
👉 http://localhost:8000

### 🔁 Principais Funcionalidades
## 🧍‍♂️ Autenticação

- Login, registro e logout via Laravel Breeze.

## 🧩 Boards

- Criar, editar, excluir e listar quadros pessoais (Dashboard).
- Acessar cada quadro individualmente.

## 🗂️ Categories

- Criar colunas dentro do quadro (ex: “Todo”, “Doing”, “Done”).
- Editar e excluir categorias.

## ✅ Tasks

- Criar tarefas em qualquer categoria.
- Editar, excluir e mover entre colunas.
- Drag & Drop com jQuery UI Sortable.
- Atualização dinâmica via AJAX (sem recarregar a página).

### ✨ Autor

Desenvolvido por Pedro Henrique Ronchini
🔗 GitHub: https://github.com/pedroronchini
