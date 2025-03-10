document.addEventListener("DOMContentLoaded", async function () {
    const tabela = document.getElementById("tabelaCarros");
    const valorHoraInput = document.getElementById("valorHora");
    const salvarValorBtn = document.getElementById("salvarValor");

    // Recuperar valor por hora salvo
    let valorHora = localStorage.getItem("valorHora") || 0;
    valorHoraInput.value = valorHora;

    // Atualizar valor por hora no armazenamento local
    salvarValorBtn.addEventListener("click", function () {
        let novoValor = parseFloat(valorHoraInput.value);
        if (isNaN(novoValor) || novoValor < 0) {
            alert("Por favor, insira um valor válido!");
            return;
        }
        localStorage.setItem("valorHora", novoValor);
        alert("Valor por hora atualizado para R$ " + novoValor.toFixed(2));
    });

    try {
        let response = await fetch("http://localhost:3000/carros");
        let data = await response.json();

        if (!data.sucesso) {
            tabela.innerHTML = "<tr><td colspan='7'>Erro ao carregar carros.</td></tr>";
            return;
        }

        if (data.carros.length === 0) {
            tabela.innerHTML = "<tr><td colspan='7'>Nenhum carro cadastrado.</td></tr>";
            return;
        }

        data.carros.forEach(carro => {
            let entrada = new Date(carro.entrada);
            let agora = new Date();
            let diferencaHoras = (agora - entrada) / (1000 * 60 * 60);
            let valorAPagar = (diferencaHoras * valorHora).toFixed(2);

            let row = `
                <tr>
                    <td>${carro.placa}</td>
                    <td>${carro.motorista}</td>
                    <td>${carro.pref ? carro.pref : "Não"}</td>
                    <td>${carro.entrada}</td>
                    <td>${carro.saida ? carro.saida : "Em aberto"}</td>
                    <td>${carro.tempo ? carro.tempo : "Calculando"}</td>
                    <td>R$ ${valorAPagar}</td>
                </tr>
            `;
            tabela.innerHTML += row;
        });

    } catch (error) {
        console.error("Erro ao buscar carros:", error);
        tabela.innerHTML = "<tr><td colspan='7'>Erro ao conectar com o servidor.</td></tr>";
    }
});
