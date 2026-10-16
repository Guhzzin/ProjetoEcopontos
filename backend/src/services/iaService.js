const { GoogleGenAI } = require("@google/genai");

// Puxa a sua nova chave (AQ...) do arquivo .env (com o trim para limpar quebras de linha do Windows)
const apiKey = (process.env.GEMINI_API_KEY || "").trim();

// Inicializa a IA usando o novo pacote
const ai = new GoogleGenAI({ apiKey: apiKey });

const analisarDescarte = async (perguntaUsuario) => {
    
    //  garantimos o JSON diretamente nas instruções (prompt)
    const promptContexto = `Você é um assistente virtual especialista do Ecopontos Curitiba.
    Analise o item que o usuário quer descartar e responda ESTRITAMENTE em formato JSON puro, sem marcações markdown.
    
    Sua resposta deve ter exatamente este formato:
    {
      "mensagem": "Dê uma dica PRÁTICA e ESPECÍFICA sobre o item. Ex: Se for vidro, mande embrulhar em jornal. Se for eletrônico, diga para não desmontar. Se for reciclável, diga para lavar antes.",
      "categorias_chave": ["palavra-chave"]
    }
    
    Para a 'categorias_chave', use APENAS UMA destas opções exatas: 'reciclavel', 'mistos', 'eletrônico', 'óleo', 'pilhas', 'baterias' ou 'lâmpadas'.
    
    Pergunta do usuário: ${perguntaUsuario}`;

    try {
        // Usa o novo método "interactions.create" e o modelo 3.8 que está na doc
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash-lite",
            input: promptContexto,
        });

        // Pega a resposta de texto (como diz na documentação)
        let textoResposta = interaction.output_text;
        
        // Limpeza de segurança (caso a IA devolva o texto com ```json no início)
        textoResposta = textoResposta.replace(/```json/g, '').replace(/```/g, '').trim();

        // Converte o texto JSON em um objeto Javascript real
        return JSON.parse(textoResposta);
        
    } catch (error) {
        console.error("Erro na nova integração @google/genai:", error);
        throw error;
    }
};

module.exports = { analisarDescarte };