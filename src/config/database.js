// Este arquivo configura a conexão com o PostgreSQL

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,        
    host: process.env.DB_HOST,         
    database: process.env.DB_NAME,        
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT,         
});

// Testa a conexão quando o servidor inicia
pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err.stack);
    } else {
        console.log("✅ Conexão com o banco de dados EntrePages bem-sucedida!");
    }
    release();
});

// Exporta o pool para ser usado em outros arquivos
module.exports = pool;
