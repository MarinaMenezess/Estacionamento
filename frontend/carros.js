document.addEventListener("DOMContentLoaded", async function () {
    const tabela = document.getElementById("tabelaCarros");
    const valorHoraInput = document.getElementById("valorHora");
    const salvarValorBtn = document.getElementById("salvarValor");
 
    let valorHora = 0;
 
    // Função para buscar o valor por hora do banco
    async function buscarValorHora() {
        try {
            let response = await fetch("http://localhost:3000/valor-hora");
            let data = await response.json();
            if (data.sucesso) {
                valorHora = parseFloat(data.valor_hora);
                valorHoraInput.value = valorHora;
            }
        } catch (error) {
            console.error("Erro ao buscar valor por hora:", error);
        }
    }
 
    // Função para salvar um novo valor por hora
    salvarValorBtn.addEventListener("click", async function () {
        let novoValor = parseFloat(valorHoraInput.value);
        if (isNaN(novoValor) || novoValor < 0) {
            alert("Por favor, insira um valor válido!");
            return;
        }
 
        try {
            let response = await fetch("http://localhost:3000/atualizar-valor-hora", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valor_hora: novoValor })
            });
            let data = await response.json();
            if (data.sucesso) {
                alert("Valor por hora atualizado para R$ " + novoValor.toFixed(2));
                valorHora = novoValor;
                carregarCarros();
            }
        } catch (error) {
            console.error("Erro ao atualizar valor por hora:", error);
        }
    });
 
    // Função para carregar carros cadastrados e calcular valores
    async function carregarCarros() {
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
 
            tabela.innerHTML = "";
 
            data.carros.forEach(carro => {
                let entrada = new Date(carro.entrada);
                let saida = carro.saida ? new Date(carro.saida) : new Date();
                let diferencaHoras = (saida - entrada) / (1000 * 60 * 60);
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
    }
 
    await buscarValorHora();
    await carregarCarros();
});