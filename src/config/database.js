const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err.stack);
    } else {
        console.log("✅ Conexão com o banco de dados EntrePages bem-sucedida!");
    }
    release();
});

module.exports = pool;
