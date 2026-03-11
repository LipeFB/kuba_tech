const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Altere para seu usuário
    password: '12092204070806072023', // Altere para sua senha
    database: 'kuba_tech',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();