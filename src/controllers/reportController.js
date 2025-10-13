// RELATÓRIOS PDF
// Usa o PDFKit para criar documentos PDF

const PDFDocument = require('pdfkit');
const diaryEntryModel = require('../models/diaryEntriesModel');

const exportDiaryToPDF = async (req, res) => {
    try {
        console.log('Iniciando geração do PDF do diário...');

        const filters = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            mood: req.query.mood,
            favorites: req.query.favorites
        };

        // Busca as entradas do diário 
        const entries = await diaryEntryModel.getDiaryEntries(filters);
        const stats = await diaryEntryModel.getDiaryStats();
        
        console.log('Entradas recuperadas:', entries.length);

        // Configura o cabeçalho da resposta HTTP para PDF
        res.setHeader('Content-Type', 'application/pdf');
        const fileName = `diario-entrepaginas-${new Date().toISOString().split('T')[0]}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);

        // Estilização do PDF
        doc.fontSize(24)
           .fillColor('#2C3E50')
           .text('EntrePages - Relatório do Diário', { align: 'center' });
        
        doc.moveDown();
        
        // Data 
        doc.fontSize(12)
           .fillColor('#7F8C8D')
           .text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
        
        doc.moveDown(2);

        // Estatisticas Gerais
        doc.fontSize(18)
           .fillColor('#34495E')
           .text('📊 Estatísticas Gerais', { underline: true });
        
        doc.moveDown();
        
        doc.fontSize(12)
           .fillColor('#2C3E50')
           .text(`Total de entradas: ${stats.totalEntries}`)
           .text(`Entradas favoritas: ${stats.favoriteEntries}`)
           .text(`Entradas no período: ${entries.length}`);

        if (filters.startDate && filters.endDate) {
            doc.text(`Período: ${new Date(filters.startDate).toLocaleDateString('pt-BR')} a ${new Date(filters.endDate).toLocaleDateString('pt-BR')}`);
        }

        doc.moveDown(2);

        if (stats.moodDistribution && stats.moodDistribution.length > 0) {
            doc.fontSize(16)
               .fillColor('#34495E')
               .text('😊 Distribuição de Humor', { underline: true });
            
            doc.moveDown();

            stats.moodDistribution.forEach(mood => {
                doc.fontSize(11)
                   .fillColor('#2C3E50')
                   .text(`${mood.mood}: ${mood.count} entradas`);
            });
            
            doc.moveDown(2);
        }

        if (entries.length > 0) {
            doc.addPage();
            
            doc.fontSize(18)
               .fillColor('#34495E')
               .text('📝 Entradas do Diário', { underline: true });
            
            doc.moveDown(2);

            entries.forEach((entry, index) => {

                if (doc.y > 700) {
                    doc.addPage();
                }

                console.log('Processando entrada:', entry.title);
                
                doc.fontSize(14)
                   .fillColor('#2C3E50')
                   .text(`${index + 1}. ${entry.title}`, { underline: true });
                
                const entryDate = new Date(entry.entry_date).toLocaleDateString('pt-BR');
                doc.fontSize(10)
                   .fillColor('#7F8C8D')
                   .text(`Data: ${entryDate}${entry.mood ? ` | Humor: ${entry.mood}` : ''}${entry.is_favorite ? ' ⭐' : ''}`);
                
                doc.moveDown();
                
                doc.fontSize(11)
                   .fillColor('#2C3E50')
                   .text(entry.content, { 
                       width: 500,
                       align: 'justify'
                   });
                
                if (entry.tags && entry.tags.length > 0) {
                    doc.moveDown();
                    doc.fontSize(9)
                       .fillColor('#3498DB')
                       .text(`Tags: ${entry.tags.join(', ')}`);
                }
                
                if (entry.photo) {
                    doc.fontSize(9)
                       .fillColor('#95A5A6')
                       .text(`📷 Imagem: ${entry.photo}`);
                }
                
                doc.moveDown(1.5);
                
                doc.strokeColor('#BDC3C7')
                   .lineWidth(0.5)
                   .moveTo(50, doc.y)
                   .lineTo(550, doc.y)
                   .stroke();
                
                doc.moveDown();
            });
        } else {
            // Mensagem se não tiver entradas
            doc.fontSize(12)
               .fillColor('#7F8C8D')
               .text('Nenhuma entrada encontrada para os filtros aplicados.');
        }

        doc.fontSize(8)
           .fillColor('#95A5A6')
           .text('Gerado pela API EntrePages - Diário Digital', 50, doc.page.height - 50, {
               align: 'center'
           });

        doc.end();
        console.log('PDF do diário gerado com sucesso!');
        
    } catch (error) {
        console.error("Erro ao gerar o PDF:", error.message);
        res.status(500).json({ 
            success: false,
            message: 'Erro ao gerar o PDF do diário', 
            error: error.message 
        });
    }
};

// Exporta a função para usar nas rotas
module.exports = { exportDiaryToPDF };
