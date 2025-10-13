// ============================================
// CONFIGURAÇÃO DE UPLOAD DE ARQUIVOS
// ============================================
// Este arquivo configura o Multer para fazer upload de fotos
// As fotos do diário são salvas na pasta 'uploads/'

// Importa os pacotes necessários
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define a pasta onde as fotos serão salvas
const uploadDir = "uploads/";

// Cria a pasta uploads se ela não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Pasta uploads/ criada com sucesso!");
}

// Configura onde e como salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    // Define o nome do arquivo
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

// Configura o Multer com as regras de upload
const upload = multer({
    storage, 
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
    // Filtra os tipos de arquivo permitidos
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Apenas imagens são permitidas (JPEG, JPG, PNG, GIF, WebP)"));
        }
    }
});

// Exporta a configuração do upload
module.exports = upload;
