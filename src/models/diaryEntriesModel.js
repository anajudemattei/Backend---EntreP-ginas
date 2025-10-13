// ENTRADAS DO DIÁRIO

const pool = require("../config/database");

// Buscar todas as entradas do diário
const getDiaryEntries = async (filters = {}) => {
    try {
        let query = "SELECT * FROM diary_entries";
        let params = [];
        let whereConditions = [];

        if (filters.startDate && filters.endDate) {
            whereConditions.push("entry_date BETWEEN $" + (params.length + 1) + " AND $" + (params.length + 2));
            params.push(filters.startDate, filters.endDate);
        }

        if (filters.mood) {
            whereConditions.push("mood = $" + (params.length + 1));
            params.push(filters.mood);
        }

        if (filters.favorites === 'true') {
            whereConditions.push("is_favorite = true");
        }

        if (filters.tag) {
            whereConditions.push("$" + (params.length + 1) + " = ANY(tags)");
            params.push(filters.tag);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        query += " ORDER BY entry_date DESC, created_at DESC";

        console.log('Executando query:', query, 'com parâmetros:', params);
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar entradas do diário:', error.message);
        throw error;
    }
};

// Buscar uma entrada específica por ID
const getDiaryEntryById = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM diary_entries WHERE id = $1", [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error('Erro ao buscar entrada por ID:', error.message);
        throw error;
    }
};

// Criar nova entrada do diário
const createDiaryEntry = async (title, content, entryDate, mood, tags, photo) => {
    try {
        const result = await pool.query(
            `INSERT INTO diary_entries (title, content, entry_date, mood, tags, photo) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, content, entryDate, mood, tags, photo]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao criar entrada do diário:', error.message);
        throw error;
    }
    };

// Atualizar entrada existente
const updateDiaryEntry = async (id, title, content, entryDate, mood, tags, isFavorite) => {
    try {
        const result = await pool.query(
            `UPDATE diary_entries 
             SET title = $1, content = $2, entry_date = $3, mood = $4, tags = $5, is_favorite = $6, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $7 RETURNING *`,
            [title, content, entryDate, mood, tags, isFavorite, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao atualizar entrada do diário:', error.message);
        throw error;
    }
};

// Deletar entrada do diário
const deleteDiaryEntry = async (id) => {
    try {
        const result = await pool.query("DELETE FROM diary_entries WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return { error: "Entrada do diário não encontrada." };
        }

        return { message: "Entrada do diário deletada com sucesso." };
    } catch (error) {
        console.error('Erro ao deletar entrada do diário:', error.message);
        throw error;
    }
};

// Buscar entradas por humor específico
const getDiaryEntriesByMood = async (mood) => {
    try {
        const result = await pool.query(
            "SELECT * FROM diary_entries WHERE mood = $1 ORDER BY entry_date DESC", 
            [mood]
        );
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar entradas por humor:', error.message);
        throw error;
    }
};

// Buscar apenas entradas favoritas
const getFavoriteDiaryEntries = async () => {
    try {
        const result = await pool.query(
            "SELECT * FROM diary_entries WHERE is_favorite = true ORDER BY entry_date DESC"
        );
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar entradas favoritas:', error.message);
        throw error;
    }
};

// Marcar ou desmarcar como favorito
const toggleFavorite = async (id) => {
    try {
        // NOT inverte o valor atual (true vira false, false vira true)
        const result = await pool.query(
            "UPDATE diary_entries SET is_favorite = NOT is_favorite WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao alterar status de favorito:', error.message);
        throw error;
    }
};

// Buscar estatísticas gerais do diário
const getDiaryStats = async () => {
    try {
        // Total de entradas
        const totalEntries = await pool.query("SELECT COUNT(*) as total FROM diary_entries");
        
        // Total de favoritas
        const favoriteEntries = await pool.query("SELECT COUNT(*) as total FROM diary_entries WHERE is_favorite = true");
        
        // Distribuição por humor
        const moodStats = await pool.query(`
            SELECT mood, COUNT(*) as count 
            FROM diary_entries 
            WHERE mood IS NOT NULL 
            GROUP BY mood 
            ORDER BY count DESC
        `);
        const monthlyStats = await pool.query(`
            SELECT 
                DATE_TRUNC('month', entry_date) as month,
                COUNT(*) as entries_count
            FROM diary_entries 
            GROUP BY month 
            ORDER BY month DESC 
            LIMIT 12
        `);

        // Retorna todas as estatísticas
        return {
            totalEntries: parseInt(totalEntries.rows[0].total),
            favoriteEntries: parseInt(favoriteEntries.rows[0].total),
            moodDistribution: moodStats.rows,
            monthlyActivity: monthlyStats.rows
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error.message);
        throw error;
    }
};

module.exports = { 
    getDiaryEntries, 
    getDiaryEntryById, 
    createDiaryEntry, 
    updateDiaryEntry, 
    deleteDiaryEntry,
    getDiaryEntriesByMood,
    getFavoriteDiaryEntries,
    toggleFavorite,
    getDiaryStats
};
