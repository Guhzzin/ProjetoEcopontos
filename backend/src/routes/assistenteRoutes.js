const express = require('express');
const router = express.Router();
const iaService = require('../services/iaService');
const db = require('../db/mysql'); // db

router.post('/', async (req, res) => {
  try {
    const perguntaUsuario = req.body.pergunta;

    // Retorna como: { mensagem: "Leve em garrafas PET", categorias_chave: ["óleo"] }
    const respostaIA = await iaService.analisarDescarte(perguntaUsuario);
    
    //  IA não identificar nada, busca por "mistos"
    const palavraChave = respostaIA.categorias_chave[0] || 'mistos';
    const TipoGestao = respostaIA.tipo_gestao || 'publico'; // Default para 'publico' se não for fornecido

    // Procura na tabela usando LIKE para encontrar a palavra no meio do texto
    const query = `
      SELECT *
      FROM pontos_coleta 
      WHERE tipo_residuo LIKE ?
    `;
    
    // O promise() é necessário porque estamos usando await com o mysql2
    const [ecopontosRecomendados] = await db.promise().query(query, [`%${palavraChave}%`]);

    res.json({
      texto_assistente: respostaIA.mensagem,
      pontos_no_mapa: ecopontosRecomendados,
      categoria: palavraChave,
      tipo_gestao: TipoGestao

    });

  } catch (error) {
    console.error("Erro na rota:", error);
    res.status(500).json({ error: "Erro ao processar assistente inteligente." });
  }
});

module.exports = router;