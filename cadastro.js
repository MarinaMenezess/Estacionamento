let pref = document.getElementById("preferencial");
let qual = document.getElementById("wich");

function toggleVisibility() {
    qual.style.display = pref.checked ? 'block' : 'none';
}

toggleVisibility();
pref.addEventListener('change', toggleVisibility);

document.getElementById("cadastroForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value;
    let placa = document.getElementById("placa").value;
    let senha = document.getElementById("senha").value;
    let preferencial = pref.checked ? "Sim" : "Não";
    let preferencias = document.getElementById("preferencias").value;

    let formData = {
        nome: nome,
        placa: placa,
        senha: senha,
        preferencial: preferencial,
        preferencias: preferencial === "Sim" ? preferencias : ""
    };

    try {
        let response = await fetch("cadastro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        let result = await response.json();

        let mensagem = document.getElementById("mensagem");
        mensagem.innerText = result.mensagem;
        mensagem.style.color = result.sucesso ? "green" : "red";

        if (result.sucesso) {
            document.getElementById("cadastroForm").reset();
            toggleVisibility();
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        document.getElementById("mensagem").innerText = "Erro ao cadastrar.";
    }
});
