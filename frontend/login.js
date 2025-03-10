document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login_form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let placa = document.getElementById("placa").value.trim();
        let senha = document.getElementById("senha").value.trim();

        if (!placa || !senha) {
            mostrarMensagem("Preencha todos os campos!", "red");
            return;
        }

        try {
            let response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placa, senha })
            });

            let result = await response.json();

            if (!result.sucesso) {
                mostrarMensagem(result.mensagem, "red");
                return;
            }

            // Salvar usuário no localStorage para persistência
            localStorage.setItem("usuario", JSON.stringify(result.usuario));

            // Redirecionar para a página de estacionamento
            window.location.href = "estacionado.html";
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            mostrarMensagem("Erro ao conectar ao servidor.", "red");
        }
    });

    function mostrarMensagem(texto, cor) {
        let mensagem = document.getElementById("mensagem");
        mensagem.innerText = texto;
        mensagem.style.color = cor;
    }
});