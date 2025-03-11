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

app.post("/pagamento", (req, res) => {
    const { placa, motorista, entrada, saida, tempo_total, valor_pago, forma_pagamento } = req.body;

    if (!placa || !motorista || !entrada || !saida || !tempo_total || !valor_pago || !forma_pagamento) {
        return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios." });
    }

    const query = "INSERT INTO transacoes (placa, motorista, entrada, saida, tempo_total, valor_pago, forma_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [placa, motorista, entrada, saida, tempo_total, valor_pago, forma_pagamento], (err) => {
        if (err) {
            console.error("Erro ao registrar pagamento:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar pagamento." });
        }

        res.json({ sucesso: true, mensagem: "Pagamento registrado com sucesso!" });
    });
});

// 🚀 Rota para registrar pagamento
app.post("/pagamento", (req, res) => {
    const { placa, tempo, valor, forma_pagamento } = req.body;
 
    if (!placa || !tempo || !valor || !forma_pagamento) {
        return res.status(400).json({ sucesso: false, mensagem: "Todos os campos são obrigatórios." });
    }
 
    // Busca o horário de entrada do usuário
    const buscarEntrada = "SELECT entrada FROM cars WHERE placa = ?";
    db.query(buscarEntrada, [placa], (err, results) => {
        if (err || results.length === 0) {
            console.error("Erro ao buscar entrada:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar horário de entrada." });
        }
 
        const entrada = results[0].entrada;
        const saida = new Date(); // Hora atual como saída
 
        // Inserir na tabela `transacoes`
        const query = `
            INSERT INTO transacoes (placa, data_entrada, data_saida, valor, pago, tipo_pagamento) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
 
        db.query(query, [placa, entrada, saida, valor, true, forma_pagamento], (err) => {
            if (err) {
                console.error("Erro ao registrar pagamento:", err);
                return res.status(500).json({ sucesso: false, mensagem: "Erro ao processar pagamento." });
            }
 
            // Atualiza a saída no registro de `cars`
            const atualizarSaida = "UPDATE cars SET saida = ? WHERE placa = ?";
            db.query(atualizarSaida, [saida, placa], (err) => {
                if (err) {
                    console.error("Erro ao atualizar saída:", err);
                    return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar saída do carro." });
                }
 
                res.json({ sucesso: true, mensagem: "Pagamento registrado com sucesso!" });
            });
        });
    });
});


// 🚀 Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});