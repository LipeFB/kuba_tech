const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12092204070806072023',
    database: 'technical_assistance'
});

connection.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = connection;