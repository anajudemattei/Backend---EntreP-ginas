const express = require('express');
const router = express.Router();
const { exportDiaryToPDF } = require('../controllers/reportController');
const apiKeyMiddleware = require('../config/apiKey');

router.use(apiKeyMiddleware);

router.get('/report/pdf', exportDiaryToPDF);

module.exports = router;
