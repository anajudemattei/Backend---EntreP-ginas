const express = require("express");
const router = express.Router();
const diaryEntriesController = require("../controllers/diaryEntriesController");
const apiKeyMiddleware = require("../config/apiKey");
const upload = require("../config/upload");

// Aplicar middleware de API key a todas as rotas
router.use(apiKeyMiddleware);

// Rotas para entradas do diário
router.get("/diary-entries", diaryEntriesController.getAllDiaryEntries);
router.get("/diary-entries/stats", diaryEntriesController.getDiaryStats);
router.get("/diary-entries/favorites", diaryEntriesController.getFavoriteDiaryEntries);
router.get("/diary-entries/mood/:mood", diaryEntriesController.getDiaryEntriesByMood);
router.get("/diary-entries/:id", diaryEntriesController.getDiaryEntry);

router.post("/diary-entries", upload.single("photo"), diaryEntriesController.createDiaryEntry);

router.put("/diary-entries/:id", diaryEntriesController.updateDiaryEntry);
router.patch("/diary-entries/:id/favorite", diaryEntriesController.toggleFavorite);

router.delete("/diary-entries/:id", diaryEntriesController.deleteDiaryEntry);

module.exports = router;
