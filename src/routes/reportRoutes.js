// ROTAS - RELATÓRIOS
// Define as rotas para gerar relatórios em PDF

const express = require('express');
const router = express.Router();
const { exportDiaryToPDF } = require('../controllers/reportController');
const apiKeyMiddleware = require('../config/apiKey');

router.use(apiKeyMiddleware);

// Gerar PDF
// GET /api/report/pdf
router.get('/report/pdf', exportDiaryToPDF);

module.exports = router;
