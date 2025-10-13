// Este arquivo inicia o servidor Express e configura tudo que precisa

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const diaryEntriesRoutes = require("./src/routes/diaryEntriesRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const app = express();

// Configura o CORS para permitir requisições de qualquer origem
const corsOptions = {
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"], 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rota inicial - mostra informações da API
app.get("/", (req, res) => {
    res.json({ 
        message: "API EntrePages - Diário Digital", 
        version: "1.0.0",
        endpoints: {
            diaryEntries: "/api/diary-entries",
            reports: "/api/report/pdf"
        }
    });
});

app.use("/api", diaryEntriesRoutes);
app.use("/api", reportRoutes);

// Função para iniciar o servidor
// Se a porta estiver ocupada, tenta a próxima porta automaticamente
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`🚀 Servidor EntrePages rodando em http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ A porta ${port} já está em uso, tentando a próxima...`);
            startServer(port + 1);
        } else {
            console.error('❌ Erro ao iniciar servidor:', err);
        }
    });
};

const PORT = process.env.PORT || 3000;

startServer(PORT);
