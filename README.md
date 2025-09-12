# EntrePages - Backend API

Backend para a aplicação de diário digital EntrePages.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Multer (upload de arquivos)
- PDFKit (geração de relatórios)
- CORS

## 📋 Pré-requisitos

- Node.js 
- PostgreSQL
- NPM 

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Execute as migrações do banco de dados (SQL scripts)

5. Inicie o servidor:
```bash
npm run dev
```

## 📚 Endpoints da API

### Entradas do Diário
- `GET /api/diary-entries` - Listar todas as entradas
- `GET /api/diary-entries/:id` - Buscar entrada por ID
- `POST /api/diary-entries` - Criar nova entrada
- `PUT /api/diary-entries/:id` - Atualizar entrada
- `DELETE /api/diary-entries/:id` - Deletar entrada

### Relatórios
- `GET /api/report/pdf` - Gerar relatório PDF das entradas

## 🔑 Autenticação

Todas as rotas requerem o header `x-api-key` com a chave configurada no arquivo `.env`.

## 📁 Estrutura do Projeto

```
src/
├── config/
│   ├── database.js
│   ├── upload.js
│   └── apiKey.js
├── controllers/
│   ├── diaryEntriesController.js
│   └── reportController.js
├── models/
│   └── diaryEntriesModel.js
└── routes/
    ├── diaryEntriesRoutes.js
    └── reportRoutes.js
```
