require("dotenv").config();
const express = require("express");
const cors = require("cors");
const diaryEntriesRoutes = require("./src/routes/diaryEntriesRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:4000"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", diaryEntriesRoutes);
app.use("/api", reportRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor EntrePages rodando em http://localhost:${PORT}`);
});
