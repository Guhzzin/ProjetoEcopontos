// Dependências
const express = require('express');
const cors = require('cors');

const db = require('./src/db/mysql'); // Importando a conexão com o banco de dados

const app = express();
app.set('json spaces', 2); //  formatação do JSON para quebra de linha e indentação de 2 espaços

app.use(cors()); // permitir que qualquer origem acesse a API
app.use(express.json()); //interpretar JSON


// Nova rota para o assistente inteligente
const assistenteRoutes = require('./src/routes/assistenteRoutes');

//criando a rota para buscar todos os ecopontos API

app.get('/api/ecopontos', (req, res)=> {
    const query = 'SELECT * FROM pontos_coleta';
    
    db.query(query, (err, results)=>{
        if(err){
            console.error('Erro ao buscar ecopontos:', err.message);
            res.status(500).json({ error: 'Erro do servidor ao buscar ecopontos' });
        } else {
            res.json(results);
        }
    });
});

app.use('/api/assistente', assistenteRoutes); // Rota para o assistente inteligente

//Config da porta do servidor
const PORT = 3000;
app.listen (PORT, ()=> {
    console.log(`servidor rodando na porta ${PORT}`);
})