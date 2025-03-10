document.addEventListener("DOMContentLoaded", function () {
    let usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("nomeUsuario").innerText = usuario.nome;
    document.getElementById("placaUsuario").innerText = usuario.placa;
    document.getElementById("preferenciaUsuario").innerText = usuario.preferencial;

    let entrada = new Date(usuario.entrada);
    let tempoDecorrido;

    let intervalo = setInterval(() => {
        tempoDecorrido = atualizarTempo(entrada);
    }, 1000);

    document.getElementById("sair").addEventListener("click", function () {
        clearInterval(intervalo);

        let saida = new Date();
        let diferencaHoras = (saida - entrada) / (1000 * 60 * 60);
        let valorHora = localStorage.getItem("valorHora") || 0;
        let valorAPagar = (diferencaHoras * valorHora).toFixed(2);

        document.getElementById("tempoEstacionado").innerText = tempoDecorrido;
        document.getElementById("pagamentos").style.display = "flex";
        document.getElementById("pagamentos").innerHTML = `
            <h4>Seu tempo foi:</h4>
            <h2>${tempoDecorrido}</h2>
            <h4>Valor:</h4>
            <h3>R$ ${valorAPagar}</h3>

            <label for="forma">Forma de Pagamento</label>
            <select name="paga" id="paga">
                <option value="Selecione">Selecione</option>
                <option value="Pix">Pix</option>
                <option value="Crédito">Crédito</option>
                <option value="Débito">Débito</option>
            </select>

            <button class="entr" id="btnPagar">Pagar</button>
        `;

        document.getElementById("btnPagar").addEventListener("click", async function () {
            let formaPagamento = document.getElementById("paga").value;
            if (formaPagamento === "Selecione") {
                alert("Por favor, selecione uma forma de pagamento!");
                return;
            }

            let pagamentoData = {
                placa: usuario.placa,
                motorista: usuario.nome,
                entrada: usuario.entrada,
                saida: saida.toISOString(),
                tempo_total: tempoDecorrido,
                valor_pago: valorAPagar,
                forma_pagamento: formaPagamento
            };

            try {
                let response = await fetch("http://localhost:3000/pagamento", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pagamentoData)
                });
                let result = await response.json();

                if (result.sucesso) {
                    alert("Pagamento realizado com sucesso!");
                    window.location.href = "finalizar.html";
                } else {
                    alert("Erro ao processar o pagamento: " + result.mensagem);
                }
            } catch (error) {
                console.error("Erro ao enviar pagamento:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    });
});

function atualizarTempo(entrada) {
    let agora = new Date();
    let diferenca = agora - entrada;

    let segundos = Math.floor((diferenca / 1000) % 60);
    let minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    let horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);

    let tempoFormatado = `${horas}h ${minutos}m ${segundos}s`;
    document.getElementById("tempoEstacionado").innerText = tempoFormatado;
    return tempoFormatado;
}
