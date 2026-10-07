// Dependências
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.set('json spaces', 2); //  formatação do JSON para quebra de linha e indentação de 2 espaços

app.use(cors()); // permitir que qualquer origem acesse a API
app.use(express.json()); //interpretar JSON

const db = mysql.createPool({
    host: 'db',  // nome do serviço do banco de dados no docker-compose.yml
    user: 'root', // nome de usuário do banco de dados
    password: 'root', // senha do banco de dados
    database: 'ecopontos_db',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0 
});

// Testando pool(conexoes livres)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        connection.release(); // Liberar a conexão
    }
});

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

//Config da porta do servidor
const PORT = 3000;
app.listen (PORT, ()=> {
    console.log(`servidor rodando na porta ${PORT}`);
})