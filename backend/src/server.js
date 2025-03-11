const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db_config"); // Agora, importando corretamente o db_config.js

const app = express();
const port = 3000;

// Verificação de conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Conectado ao banco de dados!");
    }
});

app.use(cors());
app.use(bodyParser.json());
// 🚗 **Rota de Cadastro**
app.post("/cadastro", (req, res) => {
    const { nome, placa, senha, preferencial, preferencias } = req.body;

    if (!nome || !placa || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Nome, placa e senha são obrigatórios." });
    }

    const query = "SELECT * FROM cars WHERE placa = ?";
    db.query(query, [placa], (err, results) => {
        if (err) {
            console.error("Erro ao verificar placa:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao verificar a placa. Tente novamente mais tarde." });
        }

        if (results.length > 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Essa placa já está cadastrada." });
        }

        // Insere os dados no banco de dados e registra o horário de entrada
        const insertSql = "INSERT INTO cars (placa, motorista, senha, pref, entrada) VALUES (?, ?, ?, ?, NOW())";
        db.query(insertSql, [placa, nome, senha, preferencial === "Sim" ? preferencias : ""], (err) => {
            if (err) {
                console.error("Erro ao cadastrar motorista:", err);
                return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a solicitação. Tente novamente mais tarde." });
            }

            // Buscar os dados do usuário recém-cadastrado
            db.query("SELECT * FROM cars WHERE placa = ?", [placa], (err, results) => {
                if (err || results.length === 0) {
                    console.error("Erro ao buscar dados do usuário:", err);
                    return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar informações do usuário." });
                }

                const usuario = results[0];

                res.json({
                    sucesso: true,
                    mensagem: "Cadastro realizado com sucesso!",
                    usuario: {
                        nome: usuario.motorista,
                        placa: usuario.placa,
                        preferencial: usuario.pref,
                        entrada: usuario.entrada
                    }
                });
            });
        });
    });
});

// 🚪 **Rota de Login**
app.post("/login", (req, res) => {
    const { placa, senha } = req.body;

    if (!placa || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Placa e senha são obrigatórios." });
    }

    db.query("SELECT * FROM cars WHERE placa = ? AND senha = ?", [placa, senha], (err, results) => {
        if (err) {
            console.error("Erro ao verificar login:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a solicitação." });
        }

        if (results.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Placa ou senha incorretos." });
        }

        const usuario = results[0];

        res.json({
            sucesso: true,
            mensagem: "Login realizado com sucesso!",
            usuario: {
                nome: usuario.motorista,
                placa: usuario.placa,
                preferencial: usuario.pref,
                entrada: usuario.entrada
            }
        });
    });
});

// Rota para listar os carros cadastrados
app.get("/carros", (req, res) => {
    const query = "SELECT placa, motorista, pref, entrada, saida, tempo, valor FROM cars";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar carros:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar carros." });
        }
        
        res.json({ sucesso: true, carros: results });
    });
});

// 🚀 Rota para registrar pagamento
app.post("/pagamento", (req, res) => {
    const { placa, data_entrada, data_saida, valor, tipo_pagamento } = req.body;
 
    if (!placa || !data_entrada || !data_saida || !valor || !tipo_pagamento) {
        return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios." });
    }
 
    // Converte as datas para o formato aceito pelo MySQL
    function formatarData(data) {
        let date = new Date(data);
        let ano = date.getFullYear();
        let mes = String(date.getMonth() + 1).padStart(2, "0");
        let dia = String(date.getDate()).padStart(2, "0");
        let horas = String(date.getHours()).padStart(2, "0");
        let minutos = String(date.getMinutes()).padStart(2, "0");
        let segundos = String(date.getSeconds()).padStart(2, "0");
        return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }
 
    const entradaFormatada = formatarData(data_entrada);
    const saidaFormatada = formatarData(data_saida);
 
    console.log(`Data formatada: Entrada = ${entradaFormatada}, Saída = ${saidaFormatada}`);
 
    // Inserir na tabela `transacoes`
    const query = `
        INSERT INTO transacoes (placa, data_entrada, data_saida, valor, pago, tipo_pagamento)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
 
    db.query(query, [placa, entradaFormatada, saidaFormatada, valor, true, tipo_pagamento], (err) => {
        if (err) {
            console.error("Erro ao registrar pagamento:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar pagamento." });
        }
 
        // Atualiza a saída no registro de `cars`
        const atualizarSaida = "UPDATE cars SET saida = ? WHERE placa = ?";
        db.query(atualizarSaida, [saidaFormatada, placa], (err) => {
            if (err) {
                console.error("Erro ao atualizar saída:", err);
                return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar saída do carro." });
            }
 
            res.json({ sucesso: true, mensagem: "Pagamento registrado com sucesso!" });
        });
    });
});


// 🚀 Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});