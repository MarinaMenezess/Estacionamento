document.addEventListener("DOMContentLoaded", function () {
    let pref = document.getElementById("preferencial");
    let qual = document.getElementById("wich");

    function toggleVisibility() {
        qual.style.display = pref.checked ? "block" : "none";
    }

    toggleVisibility();
    pref.addEventListener("change", toggleVisibility);

    document.getElementById("cadastroForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let placa = document.getElementById("placa").value.trim();
        let senha = document.getElementById("senha").value.trim();
        let preferencial = pref.checked ? "Sim" : "Não";
        let preferencias = document.getElementById("preferencias").value.trim();

        // Validação simples
        if (!nome || !placa || !senha) {
            mostrarMensagem("Por favor, preencha todos os campos obrigatórios.", "red");
            return;
        }

        let formData = {
            nome: nome,
            placa: placa,
            senha: senha,
            preferencial: preferencial,
            preferencias: preferencial === "Sim" ? preferencias : ""
        };

        try {
            let response = await fetch("http://localhost:3000/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            let result = await response.json();
            mostrarMensagem(result.mensagem, result.sucesso ? "green" : "red");

            if (result.sucesso) {
                document.getElementById("cadastroForm").reset();
                toggleVisibility();
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            mostrarMensagem("Erro ao cadastrar. Tente novamente mais tarde.", "red");
        }
    });

    function mostrarMensagem(texto, cor) {
        let mensagem = document.getElementById("mensagem");
        mensagem.innerText = texto;
        mensagem.style.color = cor;
    }
});
