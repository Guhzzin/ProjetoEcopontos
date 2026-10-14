const mysql2 = require('mysql2');

const db = mysql2.createPool({
    host: 'db',  // nome do serviço do banco de dados no docker-compose.yml
    user: 'root', // nome de usuário do banco de dados 
    password: 'root', // senha do db
    database: 'ecopontos_db',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0 
});

db.getConnection((err, connection) => {
    if (err){
        console.error('Error connecting to the database:', err);
    } else {
        console.log ('Database connection established successfully.');
        connection.release(); 
    }    
});

module.exports = db;