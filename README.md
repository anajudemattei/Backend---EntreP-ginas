# 📔 EntrePages - Backend API

API backend simples e direta para o diário digital EntrePages.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Plataforma JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **Multer** - Upload de arquivos (fotos)
- **PDFKit** - Geração de relatórios em PDF
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📁 Estrutura do Projeto

```
Backend---EntreP-ginas/
├── 📄 server.js                  # ⭐ Arquivo principal - inicia o servidor
├── 📄 package.json               # Dependências do projeto
├── 📄 .env                       # Variáveis de ambiente (NÃO versionar!)
├── 📄 .env.example               # Exemplo de configuração
│
├── 📁 src/
│   ├── 📁 config/                # ⚙️ Configurações
│   │   ├── database.js           # Conexão com PostgreSQL
│   │   ├── upload.js             # Configuração do Multer
│   │   └── apiKey.js             # Middleware de autenticação
│   │
│   ├── 📁 models/                # 💾 Camada de dados
│   │   └── diaryEntriesModel.js  # Funções do banco de dados
│   │
│   ├── 📁 controllers/           # 🎮 Lógica de negócio
│   │   ├── diaryEntriesController.js
│   │   └── reportController.js
│   │
│   └── 📁 routes/                # 🛣️ Rotas da API
│       ├── diaryEntriesRoutes.js
│       └── reportRoutes.js
│
└── 📁 uploads/                   # 📷 Fotos 
```

---

## ⚙️ Como Instalar e Executar

### 1️⃣ Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- PostgreSQL instalado e rodando
- Git (opcional)

### 2️⃣ Clonar o projeto
```bash
git clone <url-do-repositorio>
cd Backend---EntreP-ginas
```

### 3️⃣ Instalar dependências
```bash
npm install
```

### 4️⃣ Configurar variáveis de ambiente
```bash
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_NAME=entrepaginas_db
DB_PORT=5432
API_KEY=sua_chave_secreta_aqui
```

### 5️⃣ Criar o banco de dados
Execute o script SQL em `src/database/schema.sql` no PostgreSQL:

### 6️⃣ Iniciar o servidor
```bash
npm run dev
```

✅ O servidor estará rodando em `http://localhost:3000`

---

## 📡 Endpoints da API

### 🔐 Autenticação
**Todas as rotas requerem o header:**
```
x-api-key: sua_chave_configurada_no_env
```

### 📝 Entradas do Diário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/diary-entries` | Lista todas as entradas |
| GET | `/api/diary-entries/:id` | Busca uma entrada específica |
| GET | `/api/diary-entries/favorites` | Lista entradas favoritas |
| GET | `/api/diary-entries/mood/:mood` | Lista entradas por humor |
| GET | `/api/diary-entries/stats` | Estatísticas gerais |
| POST | `/api/diary-entries` | Cria nova entrada (com foto) |
| PUT | `/api/diary-entries/:id` | Atualiza entrada completa |
| PATCH | `/api/diary-entries/:id/favorite` | Marca/desmarca favorito |
| DELETE | `/api/diary-entries/:id` | Deleta uma entrada |

### 📊 Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/report/pdf` | Gera PDF do diário |

---

## 🧪 Como Testar a API

### Exemplo 1: Criar Nova Entrada
```bash
POST http://localhost:3000/api/diary-entries
Headers:
  x-api-key: sua_chave_aqui
  Content-Type: application/json
  
Body (JSON):
{
  "title": "Meu primeiro dia",
  "content": "Hoje foi um dia incrível!",
  "entryDate": "2025-10-13",
  "mood": "feliz",
  "tags": ["primeiro-dia", "felicidade"]
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Entrada do diário criada com sucesso!",
  "data": {
    "id": 1,
    "title": "Meu primeiro dia",
    "content": "Hoje foi um dia incrível!",
    "entry_date": "2025-10-13",
    "mood": "feliz",
    "tags": ["primeiro-dia", "felicidade"],
    "is_favorite": false,
    "photo": null,
    "created_at": "2025-10-13T10:00:00.000Z"
  }
}
```

### Exemplo 2: Listar Todas as Entradas
```bash
GET http://localhost:3000/api/diary-entries
Headers:
  x-api-key: sua_chave_aqui
```

### Exemplo 3: Buscar com Filtros
```bash
GET http://localhost:3000/api/diary-entries?startDate=2025-10-01&endDate=2025-10-13&mood=feliz
Headers:
  x-api-key: sua_chave_aqui
```

### Exemplo 4: Criar Entrada com Foto
Use **form-data** no Postman/Insomnia:
```
POST http://localhost:3000/api/diary-entries
Headers:
  x-api-key: sua_chave_aqui
  
Body (form-data):
  title: Dia da praia
  content: Fui à praia hoje!
  entryDate: 2025-10-13
  mood: feliz
  tags: praia,diversão
  photo: [arquivo.jpg]
```

