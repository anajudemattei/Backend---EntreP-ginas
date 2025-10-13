// ROTAS - ENTRADAS DO DIÁRIO

const express = require("express");
const router = express.Router();
const diaryEntriesController = require("../controllers/diaryEntriesController");
const apiKeyMiddleware = require("../config/apiKey");
const upload = require("../config/upload");

// Aplica verificação de API Key em todas as rotas
router.use(apiKeyMiddleware);

// GET /api/diary-entries
// Busca todas as entradas (aceita filtros na query)
router.get("/diary-entries", diaryEntriesController.getAllDiaryEntries);

// GET /api/diary-entries/stats
// Busca estatísticas gerais do diário
router.get("/diary-entries/stats", diaryEntriesController.getDiaryStats);

// GET /api/diary-entries/favorites
// Busca apenas as entradas marcadas como favoritas
router.get("/diary-entries/favorites", diaryEntriesController.getFavoriteDiaryEntries);

// GET /api/diary-entries/mood/:mood
// Busca entradas de um humor específico (ex: feliz, triste)
router.get("/diary-entries/mood/:mood", diaryEntriesController.getDiaryEntriesByMood);

// GET /api/diary-entries/:id
// Busca uma entrada específica pelo ID
router.get("/diary-entries/:id", diaryEntriesController.getDiaryEntry);

// POST /api/diary-entries
// Cria uma nova entrada do diário (pode incluir foto)
router.post("/diary-entries", upload.single("photo"), diaryEntriesController.createDiaryEntry);

// PUT /api/diary-entries/:id
// Atualiza uma entrada completa
router.put("/diary-entries/:id", diaryEntriesController.updateDiaryEntry);

// PATCH /api/diary-entries/:id/favorite
// Marca ou desmarca uma entrada como favorita
router.patch("/diary-entries/:id/favorite", diaryEntriesController.toggleFavorite);

// DELETE /api/diary-entries/:id
// Deleta uma entrada do diário
router.delete("/diary-entries/:id", diaryEntriesController.deleteDiaryEntry);

module.exports = router;
