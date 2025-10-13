// Este arquivo cria um middleware que verifica se a requisição
// tem uma API Key válida 

require("dotenv").config();

// Função middleware que verifica a API Key
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header("x-api-key");
    
    // Verifica se a API Key foi enviada e se é válida
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ 
            success: false,
            error: "Chave da API não fornecida ou inválida! Acesso negado." 
        });
    }
    next();
};

module.exports = apiKeyMiddleware;
