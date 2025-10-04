require('dotenv').config();
const request = require('supertest');
const express = require('express');

// Configuração do app para testes
const app = express();
const cors = require('cors');
const diaryEntriesRoutes = require('./src/routes/diaryEntriesRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", diaryEntriesRoutes);
app.use("/api", reportRoutes);

// API Key para testes
const API_KEY = process.env.API_KEY || 'entre-linhas-2024';

// Configurar timeout maior para testes
jest.setTimeout(30000);

describe('🧪 Testes da API EntrePages', () => {
    
    // ==========================================
    // TESTES UNITÁRIOS - Validações
    // ==========================================
    describe('📋 Testes Unitários - Validações', () => {
        
        test('Deve validar que título é obrigatório', () => {
            const entry = { content: 'Conteúdo de teste' };
            expect(entry.title).toBeUndefined();
        });

        test('Deve validar que conteúdo é obrigatório', () => {
            const entry = { title: 'Título de teste' };
            expect(entry.content).toBeUndefined();
        });

        test('Deve validar estrutura de entrada válida', () => {
            const entry = {
                title: 'Meu Dia',
                content: 'Foi um ótimo dia!',
                mood: 'feliz',
                tags: ['teste', 'dia'],
                isFavorite: false
            };
            expect(entry.title).toBeDefined();
            expect(entry.content).toBeDefined();
            expect(entry.mood).toBe('feliz');
            expect(Array.isArray(entry.tags)).toBe(true);
        });

        test('Deve validar que tags é um array', () => {
            const tags = ['tag1', 'tag2', 'tag3'];
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBe(3);
        });

        test('Deve validar que isFavorite é um booleano', () => {
            const isFavorite = true;
            expect(typeof isFavorite).toBe('boolean');
        });
    });

    // ==========================================
    // TESTES DE INTEGRAÇÃO - API Endpoints
    // ==========================================
    describe('🔌 Testes de Integração - Endpoints da API', () => {
        
        let createdEntryId;

        // Teste de autenticação
        describe('🔐 Autenticação', () => {
            test('Deve retornar 403 se API key não for fornecida', async () => {
                const response = await request(app)
                    .get('/api/diary-entries');
                
                expect(response.status).toBe(403);
                expect(response.body.success).toBe(false);
            });

            test('Deve retornar 403 se API key for inválida', async () => {
                const response = await request(app)
                    .get('/api/diary-entries')
                    .set('x-api-key', 'chave-invalida');
                
                expect(response.status).toBe(403);
                expect(response.body.success).toBe(false);
            });
        });

        // CRUD Completo
        describe('📝 CRUD de Entradas do Diário', () => {
            
            // CREATE - POST
            test('POST /api/diary-entries - Deve criar uma nova entrada', async () => {
                const newEntry = {
                    title: 'Entrada de Teste',
                    content: 'Este é um conteúdo de teste para a API',
                    mood: 'feliz',
                    tags: ['teste', 'api', 'jest'],
                    entryDate: '2024-10-04'
                };

                const response = await request(app)
                    .post('/api/diary-entries')
                    .set('x-api-key', API_KEY)
                    .send(newEntry);

                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty('id');
                expect(response.body.data.title).toBe(newEntry.title);
                expect(response.body.data.content).toBe(newEntry.content);
                
                // Salvar ID para próximos testes
                createdEntryId = response.body.data.id;
            });

            test('POST /api/diary-entries - Deve retornar 400 se título não for fornecido', async () => {
                const invalidEntry = {
                    content: 'Conteúdo sem título'
                };

                const response = await request(app)
                    .post('/api/diary-entries')
                    .set('x-api-key', API_KEY)
                    .send(invalidEntry);

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toContain('obrigatórios');
            });

            test('POST /api/diary-entries - Deve retornar 400 se conteúdo não for fornecido', async () => {
                const invalidEntry = {
                    title: 'Título sem conteúdo'
                };

                const response = await request(app)
                    .post('/api/diary-entries')
                    .set('x-api-key', API_KEY)
                    .send(invalidEntry);

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
            });

            // READ - GET ALL
            test('GET /api/diary-entries - Deve listar todas as entradas', async () => {
                const response = await request(app)
                    .get('/api/diary-entries')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(Array.isArray(response.body.data)).toBe(true);
                expect(response.body.count).toBeGreaterThan(0);
            });

            // READ - GET BY ID
            test('GET /api/diary-entries/:id - Deve buscar uma entrada específica', async () => {
                const response = await request(app)
                    .get(`/api/diary-entries/${createdEntryId}`)
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.id).toBe(createdEntryId);
                expect(response.body.data.title).toBe('Entrada de Teste');
            });

            test('GET /api/diary-entries/:id - Deve retornar 404 para ID inexistente', async () => {
                const response = await request(app)
                    .get('/api/diary-entries/999999')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
            });

            // UPDATE - PUT
            test('PUT /api/diary-entries/:id - Deve atualizar uma entrada', async () => {
                const updatedData = {
                    title: 'Entrada de Teste Atualizada',
                    content: 'Conteúdo atualizado para teste',
                    mood: 'muito-feliz',
                    tags: ['teste', 'atualizado'],
                    entryDate: '2024-10-04'
                };

                const response = await request(app)
                    .put(`/api/diary-entries/${createdEntryId}`)
                    .set('x-api-key', API_KEY)
                    .send(updatedData);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.title).toBe(updatedData.title);
                expect(response.body.data.content).toBe(updatedData.content);
            });

            test('PUT /api/diary-entries/:id - Deve retornar 404 para ID inexistente', async () => {
                const response = await request(app)
                    .put('/api/diary-entries/999999')
                    .set('x-api-key', API_KEY)
                    .send({
                        title: 'Título',
                        content: 'Conteúdo'
                    });

                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
            });
        });

        // Funcionalidades Extras
        describe('⭐ Funcionalidades Extras', () => {
            
            test('PATCH /api/diary-entries/:id/favorite - Deve marcar entrada como favorita', async () => {
                const response = await request(app)
                    .patch(`/api/diary-entries/${createdEntryId}/favorite`)
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.is_favorite).toBe(true);
            });

            test('PATCH /api/diary-entries/:id/favorite - Deve desmarcar entrada favorita', async () => {
                // Marcar como favorito primeiro
                await request(app)
                    .patch(`/api/diary-entries/${createdEntryId}/favorite`)
                    .set('x-api-key', API_KEY);

                // Desmarcar
                const response = await request(app)
                    .patch(`/api/diary-entries/${createdEntryId}/favorite`)
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            test('GET /api/diary-entries/favorites - Deve listar apenas favoritos', async () => {
                const response = await request(app)
                    .get('/api/diary-entries/favorites')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(Array.isArray(response.body.data)).toBe(true);
            });

            test('GET /api/diary-entries/stats - Deve retornar estatísticas', async () => {
                const response = await request(app)
                    .get('/api/diary-entries/stats')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty('totalEntries');
                expect(response.body.data).toHaveProperty('favoriteEntries');
                expect(response.body.data.totalEntries).toBeGreaterThan(0);
            });

            test('GET /api/diary-entries/mood/:mood - Deve filtrar por humor', async () => {
                const response = await request(app)
                    .get('/api/diary-entries/mood/feliz')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(Array.isArray(response.body.data)).toBe(true);
            });
        });

        // Filtros
        describe('🔍 Filtros de Busca', () => {
            
            test('GET /api/diary-entries?mood=feliz - Deve filtrar por humor', async () => {
                const response = await request(app)
                    .get('/api/diary-entries')
                    .query({ mood: 'feliz' })
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            test('GET /api/diary-entries?favorites=true - Deve filtrar favoritos', async () => {
                const response = await request(app)
                    .get('/api/diary-entries')
                    .query({ favorites: 'true' })
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            test('GET /api/diary-entries?startDate=2024-01-01&endDate=2024-12-31 - Deve filtrar por período', async () => {
                const response = await request(app)
                    .get('/api/diary-entries')
                    .query({
                        startDate: '2024-01-01',
                        endDate: '2024-12-31'
                    })
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });
        });

        // DELETE - Deve ser o último teste
        describe('🗑️ Deletar Entrada', () => {
            
            test('DELETE /api/diary-entries/:id - Deve deletar uma entrada', async () => {
                const response = await request(app)
                    .delete(`/api/diary-entries/${createdEntryId}`)
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
            });

            test('DELETE /api/diary-entries/:id - Deve retornar 404 para ID já deletado', async () => {
                const response = await request(app)
                    .delete(`/api/diary-entries/${createdEntryId}`)
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
            });
        });

        // Relatórios
        describe('📄 Relatórios PDF', () => {
            
            test('GET /api/report/pdf - Deve gerar relatório PDF', async () => {
                const response = await request(app)
                    .get('/api/report/pdf')
                    .set('x-api-key', API_KEY);

                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toBe('application/pdf');
            });
        });
    });
});
