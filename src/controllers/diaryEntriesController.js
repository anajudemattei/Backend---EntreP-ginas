const diaryEntryModel = require("../models/diaryEntriesModel");

// Buscar todas as entradas do diário
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

// Buscar entrada por ID
const getDiaryEntry = async (req, res) => {
    try {
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

// Criar nova entrada
const createDiaryEntry = async (req, res) => {
    try {
        const { title, content, entryDate, mood, tags } = req.body;
        
        // Validações básicas
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Título e conteúdo são obrigatórios." 
            });
        }

        const photo = req.file ? req.file.filename : null;
        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [];
        
        const newEntry = await diaryEntryModel.createDiaryEntry(
            title, 
            content, 
            entryDate || new Date().toISOString().split('T')[0], 
            mood, 
            tagsArray, 
            photo
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
        res.status(500).json({ 
            success: false,
            message: "Erro ao criar entrada do diário.",
            error: error.message 
        });
    }
};

// Atualizar entrada
const updateDiaryEntry = async (req, res) => {
    try {
        const { title, content, entryDate, mood, tags, isFavorite } = req.body;
        
        // Validações básicas
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Título e conteúdo são obrigatórios." 
            });
        }

        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [];
        
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

// Deletar entrada
const deleteDiaryEntry = async (req, res) => {
    try {
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

// Buscar entradas por humor
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

// Buscar entradas favoritas
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

// Alternar status de favorito
const toggleFavorite = async (req, res) => {
    try {
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

// Buscar estatísticas
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
