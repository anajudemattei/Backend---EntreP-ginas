
// ENTRADAS DO DIÁRIO
// Este arquivo contém as funções que respondem às requisições HTTP

// Importa o model com as funções do banco de dados
const diaryEntryModel = require("../models/diaryEntriesModel");
const multer = require("multer");


// GET /api/diary-entries
const getAllDiaryEntries = async (req, res) => {
    try {
        const filters = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            mood: req.query.mood,
            favorites: req.query.favorites,
            tag: req.query.tag
        };

        const entries = await diaryEntryModel.getDiaryEntries(filters);
        
        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (error) {
        console.error("Erro ao buscar entradas do diário:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao buscar entradas do diário.",
            error: error.message 
        });
    }
};


// GET /api/diary-entries/:id
const getDiaryEntry = async (req, res) => {
    try {
        // Busca a entrada pelo ID
        const entry = await diaryEntryModel.getDiaryEntryById(req.params.id);
        if (!entry) {
            return res.status(404).json({ 
                success: false,
                message: "Entrada do diário não encontrada." 
            });
        }
        res.status(200).json({
            success: true,
            data: entry
        });
    } catch (error) {
        console.error("Erro ao buscar entrada do diário:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao buscar entrada do diário.",
            error: error.message 
        });
    }
};

// POST /api/diary-entries
// Body: { title, content, entryDate, mood, tags }
// File: photo (opcional)
const createDiaryEntry = async (req, res) => {
    try {
        const { title, content, entryDate, mood, tags } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Título e conteúdo são obrigatórios." 
            });
        }

        let photoUrl = null;
        if (req.file) {
            photoUrl = `/uploads/${req.file.filename}`;
            console.log("📸 Imagem enviada:", req.file.filename);
        }

        // tags
        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [];
        
        const newEntry = await diaryEntryModel.createDiaryEntry(
            title, 
            content, 
            entryDate || new Date().toISOString().split('T')[0], // Usa data atual se não informada
            mood, 
            tagsArray, 
            photoUrl
        );
        
        res.status(201).json({
            success: true,
            message: "Entrada do diário criada com sucesso!",
            data: newEntry
        });
    } catch (error) {
        console.error("Erro ao criar entrada do diário:", error);
        
        if (error.code === "23505") { 
            return res.status(400).json({ 
                success: false,
                message: "Entrada já existe." 
            });
        }
        
        // upload de arquivo
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: "Arquivo muito grande! Tamanho máximo: 5MB"
                });
            }
            return res.status(400).json({
                success: false,
                message: `Erro no upload: ${error.message}`
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Erro ao criar entrada do diário.",
            error: error.message 
        });
    }
};

// PUT /api/diary-entries/:id
// Body: { title, content, entryDate, mood, tags, isFavorite }
const updateDiaryEntry = async (req, res) => {
    try {
        const { title, content, entryDate, mood, tags, isFavorite } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Título e conteúdo são obrigatórios." 
            });
        }

        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [];
        
        // Atualiza 
        const updatedEntry = await diaryEntryModel.updateDiaryEntry(
            req.params.id, 
            title, 
            content, 
            entryDate, 
            mood, 
            tagsArray,
            isFavorite !== undefined ? isFavorite : false
        );
        
        if (!updatedEntry) {
            return res.status(404).json({ 
                success: false,
                message: "Entrada do diário não encontrada." 
            });
        }
    
        res.status(200).json({
            success: true,
            message: "Entrada do diário atualizada com sucesso!",
            data: updatedEntry
        });
    } catch (error) {
        console.error("Erro ao atualizar entrada do diário:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao atualizar entrada do diário.",
            error: error.message 
        });
    }
};

// DELETE /api/diary-entries/:id
const deleteDiaryEntry = async (req, res) => {
    try {
        // Deleta do banco
        const result = await diaryEntryModel.deleteDiaryEntry(req.params.id);
        
        if (result.error) {
            return res.status(404).json({ 
                success: false,
                message: result.error 
            });
        }
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Erro ao deletar entrada do diário:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao deletar entrada do diário.",
            error: error.message 
        });
    }
};

// Buscar entradas por humor específico
// GET /api/diary-entries/mood/:mood
const getDiaryEntriesByMood = async (req, res) => {
    try {
        const { mood } = req.params;
        const entries = await diaryEntryModel.getDiaryEntriesByMood(mood);
        
        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (error) {
        console.error("Erro ao buscar entradas por humor:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao buscar entradas por humor.",
            error: error.message 
        });
    }
};

// Buscar apenas entradas favoritas
// GET /api/diary-entries/favorites
const getFavoriteDiaryEntries = async (req, res) => {
    try {
        const entries = await diaryEntryModel.getFavoriteDiaryEntries();
        
        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries
        });
    } catch (error) {
        console.error("Erro ao buscar entradas favoritas:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao buscar entradas favoritas.",
            error: error.message 
        });
    }
};

// Marcar/Desmarcar como favorito
// PATCH /api/diary-entries/:id/favorite
const toggleFavorite = async (req, res) => {
    try {
        // Inverte o status de favorito
        const updatedEntry = await diaryEntryModel.toggleFavorite(req.params.id);
        
        if (!updatedEntry) {
            return res.status(404).json({ 
                success: false,
                message: "Entrada do diário não encontrada." 
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Entrada ${updatedEntry.is_favorite ? 'adicionada aos' : 'removida dos'} favoritos!`,
            data: updatedEntry
        });
    } catch (error) {
        console.error("Erro ao alterar status de favorito:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao alterar status de favorito.",
            error: error.message 
        });
    }
};

// Buscar estatísticas gerais
// GET /api/diary-entries/stats
const getDiaryStats = async (req, res) => {
    try {
        const stats = await diaryEntryModel.getDiaryStats();
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ 
            success: false,
            message: "Erro ao buscar estatísticas.",
            error: error.message 
        });
    }
};

// Exporta todas as funções para usar nas rotas
module.exports = { 
    getAllDiaryEntries, 
    getDiaryEntry, 
    createDiaryEntry, 
    updateDiaryEntry, 
    deleteDiaryEntry,
    getDiaryEntriesByMood,
    getFavoriteDiaryEntries,
    toggleFavorite,
    getDiaryStats
};
