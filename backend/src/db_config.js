const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Altere para o seu usuário
    password: "root", // Altere para a sua senha, se necessário
    database: "estac", // Nome do banco de dados
});

module.exports = db;