### Exemplo 5: Gerar PDF
```bash
GET http://localhost:3000/api/report/pdf?startDate=2025-10-01&endDate=2025-10-13
Headers:
  x-api-key: sua_chave_aqui
```

**Ferramenta recomendada:**
- 🔵 Postman

---

## 📚 Como Cada Arquivo Funciona

### 📄 server.js
**O que faz:** Arquivo principal que inicia o servidor Express

- Carrega variáveis de ambiente com `dotenv`
- Configura Express com CORS e JSON
- Registra as rotas da API
- Inicia o servidor na porta configurada
- Se a porta estiver ocupada, tenta a próxima

### 🗄️ src/config/database.js
**O que faz:** Cria a conexão com o banco PostgreSQL

- Usa o `Pool` do pacote `pg` para gerenciar conexões
- Pega credenciais das variáveis de ambiente
- Testa a conexão ao iniciar
- Exporta o pool para outros arquivos

### 📤 src/config/upload.js
**O que faz:** Configura o Multer para upload de fotos

- Cria a pasta `uploads/` se não existir
- Define onde salvar os arquivos
- Gera nomes únicos para cada foto
- Limita tamanho máximo (5MB)
- Aceita apenas imagens (jpeg, jpg, png, gif, webp)

### 🔐 src/config/apiKey.js
**O que faz:** Middleware que protege as rotas

- Verifica se tem o header `x-api-key`
- Compara com a chave do `.env`
- Bloqueia acesso se inválida (erro 403)
- Permite continuar se válida

### 💾 src/models/diaryEntriesModel.js
**O que faz:** Funções que acessam o banco de dados

**Principais funções:**
- `getDiaryEntries()` - Busca com filtros
- `getDiaryEntryById()` - Busca por ID
- `createDiaryEntry()` - Cria nova entrada
- `updateDiaryEntry()` - Atualiza entrada
- `deleteDiaryEntry()` - Remove entrada
- `getFavoriteDiaryEntries()` - Busca favoritas
- `toggleFavorite()` - Marca/desmarca favorito
- `getDiaryStats()` - Estatísticas gerais

### 🎮 src/controllers/diaryEntriesController.js
**O que faz:** Processa requisições e chama o model

- Valida dados recebidos
- Processa a requisição
- Chama funções do model
- Formata e envia resposta
- Trata erros com try/catch

### 📊 src/controllers/reportController.js
**O que faz:** Gera relatórios em PDF

- Busca entradas do banco
- Cria documento PDF com PDFKit
- Adiciona título, estatísticas e entradas
- Formata com cores e espaçamentos
- Envia PDF para download

### 🛣️ src/routes/diaryEntriesRoutes.js
**O que faz:** Define as rotas HTTP

- Aplica middleware de API Key
- Define métodos (GET, POST, PUT, etc.)
- Conecta URLs aos controllers
- Adiciona upload de foto na rota POST

### 📄 src/routes/reportRoutes.js
**O que faz:** Define rotas de relatórios

- Rota para gerar PDF
- Aceita filtros via query params

---

## 🔄 Fluxo de uma Requisição

```
1. CLIENTE
   └─ Faz requisição HTTP com API Key

2. SERVER.JS
   └─ Recebe e aplica middlewares (CORS, JSON, API Key)

3. ROUTES
   └─ Encontra a rota correta
   └─ Chama o controller adequado

4. CONTROLLER
   └─ Valida dados
   └─ Chama o model

5. MODEL
   └─ Executa query SQL no banco
   └─ Retorna resultados

6. CONTROLLER
   └─ Formata resposta JSON
   └─ Envia para o cliente

7. CLIENTE
   └─ Recebe resposta JSON
```

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev            # Inicia 
npm test               # Executa testes
```


## 🐛 Resolução de Problemas

### Erro: ECONNREFUSED
**Problema:** Não consegue conectar ao servidor
**Solução:** Verifique se o servidor está rodando com `npm run dev`

### Erro 403: API Key inválida
**Problema:** Chave da API não aceita
**Solução:** Verifique o header `x-api-key` e compare com o `.env`

### Erro 500: Erro interno
**Problema:** Erro no servidor
**Solução:** 
- Verifique se o PostgreSQL está rodando
- Confira as credenciais no `.env`
- Verifique se a tabela existe no banco
- Veja os logs do servidor no terminal

### Upload não funciona
**Problema:** Arquivo não é enviado
**Solução:**
- Use `form-data` (não JSON)
- Arquivo deve ser menor que 5MB
- Formato deve ser: jpeg, jpg, png, gif ou webp

---

## 👨‍💻 Desenvolvido por

**Ana Julia Pinheiro Demattei** - Projeto SENAI

---

## 📄 Licença

MIT

