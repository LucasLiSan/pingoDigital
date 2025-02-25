document.addEventListener("DOMContentLoaded", function () {
    // Mapeia os IDs das <li> com as respectivas divs
    const sections = {
        sm1: document.getElementById("horarioFunc"),
        sm2: document.getElementById("horarioEducFis"),
        sm3: document.getElementById("normas"),
        sm4: document.getElementById("portarias")
    };

    // Oculta todas as seções inicialmente
    Object.values(sections).forEach(section => section.style.display = "none");

    // Exibe a seção "Normas" ao carregar a página
    sections.sm1.style.display = "flex";

    // Adiciona evento de clique para cada <li>
    Object.keys(sections).forEach(id => {
        document.getElementById(id).addEventListener("click", function () {
            // Oculta todas as seções antes de exibir a correta
            Object.values(sections).forEach(section => section.style.display = "none");
            sections[id].style.display = "flex";
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const tabelaBody = document.querySelector(".horariosFuncionarios tbody");

    async function carregarHorarios() {
        try {
            // Faz a requisição para a API
            const resposta = await fetch("/horas"); // Altere para a URL correta da sua API
            const dados = await resposta.json();

            if (dados.horas && dados.horas.length > 0) {
                tabelaBody.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

                // Ordena os funcionários pelo nome em ordem alfabética
                dados.horas.sort((a, b) => a.nomeFunc.localeCompare(b.nomeFunc));

                // Percorre os dados e cria as linhas da tabela
                dados.horas.forEach(hora => {
                    const linha = document.createElement("tr");

                    // Expressão regular para verificar se é um horário (formato HH:MM)
                    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
                    
                    if (!regexHora.test(hora.horaIn)) {
                        // Caso seja um motivo de afastamento, aplicar colspan
                        linha.innerHTML = `
                            <td>${hora.matricula}</td>
                            <td>${hora.nomeFunc}</td>
                            <td>${hora.cargoFunc}</td>
                            <td colspan="6">${hora.horaIn}</td>
                        `;
                    } else {
                        // Caso seja um horário normal, exibir todas as colunas
                        linha.innerHTML = `
                            <td>${hora.matricula}</td>
                            <td>${hora.nomeFunc}</td>
                            <td>${hora.cargoFunc}</td>
                            <td>${hora.horaIn || "-"}</td>
                            <td>${hora.almocoIn || "-"}</td>
                            <td>${hora.almocoOut || "-"}</td>
                            <td>${hora.horaOut || "-"}</td>
                            <td>${hora.htpcIn || "-"}</td>
                            <td>${hora.htpcOut || "-"}</td>
                        `;
                    }

                    tabelaBody.appendChild(linha);
                });
            } else {
                tabelaBody.innerHTML = "<tr><td colspan='9'>Nenhum horário encontrado.</td></tr>";
            }
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            tabelaBody.innerHTML = "<tr><td colspan='9'>Erro ao carregar dados.</td></tr>";
        }
    }

    // Chama a função ao carregar a página
    carregarHorarios();
});

