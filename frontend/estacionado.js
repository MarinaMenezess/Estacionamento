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
 
    let intervalo = setInterval(() => {
        atualizarTempo(entrada);
    }, 1000);
 
    document.getElementById("sair").addEventListener("click", function () {
        clearInterval(intervalo);
        localStorage.removeItem("usuario");
        window.location.href = "finalizar.html";
    });
});
 
function atualizarTempo(entrada) {
    let agora = new Date();
    let diferenca = agora - entrada;
 
    let segundos = Math.floor((diferenca / 1000) % 60);
    let minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    let horas = Math.floor((diferenca / (1000 * 60 * 60)));
 
    let tempoFormatado = `${horas}h ${minutos}m ${segundos}s`;
    document.getElementById("tempoEstacionado").innerText = tempoFormatado;
}

document.addEventListener("DOMContentLoaded", async function () {
    const tabela = document.getElementById("tabelaCarros");

    async function carregarCarros() {
        try {
            let response = await fetch("http://localhost:3000/carros");
            let data = await response.json();

            if (!data.sucesso) {
                tabela.innerHTML = "<tr><td colspan='5'>Erro ao carregar carros.</td></tr>";
                return;
            }

            if (data.carros.length === 0) {
                tabela.innerHTML = "<tr><td colspan='5'>Nenhum carro cadastrado.</td></tr>";
                return;
            }

            tabela.innerHTML = "";

            data.carros.forEach(carro => {
                let row = `
<tr>
<td>${carro.placa}</td>
<td>${carro.motorista}</td>
<td>${carro.pref ? carro.pref : "Não"}</td>
<td>${carro.entrada}</td>
</tr>
                `;
                tabela.innerHTML += row;
            });

        } catch (error) {
            console.error("Erro ao buscar carros:", error);
            tabela.innerHTML = "<tr><td colspan='5'>Erro ao conectar com o servidor.</td></tr>";
        }
    }

    await carregarCarros();
});
