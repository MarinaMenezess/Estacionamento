const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db_config"); // Importa a configuração do banco de dados

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota de cadastro
app.post("/cadastro", async (req, res) => {
    const { nome, placa, senha, preferencial, preferencias } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!nome || !placa || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Nome, placa e senha são campos obrigatórios."
        });
    }

    try {
        // Verifica se a placa já está cadastrada
        const [results] = await db.query("SELECT * FROM cars WHERE placa = ?", [placa]);

        if (results.length > 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Essa placa já está cadastrada." });
        }

        // Logando os dados recebidos
        console.log("Cadastro recebido:", { nome, placa, senha, preferencial, preferencias });

        // Insere os dados no banco de dados
        const sql = "INSERT INTO cars (placa, motorista, senha, pref) VALUES (?, ?, ?, ?)";
        await db.query(sql, [placa, nome, senha, preferencial === "Sim" ? preferencias : ""]);

        // Resposta de sucesso
        res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!" });
    } catch (error) {
        // Caso ocorra um erro na query ou em algum outro ponto
        console.error("Erro no banco de dados:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao processar a solicitação." });
    }
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
